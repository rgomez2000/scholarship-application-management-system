import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // For accessing route parameters
import { getScholarships } from './services/api';
import './scholarshipDetails.css';

const ScholarshipDetails = () => {
    const { id } = useParams(); // Get the scholarship ID from the URL
    const [scholarship, setScholarship] = useState(null);

    useEffect(() => {
        async function fetchData() {
            const scholarships = await getScholarships();
            const selectedScholarship = scholarships.find(sch => sch.id === parseInt(id));
            setScholarship(selectedScholarship);
        }
        fetchData();
    }, [id]); // Fetch new data whenever the ID changes

    if (!scholarship) {
        return <p>Loading...</p>;
    }

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
        </div>
    );
};

export default ScholarshipDetails;
