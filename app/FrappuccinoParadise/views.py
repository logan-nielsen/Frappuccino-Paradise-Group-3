from django.http import JsonResponse
from django.contrib.auth.decorators import login_required, user_passes_test
from django.shortcuts import render

def is_employee(user):
    return user.groups.filter(name="Baristas").exists()

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


