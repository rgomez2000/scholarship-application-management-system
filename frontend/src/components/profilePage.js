import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./profilePage.css";

const Profile = () => {
    const [registerMessage, setRegisterMessage] = useState('');
    const [applicantData, setApplicantData] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }

        // Fetch applicant data if authenticated
        const fetchApplicantData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/profile/', {
                    headers: {
                        'Authorization': `Token ${token}`,  // Include the token in the Authorization header
                    },
                });
                setApplicantData(response.data);  // Set the applicant data
            } catch (err) {
                setError('Failed to fetch profile data.');
            }
        };

        fetchApplicantData();

        // Check if the success message exists in localStorage
        const successMessage = localStorage.getItem('registerSuccess');
        if (successMessage) {
            setRegisterMessage(successMessage);
            localStorage.removeItem('registerSuccess');  // Remove message after displaying it
        }
    }, [navigate]);

    // If there's an error or loading, show respective message
    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    if (!applicantData) {
        return <p>Loading...</p>;
    }

    return (
        <div class="form-container">
            <h2>Profile</h2>
            {registerMessage && <p style={{ color: 'green' }}>{registerMessage}</p>}
            
            <div>
                <p><strong>First Name:</strong> {applicantData.first_name}</p>
                <p><strong>Last Name:</strong> {applicantData.last_name}</p>
                <p><strong>Email:</strong> {applicantData.email}</p>
                <p><strong>Phone Number:</strong> {applicantData.phone_number}</p>
                <p><strong>Birth Date:</strong> {applicantData.birth_date}</p>
                <p><strong>Address 1:</strong> {applicantData.address1}</p>
                <p><strong>Address 2:</strong> {applicantData.address2}</p>
                <p><strong>GPA:</strong> {applicantData.gpa}</p>
                <p><strong>Academic Level:</strong> {applicantData.academic_level}</p>
                <p><strong>Enrollment Status:</strong> {applicantData.enrollment_status}</p>
                <p><strong>Department:</strong> {applicantData.department}</p>
            </div>
        </div>
    );
};

export default Profile;
