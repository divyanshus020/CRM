import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/v1';

// Common axios instance (optional but recommended)
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  withCredentials: true,
});

// Add token to every request BEFORE sending
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('Token being sent:', token); // Debug log
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ User Registration
export const registerUser = async (userData) => {
  try {
    const response = await axiosInstance.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    handleAxiosError(error, 'Registration failed');
  }
};

// ✅ User Login
export const loginUser = async (credentials) => {
  try {
    const response = await axiosInstance.post('/auth/login', credentials);
    

    if (response.data.success) {
      // Store token in localStorage or cookies
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    console.error('Login Error:', error);
    handleAxiosError(error, 'Login failed');
  }
};

// ✅ Get Auth Headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  // console.log("Using token:", token);
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const createChallan = async (challanData) => {
  try {
    const response = await axiosInstance.post('challan/create-challan', challanData, {
      headers: getAuthHeaders(),
      withCredentials: true, // cookies send honge
    });
    console.log('Challan Created:', response.data);
    return response.data;
  } catch (error) {
    handleAxiosError(error, 'Failed to create challan');
  }
};

// ✅ Get All Challans
export const getAllChallans = async () => {
  try {
    const token = localStorage.getItem('token'); // Get token from localStorage
    
    if (!token) {
      throw new Error('User not authenticated');
    }
    
    const response = await axiosInstance.get('/challan/get-challans', {
      headers: {
        Authorization: `Bearer ${token}`, // Send token in header
      },
    });
    
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

export const getChallanById = async (challanId) => {

  try {

    const response = await axiosInstance.get(`/challan/get-challan/${challanId}`, {
      headers: getAuthHeaders(),
      withCredentials: true, // cookies send honge
    });

    console.log('Fetched Challan:', response.data);
    return response.data;
    
  } catch (error) {
    handleAxiosError(error, 'Failed to fetch challan by ID');
    
    
  }
}

// Create a new customer
export const createCustomer = async (customerData) => {
  try {
    const response = await axiosInstance.post('/customers', customerData);
    console.log('New Customer Created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Create customer error:', error);
    throw error;
  }
};

// Get all customers
export const getAllCustomers = async () => {
  try {
    const response = await axiosInstance.get('/customers');
    console.log('Fetched Customers:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get all customers error:', error);
    throw error;
  }
};

// Update a customer
export const updateCustomer = async (customerId, customerData) => {
  try {
    const response = await axiosInstance.put(`/customers/${customerId}`, customerData);
    console.log('Customer Updated:', response.data);
    return response.data;
  } catch (error) {
    console.error('Update customer error:', error);
    throw error;
  }
};

// Delete a customer
export const deleteCustomer = async (customerId) => {
  try {
    const response = await axiosInstance.delete(`/customers/${customerId}`);
    console.log('Customer Deleted:', response.data);
    return response.data;
  } catch (error) {
    console.error('Delete customer error:', error);
    throw error;
  }
};

// Delete a challan
export const deleteChallan = async (challanId) => {
  try {
    const response = await axiosInstance.delete(`/challan/delete-challan/${challanId}`);
    console.log('Deleted Challan:', response.data);
    return response.data;
  } catch (error) {
    console.error('Delete challan error:', error);
    throw error;
  }
};

// ✅ Common Error Handler
const handleAxiosError = (error, defaultMessage) => {
  if (error.response) {
    // Server ne response diya with status code out of 2xx
    const msg = error.response.data?.message || defaultMessage;
    throw new Error(msg);
  } else if (error.request) {
    // Request gaya but response nahi mila
    throw new Error('No response from server. Please try again.');
  } else {
    // Something went wrong while setting up request
    throw new Error(error.message || defaultMessage);
  }
};
