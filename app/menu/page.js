import Link from "next/link";

const menu = [
  {
    title: "Aprender",
    icon: "📚",
    description: "Paso 1: Conoce cómo separar correctamente cada tipo de residuo.",
    href: "/aprender"
    
  },
  {
    title: "¡A jugar!",
    icon: "🎮",
    description: "Paso 2: Responde preguntas sobre reciclaje y suma puntos.",
    href: "/jugar"
  },
  {
    title: "Mis Logros",
    icon: "🏅",
    description: "Paso 3: Consulta tu puntaje y los logros alcanzados.",
    href: "/logros"
  }
];

export default function Menu() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#f8fef7",
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
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
          <span style={{ fontSize: 28, color: "#5CA885" }}>👤</span>
        </div>
      </header>
      <section style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flex: 1
      }}>
        <div style={{
          display: "flex",
          gap: 36,
          marginTop: 48
        }}>
          {menu.map(card => (
            <Link key={card.title} href={card.href}>
              <div style={{
                background: "#fff",
                borderRadius: 22,
                boxShadow: "0 6px 22px 0 rgba(76, 175, 80, 0.14)",
                padding: "34px 28px 22px",
                minWidth: 240,
                maxWidth: 260,
                textAlign: "center",
                transition: "transform 0.15s",
                cursor: "pointer"
              }}>
                <div style={{ fontSize: 38, marginBottom: 10 }}>{card.icon}</div>
                <h2 style={{ color: "#1D7F4E", fontWeight: "bold", fontSize: 22 }}>{card.title}</h2>
                <p style={{ color: "#3B6D52", fontSize: 16, marginBottom: 16 }}>{card.description}</p>
                <button style={{
                  background: "#5CA885",
                  color: "white",
                  border: "none",
                  borderRadius: 16,
                  padding: "7px 22px",
                  fontSize: 15,
                  fontWeight: "bold",
                  boxShadow: "0 1px 6px rgba(76, 175, 80, 0.14)",
                  cursor: "pointer"
                }}>Ir</button>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
