import { useState } from "react";
import { Modal, Form, Button, Alert, Spinner } from "react-bootstrap";
import api from "../api/axios";

export default function RegisterModal({ show, onRegister, onSwitchToLogin }) {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: ""
    });
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        
        // Limpiar error del campo cuando el usuario empieza a escribir
        if (errors[name]) {
            setErrors({ ...errors, [name]: null });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Validar nombre
        if (!form.name.trim()) {
            newErrors.name = "El nombre es obligatorio";
        } else if (form.name.trim().length < 3) {
            newErrors.name = "El nombre debe tener al menos 3 caracteres";
        }

        // Validar email
        if (!form.email.trim()) {
            newErrors.email = "El email es obligatorio";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            newErrors.email = "El formato del email no es válido";
        }

        // Validar contraseña
        if (!form.password) {
            newErrors.password = "La contraseña es obligatoria";
        } else if (form.password.length < 6) {
            newErrors.password = "La contraseña debe tener al menos 6 caracteres";
        }

        // Validar confirmación de contraseña
        if (!form.password_confirmation) {
            newErrors.password_confirmation = "Debes confirmar la contraseña";
        } else if (form.password !== form.password_confirmation) {
            newErrors.password_confirmation = "Las contraseñas no coinciden";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validar formulario
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setServerError(null);

        try {
            // Obtener CSRF cookie
            await api.get("/sanctum/csrf-cookie");
            console.log("✅ CSRF cookie obtenida");

            // Registrar usuario
            const res = await api.post("/api/register", {
                name: form.name.trim(),
                email: form.email.trim(),
                password: form.password,
                password_confirmation: form.password_confirmation,
                rol: "usuario"
            });
            console.log("✅ Registro correcto");

            const { access_token, user } = res.data;
            console.log("✅ Usuario registrado:", user);

            // Guardar token en axios para todas las peticiones siguientes
            api.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

            // Guardar token en localStorage
            localStorage.setItem("token", access_token);

            // Llamar al callback con el usuario registrado
            onRegister(user);
        } catch (err) {
            console.error("❌ Error en registro:", err);
            
            if (err.response?.data?.errors) {
                // Errores de validación del servidor
                const serverErrors = {};
                Object.keys(err.response.data.errors).forEach(key => {
                    serverErrors[key] = err.response.data.errors[key][0];
                });
                setErrors(serverErrors);
            } else if (err.response?.data?.message) {
                setServerError(err.response.data.message);
            } else {
                setServerError("Error al registrar. Por favor, inténtalo de nuevo.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} centered className="register-modal">
            <Modal.Header>
                <Modal.Title>Crear cuenta</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {serverError && <Alert variant="danger">{serverError}</Alert>}
                    
                    <Form.Group className="mb-3">
                        <Form.Label>Nombre de usuario</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Tu nombre"
                            isInvalid={!!errors.name}
                            disabled={loading}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.name}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="usuario@celluloid.com"
                            isInvalid={!!errors.email}
                            disabled={loading}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.email}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Contraseña</Form.Label>
                        <Form.Control
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            isInvalid={!!errors.password}
                            disabled={loading}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.password}
                        </Form.Control.Feedback>
                        <Form.Text className="text-muted">
                            Mínimo 6 caracteres
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Confirmar contraseña</Form.Label>
                        <Form.Control
                            type="password"
                            name="password_confirmation"
                            value={form.password_confirmation}
                            onChange={handleChange}
                            placeholder="••••••••"
                            isInvalid={!!errors.password_confirmation}
                            disabled={loading}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.password_confirmation}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <div className="register-modal__switch">
                        ¿Ya tienes cuenta?{" "}
                        <Button 
                            variant="link" 
                            onClick={onSwitchToLogin}
                            disabled={loading}
                            className="p-0"
                        >
                            Inicia sesión
                        </Button>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? (
                            <>
                                <Spinner size="sm" animation="border" className="me-2" />
                                Registrando...
                            </>
                        ) : (
                            "Crear cuenta"
                        )}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}