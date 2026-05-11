import { useNavigate } from "react-router-dom";
import { Row, Col, Button, Spinner, Container } from "react-bootstrap";

export default function Catalogo({ obras = [], loading }) {
	const navigate = useNavigate();

	if (loading) {
		return <Spinner animation="border" className="spinner-custom" />;
	};

	return (
		<Container as="section" className="catalogo-section">
			<h2 className="catalogo-titulo mb-5">
				Catálogo<span>.</span>
			</h2>
			<Row className="g-4">
				{obras.length === 0 && (
					<Col xs={12} className="text-center py-5">
						<div style={{ fontFamily: 'Bebas Neue', fontSize: '2rem', color: 'rgba(240,235,227,0.2)' }}>
							Sin resultados
						</div>
					</Col>
				)}
				{obras.map(obra => (
					<Col key={obra.id} xs={6} md={4} lg={3} xl={2}>
						<div className="card-custom">
							<span className="card-badge-custom">
								{obra.peli_video ? "Película" : "Serie"}
							</span>

							{obra.poster
								? <img className="card-img-custom" src={obra.poster} alt={obra.titulo} />
								: <div className="card-placeholder">{obra.titulo.charAt(0)}</div>
							}

							<div className="card-bottom">
								<div className="card-titulo">{obra.titulo}</div>
								<div className="card-genero">{obra.genero?.nombre}</div>
							</div>

							<div className="card-overlay">
								<div className="card-titulo">{obra.titulo}</div>
								<div className="card-genero">{obra.genero?.nombre}</div>
								<div className="card-director">{obra.director?.nombre}</div>
								<Button
									className="btn-ver"
									onClick={() => navigate(`/obra/${obra.id}`)}
								>
									Ver ahora
								</Button>
							</div>
						</div>
					</Col>
				))}
			</Row>
		</Container>
	);
};
