import axios from 'axios';

const API_URL = 'http://localhost:8000/api/';

// Function to fetch scholarships with pagination, filtering, and sorting
export const getScholarships = async (filters = {}, sort = '', page = 1, pageSize = 10) => {
    try {
        const token = localStorage.getItem('token');  // Retrieve token from localStorage
        
        // Check if amount filters need to be converted to numeric values
        if (filters.min_amount && filters.min_amount.startsWith('$')) {
            filters.min_amount = parseFloat(filters.min_amount.replace('$', '').replace(',', ''));
        }
        if (filters.max_amount && filters.max_amount.startsWith('$')) {
            filters.max_amount = parseFloat(filters.max_amount.replace('$', '').replace(',', ''));
        }
        
        // Check if has_amount filter is enabled (removes scholarships with "Varies" amount)
        if (filters.has_amount === 'true') {
            filters.amount__isnull = false;  // Exclude scholarships with null or "Varies" amount
        } else if (filters.has_amount === 'false') {
            filters.amount__isnull = true;   // Include scholarships that have "Varies" or null amount
        }

        
        const response = await axios.get(`${API_URL}scholarships/`, {
            headers: {
                'Authorization': `Token ${token}`,  // Add token to Authorization header
            },
            params: {
                ...filters, // Include filters like renewal_type, date_range_start, etc.
                ordering: sort, // Add sorting
                page, // Current page
                page_size: pageSize, // Number of items per page
            },
        });
        console.log(response.data);  // Log the returned data
        return response.data;
    } catch (error) {
        console.error('Error fetching scholarships:', error);  // Log any errors
        return {results: [], count: 0 };  // Return empty array on error
    }
};

export const checkIsAdmin = async () => {
    const token = localStorage.getItem('token');
    if(token === "undefined" || !token || token == null) {
        return false;
    }

    const response = await axios.get(`${API_URL}restricted/`, {
        headers: {
            'Authorization': `Token ${token}`,  // Add token to Authorization header
        }
    });

    // For now we can just check if there wasn't an error when validating the token
    return response.status === 200;
};

export const submitApplication = async (applicationData) => {
    const response = await axios.post(`${API_URL}applications/`, applicationData);
    return response.data;
};

export const createScholarship = async (createdData) => {
    console.log(createdData);
    const response = await axios.post(`${API_URL}scholarships/`, createdData, {
        headers: {
            Authorization: `Token ${localStorage.getItem('token')}`,
        },
    });

    if (response.status !== 201) {
        throw new Error('Failed to create scholarship');
    }

    return response.data;
};

export const updateScholarship = async (id, updatedData) => {
    const response = await axios.put(`${API_URL}scholarships/${id}/`, updatedData, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${localStorage.getItem('token')}`,
        },
    });

    return response.data;
};

export const deleteScholarship = async (id) => {
    const response = await axios.delete(`${API_URL}scholarships/${id}/`, {
        headers: {
            Authorization: `Token ${localStorage.getItem('token')}`,
        },
    });

    if (response.status !== 204) {
        throw new Error('Failed to delete scholarship');
    }
};

//
// export const getApplications = async (isAdmin, username) => {
//
//     let response = null;
//     if(isAdmin) {
//         response = await axios.get(`${API_URL}applications/`, {
//             headers: {
//                 Authorization: `Token ${localStorage.getItem('token')}`,
//             },
//         });
//     } else {
//         response = await axios.get(`${API_URL}applications/${username}/`, {
//             headers: {
//                 Authorization: `Token ${localStorage.getItem('token')}`,
//             },
//         });
//     }
//
//     if (response.status !== 200) {
//         throw new Error('Failed to get applications');
//     }
// };

export const getApplication = async (id) => {

    const response = await axios.get(`${API_URL}applications/${id}/`, {
            headers: {
                Authorization: `Token ${localStorage.getItem('token')}`,
            },
        });

    if (response.status !== 200) {
        throw new Error('Failed to get application');
    }

    return response.data;
};

export const getApplications = async (isAdmin, page = 1, pageSize = 10) => {
    try {
        const token = localStorage.getItem('token');  // Retrieve token from localStorage

        const response = await axios.get( `${API_URL}applications/`, {
            headers: {
                'Authorization': `Token ${token}`,
            },
            params: {
                page, // Current page
                page_size: pageSize, // Number of items per page
                is_admin: isAdmin
            },
        });
        console.log(response.data);  // Log the returned data
        return response.data;
    } catch (error) {
        console.error('Error fetching applications:', error);  // Log any errors
        return {results: [], count: 0 };  // Return empty array on error
    }
};

export const getScholarship = async (id) => {

    const response = await axios.get(`${API_URL}scholarships/${id}/`, {
        headers: {
            Authorization: `Token ${localStorage.getItem('token')}`,
        },
    });

    if (response.status !== 200) {
        throw new Error('Failed to get scholarship');
    }

    return response.data;
};

export const getProfile = async () => {
    const response = await axios.get(`${API_URL}profile/`, {
        headers: {
            Authorization: `Token ${localStorage.getItem('token')}`,
        },
    });


    if (response.status !== 200) {
        return false
    } else {
        return response.data;
    }
};

export const createProfile = async (profileData) => {
    const response = await axios.post(`${API_URL}profile/`, profileData, {
        headers: {
            Authorization: `Token ${localStorage.getItem('token')}`,
        },
    });


    if (response.status !== 200) {
        return false
    } else {
        return response.data;
    }
};