import { useState } from "react";
import { Modal, Form, Button, Alert, Spinner } from "react-bootstrap";
import api from "../api/axios";

export default function LoginModal({ show, onLogin, onSwitchToRegister }) {
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await api.get("/sanctum/csrf-cookie");
            console.log("✅ CSRF cookie obtenida");

            const res = await api.post("/api/login", form);
            console.log("✅ Login correcto");

            const { access_token, user } = res.data;
            console.log("✅ Usuario:", user);

            // Guarda el token en axios para todas las peticiones siguientes
            api.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

            // Guarda el token en localStorage
            localStorage.setItem("token", access_token);

            onLogin(user);
        } catch (err) {
            setError("Email o contraseña incorrectos.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} centered className="login-modal">
            <Modal.Header closeButton>
                <Modal.Title>Iniciar sesión</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="usuario@celluloid.com"
                            disabled={loading}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Contraseña</Form.Label>
                        <Form.Control
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            disabled={loading}
                        />
                    </Form.Group>

                    {onSwitchToRegister && (
                        <div className="login-modal__switch">
                            ¿No tienes cuenta?{" "}
                            <Button 
                                variant="link" 
                                onClick={onSwitchToRegister}
                                disabled={loading}
                                className="p-0"
                            >
                                Regístrate
                            </Button>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? (
                            <>
                                <Spinner size="sm" animation="border" className="me-2" />
                                Entrando...
                            </>
                        ) : (
                            "Entrar"
                        )}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};
