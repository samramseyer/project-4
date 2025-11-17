import axios from 'axios';

const API_URL = '/api';

// Set up axios interceptor to add token to requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API calls
export const register = async (userData) => {
  const response = await axios.post(`${API_URL}/auth/register`, userData);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
};

export const login = async (credentials) => {
  const response = await axios.post(`${API_URL}/auth/login`, credentials);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// Category API calls
export const getCategories = async () => {
  const response = await axios.get(`${API_URL}/categories`);
  return response.data;
};

export const getCategory = async (id) => {
  const response = await axios.get(`${API_URL}/categories/${id}`);
  return response.data;
};

// Question API calls
export const getQuestions = async (params = {}) => {
  const response = await axios.get(`${API_URL}/questions`, { params });
  return response.data;
};

export const getQuestion = async (id) => {
  const response = await axios.get(`${API_URL}/questions/${id}`);
  return response.data;
};

export const createQuestion = async (questionData) => {
  const response = await axios.post(`${API_URL}/questions`, questionData);
  return response.data;
};

export const updateQuestion = async (id, questionData) => {
  const response = await axios.put(`${API_URL}/questions/${id}`, questionData);
  return response.data;
};

export const deleteQuestion = async (id) => {
  const response = await axios.delete(`${API_URL}/questions/${id}`);
  return response.data;
};

export const voteQuestion = async (id, vote) => {
  const response = await axios.post(`${API_URL}/questions/${id}/vote`, { vote });
  return response.data;
};

// Answer API calls
export const getAnswers = async (questionId) => {
  const response = await axios.get(`${API_URL}/questions/${questionId}/answers`);
  return response.data;
};

export const createAnswer = async (questionId, answerData) => {
  const response = await axios.post(`${API_URL}/questions/${questionId}/answers`, answerData);
  return response.data;
};

export const updateAnswer = async (id, answerData) => {
  const response = await axios.put(`${API_URL}/answers/${id}`, answerData);
  return response.data;
};

export const deleteAnswer = async (id) => {
  const response = await axios.delete(`${API_URL}/answers/${id}`);
  return response.data;
};

export const voteAnswer = async (id, vote) => {
  const response = await axios.post(`${API_URL}/answers/${id}/vote`, { vote });
  return response.data;
};

export const acceptAnswer = async (id) => {
  const response = await axios.post(`${API_URL}/answers/${id}/accept`);
  return response.data;
};

// User API calls (keep for backward compatibility)
export const getUsers = async () => {
  const response = await axios.get(`${API_URL}/users`);
  return response.data;
};

export const getUser = async (id) => {
  const response = await axios.get(`${API_URL}/users/${id}`);
  return response.data;
};

export const createUser = async (userData) => {
  const response = await axios.post(`${API_URL}/users`, userData);
  return response.data;
};

export const updateUser = async (id, userData) => {
  const response = await axios.put(`${API_URL}/users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await axios.delete(`${API_URL}/users/${id}`);
  return response.data;
};

// Item API calls (keep for backward compatibility)
export const getItems = async () => {
  const response = await axios.get(`${API_URL}/items`);
  return response.data;
};

export const getItem = async (id) => {
  const response = await axios.get(`${API_URL}/items/${id}`);
  return response.data;
};

export const createItem = async (itemData) => {
  const response = await axios.post(`${API_URL}/items`, itemData);
  return response.data;
};

export const updateItem = async (id, itemData) => {
  const response = await axios.put(`${API_URL}/items/${id}`, itemData);
  return response.data;
};

export const deleteItem = async (id) => {
  const response = await axios.delete(`${API_URL}/items/${id}`);
  return response.data;
};
