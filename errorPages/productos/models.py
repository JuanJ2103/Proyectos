from django.db import models

# Create your models here.
class Producto(models.Model):

    nombre = models.CharField(max_length=100)
    precio = models.DecimalField(max_digits=10, decimal_places=2)

    #Que los campos uurlfields limitan los caracteres de 200 por defecto
    imagen = models.URLField()

    def _str_(self):
        return self.nombre