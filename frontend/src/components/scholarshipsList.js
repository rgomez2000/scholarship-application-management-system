import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link component
import { getScholarships } from './services/api';
import './scholarshipsList.css'

const ScholarshipsList = () => {
    const [scholarships, setScholarships] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const data = await getScholarships();
            setScholarships(data); // Storing fetched scholarships in state
        }
        fetchData();
    }, []); // Empty dependency array ensures this runs once after initial render

    return (
        <div>
            <h1>Welcome to ScholarshipAid</h1>
            <ul>
                {scholarships.map((scholarship) => (
                    <li key={scholarship.id}>
                        <hr></hr>
                        <h2>
                            <Link to={`/scholarship/${scholarship.id}`}>{scholarship.scholarship_name}</Link>
                        </h2>
                        <p><strong>Amount:</strong> {scholarship.amount}</p>
                        <p><strong>Organization:</strong> {scholarship.organization}</p>
                        <p><strong>Department:</strong> {scholarship.department}</p>
                        <p><strong>Apply Between:</strong> {new Date(scholarship.open_date).toLocaleDateString()} - {new Date(scholarship.deadline).toLocaleDateString()}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ScholarshipsList;