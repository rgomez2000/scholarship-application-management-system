import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getScholarships } from './services/api';
import './scholarshipsList.css';

const ScholarshipsListAuth = () => {
    const [scholarships, setScholarships] = useState([]);
    const navigate = useNavigate();

    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('token') !== null;

    useEffect(() => {
        async function fetchData() {
            const data = await getScholarships();
            setScholarships(data); // Storing fetched scholarships in state
        }
        fetchData();
    }, []); // Empty dependency array ensures this runs once after initial render

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
            <h1>Welcome to ScholarshipAid</h1>
            <ul>
                {scholarships.map((scholarship) => (
                    <li key={scholarship.id}>
                        <hr />
                        <h2>
                            <Link to={`/scholarship/${scholarship.id}`}>{scholarship.scholarship_name}</Link>
                        </h2>
                        <p><strong>Amount:</strong> {scholarship.amount}</p>
                        <p><strong>Organization:</strong> {scholarship.organization}</p>
                        <p><strong>Department:</strong> {scholarship.department}</p>
                        <p><strong>Apply Between:</strong> {new Date(scholarship.open_date).toLocaleDateString()} - {new Date(scholarship.deadline).toLocaleDateString()}</p>
                        {isAuthenticated && (
                            <button onClick={() => handleApply(scholarship.id)}>Apply</button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ScholarshipsListAuth;