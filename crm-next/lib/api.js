import axios from 'axios';

// Create axios instance with relative path for Next.js API routes
const axiosInstance = axios.create({
    baseURL: '/api',
    withCredentials: true,
});

// Add token to every request BEFORE sending
axiosInstance.interceptors.request.use(
    (config) => {
        // Check if running on client side
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Common Error Handler
const handleAxiosError = (error, defaultMessage) => {
    if (error.response) {
        const msg = error.response.data?.message || defaultMessage;
        throw new Error(msg);
    } else if (error.request) {
        throw new Error('No response from server. Please try again.');
    } else {
        throw new Error(error.message || defaultMessage);
    }
};

// Auth API
export const registerUser = async (userData) => {
    try {
        const response = await axiosInstance.post('/auth/register', userData);
        return response.data;
    } catch (error) {
        handleAxiosError(error, 'Registration failed');
    }
};

export const loginUser = async (credentials) => {
    try {
        const response = await axiosInstance.post('/auth/login', credentials);
        if (response.data.success) {
            if (typeof window !== 'undefined') {
                localStorage.setItem('token', response.data.token);
            }
        }
        return response.data;
    } catch (error) {
        handleAxiosError(error, 'Login failed');
    }
};

// Customer API
export const createCustomer = async (customerData) => {
    try {
        const response = await axiosInstance.post('/customers', customerData);
        return response.data;
    } catch (error) {
        handleAxiosError(error, 'Failed to create customer');
    }
};

export const getAllCustomers = async () => {
    try {
        const response = await axiosInstance.get('/customers');
        return response.data;
    } catch (error) {
        handleAxiosError(error, 'Failed to fetch customers');
    }
};

export const updateCustomer = async (customerId, customerData) => {
    try {
        const response = await axiosInstance.put(`/customers/${customerId}`, customerData);
        return response.data;
    } catch (error) {
        handleAxiosError(error, 'Failed to update customer');
    }
};

export const deleteCustomer = async (customerId) => {
    try {
        const response = await axiosInstance.delete(`/customers/${customerId}`);
        return response.data;
    } catch (error) {
        handleAxiosError(error, 'Failed to delete customer');
    }
};

// Challan API
export const createChallan = async (challanData) => {
    try {
        const response = await axiosInstance.post('/challan', challanData);
        return response.data;
    } catch (error) {
        handleAxiosError(error, 'Failed to create challan');
    }
};

export const getAllChallans = async () => {
    try {
        const response = await axiosInstance.get('/challan');
        return response.data;
    } catch (error) {
        handleAxiosError(error, 'Failed to fetch challans');
    }
};

export const getChallanById = async (challanId) => {
    try {
        const response = await axiosInstance.get(`/challan/${challanId}`);
        return response.data;
    } catch (error) {
        handleAxiosError(error, 'Failed to fetch challan by ID');
    }
};

export const deleteChallan = async (challanId) => {
    try {
        const response = await axiosInstance.delete(`/challan/${challanId}`);
        return response.data;
    } catch (error) {
        handleAxiosError(error, 'Failed to delete challan');
    }
};
