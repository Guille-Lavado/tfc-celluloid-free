import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Badge, Stack, Spinner } from "react-bootstrap";
import NavbarPublic from "../components/NavbarPublic";
import Footer from "../components/Footer";
import Puntuacion from "../components/Puntuacion";
import Comentarios from "../components/Comentarios";
import BotonFavorito from "../components/BotonFavorito";
import api from "../api/axios";

export default function ObraDetalleBase({ user, onLoginClick, children }) {
    const { id } = useParams();
    const navigate = useNavigate();

    const [obra, setObra] = useState(null);
    const [loading, setLoading] = useState(true);
    const [videoActivo, setVideoActivo] = useState(null);

    useEffect(() => {
        const fetchObra = async () => {
            try {
                const res = await api.get(`/api/obras/${id}`);

                setObra(res.data);

                // Determina el primer vídeo a reproducir
                if (res.data.peli_video?.videometraje) {
                    setVideoActivo(res.data.peli_video.videometraje);
                } else if (res.data.capitulos_video?.length > 0) {
                    setVideoActivo(res.data.capitulos_video[0].videometraje);
                }
            } catch (err) {
                console.error("Error al cargar obra:", err);
                navigate("/");
            } finally {
                setLoading(false);
            }
        };

        fetchObra();
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="detalle-spinner">
                <Spinner animation="border" style={{ color: "#c00" }} />
            </div>
        );
    }

    const esPelicula = obra.peli_video !== null;
    const capitulos  = obra.capitulos_video ?? [];

    return (
        <div className="detalle">
            <NavbarPublic user={user} onLoginClick={onLoginClick} />

            {/* HERO BACKDROP */}
            <div className="detalle-backdrop">
                {obra.poster
                    ? <img className="detalle-backdrop-img" src={obra.poster} alt={obra.titulo} />
                    : <div className="detalle-backdrop-placeholder" />
                }

                <div className="detalle-hero-content">

                    {/* Póster */}
                    <div className="detalle-poster">
                        {obra.poster
                            ? <img src={obra.poster} alt={obra.titulo} />
                            : <div className="detalle-poster-placeholder">{obra.titulo.charAt(0)}</div>
                        }
                    </div>

                    {/* Info principal */}
                    <div className="detalle-info">
                        <Stack direction="horizontal" gap={2} className="detalle-badges flex-wrap">
                            <Badge className="badge">
                                {esPelicula ? "Película" : "Serie"}
                            </Badge>
                            {obra.genero && (
                                <Badge className="badge">{obra.genero.nombre}</Badge>
                            )}
                        </Stack>
                        <h1 className="detalle-titulo">{obra.titulo}</h1>
                        {obra.director && (
                            <div className="detalle-director-link">
                                Dirigida por <span>{obra.director.nombre}</span>
                            </div>
                        )}
                        {obra.sinopsis && (
                            <p className="detalle-sinopsis">{obra.sinopsis}</p>
                        )}
                        <BotonFavorito
                            obraId={obra.id}
                            user={user}
                            onLoginClick={onLoginClick}
                        />
                    </div>
                </div>
            </div>

            {/* CUERPO */}
            <Container fluid="xl" className="detalle-body">
                <button className="btn-volver" onClick={() => navigate(-1)}>
                    ← Volver
                </button>

                {/* VIDEOPLAYER */}
                {videoActivo && (
                    <div className="player-wrap">
                        <h2 className="player-titulo">
                            {esPelicula ? "Película" : "Episodio"}<span>.</span>
                        </h2>
                        <div className="player-box">
                            <video
                                key={videoActivo.url_video}
                                controls
                                autoPlay={false}
                                preload="metadata"
                            >
                                <source src={videoActivo.url_video} type="video/mp4" />
                                Tu navegador no soporta la reproducción de vídeo.
                            </video>
                        </div>

                        {/* Episodios para series */}
                        {!esPelicula && capitulos.length > 0 && (
                            <Stack gap={2} className="episodios mt-3">
                                {capitulos.map((cap) => (
                                    <button
                                        key={cap.id_video}
                                        className={`episodio-btn ${videoActivo.id === cap.videometraje?.id ? "activo" : ""}`}
                                        onClick={() => setVideoActivo(cap.videometraje)}
                                    >
                                        <span>{cap.videometraje?.nombre ?? `S${cap.temporada}E${cap.episodio}`}</span>
                                        <span className="episodio-num">S{cap.temporada} E{cap.episodio}</span>
                                    </button>
                                ))}
                            </Stack>
                        )}
                    </div>
                )}

                {/* DIRECTOR */}
                {obra.director && (
                    <Stack direction="horizontal" gap={4} className="director-section flex-wrap">
                        <div className="director-foto">
                            {obra.director.img
                                ? <img src={obra.director.img} alt={obra.director.nombre} />
                                : <div className="director-foto-placeholder">{obra.director.nombre.charAt(0)}</div>
                            }
                        </div>
                        <div>
                            <p className="director-label">Director</p>
                            <p className="director-nombre">{obra.director.nombre}</p>
                            {obra.director.biografia && (
                                <p className="director-bio">{obra.director.biografia}</p>
                            )}
                        </div>
                    </Stack>
                )}

                <Puntuacion videoId={videoActivo.id} user={user} />
                <Comentarios videoId={videoActivo.id} user={user} />
            </Container>

            <Footer />
        </div>
    );
};
