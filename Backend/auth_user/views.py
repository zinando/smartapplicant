from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.hashers import make_password
from .serializers import UserSerializer
from api.utils import *
from api.tasks import async_extract_and_score
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from .utils import *


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
            print(e)
            return Response(
                {'status': 0, 'message': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

class ResumeUploadView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def post(self, request, *args, **kwargs):
        try:
            user = request.user
            file = request.FILES.get('resume')
            title = request.data.get('title')
            
            if not file:
                raise ValueError("Resume file is required")
            
            if file.size > 5 * 1024 * 1024:  # 5MB
                raise Exception("File too large (max 5MB)")
            
            # Read file content into memory
            file_bytes = file.read()

            if file.size > 2 * 1024 * 1024:  # Example: 2MB+ → async
                task = async_extract_and_score.delay(file_bytes, file.name)
                res_status = 2
                data = {
                    'task_id': task.id,
                    'status': 'Processing',
                    'ats_score': None,
                    'required_sections': None
                }
            else:
                result = extract_text(file_bytes, file.name)
                if result['status'] == 0:
                    raise Exception(result['message'])
                
                text = result['text']

                # parse resume text to get data
                parsed_data = parse_resume(text)

                # Calculate ATS optimization score with the parsed data
                ats_score = calculate_ats_score(parsed_data)

                analytics = {}
                analytics['ats_score'] = ats_score
                analytics['parsed_data'] = parsed_data
                analytics['suggestions'] = get_suggestions_for_resume(text)
                analytics['score_comparison'] = compare_ats_score(ats_score)
                analytics['keyword_coverage'] = get_keyword_coverage(text)
                analytics['score_rating'] = get_resume_score_rating(ats_score)

                mr = {}
                mr['title'] = title.lower()
                mr['last_updated'] = timezone.now().strftime('%Y-%m-%d %H:%M:%S')
                mr['is_active'] = False
                mr['analytics'] = analytics
                mr['resume_text'] = text

                # Add resume data to user profile
                if not add_user_resume_data(user, mr):
                    raise Exception("Resume data already exists")

            serializer = self.get_serializer(user)
            return Response({
                'status': 1,
                'message': 'Resume uploaded successfully',
                'user': serializer.data
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            print(e)
            return Response(
                {'status': 0, 'message': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    def delete(self, request, *args, **kwargs):
        try:
            print(request.user)
            user = request.user
            resume_id = request.data.get('resume_id')

            if not resume_id:
                raise ValueError("Resume ID is required")
            
            # Check if the resume exists
            if not user.resume_data:
                raise Exception("No resumes found for this user")
            resume = [data for data in user.resume_data if data['id'] == resume_id]
            if not resume:
                raise Exception("Resume not found")
            resume = resume[0]
            # Remove the resume from the user's profile
            user.resume_data.remove(resume)
            user.save()

            # Update the resume IDs
            update_user_resume_data_id(user)

            return Response({
                'status': 1,
                'message': 'Resume deleted successfully',
                'user': UserSerializer(user).data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response(
                {'status': 0, 'message': str(e)},
                status=status.HTTP_200_OK
            )
        
# create a view for analyzing the resume vs job description
class ResumeAnalysisView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def post(self, request, *args, **kwargs):
        try:
            user = request.user
            resume_id = request.data.get('resume_id')
            job_title = request.data.get('job_title')
            job_description = request.data.get('job_description')

            if not resume_id or not job_description:
                raise ValueError("Resume ID and job description are required")
            
            # Check if the resume exists
            if not user.resume_data:
                raise Exception("No resumes found for this user")
            # print(f'user.resume_data: {user.resume_data}, resume_id: {resume_id}')
            resume = [data for data in user.resume_data if data['id'] == resume_id]
            if not resume:
                raise Exception("Resume not found")
            resume = resume[0]

            # print(resume["resume_text"])

            # Analyze the resume against the job description
            analysis_result = analyze_resume_with_jd(resume["resume_text"], job_description, job_title)

            return Response({
                'status': 1,
                'message': 'Resume analysis completed successfully',
                'analysis_result': analysis_result
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {'status': 0, 'message': str(e)},
                status=status.HTTP_200_OK
            )