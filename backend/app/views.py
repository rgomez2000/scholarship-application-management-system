from django.contrib.auth.models import Group
from django.shortcuts import render
from django.contrib.auth import authenticate, login
from rest_framework.response import Response
from rest_framework import viewsets, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework.filters import OrderingFilter
from rest_framework.authtoken.views import ObtainAuthToken
from .models import *
from .permissions import IsAdminUser
from .serializers import *
from django.contrib.auth import logout
import django_filters
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q

class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        # Get the token using the default ObtainAuthToken behavior
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        
        # Create a token or retrieve an existing one for the user
        token, created = Token.objects.get_or_create(user=user)
        
        return Response({'token': token.key})

class ScholarshipFilter(django_filters.FilterSet):
    permission_classes = [AllowAny]

    # Filter by renewal type
    renewal_type = django_filters.ChoiceFilter(choices=Scholarship.RENEWAL_TYPES)

    # Filter by amount (greater than or less than certain value)
    min_amount = django_filters.NumberFilter(field_name='amount', lookup_expr='gte', method='filter_min_amount')
    max_amount = django_filters.NumberFilter(field_name='amount', lookup_expr='lte', method='filter_max_amount')
    
    # Filter by date range (open_date and deadline)
    date_range_start = django_filters.DateFilter(field_name='open_date', lookup_expr='gte')
    date_range_end = django_filters.DateFilter(field_name='deadline', lookup_expr='lte')
    
    # Filter by organization, department, donor
    organization = django_filters.CharFilter(field_name='organization', lookup_expr='icontains')
    department = django_filters.CharFilter(field_name='department', lookup_expr='icontains')
    donor = django_filters.CharFilter(field_name='donor', lookup_expr='icontains')
    
    # Search filter for general text fields
    search = django_filters.CharFilter(field_name='scholarship_name', lookup_expr='icontains')

    has_amount = django_filters.ChoiceFilter(
        choices=[('all', 'All'), ('true', 'True'), ('false', 'False')],
        method='filter_has_amount'
    )

    def filter_has_amount(self, queryset, name, value):
        if value == 'true':
            # Filter scholarships where amount is a valid number (not 'Varies' or empty)
            return queryset.exclude(Q(amount__iexact='Varies') | Q(amount__isnull=True) | Q(amount=''))
        elif value == 'false':
            # Filter scholarships where amount is 'Varies' or empty
            return queryset.filter(Q(amount__iexact='Varies') | Q(amount__isnull=True) | Q(amount=''))
        return queryset

    def filter_min_amount(self, queryset, name, value):
        # Clean the value by removing '$' and commas before filtering
        if isinstance(value, str):
            value = value.replace('$', '').replace(',', '')
        return queryset.filter(amount__gte=value)

    def filter_max_amount(self, queryset, name, value):
        # Clean the value by removing '$' and commas before filtering
        if isinstance(value, str):
            value = value.replace('$', '').replace(',', '')
        return queryset.filter(amount__lte=value)

    class Meta:
        model = Scholarship
        fields = ['renewal_type', 'min_amount', 'max_amount', 'date_range_start', 'date_range_end', 'organization', 'department', 'donor', 'search', 'has_amount']

class ScholarshipViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]

    queryset = Scholarship.objects.all()
    serializer_class = ScholarshipSerializer
    filter_backends = (DjangoFilterBackend, OrderingFilter)
    filterset_class = ScholarshipFilter

    # Default ordering (can be overridden with query params)
    ordering_fields = ['scholarship_name', 'amount', 'open_date', 'deadline','date_created']
    ordering = ['-date_created']  # Default sorting, can be changed via query params

    def list(self, request, *args, **kwargs):
        # Fetch the filter options dynamically
        filter_options = {
            'departments': Scholarship.objects.values_list('department', flat=True).distinct(),
            'donors': Scholarship.objects.values_list('donor', flat=True).distinct(),
            'organizations': Scholarship.objects.values_list('organization', flat=True).distinct(),
        }
        
        # Make sure to remove null or empty values
        for key in filter_options:
            filter_options[key] = list(filter(None, filter_options[key]))

        # Get the usual scholarship data
        response = super().list(request, *args, **kwargs)

        # Include filter options as part of the response
        response.data['filter_options'] = filter_options

        return response

class ApplicationViewSet(viewsets.ModelViewSet):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        """
        List applications. If `isAdmin` query parameter is true, return all applications.
        Otherwise, return applications for the current authenticated user.
        """
        is_admin = request.query_params.get('is_admin', 'false').lower() == 'true'
        user = request.user

        try:
            if is_admin:
                # Fetch all applications freshly from the database
                applications = Application.objects.all()
            else:
                # Fetch applications for the logged-in user
                applicant = Applicant.objects.get(user=user)
                applications = Application.objects.filter(applicant=applicant)

            # Serialize the data
            serializer = self.get_serializer(applications, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Applicant.DoesNotExist:
            return Response({'error': 'Applicant not found for the current user.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def create(self, request, *args, **kwargs):
        try:
            # Get the authenticated user
            user = request.user

            # Fetch the corresponding applicant
            applicant = Applicant.objects.get(user=user)

            # Add the applicant to the request data
            request.data['applicant'] = applicant.id

            # Create the application using the serializer
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)

            # Return the response
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except Applicant.DoesNotExist:
            return Response({'error': 'Applicant not found for the current user.'}, status=status.HTTP_404_NOT_FOUND)
        except Scholarship.DoesNotExist:
            return Response({'error': 'Scholarship not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = UserRegistrationSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()

            # Assign user to the Admin group
            admins, created = Group.objects.get_or_create(name="Admin")
            user.groups.add(admins)

            # Get or create token
            token, created = Token.objects.get_or_create(user=user)

            return Response(
                {"message": "User registered successfully!", "token": token.key},
                status=status.HTTP_201_CREATED,)
        else:
            return Response({'message': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')

        # Try to authenticate user
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)

            # Get or create token for the user
            token, created = Token.objects.get_or_create(user=user)

            # Get user groups (roles)
            groups = user.groups.values_list('name', flat=True)  # List of group names

            return Response({
                'message': 'Login successful',
                'first_name': user.first_name,  # Include first name in the response
                'username': user.username,        # Include username as well if needed
                'groups': list(groups),  # Convert queryset to list
                'token': token.key
            }, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user  # The logged-in user
        # Get applicant details associated with the user
        try:
            applicant = Applicant.objects.get(user=user)
            serializer = ApplicantSerializer(applicant)
            return Response(serializer.data)  # Return the applicant data
        except Applicant.DoesNotExist:
            return Response({"detail": "Applicant data not found."}, status=404)

    def post(self, request, *args, **kwargs):
        try:
            user = request.user
            # request.data.user = user.id
            data = request.data.copy()
            data['user'] = user.id
            print(data)
            serializer = ApplicantSerializer(data=data)

            if serializer.is_valid():
                applicant = serializer.save()
                return Response({"data": "hellow"}, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            # Log the error for debugging purposes if necessary
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        logout(request)  # Log the user out by clearing the session
        return Response({'message': 'Logout successful'})

# Check if a user is restricted from a given action or seeing a page
class RestrictedView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        return Response({"message": "Welcome, Admin!"})
    
class NotificationListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        notifications = Notification.objects.filter(user=request.user).order_by('-created_at')
        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data)
    
class ClearNotificationsView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        Notification.objects.filter(user=request.user).delete()
        return Response({"message": "All notifications cleared."})