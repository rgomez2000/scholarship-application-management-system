import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getScholarships } from './services/api';
import './scholarshipDetails.css';

const ScholarshipDetails = () => {
    const { id } = useParams(); // Get the scholarship ID from the URL
    const [scholarship, setScholarship] = useState(null);
    const navigate = useNavigate();
    const isAuthenticated = localStorage.getItem('token') !== null; // Check if user is authenticated

    useEffect(() => {
        async function fetchData() {
            const data = await getScholarships();
            const selectedScholarship = data.results.find(sch => sch.id === parseInt(id)); 
        setScholarship(selectedScholarship);
        }
        fetchData();
    }, [id]); // Fetch new data whenever the ID changes

    if (!scholarship) {
        return <p>Loading...</p>;
    }

    const handleApply = (id) => {
        // Navigate to the application page for the specific scholarship
        if (isAuthenticated) {
            navigate(`/apply/${id}`);
        } else {
            alert('You must be logged in to apply.');
        }
    };

    return (
        <div>
            <h1>{scholarship.scholarship_name}</h1>
            <p><strong>Amount:</strong> {scholarship.amount}</p>
            <p><strong>Organization:</strong> {scholarship.organization}</p>
            <p><strong>Department:</strong> {scholarship.department}</p>
            <p><strong>Apply Between:</strong> {new Date(scholarship.open_date).toLocaleDateString()} - {new Date(scholarship.deadline).toLocaleDateString()}</p>
            <h3>Description</h3>
            <p>{scholarship.description}</p>
            <h3>Additional Info</h3>
            <p>{scholarship.additional_info}</p>
            {isAuthenticated && (
                            <button onClick={() => handleApply(scholarship.id)}>Apply</button>
                        )}
        </div>
    );
};

export default ScholarshipDetails;
