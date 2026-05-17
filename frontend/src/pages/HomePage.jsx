import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import NavbarPublic from "../components/NavbarPublic";
import Catalogo from "../components/Catalogo";
import api from "../api/axios";

export default function HomePage({ user, onLoginClick }) {
  const [obras, setObras] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/obras")
      .then(res => setObras(res.data))
      .catch(err => console.error("Error cargando obras:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home">
      {/* NAV */}
      <NavbarPublic user={user} onLoginClick={onLoginClick} />

      {/* HERO */}
      <header className="hero">
        <p className="hero-eyebrow">Plataforma de cine libre</p>
        <h1 className="hero-title">
          El cine<span>es libre.</span>
        </h1>
        <p className="hero-subtitle">
          Descubre películas y series del catálogo. Sin suscripciones, sin límites.
        </p>
        <div className="hero-scroll">
          <span className="text-uppercase" style={{ fontSize: '0.65rem', letterSpacing: '0.3em', color: 'rgba(240,235,227,0.3)' }}>Explorar</span>
        </div>
      </header>

      {/* CATÁLOGO */}
      <Catalogo obras={obras} loading={loading} />

      <div className="divider" />

      {/* FOOTER */}
      <footer className="footer-custom">
        <Container fluid className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
          <span>© 2025 Celluloid Free</span>
          <span>El cine es libre.</span>
        </Container>
      </footer>
    </div>
  );
};
