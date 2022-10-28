from datetime import datetime
import json
from FrappuccinoParadise.models import Account, TimeCard
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required, user_passes_test
from django.shortcuts import render
from django.contrib.auth.models import User, Group
from djmoney.money import Money

from FrappuccinoParadise.models import Drink, Order, Ingredient, OrderItem, Account

def is_employee(user):
    return user.groups.filter(name="Baristas").exists()

def is_manager(user):
    return user.groups.filter(name="Managers").exists()

def get_manager():
    return User.objects.get(groups=3)

def api(request):
    return JsonResponse({'test': True})

def get_manager():
    return User.objects.get(groups=3)
    
@login_required
def index(request):
    return render(request, 'FrappuccinoParadise/index.html')

# Get menu items
# Returns a list of drink objects
@login_required
def get_menu(request):
    return JsonResponse(list(Drink.objects.values()), safe=False)

# Get ingredients required to make a drink
# Returns a list of IngredientItem objects
@login_required
def get_recipe(request):
    drink = Drink.objects.get(pk=request.GET['id'])
    ingredients = list(drink.ingredientitem_set.values())
    return JsonResponse(ingredients, safe=False)

# Get menu items
# Returns a list of drink objects
@login_required
def get_ingredients(request):
    return JsonResponse(list(Ingredient.objects.values()), safe=False)

# Place order
# Doesn't return anything besides errors
@login_required
def place_order(request):
    error = None
    try:
        user = request.user
        manager = get_manager()
        order = json.loads(request.POST['order'])
        ingredients = {}
        cost = 0
        for item in order:
            cost += float(item['cost'])
            drink = Drink.objects.get(pk=item['drink']['id'])
            # Get required ingredients
            for ingredientItem in drink.ingredientitem_set.all():
                if ingredientItem.ingredient.name not in ingredients:
                    ingredients.update({ingredientItem.ingredient.name: ingredientItem.number})
                else:
                    ingredients[ingredientItem.ingredient.name] += ingredientItem.number
            # Add addOns
            for ingredientItem in item['addOns']:
                if ingredientItem['name'] not in ingredients:
                    ingredients.update({ingredientItem['name']: int(ingredientItem['number'])})
                else:
                    ingredients[ingredientItem['name']] += int(ingredientItem['number'])
        # Check inventory
        for ingredientItem in ingredients:
            if Ingredient.objects.get(name=ingredientItem).amountPurchased < ingredients[ingredientItem]:
                error = "Insufficient inventory"
        # Check account balance
        if user.account.credit.amount < cost:
            error = "Insufficient credit"
        if not error:
            # Update inventory
            for ingredient in ingredients:
                i = Ingredient.objects.get(name=ingredient)
                i.amountPurchased -= ingredients[ingredient]
                i.save()
            # Transfer funds
            user.account.credit -= Money(cost, 'USD')
            user.account.save()
            manager.account.credit += Money(cost, 'USD')
            manager.account.save()
            # Create order
            o = Order(customerName=user.username, cost=cost)
            o.save()
            for item in order:
                orderItem = OrderItem(
                    order = o,
                    drink = Drink.objects.get(pk=item['drink']['id']),
                    number = item['amount']
                )
                orderItem.save()

                for addOn in item['addOns']:
                    orderItem.addon_set.create(
                        ingredient = Ingredient.objects.get(pk=addOn['id']),
                        number = addOn['id'],        
                    )
    except Exception as e:
        error = str(e)
    return JsonResponse({'error': error})

# Get list of orders
# Returns a list of orders
@login_required
@user_passes_test(is_employee)
def get_orders(request):
    orders = Order.objects.filter(isDelivered=False)
    ordersList = list(orders.values())

    for i in range(len(orders)):
        orderItems = orders[i].orderitem_set.all()
        orderItemsList = list(orderItems.values())

        ordersList[i]['formatted_time'] = orders[i].time.strftime("%#I:%M %p")

        for j in range(len(orderItems)):
            addOns = orderItems[j].addon_set.all()
            addOnsList = list(addOns.values())
            orderItemsList[j]['addons'] = addOnsList

            for k in range(len(addOnsList)):
                addOn = addOnsList[k]
                ingredient = Ingredient.objects.get(pk=addOns[k].ingredient_id)
                addOn['ingredient_name'] = ingredient.name

            drink = Drink.objects.get(pk=orderItems[j].drink_id)
            orderItemsList[j]['drink_name'] = drink.name

        ordersList[i]['order_items'] = orderItemsList


    return JsonResponse(ordersList, safe=False)

# Changes status of order
# Doesn't return anything besides errors
@login_required
@user_passes_test(is_employee)
def manage_order(request):
    error = None
    try:
        order = json.loads(request.body.decode('utf-8'))
        o = Order.objects.get(id=order.id)
        o.isReady = order.isReady
        o.isDelivered = order.isDelivered
        o.save()
    except:
        error = "Error managing order"
    return JsonResponse({'error': error})

# For barista to log a shift
# Doesn't return anything besides errors
@login_required
@user_passes_test(is_employee)
def add_shift(request):
    hours = request.POST['hours']
    date = request.POST['date'] if 'date' in request.POST else datetime.now().date()
    error = None
    try:
        request.user.account.timecard_set.create(date=date, hours=hours)
    except:
        error = "Error logging hours"
    return JsonResponse({'error': error})

# For barista to see the last (up to) 20 logged shifts
# Returns date, number of hours and whether employee has been paid for each of those shifts
@login_required
@user_passes_test(is_employee)
def get_logged_shifts(request):
    response = {}
    try:
        for shift in request.user.account.timecard_set.order_by('-date')[:20]:
            response[shift.id] = {
                'date': shift.date,
                'hours': shift.hours,
                'paid': shift.paid,
            }
        response['error'] = None
    except:
        response['error'] = "Error retrieving shifts"
    return JsonResponse(response)

