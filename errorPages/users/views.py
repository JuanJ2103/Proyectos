from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
#Falta importar el modelo
from .models import CustomUser
#Falta importar el serializador
from .serializers import CustomUserSerializer
from rest_framework.renderers import JSONRenderer

class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    renderer_classes = [JSONRenderer]

    #Como le pongo seguridad?
    authentication_classes = [JWTAuthentication]
    permission_classes=[IsAuthenticated]

    #Sobreescribir el metodo para la obtención de permisos
    def get_permissions(self):
        if self.request.method in ['PUT', 'DELETE']:
            # Checar si tenemos sesión 
            return [IsAuthenticated()]
        #Dar acceso a todo lo demas sin estar logueado
        return []

from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

from django.contrib.auth.models import User
from .forms import CustomUserCreationForm
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

class CustomUserFormAPI(APIView):
    def get(self, request, *args, **kwargs):
        form = CustomUserCreationForm()
        fields = {
            field: {
            'label': form[field].label,
            'input':form[field].field.widget.attrs,
            'type': form[field].field.widget.input_type,
            }
                for field in form.fields
        }
        return Response(fields)
    
    def post(self, request, *args, **kwargs):
        form = CustomUserCreationForm(request.data)
        if form.is_valid():
            user_data = form.cleaned_data
            User = get_user_model()
            user = User.objects.create_user(
            email=user_data['email'],
            password=user_data['password1'],
            name=user_data['name'],
            surname=user_data['surname'],
            control_number=user_data['control_number'],
            age=user_data['age'],
            tel=user_data['tel'],
            )
            return Response({'message': 'Usuario creado con éxito'},status=status.HTTP_201_CREATED)
        return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)