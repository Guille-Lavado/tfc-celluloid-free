import { useNavigate } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import "../styles/Navbar.css";

export default function NavbarPublic({ user, onLoginClick }) {
    const navigate = useNavigate();

    return (
        <Navbar className="nav-custom">
            <Container fluid className="px-0 d-flex justify-content-between align-items-center">
                <Navbar.Brand href="/" className="nav-logo m-0">
                    Celluloid<em>.</em>Free
                </Navbar.Brand>
                <div className="d-flex" style={{ gap: "10px" }}>
                    <Nav>
                        <span className="nav-btn" onClick={() => navigate("/buscar")}>
                            Buscar
                        </span>
                    </Nav>
                    {user?.rol === "administrador" && (
                        <Nav>
                            <span className="nav-btn" onClick={() => navigate("/admin/obras")}>
                                Admin
                            </span>
                        </Nav>
                    )}
                    {!user && (
                        <Nav>
                            <span className="nav-btn" onClick={onLoginClick}>
                                Iniciar sesión
                            </span>
                        </Nav>
                    )}
                </div>
            </Container>
        </Navbar>
    );
};
