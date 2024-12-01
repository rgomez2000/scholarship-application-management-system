import axios from 'axios';

const API_URL = 'http://localhost:8000/api/';

export const getScholarships = async () => {
    try {
        const response = await axios.get(`${API_URL}scholarships/`);
        console.log(response.data);  // Log the returned data
        return response.data;
    } catch (error) {
        console.error('Error fetching scholarships:', error);  // Log any errors
    }
    
};

export const submitApplication = async (applicationData) => {
    const response = await axios.post(`${API_URL}applications/`, applicationData);
    return response.data;
};
