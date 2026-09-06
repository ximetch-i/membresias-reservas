const mongoose = require("mongoose");

async function connectDB() {
  const MONGO_URI = process.env.MONGO_URI;
  const MONGO_DB_NAME = process.env.MONGO_DB_NAME;

  if (!MONGO_URI || !MONGO_DB_NAME) {
    throw new Error(
      "Faltan variables de entorno MONGO_URI o MONGO_DB_NAME. Nunca hardcodear localhost."
    );
  }

  try {
    await mongoose.connect(MONGO_URI, {
      dbName: MONGO_DB_NAME,
    });
    console.log(`Conectado a MongoDB - base de datos: ${MONGO_DB_NAME}`);
  } catch (error) {
    console.error("Error conectando a MongoDB:", error.message);
    process.exit(1);
  }
}

module.exports = connectDB;