# For managers to see their employees
# Returns username, first name and last name of each employee
@login_required
@user_passes_test(is_manager)
def employees(request):
    response = {}
    try:
        for user in Group.objects.get("Baristas").user_set.all():
            response[user.id] = {
                'username': user.username,
                'first_name': user.first_name,
                'last_name': user.last_name,
            }
        response['error'] = None
    except:
        response['error'] = "Error retrieving employee information"
    return JsonResponse(response)

# For managers to see an employee's unpaid shifts
# Returns date and number of hours for each unpaid shift
@login_required
@user_passes_test(is_manager)
def get_unpaid(request):
    userId = request.POST['user_id']
    response = {}
    try:
        employee = User.objects.get(id=userId)
        for shift in employee.account.timecard_set.filter(paid=False):
            response[shift.id] = {
                'date': shift.date,
                'hours': shift.hours,
            }
        response['error'] = None
    except User.DoesNotExist:
        response['error'] = "Error finding this user"
    except:
        response['error'] = "Error retrieving shifts for this user"
    return JsonResponse(response)

# Uses manager's funds to pay TimeCards specified in 'shift_ids'
# Return a list of 'paid' TimeCards, a list 'unpaid' that couldn't be paid, and a list of 'errors'
@login_required
@user_passes_test(is_manager)
def pay(request):
    # This should be a list of TimeCard ids - change it here or in the frontend as necessary
    shifts = request.POST['shift_ids']
    hourly_wage = float(request.POST['hourly_wage'])
    response = {
        'paid': list(),
        'unpaid': list(),
        'errors': set(),
    }
    for shift_id in shifts:
        try:
            shift = TimeCard.objects.get(id=shift_id)
            earnings = Money(shift.hours * hourly_wage, 'USD')
            if not shift.paid:
                if request.user.account.credit >= earnings:
                    request.user.account.credit -= earnings
                    shift.employee.credit += earnings
                    shift.paid = True
                    response['paid'].append(shift_id)
                else:
                    response['errors'].add("Insufficient funds")
                    response['unpaid'].append(shift_id)
            else:
                response['errors'].add(f"TimeCard {shift_id} has already been paid")
                response['paid'].append(shift_id)
        except(TimeCard.DoesNotExist):
            response['errors'].add(f"TimeCard {shift_id} does not exist\n")
            response['unpaid'].append(shift_id)
        except:
            response['errors'].add("Error paying employee(s)\n")
            response['unpaid'].append(shift_id)
    return JsonResponse(response)

# Elevate user to barista status
# No return besides errors
@login_required
@user_passes_test(is_manager)
def hire(request):
    username = request.POST['username']
    email = request.POST['email']
    response = {}
    try:
        user = User.objects.get(username=username, email=email)
        baristas = Group.objects.get(name='Baristas')
        user.groups.add(baristas)
        response['error'] = None
    except User.DoesNotExist:
        response['error'] = "Error finding this user"
    except:
        response['error'] = "Error making this user a barista"
    return JsonResponse(response)

# Demote barista to customer
# No return besides errors
@login_required
@user_passes_test(is_manager)
def fire(request):
    userId = request.POST['user_id']
    response = {}
    try:
        user = User.objects.get(id=userId)
        baristas = Group.objects.get(name='Baristas')
        user.groups.remove(baristas)
        response['error'] = None
    except User.DoesNotExist:
        response['error'] = "Error finding this user"
    except:
        response['error'] = "Error removing user from baristas group"
    return JsonResponse(response)

# Create new account
# No return besides errors
def new_account(request):
    username = request.POST['username']
    password = request.POST['password']
    firstName = request.POST['first_name']
    lastName = request.POST['last_name']
    email = request.POST['email']
    response = {}
    try:
        customers = Group.objects.get('Customers')
        newuser = User.objects.create_user(
            username=username, 
            password=password, 
            email=email, 
            first_name=firstName, 
            last_name=lastName
        )
        newuser.groups.add(customers)
        newuser.save()
        account = Account(user=newuser)
        account.save()
        response['error'] = None
    except Group.DoesNotExist:
        response['error'] = "Error creating new customer"
    except:
        response['error'] = "Error creating user"
    return JsonResponse(response)

# Get account information
# Returns first_name, last_name, username, email, credit, currency, groups
@login_required
def account(request):
    user = request.user
    response = {}
    try:
        response['first_name'] = user.first_name
        response['last_name'] = user.last_name
        response['username'] = user.username
        response['email'] = user.email
        response['credit'] = str(user.account.credit.amount)
        response['currency'] = str(user.account.credit.currency)
        response['groups'] = [group.name for group in user.groups.all()]
        response['error'] = None
    except:
        response['error'] = "Error retrieving account information"
    return JsonResponse(response)

# Add credit to account
# No return besides errors
@login_required
def add_credit(request):
    amount = request.POST['amount']
    response = {}
    try:
        request.user.account.credit += Money(amount, 'USD')
        request.user.account.save()
        response['error'] = None
    except:
        response['error'] = f"Could not add {amount} to credit"
    return JsonResponse(response)

@login_required
def user_is_employee(request):
      return JsonResponse({'is_employee': is_employee(request.user)})

@login_required
@user_passes_test(is_employee)
def set_order_ready(request):
    id = request.POST['order_id']
    order = Order.objects.get(pk=id)
    order.isReady = True
    order.save()

    return JsonResponse({'error': None})

@login_required
@user_passes_test(is_employee)
def set_order_delivered(request):
    id = request.POST['order_id']
    order = Order.objects.get(pk=id)
    order.isDelivered = True
    order.save()

    return JsonResponse({'error': None})
