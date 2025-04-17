from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.hashers import make_password
from .serializers import UserSerializer

User = get_user_model()

class SignUpView(generics.CreateAPIView):
    serializer_class = UserSerializer
    def create(self, request, *args, **kwargs):
        try:
            email = request.data.get('email')
            password = request.data.get('password')
            phone = request.data.get('phone', None)
            first_name = request.data.get('first_name', None)
            last_name = request.data.get('last_name', None)
            
            if not email or not password:
                raise ValueError("Email and password are required")
            
            # Validate password
            validate_password(password=password)
            
            if User.objects.filter(email=email).exists():
                raise ValueError("Email already exists")
            
            user = User.objects.create(
                email=email,
                password=make_password(password),
                phone_number=phone,
                first_name=first_name,
                last_name=last_name
            )
            
            refresh = RefreshToken.for_user(user)
            serializer = self.get_serializer(user)
            data = serializer.data
            return Response({
                'status': 1,
                'message': 'User created successfully',
                'user': data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response(
                {'status': 0, 'message': str(e)},
                status=status.HTTP_200_OK
            )

class LoginView(TokenObtainPairView):
    serializer_class = UserSerializer

    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')

        try:
            if not username or not password:
                raise ValueError("Username and password are required")
            
            user = authenticate(request, username=username, password=password)

            if user is None:
                raise ValueError("Invalid username or password")
            
            refresh = RefreshToken.for_user(user)
            serializer = self.get_serializer(user)
            data = serializer.data
            return Response({
                'status': 1,
                'message': 'Login successful',
                'user': data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {'status': 0, 'message': str(e)},
                status=status.HTTP_200_OK
            )

class LogoutView(generics.GenericAPIView):
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            
            if not refresh_token:
                raise ValueError("Refresh token is required")
                
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'status':1, 'message': 'Successfully logged out'},status=status.HTTP_205_RESET_CONTENT)
            
        except Exception as e:
            return Response(
                {'status': 0, 'message': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )