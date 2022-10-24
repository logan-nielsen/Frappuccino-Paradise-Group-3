from datetime import datetime
import json
from FrappuccinoParadise.models import Account
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required, user_passes_test
from django.shortcuts import render
from django.contrib.auth.models import User, Group
from djmoney.money import Money

from FrappuccinoParadise.models import Drink, Order

def is_employee(user):
    return user.groups.filter(name="Baristas").exists()

def is_manager(user):
    return user.groups.filter(name="Managers").exists()

def api(request):
    return JsonResponse({'test': True})
    
@login_required
def index(request):
    return render(request, 'FrappuccinoParadise/index.html')

# Get menu items
# Returns a list of drink objects
@login_required
def get_menu(request):
    return JsonResponse(Drink.objects.all().values())

# Place order
# Doesn't return anything besides errors
@login_required
def place_order(request):
    error = None
    try:
        order = json.loads(request.body.decode('utf-8'))
        cost = 0
        for drink in order:
            cost += drink.cost
        o = Order(customerName=request.user.username,cost=cost)
        for drink in order:
            o.order.add(Drink.objects.get(id=drink.id))
        #TODO: add addons?
        #TODO: check inventory
        #TODO: check account balance
        #TODO: update inventory
        #TODO: transfer funds
        o.save()
    except:
        error = "Error placing order"
    return JsonResponse({'error': error})

# Get list of orders
# Returns a list of orders
@login_required
def get_orders(request):
    return JsonResponse(Order.objects.all().values())

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
# Returns first_name, last_name, username, email, credit, currency
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
        response['error'] = None
    except:
        response['error'] = f"Could not add {amount} to credit"
    return JsonResponse(response)

@login_required
def user_is_employee(request):
      return JsonResponse({'is_employee': is_employee(request.user)})
