from django.shortcuts import redirect, render

def login(request):
    return render(request, 'registration/login.html')

def homeRedirect(request):
    return redirect('/app/')
