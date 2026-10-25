from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token
from .views import HallListView, EventListView, SensorEventView, HistoryView

urlpatterns = [
    path("login/", obtain_auth_token),
    path("halls/", HallListView.as_view()),
    path("events/", EventListView.as_view()),
    path("sensor/", SensorEventView.as_view()),
    path("history/", HistoryView.as_view()),
]