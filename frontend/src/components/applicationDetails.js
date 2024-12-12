import React, { useState, useEffect } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
// import './application.css';
import {checkIsAdmin, getApplication, updateApplication} from './services/api';

const ApplicationDetails = () => {
    const { id } = useParams(); // Get the application ID from the URL
    const [application, setApplication] = useState({});
    const [status, setStatus] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();


    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getApplication(id);
                setApplication(data);
            } catch (error) {
                console.error('Error fetching application details:', error);
            } finally {
                setLoading(false); // Set loading to false whether the fetch succeeds or fails
            }
        }

        async function fetchIsAdmin() {
            try {
                const isAdmin = await checkIsAdmin();
                setIsAdmin(isAdmin);
            } catch (error) {
                console.error('Error checking admin status:', error);
            }
        }

        fetchData();
        fetchIsAdmin();
    }, [id]);



    const handleSave = async () => {
        try {
            await updateApplication(application.id, {id: application.id,
                status: status});
            alert('Application updated successfully!');
        } catch (error) {
            alert('Failed to update application.', error);
        }
        navigate('/applications');
    };


    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div>
                <h1>Scholarship</h1>
                <h2>{application.scholarship.scholarship_name}</h2>
                <h3>Description</h3> <p> {application.scholarship.description}</p>
                <h3>Additional Info</h3> <p> {application.scholarship.additional_info}</p>
                <p><strong>Amount:</strong> {application.scholarship.amount}</p>
                <p><strong>Organization:</strong> {application.scholarship.organization}</p>
                <p><strong>Department:</strong> {application.scholarship.department}</p>
                <p><strong>Apply
                    Between:</strong> {new Date(application.scholarship.open_date).toLocaleDateString()} - {new Date(application.scholarship.deadline).toLocaleDateString()}
                </p>
                <hr></hr>
                <h1>Applicant</h1>

                <div>
                    <div>
                        <strong>First Name:</strong> {application.applicant.first_name}
                    </div>

                    <div>
                        <strong>Last Name:</strong> {application.applicant.last_name}
                    </div>

                    <div>
                        <strong>Email:</strong> {application.applicant.email}
                    </div>

                    <div>
                        <strong>Phone Number:</strong> {application.applicant.phone_number}
                    </div>

                    <div>
                        <strong>Birth Date:</strong> {application.applicant.birth_date}
                    </div>

                    <div>
                        <strong>Address 1:</strong> {application.applicant.address1}
                    </div>

                    <div>
                        <strong>Address 2:</strong> {application.applicant.address2}
                    </div>

                    <div>
                        <strong>GPA:</strong> {application.applicant.gpa}
                    </div>

                    <div>
                        <strong>Academic Level:</strong> {application.applicant.academic_level}
                    </div>

                    <div>
                        <strong>Enrollment Status:</strong> {application.applicant.enrollment_status}
                    </div>

                    <div>
                        <strong>Department:</strong> {application.applicant.department}
                    </div>
                </div>

                <h1>Status</h1>
                    <div>
                        <strong>Status:</strong> {application.status}
                    </div>

                {isAdmin && <button onClick={() => setIsEditing(true)}>Change Status</button>}
            </div>
            {isEditing && (
                <div>
                    <label htmlFor="status">Status:</label>
                    <select
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="reviewed">Reviewed</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                    <button onClick={handleSave}>Save</button>
                    <button onClick={() => setIsEditing(false)}>Cancel</button>
                </div>
            )}
        </div>
    );
};

export default ApplicationDetails;
