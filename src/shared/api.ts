import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

// Request Interceptor: Attach JWT
api.interceptors.request.use(
    (config) => {
        let token = localStorage.getItem('tarix_token') || sessionStorage.getItem('tarix_token');
        if (token && token !== 'undefined' && token !== 'null') {
            // Strip errant quotes just in case it was JSON.stringified
            token = token.replace(/['"]+/g, '');
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Global Error Boundary
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('tarix_token');
            sessionStorage.removeItem('tarix_token');
            // Hard redirect to login for security compliance
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
