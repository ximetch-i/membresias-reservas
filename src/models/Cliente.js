const mongoose = require("mongoose");

const ReservaSchema = new mongoose.Schema(
  {
    mesa: {
      type: Number,
      required: true,
    },
    horario: {
      type: String,
      required: true,
    },
    estado: {
      type: String,
      enum: ["confirmada", "pendiente", "cancelada"],
      default: "confirmada",
    },
  },
  { _id: true } 
);

const ClienteSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    plan: {
      type: String,
      enum: ["básico", "premium"],
      required: true,
    },
    reservas: {
      type: [ReservaSchema],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cliente", ClienteSchema, "clientes");