from rest_framework import serializers
from .models import Producto

#Es una clase que actua sobre un modelo
class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = '__all__' # <--- Todos los campos