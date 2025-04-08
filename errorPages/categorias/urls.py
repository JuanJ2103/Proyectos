from django.urls import path
from  .views import *

urlpatterns = [
    path('registrar/', registrar_categoria, name='registrar'),
    path('api/get/', ver_categoria, name='verCategorias'),
    path('', index, name='home'),
    path('json/', categoria_json, name='listaJson'),
    path('api/post/', agregar_categoria, name='agregarCategoria')
]