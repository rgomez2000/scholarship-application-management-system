import React, { useEffect, useState } from 'react';
import {getApplications} from './services/api';
import {Link} from "react-router-dom";
// import './applicationsList.css';

const ApplicationsList = () => {
    const [applications, setApplications] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        async function fetchData() {
            try {
                setLoading(true); // Set loading state to true before API call
                const data = await getApplications(true, currentPage); // Pass currentPage to the API call
                setApplications(data); // Use `results` from the API response
                setTotalPages(Math.ceil(data.length / 10));

            } catch (error) {
                console.error('Error fetching scholarships:', error);
            } finally {
                setLoading(false); // Set loading state to false after API call
            }
        }

        fetchData();
    }, [currentPage]); // Re-fetch data when currentPage changes

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div>
            <h1>Applications</h1>

            {loading ? (
                <p>Loading applications...</p>
            ) : (
                <>
                    <ul>
                        {applications.map((application) => (
                            <li key={application.id}>
                                <hr/>
                                <Link to={`/applications/${application.id}`}>Go to application</Link>
                                <p><strong>Scholarship Name:</strong> {application.scholarship.scholarship_name}</p>
                                <p><strong>Amount:</strong> {application.scholarship.amount}</p>
                                <p><strong>Status:</strong> {application.status}</p>
                                <p><strong>Submitted On:</strong> {application.submitted_on}</p>
                            </li>
                        ))}
                    </ul>

                    <div className="pagination">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        <span>
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ApplicationsList;