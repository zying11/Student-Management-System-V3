import axios from "axios";

const axiosClient = axios.create({
    // baseURL: "http://127.0.0.1:8000/api",
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
});

// axiosClient.interceptors.request.use((config) => {
//     const token = localStorage.getItem("ACCESS_TOKEN");
//     config.headers.Authorization = `Bearer ${token}`;
//     return config;
// });
axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("ACCESS_TOKEN");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axiosClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        try {
            const { response } = error;
            if (response.status === 401) {
                localStorage.removeItem("ACCESS_TOKEN");
            }
        } catch (err) {
            console.error(err);
        }
        throw error;
    }
);

export default axiosClient;
