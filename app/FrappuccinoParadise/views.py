from datetime import datetime
import json
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required, user_passes_test
from django.shortcuts import render
from django.contrib.auth.models import User, Group
from djmoney.money import Money

from FrappuccinoParadise.models import Drink, Order, Ingredient, OrderItem, Account, TimeCard

def is_employee(user):
    return user.groups.filter(name="Baristas").exists()

def is_manager(user):
    return user.groups.filter(name="Managers").exists()

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

# Manger buys ingredients
# Doesn't return anything besides errors
@login_required
@user_passes_test(is_manager)
def buy_ingredients(request):
    error = None
    manager = request.user
    cost = float(request.POST['cost'])
    ingredients = json.loads(request.POST['ingredients'])
    try:
        if manager.account.credit.amount < cost:
            error = 'Insufficient funds'
        else:
            for ingredient in ingredients:
                i = Ingredient.objects.get(pk=ingredient['id'])
                i.amountPurchased += int(ingredient['number'])
                i.save()
            manager.account.credit -= Money(cost, 'USD')
            manager.account.save()
    except:
        error = 'Error buying ingredients'
    return JsonResponse({'error': error}, status= 400 if error != None else 200)

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
            amount = int(item['amount'])
            cost += float(item['cost'])
            drink = Drink.objects.get(pk=item['drink']['id'])
            # Get required ingredients
            for ingredientItem in drink.ingredientitem_set.all():
                if ingredientItem.ingredient.name not in ingredients:
                    ingredients.update({ingredientItem.ingredient.name: ingredientItem.number * amount})
                else:
                    ingredients[ingredientItem.ingredient.name] += ingredientItem.number * amount
            # Add addOns
            for ingredientItem in item['addOns']:
                if ingredientItem['name'] not in ingredients:
                    ingredients.update({ingredientItem['name']: int(ingredientItem['number']) * amount})
                else:
                    ingredients[ingredientItem['name']] += int(ingredientItem['number']) * amount
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
            o = Order(customer=user, cost=cost)
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
                        number = addOn['number'],        
                    )
    except Exception as e:
        error = 'Error placing order'
    return JsonResponse({'error': error}, status= 400 if error == None else 200)

# Get list of orders
# Returns a list of orders
@login_required
@user_passes_test(is_employee)
def get_orders(request):
    orders = Order.objects.filter(isDelivered=False).order_by('date', 'time')
    ordersList = list(orders.values())

    for i in range(len(orders)):
        orderItems = orders[i].orderitem_set.all()
        orderItemsList = list(orderItems.values())

        ordersList[i]['formatted_time'] = orders[i].time.strftime("%#I:%M %p")

        customer = orders[i].customer
        ordersList[i]['customer_name'] = customer.username

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
    return JsonResponse({'error': error}, status= 400 if error !='' else 200)

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
    return JsonResponse(response, status= 400 if response['error'] !=None else 200)

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
    return JsonResponse(response, status= 400 if response['error'] !=None else 200)

# For managers to see an employee's unpaid shifts
# Returns date and number of hours for each unpaid shift
@login_required
@user_passes_test(is_manager)
def get_unpaid(request):
    employees = User.objects.filter(groups__name='Baristas').exclude(groups__name='Managers');

    response = []
    error = False
    try:
        for employee in employees:
            employeeRespose = {
                'id': employee.id,
                'name': employee.get_full_name(),
                'hours': 0,
            }

            for shift in employee.account.timecard_set.filter(paid=False):
                employeeRespose['hours'] += shift.hours
            response.append(employeeRespose)
            
    except User.DoesNotExist:
        response.append({'error': "Error finding this user"})
        error = True
    except:
        response.append({'error': "Error retrieving shifts for this user"})
        error = True
    return JsonResponse(
        response,
        safe=False,
        status= 400 if error else 200
    )

# Uses manager's funds to pay TimeCards specified in 'shift_ids'
# Return a list of 'paid' TimeCards, a list 'unpaid' that couldn't be paid, and a list of 'errors'
@login_required
@user_passes_test(is_manager)
def pay(request):
    # This should be a list of TimeCard ids - change it here or in the frontend as necessary
    shifts = TimeCard.objects.filter(paid=False);
    hourly_wage = 15 # TODO: make the hourly wage not hard coded
    response = {
        'paid': list(),
        'unpaid': list(),
        'errors': set(),
    }
    for shift in shifts:
        try:
            earnings = Money(shift.hours * hourly_wage, 'USD')
            if not shift.paid:
                if request.user.account.credit >= earnings:
                    request.user.account.credit -= earnings
                    request.user.account.save()
                    shift.employee.credit += earnings
                    shift.employee.save()
                    shift.paid = True
                    shift.save()
                    response['paid'].append(shift.id)
                else:
                    response['errors'].add("Insufficient funds")
                    response['unpaid'].append(shift.id)
            else:
                response['errors'].add(f"TimeCard {shift.id} has already been paid")
                response['paid'].append(shift.id)
        except(TimeCard.DoesNotExist):
            response['errors'].add(f"TimeCard {shift.id} does not exist\n")
            response['unpaid'].append(shift.id)
        except Exception as e:
            response['errors'].add("{e}\n")
            response['unpaid'].append(shift.id)
    return JsonResponse(response, status= 400 if response['error'] !=None else 200)

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
    return JsonResponse(response, status= 400 if response['error'] !=None else 200)

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
    return JsonResponse(response, status= 400 if response['error'] !=None else 200)

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
        customers = Group.objects.get(name='Customers')
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
    return JsonResponse(response, status= 400 if response['error'] !=None else 200)

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
    return JsonResponse(response, status= 400 if response['error'] !=None else 200)

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
    return JsonResponse(response, status= 400 if response['error'] !=None else 200)

