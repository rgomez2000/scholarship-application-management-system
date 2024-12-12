import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './application.css';
import {getApplication, getScholarship} from "./services/api";

const ApplicationPage = () => {
    const { id } = useParams(); // Get the scholarship ID from the URL
    const [scholarship, setScholarship] = useState(null);
    const [application, setApplication] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = getApplication(id);
                setApplication(response.data);
            } catch (error) {
                console.error('Error fetching application details:', error);
            }

            try {
                const response = getScholarship(application.scholarship_id);
                setScholarship(response.data);
            } catch (error) {
                console.error('Error fetching scholarship details:', error);
            }
        };

        fetchData();
    }, [id]);

    return (
        <div>
            {scholarship ? (
                <div>
                    <h2>{application.scholarship_name}</h2>
                    <h3>Description</h3> <p> {scholarship.description}</p>
                    <h3>Additional Info</h3> <p> {application.additional_info}</p>
                    <p><strong>Amount:</strong> {application.amount}</p>
                    <p><strong>Organization:</strong> {application.organization}</p>
                    <p><strong>Department:</strong> {application.department}</p>
                    <p><strong>Apply
                        Between:</strong> {new Date(application.open_date).toLocaleDateString()} - {new Date(scholarship.deadline).toLocaleDateString()}
                    </p>
                    <hr></hr>

                    <h1>First Name: {application.first_name}</h1>
                    <h1>Last Name: {application.last_name}</h1>
                    <h1>Email: {application.email}</h1>
                    <h1>Phone Number: {application.phone_number}</h1>
                    <h1>Birth Date: {application.birth_date}</h1>
                    <h1>Address 1: {application.address1}</h1>
                    <h1>Address 2: {application.address2}</h1>
                    <h1>GPA: {application.gpa}</h1>
                    <h1>Academic Level: {application.academic_level}</h1>
                    <h1>Enrollment Status: {application.enrollment_status}</h1>
                    <h1>Department: {application.department}</h1>
                    {/*<h1>Statement of Purpose: {application.SoP ?*/}
                    {/*<Link to={application.SoP}>View File</Link> : 'Not Uploaded'}</h1>*/}


                </div>
            ) : (
                <p>Loading scholarship details...</p>
            )}
        </div>
    );
};

export default ApplicationPage;
