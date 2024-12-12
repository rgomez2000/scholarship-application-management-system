import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {getProfile, createProfile} from './services/api';
import './scholarshipDetails.css';

const ProfilePageNew = () => {
    const { id } = useParams(); // Get the scholarship ID from the URL
    const [hasProfile, setHasProfile] = useState(false);
    const navigate = useNavigate();
    const isAuthenticated = localStorage.getItem('token') !== null; // Check if user is authenticated
    const [profile, setProfile] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        birth_date: '',
        address1: '',
        address2: '',
        gpa: '',
        department: '',
        academic_level: '',
        enrollment_status: ''
    });

    useEffect(() => {
        if(!isAuthenticated) {
            navigate('/login');
        }

        async function fetchData() {
            const data = await getProfile();
            if(data === false) {
                setHasProfile(false)
            } else {
                setProfile(data);
                setHasProfile(true)
            }
        }


        fetchData();
    }, [id]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile((prevProfile) => ({
            ...prevProfile,
            [name]: value
        }));
    };

    const handleCreate = async () => {
        try {
            const p = await createProfile(profile);
            alert('Profile created successfully!');
            console.log('Created Profile:', p);

            navigate('/');
        } catch (error) {
            console.error('Error creating profile:', error);
            alert('Failed to create profile.');
        }
    };


    return (
        <div>
            {!hasProfile ? (
                <div>
                    <form>
                        <label>
                            First Name:
                            <input
                                type="text"
                                name="first_name"
                                value={profile.first_name}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            Last Name:
                            <input
                                type="text"
                                name="last_name"
                                value={profile.last_name}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            Email:
                            <input
                                type="text"
                                name="email"
                                value={profile.email}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            Phone Number:
                            <input
                                type="text"
                                name="phone_number"
                                value={profile.phone_number}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            Birth Date:
                            <input
                                type="text"
                                name="birth_date"
                                value={profile.birth_date}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            Address 1:
                            <input
                                type="text"
                                name="address1"
                                value={profile.address1}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            Address 1:
                            <input
                                type="text"
                                name="address2"
                                value={profile.address2}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            GPA:
                            <input
                                type="text"
                                name="gpa"
                                value={profile.gpa}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            Academic Level:
                            <input
                                type="text"
                                name="academic_level"
                                value={profile.academic_level}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            Enrollment Status:
                            <input
                                type="text"
                                name="enrollment_status"
                                value={profile.enrollment_status}
                                onChange={handleInputChange}
                            />
                        </label>Department:
                        <label>
                            Department:
                            <input
                                type="text"
                                name="department"
                                value={profile.department}
                                onChange={handleInputChange}
                            />
                        </label>

                    </form>
                    <button onClick={handleCreate}>Create Profile</button>
                </div>
            ) : (
                <div>
                    <h2>Profile</h2>
                    {/*{registerMessage && <p style={{color: 'green'}}>{registerMessage}</p>}*/}

                    <div>
                        <p><strong>First Name:</strong> {profile.first_name}</p>
                        <p><strong>Last Name:</strong> {profile.last_name}</p>
                        <p><strong>Email:</strong> {profile.email}</p>
                        <p><strong>Phone Number:</strong> {profile.phone_number}</p>
                        <p><strong>Birth Date:</strong> {profile.birth_date}</p>
                        <p><strong>Address 1:</strong> {profile.address1}</p>
                        <p><strong>Address 2:</strong> {profile.address2}</p>
                        <p><strong>GPA:</strong> {profile.gpa}</p>
                        <p><strong>Academic Level:</strong> {profile.academic_level}</p>
                        <p><strong>Enrollment Status:</strong> {profile.enrollment_status}</p>
                        <p><strong>Department:</strong> {profile.department}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePageNew;
