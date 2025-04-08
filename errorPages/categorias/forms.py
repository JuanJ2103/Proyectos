from django import forms
from .models import Categoria

class categoriaForm(forms.ModelForm):
    class Meta:
        model = Categoria
        fields = ['nombre', 'imagen']
        
        widgets = {
            'nombre': forms.TextInput(
                attrs = {
                    'class': 'form-input',
                    'placeholder': 'Nombre de la categoria'
                }
            ),
            'imagen': forms.URLInput(
                attrs = {
                    'class': 'form-input',
                    'placeholder': 'Imagen de la categoria'
                }
            )
        }
        
        labels = {
            'nombre': 'Nombre de la categoria',
            'imagen': 'URL de la imagen' 
        }
        
        error_messages = {
            'nombre': {
                'required': 'El nombre es obligatorio'
            },
        }