import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000",
    withCredentials: true,
    withXSRFToken: true,
    headers: {
        "Accept": "application/json",
    }
});

// Interceptor de respuesta — Añadir Token
// Esta función se ejecuta antes de cada petición HTTP
api.interceptors.request.use(config => {
    // Coger token del local storage
    const token = localStorage.getItem("token");
    if (token) {
        // Añadir token a los headers
        config.headers.Authorization = `Bearer ${token}`;
    };
    return config;
});

// Interceptor de respuesta — detecta el 401
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            // Eliminar token del local storage
            localStorage.removeItem("token");
            // Lanza un evento global para que App.jsx lo escuche
            window.dispatchEvent(new Event("session-expired"));
        }
        return Promise.reject(error);
    }
);

export default api;