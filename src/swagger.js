const swaggerJsdoc = require("swagger-jsdoc");

const PORT = process.env.PORT || 8003;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Membresías y Reservas API",
      version: "1.0.0",
      description:
        "Microservicio 3 de la Ludoteca / Red de Cafés de Juegos de Mesa. " +
        "Gestiona clientes, sus planes de membresía y sus reservas de mesas. " +
        "Persistencia en MongoDB.",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: "Servidor local",
      },
    ],
    components: {
      schemas: {
        Reserva: {
          type: "object",
          properties: {
            _id: { type: "string", example: "66d3f1a2c8b9e40012a4f9c1" },
            mesa: { type: "integer", example: 3 },
            horario: { type: "string", example: "2026-09-10T18:00" },
            estado: {
              type: "string",
              enum: ["confirmada", "pendiente", "cancelada"],
              example: "confirmada",
            },
          },
        },
        Cliente: {
          type: "object",
          properties: {
            _id: { type: "string", example: "66d3f1a2c8b9e40012a4f9c0" },
            nombre: { type: "string", example: "Ana Pérez" },
            plan: {
              type: "string",
              enum: ["básico", "premium"],
              example: "premium",
            },
            reservas: {
              type: "array",
              items: { $ref: "#/components/schemas/Reserva" },
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        ClienteInput: {
          type: "object",
          required: ["nombre", "plan"],
          properties: {
            nombre: { type: "string", example: "Ana Pérez" },
            plan: {
              type: "string",
              enum: ["básico", "premium"],
              example: "premium",
            },
          },
        },
        ReservaInput: {
          type: "object",
          required: ["mesa", "horario"],
          properties: {
            mesa: { type: "integer", example: 3 },
            horario: { type: "string", example: "2026-09-10T18:00" },
            estado: {
              type: "string",
              enum: ["confirmada", "pendiente", "cancelada"],
              example: "confirmada",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: { type: "string" },
            detalle: { type: "string" },
          },
        },
      },
    },
  },
  // Dónde buscar los comentarios @swagger (JSDoc) que documentan cada endpoint
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;