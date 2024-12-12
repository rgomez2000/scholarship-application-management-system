import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './application.css';

const ApplicationPage = () => {
    const { id } = useParams(); // Get the scholarship ID from the URL
    const [scholarship, setScholarship] = useState(null);
    const [applicationData, setApplicationData] = useState({
        email: '',
        phone_number: '',
        first_name: '',
        last_name: '',
        birth_date: '',
        address1: '',
        address2: '',
        gpa: '',
        academic_level: 'Graduate',
        enrollment_status: 'Full Time',
        department: '',
        SoP: null // Statement of Purpose (File)
    });

    useEffect(() => {
        // Fetch scholarship details using the scholarship ID
        const fetchScholarship = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/scholarships/${id}/`);
                setScholarship(response.data);
            } catch (error) {
                console.error('Error fetching scholarship details:', error);
            }
        };

        fetchScholarship();
    }, [id]);

    const handleApplicationSubmit = async (e) => {
        e.preventDefault();

        // Form data to be sent, including the file upload
        const formData = new FormData();
        for (let key in applicationData) {
            formData.append(key, applicationData[key]);
        }
        formData.append('scholarship', id);
        formData.append('status', 'submitted');

        try {
            // Submit the application for the scholarship
            const response = await axios.post(
                `http://localhost:8000/api/applications/`,
                formData,
                {
                    headers: {
                        'Authorization': `Token ${localStorage.getItem('token')}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            console.log('Application submitted', response.data);
        } catch (error) {
            console.error('Error submitting application:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setApplicationData({
            ...applicationData,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setApplicationData({
            ...applicationData,
            [name]: files[0]
        });
    };

    return (
        <div>
            {scholarship ? (
                <div>
                    <h2>{scholarship.scholarship_name}</h2>
                    <h3>Description</h3> <p> {scholarship.description}</p>
                    <h3>Additional Info</h3> <p> {scholarship.additional_info}</p>
                    <p><strong>Amount:</strong> {scholarship.amount}</p>
                    <p><strong>Organization:</strong> {scholarship.organization}</p>
                    <p><strong>Department:</strong> {scholarship.department}</p>
                    <p><strong>Apply Between:</strong> {new Date(scholarship.open_date).toLocaleDateString()} - {new Date(scholarship.deadline).toLocaleDateString()}</p>
                    <hr></hr>
                    <form onSubmit={handleApplicationSubmit}>
                        {/* Form Fields for Applicant */}
                        <div>
                            <label htmlFor="first_name">First Name:</label>
                            <input
                                type="text"
                                id="first_name"
                                name="first_name"
                                value={applicationData.first_name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="last_name">Last Name:</label>
                            <input
                                type="text"
                                id="last_name"
                                name="last_name"
                                value={applicationData.last_name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="email">Email:</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={applicationData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="phone_number">Phone Number:</label>
                            <input
                                type="text"
                                id="phone_number"
                                name="phone_number"
                                value={applicationData.phone_number}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="birth_date">Birth Date:</label>
                            <input
                                type="date"
                                id="birth_date"
                                name="birth_date"
                                value={applicationData.birth_date}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="address1">Address 1:</label>
                            <input
                                type="text"
                                id="address1"
                                name="address1"
                                value={applicationData.address1}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="address2">Address 2:</label>
                            <input
                                type="text"
                                id="address2"
                                name="address2"
                                value={applicationData.address2}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="gpa">GPA:</label>
                            <input
                                type="number"
                                step="0.01"
                                id="gpa"
                                name="gpa"
                                value={applicationData.gpa}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="academic_level">Academic Level:</label>
                            <select
                                id="academic_level"
                                name="academic_level"
                                value={applicationData.academic_level}
                                onChange={handleChange}
                                required
                            >
                                <option value="GRAD">Graduate</option>
                                <option value="UNDER">Undergraduate</option>
                                <option value="HS">High School</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="enrollment_status">Enrollment Status:</label>
                            <select
                                id="enrollment_status"
                                name="enrollment_status"
                                value={applicationData.enrollment_status}
                                onChange={handleChange}
                                required
                            >
                                <option value="FT">Full Time</option>
                                <option value="PT">Part Time</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="department">Department:</label>
                            <input
                                type="text"
                                id="department"
                                name="department"
                                value={applicationData.department}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="SoP">Statement of Purpose (SoP):</label>
                            <input
                                type="file"
                                id="SoP"
                                name="SoP"
                                onChange={handleFileChange}
                                required
                            />
                        </div>

                        <div>
                            <button type="submit">Submit Application</button>
                        </div>
                    </form>
                </div>
            ) : (
                <p>Loading scholarship details...</p>
            )}
        </div>
    );
};

export default ApplicationPage;
