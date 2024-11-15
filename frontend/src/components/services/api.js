import axios from 'axios';

const API_URL = 'http://localhost:8000/api/';

export const getScholarships = async () => {
    const response = await axios.get(`${API_URL}scholarships/`);
    return response.data;
};

export const submitApplication = async (applicationData) => {
    const response = await axios.post(`${API_URL}applications/`, applicationData);
    return response.data;
};