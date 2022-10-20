from django.http import JsonResponse
from django.shortcuts import render

def api(request):
    return JsonResponse({'test': True})

def index(request):
    return render(request, 'FrappuccinoParadise/index.html')
