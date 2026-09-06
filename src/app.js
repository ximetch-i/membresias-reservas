const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const clientesRoutes = require("./routes/clientes.routes");

const app = express();

app.use(cors());
app.use(express.json()); // fuerza JSON

// Healthcheck simple, útil para probar que el contenedor levantó bien
app.get("/", (req, res) => {
  res.status(200).json({ servicio: "membresias-reservas", estado: "ok" });
});

// Documentación interactiva: http://localhost:8003/api-docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// JSON crudo de la spec OpenAPI, útil para API Gateway o para compartir con el equipo
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

app.use("/clientes", clientesRoutes);

// 404 para rutas no definidas
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

module.exports = app;