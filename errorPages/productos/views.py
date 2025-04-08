from rest_framework import viewsets
from rest_framework.renderers import JSONRenderer
from .models import Producto
from .serializers import ProductoSerializer

class ProductoViewset(viewsets.ModelViewSet):
    #Conjunto de querys de la BD
    queryset = Producto.objects.all()

    #Saber como empaquetar y enviar la información
    serializer_class = ProductoSerializer

    #Saber como voy a renderizar las respuestas
    renderer_classes = [JSONRenderer]