@login_required
def user_is_employee(request):
      return JsonResponse({'is_employee': is_employee(request.user)})

@login_required
def user_is_manager(request):
      return JsonResponse({'is_manager': is_manager(request.user)})

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


@login_required
def get_my_orders(request):
    my_orders = Order.objects.filter(customer=request.user).filter(isDelivered=False).order_by('date', 'time')
    orders_list = list(my_orders.values())

    for i in range(len(my_orders)):
        order_items = my_orders[i].orderitem_set.all()
        order_items_list = list(order_items.values())

        orders_list[i]['formatted_time'] = my_orders[i].time.strftime("%#I:%M %p")

        for j in range(len(order_items)):
            add_ons = order_items[j].addon_set.all()
            add_ons_list = list(add_ons.values())
            order_items_list[j]['addons'] = add_ons_list

            for k in range(len(add_ons_list)):
                add_on = add_ons_list[k]
                ingredient = Ingredient.objects.get(pk=add_ons[k].ingredient_id)
                add_on['ingredient_name'] = ingredient.name

            drink = Drink.objects.get(pk=order_items[j].drink_id)
            order_items_list[j]['drink_name'] = drink.name

        orders_list[i]['order_items'] = order_items_list

    return JsonResponse(orders_list, safe=False)


@login_required
@user_passes_test(is_manager or is_employee)
def get_order_history(request):
    orders = Order.objects.all().order_by('date', 'time')
    orders_list = list(orders.values())

    for i in range(len(orders)):
        order_items = orders[i].orderitem_set.all()
        order_items_list = list(order_items.values())

        orders_list[i]['formatted_time'] = orders[i].time.strftime("%#I:%M %p")

        for j in range(len(order_items)):
            add_ons = order_items[j].addon_set.all()
            add_ons_list = list(add_ons.values())
            order_items_list[j]['addons'] = add_ons_list

            for k in range(len(add_ons_list)):
                add_on = add_ons_list[k]
                ingredient = Ingredient.objects.get(pk=add_ons[k].ingredient_id)
                add_on['ingredient_name'] = ingredient.name

            drink = Drink.objects.get(pk=order_items[j].drink_id)
            order_items_list[j]['drink_name'] = drink.name

        orders_list[i]['order_items'] = order_items_list

    return JsonResponse(orders_list, safe=False)

# Adds new drink to the menu
# Doesn't return anything besides errors
@login_required
@user_passes_test(is_manager)
def add_menu_item(request):
    name = request.POST['name']
    price = request.POST['price']
    ingredients = json.loads(request.POST['ingredients'])
    drink = Drink(name=name, cost=price)
    drink.save();
    for i in ingredients:
        if (int(i['number']) > 0):
            ingredient = Ingredient.objects.get(pk=i['id'])
            drink.ingredientitem_set.create(ingredient=ingredient, number=i['number'])
    return JsonResponse({'error': None})

# Removes a drink from the menu
# Doesn't return anything besides errors
@login_required
@user_passes_test(is_manager)
def remove_menu_item(request):
    drink = Drink.objects.get(pk=request.POST['id'])
    drink.delete()
    return JsonResponse({'error': None})

# Edits existing drinks on the menu
# Doesn't return anything besides errors
@login_required
@user_passes_test(is_manager)
def edit_menu(request):
    menu = json.loads(request.POST['menu'])
    for item in menu:
        name = item['name']
        price = item['cost']
        ingredients = item['ingredients']
        drink = Drink.objects.get(pk=item['id'])
        drink.name = name
        drink.cost = price
        drink.ingredientitem_set.all().delete()
        for i in ingredients:
            if (int(i['number']) > 0):
                ingredient = Ingredient.objects.get(pk=i['id'])
                drink.ingredientitem_set.create(ingredient=ingredient, number=i['number'])
        drink.save()
    return JsonResponse({'error': None})
