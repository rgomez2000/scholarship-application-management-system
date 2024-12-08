from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view
from django.contrib.auth import authenticate, login
from rest_framework.response import Response
from rest_framework import viewsets
from .models import *
from .serializers import *
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view
from django.contrib.auth import logout
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
import django_filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
from django.db.models import Q


class ScholarshipFilter(django_filters.FilterSet):
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

@api_view(['POST'])
def register(request):
    if request.method == 'POST':
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token = Token.objects.create(user=user)
            return Response({"message": "User registered successfully!", "token": token.key}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')

        # Try to authenticate user
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return Response({
                'message': 'Login successful',
                'first_name': user.first_name,  # Include first name in the response
                'username': user.username        # Include username as well if needed
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

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        logout(request)  # Log the user out by clearing the session
        return Response({'message': 'Logout successful'})
    
