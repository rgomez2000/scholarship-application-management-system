import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { checkIsAdmin, getScholarships, updateScholarship, deleteScholarship } from './services/api';
import './scholarshipDetails.css';

const ScholarshipDetails = () => {
    const { id } = useParams(); // Get the scholarship ID from the URL
    const [scholarship, setScholarship] = useState(null);
    const [editableScholarship, setEditableScholarship] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const navigate = useNavigate();
    const isAuthenticated = localStorage.getItem('token') !== null; // Check if user is authenticated
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        async function fetchData() {
            const data = await getScholarships();
            const selectedScholarship = data.results.find(sch => sch.id === parseInt(id));
            setScholarship(selectedScholarship);
            setEditableScholarship({ ...selectedScholarship });
        }

        async function fetchIsAdmin() {
            const isAdminFlag = await checkIsAdmin();
            setIsAdmin(isAdminFlag);
        }

        fetchData();
        fetchIsAdmin();
    }, [id]); // Fetch new data whenever the ID changes

    if (!scholarship) {
        return <p>Loading...</p>;
    }

    const handleApply = (id) => {
        if (isAuthenticated) {
            navigate(`/apply/${id}`);
        } else {
            alert('You must be logged in to apply.');
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            await updateScholarship(editableScholarship.id, editableScholarship);
            alert('Scholarship updated successfully!');
            setIsEditing(false);
            navigate('/'); // Navigate to the listing page
        } catch (error) {
            alert('Failed to update scholarship.');
        }
    };

    const handleDelete = async () => {
        try {
            await deleteScholarship(scholarship.id);
            alert('Scholarship deleted successfully!');
            navigate('/'); // Navigate to the listing page
        } catch (error) {
            alert('Failed to delete scholarship.');
        }
    };

    const handleFieldChange = (field, value) => {
        setEditableScholarship({
            ...editableScholarship,
            [field]: value
        });
    };

    return (
        <div>
            {isEditing ? (
                <div>
                    <input
                        type="text"
                        value={editableScholarship.scholarship_name}
                        onChange={(e) => handleFieldChange('scholarship_name', e.target.value)}
                    />
                    <input
                        type="text"
                        value={editableScholarship.amount}
                        onChange={(e) => handleFieldChange('amount', e.target.value)}
                    />
                    <input
                        type="text"
                        value={editableScholarship.organization}
                        onChange={(e) => handleFieldChange('organization', e.target.value)}
                    />
                    <input
                        type="text"
                        value={editableScholarship.department}
                        onChange={(e) => handleFieldChange('department', e.target.value)}
                    />
                    <textarea
                        value={editableScholarship.description}
                        onChange={(e) => handleFieldChange('description', e.target.value)}
                    />
                    <textarea
                        value={editableScholarship.additional_info}
                        onChange={(e) => handleFieldChange('additional_info', e.target.value)}
                    />
                    <button onClick={handleSave}>Save</button>
                    <button onClick={() => setIsEditing(false)}>Cancel</button>
                </div>
            ) : (
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
                    {isAuthenticated && <button onClick={() => handleApply(scholarship.id)}>Apply</button>}
                    {isAdmin && <button onClick={handleEdit}>Edit</button>}
                    {isAdmin && (
                        <>
                            <button onClick={() => setConfirmDelete(true)}>Delete</button>
                            {confirmDelete && (
                                <div>
                                    <p>Are you sure you want to delete this scholarship?</p>
                                    <button onClick={handleDelete}>Confirm</button>
                                    <button onClick={() => setConfirmDelete(false)}>Cancel</button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default ScholarshipDetails;
