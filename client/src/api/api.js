import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/v1';

// Common axios instance (optional but recommended)
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // cookies send honge (agar jarurat ho)
});

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
  console.log("Using token:", token);
  return {
    Authorization: `Bearer ${token}`,
  };
};

// ✅ Get All Challans
export const getAllChallans = async () => {
  try {
    const response = await axiosInstance.get('/challan/get-challans', {
      headers: getAuthHeaders(),
      withCredentials: true, // cookies send honge
    });

    console.log('Fetched Challans:', response.data);
    return response.data;
  } catch (error) {
    handleAxiosError(error, 'Failed to fetch challans');
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

export const newCostomer = async (customerData) => {
  try {
    const response = await axiosInstance.post('/coustmer/new-coustmer', customerData, {
      headers: getAuthHeaders(),

      withCredentials: true, // cookies send honge
    });
    console.log('New Customer Created:', response.data);
    return response.data;
  } catch (error) {
    handleAxiosError(error, 'Failed to create new customer');
  }
};

export const getAllCustomers = async () => {
  try {
    const response = await axiosInstance.get('/coustmer/get-coustmers', {
      headers: getAuthHeaders(),
      withCredentials: true, // cookies send honge
    });

    console.log('Fetched Customers:', response.data);
    return response.data;
  } catch (error) {
    handleAxiosError(error, 'Failed to fetch customers');
}
}

export const editCustomer = async (customerId, customerData) => {
  try {
    const response = await axiosInstance.put(`/coustmer/edit-coustmer/${customerId}`, customerData, {
      headers: getAuthHeaders(),
      withCredentials: true, // cookies send honge
    });
    console.log('Customer Edited:', response.data);
    return response.data;
  } catch (error) {
    handleAxiosError(error, 'Failed to edit customer');
  }
};

export const deleteChallan = async (challanId) => {
  try {
    const response = await axiosInstance.delete(`/challan/delete-challan/${challanId}`, {
      headers: getAuthHeaders(),
      withCredentials: true, // cookies send honge
    });

    console.log('Deleted Challan:', response.data);
    return response.data;
  } catch (error) {
    handleAxiosError(error, 'Failed to delete challan');
  }
};

export const deleteCustomer = async (customerId) => {
  try {
    const response = await axiosInstance.delete(`/coustmer/delete-coustmer/${customerId
}`, {
      headers: getAuthHeaders(),
      withCredentials: true, // cookies send honge
    });
    console.log('Deleted Customer:', response.data);
    return response.data;
  } catch (error) {
    handleAxiosError(error, 'Failed to delete customer');
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
