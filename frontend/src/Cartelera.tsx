import { useState, useEffect } from "react";
import './cartelera.css';

// ─── TIPOS ────────────────────────────────────────────────
interface Video {
  id: string;
  title: string;
  author: string;
  thumbnail: string;
  publishedAt: string;
  hypeLevel: number;
}

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────
export default function Cartelera() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:3000/api/videos", {
        headers: { 'x-api-key': import.meta.env.VITE_API_KEY }
      })
      .then((res) => {
        if (!res.ok) throw new Error(`Error del servidor: ${res.status}`);
        return res.json();
      })
      .then((data: Video[]) => {
        // Ordenamos por Hype descendente para que la Joya quede siempre primera
        const sorted = [...data].sort((a, b) => b.hypeLevel - a.hypeLevel);
        setVideos(sorted);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // ── Estado: cargando ──────────────────────────────────────
  if (loading) {
    return (
      	<div className="centered">
     		<div className="spinner" />
      		<p className="loadingText">Cargando cartelera...</p>
    	</div>
    );
  }

  // ── Estado: error ─────────────────────────────────────────
  if (error) {
    return (
      	<div className="centered">
			<p className="errorIcon">⚠️</p>
			<p className="errorText">No se pudo cargar la cartelera</p>
			<p className="errorDetail">{error}</p>
    	</div>
    );
  }

  // El primero en el array (mayor Hype) es la Joya de la Corona
  const [jewel, ...rest] = videos;

  // ── Render principal ──────────────────────────────────────
  return (
	<div className="page">
		<div className="pageContainer">
		<header className="header">
			<h1 className="title">Cartelera de Conocimiento Tech</h1>
			<p className="subtitle">
			Una plataforma inteligente que analiza videos tecnológicos y destaca el contenido más relevante en tiempo real.
			</p>
		</header>

		{jewel && (
			<section className="jewelSection">
			<div className="crownBadge">VIDEO DESTACADO</div>
			<div className="jewelCard">
				<div className="jewelImgWrapper">
				<img
					src={jewel.thumbnail}
					alt={jewel.title}
					className="jewelImg"
				/>
				</div>
				<div className="jewelInfo">
				<h2 className="jewelTitle">{jewel.title}</h2>
				<p className="jewelAuthor">por {jewel.author}</p>
				<p className="jewelDate">{jewel.publishedAt}</p>
				</div>
			</div>
			</section>
		)}

		<section>
			<h3 className="gridTitle">Explora más contenido</h3>
			<div className="grid">
			{rest.map((video) => (
				<VideoCard key={video.id} video={video} />
			))}
			</div>
		</section>
		</div>
	</div>
);
}

function normalizeWord(word) {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

// ─── COMPONENTE: Tarjeta de video regular ─────────────────
function VideoCard({ video }: { video: Video }) {
  const isZeroHype = video.hypeLevel === 0;

  return (
    <div className="card">
      <div className="imgWrapper">
        <img src={video.thumbnail} alt={video.title} className="cardImg" />
        {isZeroHype && (
          <div className="noCommentsTag">💬 Sin comentarios</div>
        )}
      </div>

      <div className="cardBody">
        <h4 className="cardTitle">
		{video.title
			.split(" ")
			.map(word => word.toLowerCase() === "tutorial" ? normalizeWord(word) : word)
			.join(" ")}
		</h4>
        <p className="cardAuthor">{video.author}</p>

        <div className="cardFooter">
          <span className="cardDate">{video.publishedAt}</span>
        </div>
      </div>
    </div>
  );
}