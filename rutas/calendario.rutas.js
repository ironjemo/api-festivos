const express = require("express");
const router = express.Router();

// Importamos el controlador correspondiente al calendario
const controlador = require("../controladores/calendario.controlador");

// 📌 Ruta para listar todos los registros del calendario
router.get("/", controlador.listar);

// 📌 Ruta para buscar un registro del calendario por su ID
router.get("/:id", controlador.buscarPorId);

// 📌 Ruta para crear un nuevo registro del calendario
router.post("/", controlador.crear);

// 📌 Ruta para actualizar un registro existente del calendario por ID
router.put("/:id", controlador.actualizar);

// 📌 Ruta para eliminar un registro del calendario por ID
router.delete("/:id", controlador.eliminar);

// ✅ Ruta para generar automáticamente los festivos del año proporcionado
// Ejemplo: GET /api/calendario/generar/2024
router.get("/generar/:anio", controlador.generarCalendario);

// ✅ Ruta para listar todos los días festivos de un año específico
// Ejemplo: GET /api/calendario/listar/2024
router.get("/listar/:anio", controlador.listarPorAnio);

// Exportamos el router para ser usado en app.js
module.exports = router;


