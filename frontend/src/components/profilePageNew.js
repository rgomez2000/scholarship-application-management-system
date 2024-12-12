import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {getProfile, createProfile} from './services/api';
import './scholarshipDetails.css';
import "./profilePageNew.css";

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
                <div class="form-container">
                    <form class="form-group">
                        <h2>Create a User Profile</h2>
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
                                type="tel"
                                name="phone_number"
                                placeholder="e.g., +1-234-567-8900"
                                pattern="^\+?[1-9]\d{1,14}$" title="Enter a valid phone number with country code."
                                value={profile.phone_number}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label for="date">
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
                                type="number"
                                name="gpa"
                                step="0.01"
                                min="0.00"
                                max="4.00"
                                placeholder="e.g., 3.75"
                                value={profile.gpa}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            Academic Level:
                            <select id="academic-level" 
                            name="academic_level"
                            value={profile.academic_level}
                            onChange={handleInputChange}
                            >
                                <option value="" disabled selected>Select your status</option>
                                <option value="high_school">High School</option>
                                <option value="undergraduate">Undergraduate</option>
                                <option value="graduate">Graduate</option>
                            </select>
                        </label>
                        <label>
                            Enrollment Status:
                            <select id="enrollment-status" 
                            name="enrollment_status"
                            value={profile.enrollment_status}
                            onChange={handleInputChange}
                            >
                                <option value="" disabled selected>Select your level</option>
                                <option value="part_time">Part Time</option>
                                <option value="full_time">Full Time</option>
                            </select>
                        </label>
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
                    <button class="form-container-button" onClick={handleCreate}>Create Profile</button>
                </div>
            ) : (
                <div>
                    {/*{registerMessage && <p style={{color: 'green'}}>{registerMessage}</p>}*/}

                    <div class="form-container">
                        <h2>Profile</h2>
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
