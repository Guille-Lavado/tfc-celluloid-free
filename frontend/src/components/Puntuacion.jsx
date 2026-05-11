import { useState, useEffect } from "react";
import { Row, Col, Spinner } from "react-bootstrap";
import api from "../api/axios";

export default function Puntuacion({ videoId, user }) {
    const [media, setMedia] = useState(0);
    const [totalVotos, setTotalVotos] = useState(0);
    const [miPuntuacion, setMiPuntuacion] = useState(null);
    const [hoverEstrella, setHoverEstrella] = useState(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const fetchPuntuacion = async () => {
            try {
                const res = await api.get(`/api/puntuaciones/${videoId}`);

                setMedia(res.data.media ?? 0);
                setTotalVotos(res.data.total_votos ?? 0);
                setMiPuntuacion(res.data.mi_puntuacion ?? null);
            } catch (err) {
                console.error("Error al cargar puntuación:", err);
            } finally {
                setCargando(false);
            }
        };

        fetchPuntuacion();
    }, [videoId]);

    const handlePuntuacion = async (valor) => {
        try {
            const res = await api.post(`/api/puntuaciones/${videoId}`, { valor });

            setMedia(res.data.media);
            setTotalVotos(res.data.total_votos);
            setMiPuntuacion(valor);
        } catch (err) {
            console.error("Error al puntuar:", err);
        }
    };

    const handleEliminar = async () => {
        try {
            const res = await api.delete(`/api/puntuaciones/${videoId}`);

            setMedia(res.data.media);
            setTotalVotos(res.data.total_votos);
            setMiPuntuacion(null);
        } catch (err) {
            console.error("Error al eliminar puntuación:", err);
        }
    };

    if (cargando) {
        return (
            <div className="puntuacion-section d-flex justify-content-center py-4">
                <Spinner animation="border" size="sm" style={{ color: "#c00" }} />
            </div>
        );
    }

    return (
        <div className="puntuacion-section">
            <h2>Puntuación<em>.</em></h2>
            <Row className="align-items-center g-4">

                {/* Media global */}
                <Col xs="auto">
                    <div className="puntuacion-media">
                        <div className="puntuacion-num">
                            {media > 0 ? media : "—"}
                            <span>/5</span>
                        </div>
                        <div className="puntuacion-votos">{totalVotos} votos</div>
                    </div>
                </Col>

                {/* Estrellas interactivas */}
                <Col>
                    <div className="estrellas">
                        {[1, 2, 3, 4, 5].map((n) => (
                            <span
                                key={n}
                                className={[
                                    "estrella",
                                    n <= (hoverEstrella ?? miPuntuacion ?? 0) ? "activa" : "",
                                    hoverEstrella && n <= hoverEstrella ? "hover-activa" : "",
                                ].join(" ").trim()}
                                onClick={() => handlePuntuacion(n)}
                                onMouseEnter={() => setHoverEstrella(n)}
                                onMouseLeave={() => setHoverEstrella(null)}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                    <p className="puntuacion-msg">
                        {miPuntuacion ? (
                            <>
                                Tu puntuación: {miPuntuacion}/5 —{" "}
                                <button
                                    style={{ background: "none", border: "none", color: "#c00", cursor: "pointer", fontSize: "0.75rem", padding: 0 }}
                                    onClick={handleEliminar}
                                >
                                    Quitar
                                </button>
                            </>
                        ) : (
                            "Haz clic en una estrella para puntuar"
                        )}
                    </p>
                </Col>
            </Row>
        </div>
    );
};
