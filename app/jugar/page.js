"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const categoriasOpciones = [
  { id: 7, texto: "Orgánico" },
  { id: 8, texto: "Reciclable" },
  { id: 9, texto: "No reciclable" },
];

export default function Jugar() {
  const [nombre, setNombre] = useState("");
  const [usuario, setUsuario] = useState(() => {
    if (typeof window !== "undefined") {
      const id = localStorage.getItem("usuarioId");
      const nombre = localStorage.getItem("usuarioNombre");
      return id && nombre ? { id, nombre } : null;
    }
    return null;
  });
  const [residuos, setResiduos] = useState([]);
  const [preguntaIndex, setPreguntaIndex] = useState(0);
  const [puntaje, setPuntaje] = useState(0);
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (usuario) {
      axios
        .get("http://localhost:5000/residuos")
        .then((res) => setResiduos(res.data))
        .catch(() => setResiduos([]));
    }
  }, [usuario]);

  const crearUsuario = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) return alert("Por favor ingresa un nombre");
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/usuarios", { nombre });
      localStorage.setItem("usuarioId", res.data.id);
      localStorage.setItem("usuarioNombre", res.data.nombre);
      setUsuario(res.data);
      console.log("Usuario guardado en localStorage:", res.data);
    } catch (error) {
      alert("Error al crear usuario");
    } finally {
      setLoading(false);
    }
  };

  const responder = (categoriaSeleccionadaId) => {
    const residuoActual = residuos[preguntaIndex];
    if (!residuoActual) return;

    const esCorrecta = categoriaSeleccionadaId === residuoActual.categoria_id;
    const nuevoPuntaje = esCorrecta ? puntaje + 1 : puntaje;

    setPuntaje(nuevoPuntaje);

    if (preguntaIndex + 1 < residuos.length) {
      setPreguntaIndex(preguntaIndex + 1);
    } else {
      setJuegoTerminado(true);
      guardarPuntaje(nuevoPuntaje);
    }
  };

  const guardarPuntaje = async (puntajeFinal) => {
    try {
      console.log("Guardando puntaje en backend:", puntajeFinal);
      await axios.post("http://localhost:5000/puntaje", {
        usuario_id: usuario.id,
        puntaje: puntajeFinal,
      });
    } catch (error) {
      console.error("Error guardando puntaje:", error);
    }
  };

  const reiniciar = () => {
    setNombre("");
    setUsuario(null);
    setResiduos([]);
    setPreguntaIndex(0);
    setPuntaje(0);
    setJuegoTerminado(false);
    localStorage.removeItem("usuarioId");
    localStorage.removeItem("usuarioNombre");
    router.push("/menu");
  };

  if (!usuario) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
         <h2>Ingresa tu nombre para jugar</h2>
          <form onSubmit={crearUsuario}>
            <input
              type="text"
              placeholder="Tu nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              style={styles.input}
              disabled={loading}
            />
            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? "Creando..." : "Comenzar"}
            </button>
          </form>
          <button
            type="button"
            style={{ ...styles.button, marginTop: 12, backgroundColor: "#888" }}
            onClick={() => router.push("/menu")}
          >
            Regresar al menú
          </button>
        </div>
      </div>
    );
  }

  if (juegoTerminado) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2>¡Juego terminado!</h2>
          <p>
            {usuario.nombre}, obtuviste un puntaje de <strong>{puntaje}</strong> de {residuos.length}.
          </p>
          <button style={styles.button} onClick={reiniciar}>
            Volver al menú
          </button>
        </div>
      </div>
    );
  }

  if (residuos.length === 0) {
    return <p style={{ textAlign: "center", marginTop: 40 }}>Cargando preguntas...</p>;
  }

  const residuoActual = residuos[preguntaIndex];

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>{`Pregunta ${preguntaIndex + 1} de ${residuos.length}`}</h2>
        <p style={{ marginBottom: 10 }}>¿A qué categoría pertenece este residuo?</p>
        <img
          src={residuoActual.imagen}
          alt={residuoActual.nombre}
          style={{ maxWidth: "100%", borderRadius: 12, marginBottom: 20 }}
        />
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          {categoriasOpciones.map((cat) => (
            <button
              key={cat.id}
              onClick={() => responder(cat.id)}
              style={styles.button}
            >
              {cat.texto}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f7fff4",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    backgroundColor: "white",
    padding: 24,
    borderRadius: 16,
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    width: 420,
    maxWidth: "90%",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: 12,
    borderRadius: 8,
    border: "1px solid #ccc",
    fontSize: 16,
    marginBottom: 12,
  },
  button: {
    padding: 14,
    backgroundColor: "#2e7d32",
    color: "white",
    fontWeight: "bold",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    minWidth: 100,
  },
};
