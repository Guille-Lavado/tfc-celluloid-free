import { useState, useEffect } from "react";
import { Form, Button, Spinner, Stack } from "react-bootstrap";
import api from "../api/axios";

export default function Comentarios({ videoId, user }) {
    const [comentarios, setComentarios]         = useState([]);
    const [nuevoComentario, setNuevoComentario] = useState("");
    const [enviando, setEnviando]               = useState(false);
    const [cargando, setCargando]               = useState(true);

    useEffect(() => {
        const fetchComentarios = async () => {
            try {
                const res = await api.get(`/api/videos/${videoId}/comentarios`);

                setComentarios(res.data);
            } catch (err) {
                console.error("Error al cargar comentarios:", err);
                setComentarios([]);
            } finally {
                setCargando(false);
            }
        };

        fetchComentarios();
    }, [videoId]);

    const handleEnviar = async (e) => {
        e.preventDefault();

        if (!nuevoComentario.trim()) { return; }

        setEnviando(true);

        try {
            const res = await api.post(`/api/videos/${videoId}/comentarios`, {
                contenido: nuevoComentario,
            });

            setComentarios([res.data, ...comentarios]);
            setNuevoComentario("");
        } catch (err) {
            console.error("Error al enviar comentario:", err);
        } finally {
            setEnviando(false);
        }
    };

    const handleBorrar = async (idComentario) => {
        try {
            await api.delete(`/api/comentarios/${idComentario}`);

            setComentarios(comentarios.filter((c) => c.id_comentario !== idComentario));
        } catch (err) {
            console.error("Error al borrar comentario:", err);
        }
    };

    const formatFecha = (fecha) => {
        return new Intl.DateTimeFormat('es-ES', {
            day: "numeric",
            month: "long",
            year: "numeric",
        }).format(new Date(fecha));
    };

    if (cargando) {
        return (
            <div className="comentarios-section d-flex justify-content-center py-4">
                <Spinner animation="border" size="sm" style={{ color: "#c00" }} />
            </div>
        );
    }

    return (
        <div className="comentarios-section">
            <h2>Comentarios<em>.</em></h2>

            {/* Formulario */}
            <Form onSubmit={handleEnviar}>
                <Stack direction="horizontal" gap={3} className="align-items-end mb-4">
                    <Form.Control
                        as="textarea"
                        rows={2}
                        className="comentario-input"
                        placeholder="Escribe un comentario..."
                        value={nuevoComentario}
                        onChange={(e) => setNuevoComentario(e.target.value)}
                        required
                    />
                    <Button
                        type="submit"
                        className="btn-comentar"
                        disabled={enviando}
                    >
                        {enviando ? <Spinner size="sm" animation="border" /> : "Comentar"}
                    </Button>
                </Stack>
            </Form>

            {/* Lista */}
            <div className="comentario-lista">
                {comentarios.length === 0 && (
                    <div className="comentarios-vacio">Sin comentarios aún</div>
                )}
                {comentarios.map((c) => (
                    <div key={c.id_comentario} className="comentario-item">
                        <div className="comentario-header">
                            <span className="comentario-autor">
                                {c.usuario?.name ?? "Usuario"}
                            </span>
                            <Stack direction="horizontal" gap={3}>
                                <span className="comentario-fecha">
                                    {formatFecha(c.fecha)}
                                </span>
                                {(user?.id === c.id_user || user?.rol === "administrador") && (
                                    <button
                                        className="btn-borrar-comentario"
                                        onClick={() => handleBorrar(c.id_comentario)}
                                    >
                                        Eliminar
                                    </button>
                                )}
                            </Stack>
                        </div>
                        <p className="comentario-texto">{c.contenido}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
