from django.urls import path
from .views import *

urlpatterns = [
    path('users', UsersList.as_view()),
    path('requests', RequestsList.as_view()),
    path('requestcalculations', RequestCalculations.as_view()),
]