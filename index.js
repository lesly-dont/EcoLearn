require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let connection;

// Inicializar la conexión a la base de datos
async function initDB() {
  connection = await mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
}

// Endpoint: Obtener residuos aleatorios con su categoría 
app.get('/residuos', async (req, res) => {
  try {
    const [rows] = await connection.query(
      `SELECT residuos.id, residuos.nombre, residuos.imagen, residuos.categoria_id, categorias.nombre AS categoria, residuos.explicacion
       FROM residuos
       JOIN categorias ON residuos.categoria_id = categorias.id
       ORDER BY RAND() LIMIT 10`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint: Obtener todas las categorías
app.get('/categorias', async (req, res) => {
  try {
    const [rows] = await connection.query('SELECT * FROM categorias');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint: Crear un usuario
app.post('/usuarios', async (req, res) => {
  const { nombre } = req.body;
  try {
    const [result] = await connection.query(
      'INSERT INTO usuarios (nombre) VALUES (?)',
      [nombre]
    );
    res.json({ id: result.insertId, nombre });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint: Actualizar puntaje y registrar partida
app.post('/puntaje', async (req, res) => {
  const { usuario_id, puntaje } = req.body;
  console.log(`Recibiendo puntaje ${puntaje} para usuario ${usuario_id}`);
  try {
    await connection.query(
      'UPDATE usuarios SET puntaje = puntaje + ? WHERE id = ?',
      [puntaje, usuario_id]
    );
    await connection.query(
      'INSERT INTO partidas (usuario_id, puntaje) VALUES (?, ?)',
      [usuario_id, puntaje]
    );
    res.json({ message: 'Puntaje actualizado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint: Obtener videos por categoría
app.get('/videos/:categoria_id', async (req, res) => {
  const { categoria_id } = req.params;
  try {
    const [rows] = await connection.query(
      'SELECT * FROM videos WHERE categoria_id = ?',
      [categoria_id]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener usuario por ID con puntaje
/*app.get('/usuarios/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const [rows] = await connection.query('SELECT id, nombre, puntaje FROM usuarios WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});*/

// Iniciar el servidor después de la conexión a la base de datos
const PORT = process.env.PORT || 5000;
initDB()
  .then(() => {
    console.log("Servidor backend arrancando...");
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en puerto ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error inicializando la base de datos', err);
  });
  // Endpoint: Obtener el último usuario registrado con puntaje
app.get('/usuarios/ultimo', async (req, res) => {
  try {
    const [rows] = await connection.query(
      'SELECT id, nombre, puntaje FROM usuarios ORDER BY id DESC LIMIT 1'
    );
    console.log("Último usuario encontrado:", rows);  // Agregar log
    if (rows.length === 0) {
      return res.status(404).json({ error: 'No hay usuarios registrados' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

