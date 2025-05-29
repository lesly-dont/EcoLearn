"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Logros() {
  const [usuario, setUsuario] = useState(null);
  const [puntaje, setPuntaje] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Consultar al backend para obtener el último usuario registrado
    axios
      .get("http://localhost:5000/usuarios/ultimo")
      .then((res) => {
        setUsuario({ id: res.data.id, nombre: res.data.nombre });
        setPuntaje(res.data.puntaje);
        setLoading(false); // Marcamos que la carga terminó
      })
      .catch((error) => {
        console.error("Error cargando el usuario:", error);
        setLoading(false);
        setPuntaje("Error al cargar puntaje");
      });
  }, []);

  if (loading) return <p>Cargando...</p>;

  if (!usuario) return <p>No se encontró un usuario válido</p>;

  // Validación para mostrar mensaje diferente según el puntaje
  const mensajeCertificado =
    puntaje <= 5
      ? "No obtuvo el resultado esperado. ¡Sigue intentándolo!"
      : "Ha completado satisfactoriamente el juego EcoLearn para aprender a separar residuos.";

  return (
    <div style={styles.container}>
      <div style={styles.certificate}>
        <div style={styles.medal}>🏅</div>
        <h1 style={styles.title}>Certificado de Logro</h1>

        <p style={styles.subtitle}>Se certifica que</p>

        <h2 style={styles.name}>{usuario.nombre}</h2>

        <p style={styles.text}>{mensajeCertificado}</p>

        <p style={styles.score}>
          Puntaje obtenido: <span style={{ fontWeight: "bold" }}>{puntaje}</span>
        </p>

        <button
          style={styles.button}
          onClick={() => {
            // Limpiamos el localStorage y redirigimos al menú
            localStorage.removeItem("usuarioId");
            localStorage.removeItem("usuarioNombre");
            router.push("/menu");
          }}
        >
          Reiniciar juego
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#fef9f4",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  certificate: {
    maxWidth: 800,
    width: "100%",
    backgroundColor: "#fff",
    border: "14px solid #d4af37", // marco dorado más grueso
    borderRadius: 24,
    padding: 60,
    boxShadow: "0 0 30px rgba(212, 175, 55, 0.8)",
    textAlign: "center",
    fontFamily: "'Georgia', serif",
    position: "relative",
  },
  medal: {
    fontSize: 64,
    marginBottom: 20,
  },
  title: {
    fontSize: 48,
    marginBottom: 20,
    color: "#b8860b",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 26,
    marginBottom: 10,
    fontStyle: "italic",
    color: "#555",
  },
  name: {
    fontSize: 38,
    marginBottom: 30,
    fontWeight: "bold",
    color: "#333",
  },
  text: {
    fontSize: 24,
    marginBottom: 50,
    color: "#666",
    lineHeight: 1.6,
  },
  score: {
    fontSize: 32,
    marginBottom: 50,
    color: "#2e7d32",
  },
  button: {
    backgroundColor: "#b8860b",
    color: "white",
    border: "none",
    borderRadius: 12,
    padding: "16px 40px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: 20,
    transition: "background-color 0.3s ease",
  },
};
