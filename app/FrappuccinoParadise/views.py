from django.http import JsonResponse
from django.contrib.auth.decorators import login_required, user_passes_test
from django.shortcuts import render
from django.contrib.auth.models import User, Group

def is_employee(user):
    return user.groups.filter(name="Baristas").exists()

def is_manager(user):
    return user.groups.filter(name="Managers").exists()

def api(request):
    return JsonResponse({'test': True})
    
@login_required
def index(request):
    return render(request, 'FrappuccinoParadise/index.html')

# For barista to log a shift
@login_required
@user_passes_test(is_employee)
def add_shift(request):
    date = request.POST['date']
    hours = request.POST['hours']
    error = None
    try:
        request.user.account.timecard_set.create(date=date, hours=hours)
    except:
        error = "Error logging hours"
    return JsonResponse({'error': error})

# For barista to see the last (up to) 20 logged shifts
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
    except:
        response['error'] = "Error retrieving shifts"
    return JsonResponse(response)

# For managers to see their employees
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
    except:
        response['error'] = "Error retrieving employee information"
    return response

# For managers to see employee's unpaid shifts
@login_required
@user_passes_test(is_manager)
def get_unpaid(request):
    userId = request.POST['user_id']
    response = {}
    try:
        employee = User.objects.get(userId)
        try:
            for shift in employee.account.timecard_set.filter(paid=False):
                response[shift.id] = {
                    'date': shift.date,
                    'hours': shift.hours,
                }
        except:
            response['error'] = "Error retrieving shifts for this user"
    except:
        response['error'] = "Error finding this user"
    return response            
