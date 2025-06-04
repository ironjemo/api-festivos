const express = require("express");
const controlador = require("../controladores/tipo.controlador");

module.exports = (app) => {
    const router = express.Router();

    router.get("/", controlador.listar);
    router.get("/:id", controlador.buscarPorId);
    router.post("/", controlador.insertar);
    router.put("/:id", controlador.actualizar);
    router.delete("/:id", controlador.eliminar);

    app.use("/api/tipos", router);
};
