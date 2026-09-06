const express = require("express");
const mongoose = require("mongoose");
const Cliente = require("../models/Cliente");

const router = express.Router();

// Helper para validar ObjectId y evitar que Mongoose tire un error feo de cast
function validarId(req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: "El id proporcionado no es válido" });
  }
  next();
}

/**
 * @swagger
 * /clientes:
 *   get:
 *     summary: Listar todos los clientes
 *     tags: [Clientes]
 *     responses:
 *       200:
 *         description: Arreglo de clientes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cliente'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// GET /clientes — listar todos los clientes
router.get("/", async (req, res) => {
  try {
    const clientes = await Cliente.find();
    res.status(200).json(clientes);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener clientes", detalle: error.message });
  }
});

/**
 * @swagger
 * /clientes/{id}:
 *   get:
 *     summary: Obtener un cliente por id
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ObjectId de MongoDB del cliente
 *     responses:
 *       200:
 *         description: Cliente encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cliente'
 *       400:
 *         description: El id no tiene un formato válido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Cliente no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// GET /clientes/{id} — obtener un cliente
router.get("/:id", validarId, async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }
    res.status(200).json(cliente);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener cliente", detalle: error.message });
  }
});

/**
 * @swagger
 * /clientes:
 *   post:
 *     summary: Crear un cliente
 *     tags: [Clientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClienteInput'
 *     responses:
 *       201:
 *         description: Cliente creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cliente'
 *       400:
 *         description: Datos inválidos o faltantes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// POST /clientes — crear un cliente
router.post("/", async (req, res) => {
  try {
    const { nombre, plan, reservas } = req.body;

    if (!nombre || !plan) {
      return res.status(400).json({ error: "nombre y plan son obligatorios" });
    }

    const nuevoCliente = new Cliente({ nombre, plan, reservas });
    const clienteGuardado = await nuevoCliente.save();
    res.status(201).json(clienteGuardado);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: "Datos inválidos", detalle: error.message });
    }
    res.status(500).json({ error: "Error al crear cliente", detalle: error.message });
  }
});

/**
 * @swagger
 * /clientes/{id}:
 *   put:
 *     summary: Actualizar plan (y opcionalmente nombre) de un cliente
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ObjectId de MongoDB del cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               plan:
 *                 type: string
 *                 enum: [básico, premium]
 *     responses:
 *       200:
 *         description: Cliente actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cliente'
 *       400:
 *         description: Id o datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Cliente no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// PUT /clientes/{id} — actualizar plan de un cliente
router.put("/:id", validarId, async (req, res) => {
  try {
    const { nombre, plan } = req.body;

    const clienteActualizado = await Cliente.findByIdAndUpdate(
      req.params.id,
      { $set: { ...(nombre && { nombre }), ...(plan && { plan }) } },
      { new: true, runValidators: true }
    );

    if (!clienteActualizado) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }
    res.status(200).json(clienteActualizado);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: "Datos inválidos", detalle: error.message });
    }
    res.status(500).json({ error: "Error al actualizar cliente", detalle: error.message });
  }
});

/**
 * @swagger
 * /clientes/{id}:
 *   delete:
 *     summary: Eliminar un cliente
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ObjectId de MongoDB del cliente
 *     responses:
 *       200:
 *         description: Cliente eliminado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                 cliente:
 *                   $ref: '#/components/schemas/Cliente'
 *       400:
 *         description: Id inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Cliente no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// DELETE /clientes/{id} — eliminar un cliente
router.delete("/:id", validarId, async (req, res) => {
  try {
    const clienteEliminado = await Cliente.findByIdAndDelete(req.params.id);
    if (!clienteEliminado) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }
    res.status(200).json({ mensaje: "Cliente eliminado correctamente", cliente: clienteEliminado });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar cliente", detalle: error.message });
  }
});

/**
 * @swagger
 * /clientes/{id}/reservas:
 *   post:
 *     summary: Agregar una reserva a un cliente
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ObjectId de MongoDB del cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReservaInput'
 *     responses:
 *       201:
 *         description: Reserva agregada, se devuelve el cliente completo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cliente'
 *       400:
 *         description: Id o datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Cliente no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// POST /clientes/{id}/reservas — agregar una reserva
router.post("/:id/reservas", validarId, async (req, res) => {
  try {
    const { mesa, horario, estado } = req.body;

    if (!mesa || !horario) {
      return res.status(400).json({ error: "mesa y horario son obligatorios" });
    }

    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    cliente.reservas.push({ mesa, horario, estado });
    await cliente.save();

    res.status(201).json(cliente);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: "Datos inválidos", detalle: error.message });
    }
    res.status(500).json({ error: "Error al agregar reserva", detalle: error.message });
  }
});

/**
 * @swagger
 * /clientes/{id}/reservas:
 *   get:
 *     summary: Listar las reservas de un cliente
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ObjectId de MongoDB del cliente
 *     responses:
 *       200:
 *         description: Arreglo de reservas del cliente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reserva'
 *       400:
 *         description: Id inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Cliente no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// GET /clientes/{id}/reservas — listar las reservas de un cliente
router.get("/:id/reservas", validarId, async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }
    res.status(200).json(cliente.reservas);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener reservas", detalle: error.message });
  }
});

module.exports = router;