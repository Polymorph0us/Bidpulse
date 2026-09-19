import axios from 'axios';

const apiClient = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL || ''}/api`,
    headers: { 'Content-Type': 'application/json' },
    timeout: 25000,
});

// Request Interceptor: Attach the Access Token to every outgoing request
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) config.headers['Authorization'] = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Catch 401s on protected endpoints and silently refresh the token
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (!originalRequest) return Promise.reject(error);

        const url = originalRequest.url || '';
        const isAuthEndpoint = url.includes('/auth/token') || url.includes('/auth/login') || url.includes('/auth/refresh') || (url.includes('/users') && originalRequest.method === 'post');

        // Do not attempt refresh on auth endpoints (login, register, refresh)
        if (!isAuthEndpoint && (error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) throw new Error("No refresh token available");

                const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL || ''}/api/auth/refresh`, {
                    refreshToken: refreshToken
                });

                localStorage.setItem('accessToken', response.data.accessToken);
                if (response.data.refreshToken) {
                    localStorage.setItem('refreshToken', response.data.refreshToken);
                }

                originalRequest.headers['Authorization'] = `Bearer ${response.data.accessToken}`;
                return apiClient(originalRequest);

            } catch (refreshError) {
                console.error("Session expired. Logging out.", refreshError);
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                if (window.location.pathname !== '/login' && window.location.pathname !== '/' && window.location.pathname !== '/register') {
                    window.location.href = '/login';
                }
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;