import axios from "axios";

const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    withCredentials: true // Enable credentials to send/receive cookies
});

// Add a request interceptor
instance.interceptors.request.use(function (config) {
    // No need to manually add token as it will be sent automatically with cookies
    return config;
}, function (error) {
    return Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    if (response && response.data) {
        return response.data;
    }
    return response;
}, async function (error) {
    const originalRequest = error.config;

    // Handle token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
            // Call refresh token API with credentials
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
                {},
                { withCredentials: true }
            );

            if (response.status === 200) {
                // Retry original request
                return instance(originalRequest);
            }
        } catch (refreshError) {
            // Just reject the error, let ProtectedRoute handle the redirect
            return Promise.reject(refreshError);
        }
    }

    // Handle other errors
    if (error.response?.data) {
        return Promise.reject(error.response.data);
    }
    return Promise.reject(error);
});

export default instance;