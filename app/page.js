import Link from "next/link";

export default function Home() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#f8fef7",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <header style={{
        width: "100%",
        padding: "18px 48px",
        boxSizing: "border-box",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div style={{ fontWeight: "bold", fontSize: 26, color: "#1D7F4E" }}>EcoLearn App</div>
        <div style={{
          background: "#eee",
          width: 44,
          height: 44,
          borderRadius: "50%",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          {/* Aquí puedes poner la foto de perfil del usuario si la tienes */}
          <span style={{ fontSize: 28, color: "#5CA885" }}>👤</span>
        </div>
      </header>
      <section style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <h1 style={{ fontSize: 38, fontWeight: "bold", color: "#1D7F4E", marginBottom: 6 }}>¡Bienvenido a EcoLearn!</h1>
        <p style={{ color: "#3B6D52", fontSize: 18, marginBottom: 28 }}>
          Aprende a reciclar de manera divertida, juega, gana puntos y conviértete en un héroe del planeta.
        </p>
        <img src="https://cdn-icons-png.flaticon.com/512/2921/2921822.png" alt="Reciclaje" style={{ width: 140, marginBottom: 26 }} />
        <Link href="/menu">
          <button style={{
            background: "#5CA885",
            color: "white",
            border: "none",
            borderRadius: 20,
            padding: "12px 36px",
            fontSize: 18,
            fontWeight: "bold",
            boxShadow: "0 2px 8px rgba(76, 175, 80, 0.10)",
            cursor: "pointer",
            marginTop: 8
          }}>Empezar</button>
        </Link>
      </section>
    </div>
  );
}
