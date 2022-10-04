from django.http import JsonResponse

def api(request, path):
    return JsonResponse({'path': path})
