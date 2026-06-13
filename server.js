import express from 'express';
import path from 'path';
import fs from 'fs';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'db.json');

// Middleware
app.use(express.static(__dirname));
app.use(bodyParser.json());

// Funciones auxiliares para leer y escribir datos
function leerDatos() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error al leer datos:', error);
    return { dias: [] };
  }
}

function guardarDatos(datos) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(datos, null, 2), 'utf8');
  } catch (error) {
    console.error('Error al guardar datos:', error);
  }
}

// ENDPOINTS DE API REST

// GET /api/dias - Obtener todos los días con ejercicios
app.get('/api/dias', (req, res) => {
  const datos = leerDatos();
  res.json(datos.dias);
});

// GET /api/dias/:id - Obtener un día específico
app.get('/api/dias/:id', (req, res) => {
  const datos = leerDatos();
  const dia = datos.dias.find(d => d.id === parseInt(req.params.id));
  
  if (!dia) {
    return res.status(404).json({ error: 'Día no encontrado' });
  }
  
  res.json(dia);
});

// POST /api/ejercicios - Agregar un ejercicio
app.post('/api/ejercicios', (req, res) => {
  const { nombre, grupoMuscular, series, reps, peso, dia } = req.body;
  
  if (!nombre || !grupoMuscular || !series || !reps || dia === undefined) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }
  
  const datos = leerDatos();
  const diaEncontrado = datos.dias.find(d => d.id === parseInt(dia));
  
  if (!diaEncontrado) {
    return res.status(404).json({ error: 'Día no encontrado' });
  }
  
  // Generar nuevo ID
  let maxId = 0;
  datos.dias.forEach(d => {
    d.ejercicios.forEach(e => {
      if (e.id > maxId) maxId = e.id;
    });
  });
  
  const nuevoEjercicio = {
    id: maxId + 1,
    nombre,
    grupoMuscular,
    series: parseInt(series),
    reps: parseInt(reps),
    peso: parseInt(peso) || 0
  };
  
  diaEncontrado.ejercicios.push(nuevoEjercicio);
  guardarDatos(datos);
  
  res.status(201).json(nuevoEjercicio);
});

// PUT /api/ejercicios/:id - Actualizar un ejercicio
app.put('/api/ejercicios/:id', (req, res) => {
  const { nombre, grupoMuscular, series, reps, peso } = req.body;
  const ejercicioId = parseInt(req.params.id);
  
  const datos = leerDatos();
  let ejercicioEncontrado = null;
  let diaEncontrado = null;
  
  for (const dia of datos.dias) {
    const ejercicio = dia.ejercicios.find(e => e.id === ejercicioId);
    if (ejercicio) {
      ejercicioEncontrado = ejercicio;
      diaEncontrado = dia;
      break;
    }
  }
  
  if (!ejercicioEncontrado) {
    return res.status(404).json({ error: 'Ejercicio no encontrado' });
  }
  
  // Actualizar campos
  if (nombre) ejercicioEncontrado.nombre = nombre;
  if (grupoMuscular) ejercicioEncontrado.grupoMuscular = grupoMuscular;
  if (series) ejercicioEncontrado.series = parseInt(series);
  if (reps) ejercicioEncontrado.reps = parseInt(reps);
  if (peso !== undefined) ejercicioEncontrado.peso = parseInt(peso);
  
  guardarDatos(datos);
  res.json(ejercicioEncontrado);
});

// DELETE /api/ejercicios/:id - Eliminar un ejercicio
app.delete('/api/ejercicios/:id', (req, res) => {
  const ejercicioId = parseInt(req.params.id);
  const datos = leerDatos();
  
  let eliminado = false;
  
  for (const dia of datos.dias) {
    const index = dia.ejercicios.findIndex(e => e.id === ejercicioId);
    if (index !== -1) {
      dia.ejercicios.splice(index, 1);
      eliminado = true;
      break;
    }
  }
  
  if (!eliminado) {
    return res.status(404).json({ error: 'Ejercicio no encontrado' });
  }
  
  guardarDatos(datos);
  res.json({ message: 'Ejercicio eliminado correctamente' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});