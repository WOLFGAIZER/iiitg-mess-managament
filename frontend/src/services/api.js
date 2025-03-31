import axios from "axios";

const API_URL = "http://localhost:5000/api"; // Change this if needed

export const login = async (userData) => {
  const response = await axios.post('/auth/login', userData);
  return response;
};

export const register = async (userData) => {
  return await axios.post(`${API_URL}/register`, userData);
};

export const verifyOTP = async (data) => {
  const response = await axios.post('/verify-otp', data);
  return response.data;
};

export const resendOTP = async (data) => {
  const response = await axios.post('/auth/resend-otp', data);
  return response;
};

export const sendLoginOTP = async (data) => {
  const response = await axios.post('/auth/send-login-otp', data);
  return response;
};

export const verifyLoginOTP = async (data) => {
  const response = await axios.post('/auth/verify-login-otp', data);
  return response;
};

export const resendLoginOTP = async (data) => {
  const response = await axios.post('/auth/resend-login-otp', data);
  return response;
};

export default axios;
