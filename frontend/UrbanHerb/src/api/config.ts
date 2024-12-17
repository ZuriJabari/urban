import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API base URL
export const API_URL = __DEV__ 
    ? 'http://localhost:8000/api/v1'  // Development
    : 'https://api.urbanherb.com/api/v1';  // Production

// Create axios instance
export const api = axios.create({
    baseURL: API_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle response
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Handle 401 (Unauthorized) - Token expired
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Get refresh token
                const refreshToken = await AsyncStorage.getItem('refreshToken');
                if (!refreshToken) {
                    throw new Error('No refresh token');
                }

                // Get new access token
                const response = await axios.post(`${API_URL}/auth/token/refresh/`, {
                    refresh: refreshToken,
                });

                // Save new tokens
                await AsyncStorage.setItem('token', response.data.access);
                await AsyncStorage.setItem('refreshToken', response.data.refresh);

                // Retry original request with new token
                originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
                return api(originalRequest);
            } catch (refreshError) {
                // Clear tokens and redirect to login
                await AsyncStorage.multiRemove(['token', 'refreshToken']);
                // TODO: Implement navigation to login
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
); 