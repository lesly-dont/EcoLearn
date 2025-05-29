"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";  
import axios from "axios";
import styles from "./page.module.css";

export default function Aprender() {
  const router = useRouter();  
  const [categorias, setCategorias] = useState([]);
  const [videos, setVideos] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

  
  const iconosPorCategoria = {
    "Orgánico": "🌿",
    "Reciclable": "♻️",
    "No reciclable": "🚫",
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/categorias")
      .then((res) => setCategorias(res.data))
      .catch(() => setCategorias([]));
  }, []);

  useEffect(() => {
    if (categoriaSeleccionada) {
      axios
        .get(`http://localhost:5000/videos/${categoriaSeleccionada.id}`)
        .then((res) => setVideos(res.data))
        .catch(() => setVideos([]));
    }
  }, [categoriaSeleccionada]);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fef7" }}>
      <main className={styles.container}>
        {/* Botón para regresar al menú */}
        <button
          onClick={() => router.push("/menu")}  
          style={{
            backgroundColor: "#2e7d32",
            color: "white",
            border: "none",
            padding: "10px 18px",
            borderRadius: 8,
            cursor: "pointer",
            marginBottom: 20,
            fontWeight: "bold",
          }}
        >
          ← Regresar al menú
        </button>

        <h1 className={styles.title}>Aprende a separar tus residuos</h1>
        <p className={styles.subtitle}>
          Selecciona una categoría para ver información y videos.
        </p>

        <section className={styles.categories}>
          <div className={styles.topCategory}>
            {categorias[0] && (
              <div
                className={styles.topCategoryCard}
                onClick={() => setCategoriaSeleccionada(categorias[0])}
              >
                <div className={styles.categoryIcon}>
                  {iconosPorCategoria[categorias[0].nombre] || "♻️"}
                </div>
                <h3>{categorias[0].nombre}</h3>
                <p>{categorias[0].descripcion}</p>
              </div>
            )}  
          </div>

          <div className={styles.baseCategories}>
            {categorias.slice(1).map((cat) => (
              <div
                key={cat.id}
                className={styles.baseCategoryCard}
                onClick={() => setCategoriaSeleccionada(cat)}
              >
                <div className={styles.categoryIcon}>
                  {iconosPorCategoria[cat.nombre] || "♻️"}
                </div>
                <h3>{cat.nombre}</h3>
                <p>{cat.descripcion}</p>
              </div>
            ))}
          </div>
        </section>

        {categoriaSeleccionada && (
          <section className={styles.videosSection}>
            <h2 className={styles.videosTitle}>
              Videos sobre {categoriaSeleccionada.nombre}
            </h2>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {videos.map((video) => (
                <div key={video.id} className={styles.videoCard}>
                  <iframe
                    className={styles.videoIframe}
                    src={video.url}
                    title={video.titulo}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                  <p className={styles.videoDescription}>{video.descripcion}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
