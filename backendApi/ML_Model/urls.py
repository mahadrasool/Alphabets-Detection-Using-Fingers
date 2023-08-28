from django.urls import path
from . import views  # Import app-specific views

urlpatterns = [
    # Add more app-specific URL patterns here
    path('receive-image/', views.receive_image_view, name='receive_image'),
]
