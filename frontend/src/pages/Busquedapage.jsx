import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Container, Row, Col, Form, Button, Spinner } from "react-bootstrap";
import NavbarPublic from "../components/NavbarPublic";
import CatalogoGrid from "../components/Catalogo";
import Footer from "../components/Footer";
import api from "../api/axios";

export default function BusquedaPage({ user, onLoginClick }) {
    const [searchParams, setSearchParams] = useSearchParams();

    // Estados de datos
    const [obras, setObras] = useState([]);
    const [generos, setGeneros] = useState([]);
    const [loading, setLoading] = useState(false);
    const [buscado, setBuscado] = useState(false);

    // Estados de datos
    const [filtros, setFiltros] = useState({
        nombre: searchParams.get("nombre") ?? "",
        genero: searchParams.get("genero") ?? "",
        director: searchParams.get("director") ?? "",
    });

    // Cargar géneros para el selector
    useEffect(() => {
        api.get("/api/generos").then(res => setGeneros(res.data));
    }, []);

    // Ejecutar búsqueda inicial si hay parámetros en la URL
    useEffect(() => {
        if (filtros.nombre || filtros.genero || filtros.director) {
            ejecutarBusqueda(filtros);
        }
    }, [filtros]);

    const handleChange = (e) => {
        setFiltros({ ...filtros, [e.target.name]: e.target.value });
    };

    const ejecutarBusqueda = async (paramsBusqueda) => {
        setLoading(true);
        setBuscado(true);

        // Limpiar parámetros vacíos para la URL
        const params = {};
        if (paramsBusqueda.nombre) params.nombre = paramsBusqueda.nombre;
        if (paramsBusqueda.genero) params.genero = paramsBusqueda.genero;
        if (paramsBusqueda.director) params.director = paramsBusqueda.director;
        
        setSearchParams(params);

        try {
            // El backend recibe 'nombre', 'genero' y 'director' y filtra la base de datos
            const res = await api.get("/api/obras", { params });
            setObras(res.data);
        } catch (error) {
            console.error("Error al buscar obras:", error);
            setObras([]);
        } finally {
            setLoading(false);
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        ejecutarBusqueda(filtros);
    };

    const limpiar = () => {
        setFiltros({ nombre: "", genero: "", director: "" });
        setSearchParams({});
        setObras([]);
        setBuscado(false);
    };

    return (
        <div className="busqueda">
            <NavbarPublic user={user} onLoginClick={onLoginClick} />

            <Container className="busqueda-header">
                <p className="busqueda-eyebrow">Catálogo completo</p>
                <h1 className="busqueda-titulo">Buscar<span>.</span></h1>
            </Container>

            <Container className="busqueda-form-wrap">
                <Form onSubmit={handleFormSubmit}>
                    <Row className="align-items-end g-3">
                        <Col lg={4} md={6}>
                            <Form.Group className="busqueda-field">
                                <Form.Label>Título</Form.Label>
                                <Form.Control
                                    name="nombre"
                                    value={filtros.nombre}
                                    onChange={handleChange}
                                    placeholder="Ej: Inception..."
                                />
                            </Form.Group>
                        </Col>
                        <Col lg={3} md={6}>
                            <Form.Group className="busqueda-field">
                                <Form.Label>Género</Form.Label>
                                <Form.Select name="genero" value={filtros.genero} onChange={handleChange}>
                                    <option value="">Todos los géneros</option>
                                    {generos.map(g => (
                                        <option key={g.id} value={g.nombre}>{g.nombre}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col lg={3} md={6}>
                            <Form.Group className="busqueda-field">
                                <Form.Label>Director</Form.Label>
                                <Form.Control
                                    name="director"
                                    value={filtros.director}
                                    onChange={handleChange}
                                    placeholder="Ej: Nolan..."
                                />
                            </Form.Group>
                        </Col>
                        <Col lg="auto" md={6} className="d-grid gap-2 d-md-flex mt-3 mt-lg-0">
                            <Button type="submit" className="btn-buscar">Buscar</Button>
                            <Button variant="outline-light" className="btn-limpiar" onClick={limpiar}>Limpiar</Button>
                        </Col>
                    </Row>
                </Form>
            </Container>

            <div className="busqueda-divisor" />

            <Container className="busqueda-resultados">
                {loading && (
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="danger" />
                    </div>
                )}

                {!loading && buscado && (
                    <p className="resultados-count">
                        <span>{obras.length}</span> resultado{obras.length !== 1 ? "s" : ""}
                    </p>
                )}

                {!loading && buscado && obras.length === 0 && (
                    <div className="busqueda-estado">
                        Sin resultados
                        <p>Prueba con otros filtros</p>
                    </div>
                )}

                {!loading && !buscado && (
                    <div className="busqueda-estado">
                        ¿Qué quieres ver hoy?
                        <p>Usa los filtros para encontrar tu película</p>
                    </div>
                )}

                {!loading && obras.length > 0 && (
                    <CatalogoGrid obras={obras} loading={false} />
                )}
            </Container>

            <Footer />
        </div>
    );
}
