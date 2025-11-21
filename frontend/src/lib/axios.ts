import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3002/api",
    timeout: 20000, // 20 seconds
    headers: {
        "Content-Type": "application/json",
    },
});

// Response Interceptor for global error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("API Error:", error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default api;
