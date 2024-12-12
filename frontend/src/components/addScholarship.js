import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkIsAdmin, createScholarship } from './services/api';
import './scholarshipDetails.css';
import './addScholarship.css';

const ScholarshipDetails = () => {
    const [scholarship, setScholarship] = useState({
        scholarship_name: '',
        amount: '',
        organization: '',
        department: '',
        open_date: '',
        deadline: '',
        description: '',
        additional_info: ''
    });
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchIsAdmin() {
            const isAdminFlag = await checkIsAdmin();
            if (!isAdminFlag) {
                alert("Only admins can be on this page");
                navigate('/');
            } else {
                setIsAdmin(true);
            }
        }

        fetchIsAdmin();
    }, [navigate]); // Ensure the effect only runs once on mount

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setScholarship((prevScholarship) => ({
            ...prevScholarship,
            [name]: value
        }));
    };

    const handleCreate = async () => {
        try {
            // Build the json object to send to API
            const scholarshipData = {
                ...scholarship,
                open_date: scholarship.open_date || new Date().toISOString(),
                deadline:
                    scholarship.deadline ||
                    new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
            };

            const createdScholarship = await createScholarship(scholarshipData);
            alert('Scholarship created successfully!');
            console.log('Created Scholarship:', createdScholarship);

            navigate('/');
        } catch (error) {
            console.error('Error creating scholarship:', error);
            alert('Failed to create scholarship.');
        }
    };

    return (
        <div>
            {isAdmin && (
                <div class="form-container"> 
                    <h1>{'Create Scholarship'}</h1>
                    <form class="form-group">
                        <label>
                            Scholarship Name:
                            <input
                                type="text"
                                name="scholarship_name"
                                value={scholarship.scholarship_name}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            Amount:
                            <input
                                type="number"
                                name="amount"
                                value={scholarship.amount}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            Organization:
                            <input
                                type="text"
                                name="organization"
                                value={scholarship.organization}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            Department:
                            <input
                                type="text"
                                name="department"
                                value={scholarship.department}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            Open Date:
                            <input
                                type="date"
                                name="open_date"
                                value={scholarship.open_date}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            Deadline:
                            <input
                                type="date"
                                name="deadline"
                                value={scholarship.deadline}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            Description:
                            <textarea
                                name="description"
                                value={scholarship.description}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            Additional Info:
                            <textarea
                                name="additional_info"
                                value={scholarship.additional_info}
                                onChange={handleInputChange}
                            />
                        </label>
                        <button class="form-container-button" onClick={handleCreate}>Create Scholarship</button>
                    </form>
                    
                </div>
            )}
        </div>
    );
};

export default ScholarshipDetails;
