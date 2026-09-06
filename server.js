require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/db");
 
const PORT = process.env.PORT || 8003;
 
async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Microservicio de membresias-reservas corriendo en el puerto ${PORT}`);
  });
}
 
start();