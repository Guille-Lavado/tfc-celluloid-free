import { Container } from "react-bootstrap";

export default function Footer() {
    return (
        <>
            <div className="divider" />
            <footer className="footer-custom">
                <Container fluid className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
                    <span>© 2025 Celluloid Free</span>
                    <span>El cine es libre.</span>
                </Container>
            </footer>
        </>
    );
};
