import React, { useEffect, useState } from 'react';
import { getScholarships } from './services/api';

const ScholarshipsList = () => {
    const [scholarships, setScholarships] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const data = await getScholarships();
            setScholarships(data);
        }
        fetchData();
    }, []);

    return (
        <div>
            <h1>Available Scholarships</h1>
            <ul>
                {scholarships.map((scholarship) => (
                    <li key={scholarship.id}>{scholarship.name} - {scholarship.amount}</li>
                ))}
            </ul>
        </div>
    );
};

export default ScholarshipsList;