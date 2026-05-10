import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AdminObras, AdminUsuarios, AdminDirectores, AdminGeneros, HomePage, ObraDetallePage } from "./pages/index";
import LoginModal from "./components/LoginModal";
import AdminLayout from "./components/AdminLayout";
import api from "./api/axios";
import "./styles/index.scss";

function App() {
    const [user, setUser] = useState(null);
    const [showLogin, setShowLogin] = useState(false);

    // Al arrancar comprueba si ya hay sesión activa en la cookie
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await api.get("/api/user");
                setUser(res.data);
            } catch {
                // 401, si no hay sesión mostramos el login
                setShowLogin(true);
            }
        }

        checkAuth();
    }, []);

    useEffect(() => {
        const handleExpired = () => {
            setUser(null);
            setShowLogin(true);
        };

        // Escuchar evento global y eliminar usuario
        window.addEventListener("session-expired", handleExpired);
        return () => window.removeEventListener("session-expired", handleExpired);
    }, []);

    const handleLogin = (userData) => {
        setUser(userData);
        setShowLogin(false);
    };

    const handleLogout = async () => {
        try {
            // borra el token en Laravel
            await api.post("/api/logout");
        } finally {
            // borra el token en el navegador
            localStorage.removeItem("token");
            setUser(null);
            setShowLogin(true);
        };
    };

    // Modal, no se puede cerrar sin loguearse
    if (!user) {
        return (
            <LoginModal
                show={showLogin}
                onLogin={handleLogin}
            />
        );
    }

    // Panel de admin
    return (
        <BrowserRouter>
            <Routes>
                {/* Páginas públicas */}
                <Route path="/" element={<HomePage user={user} onLoginClick={() => setShowLogin(true)} />} />
                <Route path="/obra/:id" element={<ObraDetallePage user={user} onLoginClick={() => setShowLogin(true)} />} />

                {/* Panel admin */}
                <Route path="/admin" element={
                    user && user.rol === "administrador"
                        ? <AdminLayout user={user} onLogout={handleLogout} />
                        : <Navigate to="/" replace />
                }>
                    <Route path="obras"    element={<AdminObras />} />
                    <Route path="usuarios" element={<AdminUsuarios />} />
                    <Route path="generos"    element={<AdminGeneros />} />
                    <Route path="directores" element={<AdminDirectores />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;