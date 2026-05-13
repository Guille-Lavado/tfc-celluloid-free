import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import api from "../api/axios";

export default function BotonFavorito({ obraId, user, onLoginClick }) {
    const [esFavorito, setEsFavorito] = useState(false);

    useEffect(() => {
        // Si no hay usuario no hacemos ninguna petición
        if (!user) return;

        const fetchFavoritos = async () => {
            try {
                const res = await api.get("/api/favoritos/obras");

                // Comprueba si la obra actual está en la lista de favoritos
                const estaEnFavoritos = res.data.some((obra) => obra.id === obraId);

                setEsFavorito(estaEnFavoritos);
            } catch (err) {
                console.error("Error al cargar favoritos:", err);
            }
        };

        fetchFavoritos();
    }, [obraId, user]);

    const handleToggle = async () => {
        // Si no está autenticado redirige al login
        if (!user) {
            onLoginClick();
            return;
        }

        try {
            const res = await api.post(`/api/favoritos/obras/${obraId}`);

            setEsFavorito(res.data.favorito);
        } catch (err) {
            console.error("Error al actualizar favorito:", err);
        }
    };

    return (
        <Button
            className={`btn-favorito ${esFavorito ? "activo" : ""}`}
            onClick={handleToggle}
        >
            <span className="btn-favorito__icono">
                {esFavorito ? "♥" : "♡"}
            </span>
            <span>
                {esFavorito ? "En favoritos" : "Añadir a favoritos"}
            </span>
        </Button>
    );
}
