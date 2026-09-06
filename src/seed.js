/**
 * Script de carga masiva de datos ficticios (fake data) para la colección "clientes".
 *
 * Uso:
 *   node src/seed.js            -> inserta 20,000 clientes (default)
 *   node src/seed.js 30000      -> inserta 30,000 clientes
 *
 * Este script está pensado para correrse UNA SOLA VEZ (o cuando quieras
 * repoblar la colección). No se ejecuta automáticamente al levantar el
 * servidor (server.js no lo llama).
 *
 * Antes de insertar, vacía la colección para evitar duplicados si lo
 * corres más de una vez por error.
 */

require("dotenv").config();
const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const connectDB = require("./db");
const Cliente = require("./models/Cliente");

const TOTAL_CLIENTES = parseInt(process.argv[2], 10) || 20000;
const TAMANO_LOTE = 1000; 

function generarReservas() {
  const cantidad = faker.number.int({ min: 0, max: 3 });
  const reservas = [];

  for (let i = 0; i < cantidad; i++) {
    reservas.push({
      mesa: faker.number.int({ min: 1, max: 20 }),
      horario: faker.date.soon({ days: 30 }).toISOString(),
      estado: faker.helpers.arrayElement(["confirmada", "pendiente", "cancelada"]),
    });
  }

  return reservas;
}

function generarCliente() {
  return {
    nombre: faker.person.fullName(),
    plan: faker.helpers.arrayElement(["básico", "premium"]),
    reservas: generarReservas(),
  };
}

async function seed() {
  await connectDB();

  console.log(`Vaciando la colección "clientes" antes de insertar...`);
  await Cliente.deleteMany({});

  console.log(`Insertando ${TOTAL_CLIENTES} clientes ficticios en lotes de ${TAMANO_LOTE}...`);

  let insertados = 0;

  for (let i = 0; i < TOTAL_CLIENTES; i += TAMANO_LOTE) {
    const loteSize = Math.min(TAMANO_LOTE, TOTAL_CLIENTES - i);
    const lote = Array.from({ length: loteSize }, generarCliente);

    await Cliente.insertMany(lote, { ordered: false });

    insertados += loteSize;
    console.log(`  -> ${insertados}/${TOTAL_CLIENTES} insertados`);
  }

  const totalEnDB = await Cliente.countDocuments();
  console.log(`Listo. Documentos totales en la colección "clientes": ${totalEnDB}`);

  await mongoose.connection.close();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Error durante el seed:", err);
  process.exit(1);
});