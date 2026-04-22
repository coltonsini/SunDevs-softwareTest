import { useState, useEffect } from "react";
import 'cartelera.css';

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
    fetch("http://localhost:3000/api/videos")
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
      <div style={styles.centered}>
        <div style={styles.spinner} />
        <p style={styles.loadingText}>Cargando cartelera...</p>
      </div>
    );
  }

  // ── Estado: error ─────────────────────────────────────────
  if (error) {
    return (
      <div style={styles.centered}>
        <p style={styles.errorIcon}>⚠️</p>
        <p style={styles.errorText}>No se pudo cargar la cartelera</p>
        <p style={styles.errorDetail}>{error}</p>
      </div>
    );
  }

  // El primero en el array (mayor Hype) es la Joya de la Corona
  const [jewel, ...rest] = videos;

  // ── Render principal ──────────────────────────────────────
  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.title}>📺 Cartelera de Conocimiento</h1>
        <p style={styles.subtitle}>El colador está activo — solo lo bueno llega aquí</p>
      </header>

      {/* ── JOYA DE LA CORONA ─────────────────────────────── */}
      {jewel && (
        <section style={styles.jewelSection}>
          <div style={styles.crownBadge}>👑 Joya de la Corona</div>
          <div style={styles.jewelCard}>
            <div style={styles.jewelImgWrapper}>
              <img
                src={jewel.thumbnail}
                alt={jewel.title}
                style={styles.jewelImg}
              />
              <div style={styles.hypeOverlay}>
                <span style={styles.hypeValue}>
                  🔥 {jewel.hypeLevel.toFixed(4)}
                </span>
                <span style={styles.hypeLabel}>Nivel de Hype</span>
              </div>
            </div>
            <div style={styles.jewelInfo}>
              <h2 style={styles.jewelTitle}>{jewel.title}</h2>
              <p style={styles.jewelAuthor}>por {jewel.author}</p>
              <p style={styles.jewelDate}>{jewel.publishedAt}</p>
              <div style={styles.jewelHypePill}>
                🏆 Hype #{jewel.hypeLevel.toFixed(4)}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── GRILLA DEL RESTO ──────────────────────────────── */}
      <section>
        <h3 style={styles.gridTitle}>Los demás mortales</h3>
        <div style={styles.grid}>
          {rest.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </section>
    </div>
  );
}

// ─── COMPONENTE: Tarjeta de video regular ─────────────────
function VideoCard({ video }: { video: Video }) {
  const isZeroHype = video.hypeLevel === 0;

  return (
    <div style={styles.card}>
      <div style={styles.imgWrapper}>
        <img src={video.thumbnail} alt={video.title} style={styles.cardImg} />
        {isZeroHype && (
          <div style={styles.noCommentsTag}>💬 Sin comentarios</div>
        )}
      </div>
      <div style={styles.cardBody}>
        <h4 style={styles.cardTitle}>{video.title}</h4>
        <p style={styles.cardAuthor}>{video.author}</p>
        <div style={styles.cardFooter}>
          <span style={styles.cardDate}>{video.publishedAt}</span>
          <span
            style={{
              ...styles.hypePill,
              background: isZeroHype ? "#374151" : "#1d2f3f",
              color: isZeroHype ? "#6b7280" : "#38bdf8",
            }}
          >
            🔥 {video.hypeLevel.toFixed(4)}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── ESTILOS (CSS-in-JS para mantenerlo en un solo archivo) ───
const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#0a0f1a",
    color: "#e2e8f0",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    padding: "32px 24px",
    maxWidth: "1100px",
    margin: "0 auto",
  },
  header: {
    textAlign: "center",
    marginBottom: "40px",
  },
  title: {
    fontSize: "2.2rem",
    fontWeight: 800,
    color: "#f1f5f9",
    margin: 0,
    letterSpacing: "-0.5px",
  },
  subtitle: {
    color: "#64748b",
    marginTop: "8px",
    fontSize: "0.95rem",
  },

  // ── Joya ──
  jewelSection: {
    marginBottom: "48px",
  },
  crownBadge: {
    display: "inline-block",
    background: "linear-gradient(135deg, #f59e0b, #d97706)",
    color: "#0a0f1a",
    fontWeight: 700,
    fontSize: "0.85rem",
    padding: "6px 16px",
    borderRadius: "20px",
    marginBottom: "12px",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
  },
  jewelCard: {
    display: "flex",
    gap: "24px",
    background: "linear-gradient(135deg, #0f172a, #1e2a3a)",
    border: "2px solid #f59e0b",
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "0 0 40px rgba(245, 158, 11, 0.25)",
    flexWrap: "wrap" as const,
  },
  jewelImgWrapper: {
    position: "relative" as const,
    flex: "0 0 auto",
    width: "100%",
    maxWidth: "360px",
  },
  jewelImg: {
    width: "100%",
    borderRadius: "10px",
    display: "block",
  },
  hypeOverlay: {
    position: "absolute" as const,
    bottom: "8px",
    right: "8px",
    background: "rgba(0,0,0,0.8)",
    borderRadius: "8px",
    padding: "6px 12px",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
  },
  hypeValue: {
    color: "#f59e0b",
    fontWeight: 700,
    fontSize: "1rem",
  },
  hypeLabel: {
    color: "#94a3b8",
    fontSize: "0.65rem",
    textTransform: "uppercase" as const,
    letterSpacing: "1px",
  },
  jewelInfo: {
    flex: 1,
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "center",
    gap: "8px",
    minWidth: "200px",
  },
  jewelTitle: {
    fontSize: "1.5rem",
    fontWeight: 700,
    color: "#f1f5f9",
    margin: 0,
    lineHeight: 1.3,
  },
  jewelAuthor: {
    color: "#94a3b8",
    margin: 0,
    fontSize: "1rem",
  },
  jewelDate: {
    color: "#64748b",
    margin: 0,
    fontSize: "0.875rem",
  },
  jewelHypePill: {
    display: "inline-block",
    background: "rgba(245, 158, 11, 0.15)",
    border: "1px solid #f59e0b",
    color: "#f59e0b",
    padding: "6px 14px",
    borderRadius: "20px",
    fontWeight: 700,
    fontSize: "0.9rem",
    marginTop: "8px",
    alignSelf: "flex-start",
  },

  // ── Grilla ──
  gridTitle: {
    color: "#475569",
    fontSize: "0.85rem",
    textTransform: "uppercase",
    letterSpacing: "2px",
    marginBottom: "16px",
    fontWeight: 600,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "20px",
  },
  card: {
    background: "#111827",
    borderRadius: "12px",
    overflow: "hidden",
    border: "1px solid #1e293b",
    transition: "border-color 0.2s",
  },
  imgWrapper: {
    position: "relative" as const,
  },
  cardImg: {
    width: "100%",
    display: "block",
    aspectRatio: "16/9",
    objectFit: "cover" as const,
  },
  noCommentsTag: {
    position: "absolute" as const,
    top: "8px",
    left: "8px",
    background: "rgba(0,0,0,0.75)",
    color: "#6b7280",
    fontSize: "0.7rem",
    padding: "3px 8px",
    borderRadius: "4px",
  },
  cardBody: {
    padding: "14px",
  },
  cardTitle: {
    color: "#e2e8f0",
    fontSize: "0.95rem",
    fontWeight: 600,
    margin: "0 0 6px 0",
    lineHeight: 1.4,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical" as const,
    overflow: "hidden",
  },
  cardAuthor: {
    color: "#64748b",
    fontSize: "0.8rem",
    margin: "0 0 10px 0",
  },
  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "8px",
  },
  cardDate: {
    color: "#475569",
    fontSize: "0.75rem",
  },
  hypePill: {
    padding: "3px 10px",
    borderRadius: "12px",
    fontSize: "0.75rem",
    fontWeight: 600,
    flexShrink: 0,
  },

  // ── Estados ──
  centered: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    background: "#0a0f1a",
    gap: "12px",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "3px solid #1e293b",
    borderTop: "3px solid #38bdf8",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  loadingText: {
    color: "#64748b",
    fontSize: "0.9rem",
  },
  errorIcon: {
    fontSize: "3rem",
    margin: 0,
  },
  errorText: {
    color: "#f87171",
    fontWeight: 600,
    fontSize: "1.1rem",
    margin: 0,
  },
  errorDetail: {
    color: "#64748b",
    fontSize: "0.85rem",
    margin: 0,
  },
};
