from django.urls import path, include
from rest_framework.routers import SimpleRouter
from .views import ProductoViewset

#Definir un router
router = SimpleRouter()
router.register(r'api', ProductoViewset)

#ProductoViewset:
#ip:8000/productos/api/ <---- GET de todo
#ip:8000/productos/api/{id} <---- GET, POST, PUT, DELETE de uno

urlpatterns = [
    path('', include(router.urls))
]