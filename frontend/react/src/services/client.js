import axios from 'axios';

// Helper to attach JWT token from localStorage
const getAuthConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  },
});

// Base API URL from environment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// --- Customer APIs ---

export const getCustomers = async () => {
  try {
    return await axios.get(`${API_BASE_URL}/api/v1/customers`, getAuthConfig());
  } catch (e) {
    throw e;
  }
};

export const saveCustomer = async (customer) => {
  try {
    return await axios.post(`${API_BASE_URL}/api/v1/customers`, customer, getAuthConfig());
  } catch (e) {
    throw e;
  }
};

export const updateCustomer = async (id, update) => {
  try {
    return await axios.put(`${API_BASE_URL}/api/v1/customers/${id}`, update, getAuthConfig());
  } catch (e) {
    throw e;
  }
};

export const deleteCustomer = async (id) => {
  try {
    return await axios.delete(`${API_BASE_URL}/api/v1/customers/${id}`, getAuthConfig());
  } catch (e) {
    throw e;
  }
};

// --- Authentication ---

export const login = async (credentials) => {
  try {
    return await axios.post(`${API_BASE_URL}/api/v1/auth/login`, credentials);
  } catch (e) {
    throw e;
  }
};

// --- Customer Profile Image ---

export const uploadCustomerProfilePicture = async (id, formData) => {
  try {
    return await axios.post(
      `${API_BASE_URL}/api/v1/customers/${id}/profile-image`,
      formData,
      {
        ...getAuthConfig(),
        headers: {
          ...getAuthConfig().headers,
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  } catch (e) {
    throw e;
  }
};

export const customerProfilePictureUrl = (id) =>
  `${API_BASE_URL}/api/v1/customers/${id}/profile-image`;
