# Membresías y Reservas — Microservicio 3

Microservicio del proyecto **Ludoteca / Red de Cafés de Juegos de Mesa**.
Gestiona clientes, sus planes de membresía (`básico` / `premium`) y sus reservas de mesas.

| | |
|---|---|
| **Lenguaje** | Node.js + Express |
| **Base de datos** | MongoDB (NoSQL) |
| **Puerto** | 8003 |
| **Imagen Docker** | `usuario/membresias-reservas` |

## Estructura del documento (colección `clientes`)

```json
{
  "_id": "66d3f1a2c8b9e40012a4f9c0",
  "nombre": "Ana Pérez",
  "plan": "premium",
  "reservas": [
    {
      "_id": "66d3f1a2c8b9e40012a4f9c1",
      "mesa": 3,
      "horario": "2026-09-10T18:00",
      "estado": "confirmada"
    }
  ],
  "createdAt": "2026-09-06T12:00:00.000Z",
  "updatedAt": "2026-09-06T12:00:00.000Z"
}
```

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/clientes` | Listar todos los clientes |
| GET | `/clientes/{id}` | Obtener un cliente |
| POST | `/clientes` | Crear un cliente |
| PUT | `/clientes/{id}` | Actualizar plan (y/o nombre) de un cliente |
| DELETE | `/clientes/{id}` | Eliminar un cliente |
| POST | `/clientes/{id}/reservas` | Agregar una reserva a un cliente |
| GET | `/clientes/{id}/reservas` | Listar las reservas de un cliente |

Documentación interactiva completa (Swagger UI): **`/api-docs`**
Spec OpenAPI en JSON crudo: **`/api-docs.json`**

## Variables de entorno

Copia `.env.example` a `.env` y completa los valores:

```
MONGO_URI=mongodb://localhost:27017
MONGO_DB_NAME=ludoteca_membresias
PORT=8003
```

> Nunca se hardcodea `localhost` dentro del código — todo se lee de variables de entorno (`src/db.js`). En despliegue, `MONGO_URI` apunta a la VM/servicio real de MongoDB.

## Cómo correr en local (sin Docker)

```bash
npm install
cp .env.example .env   # y completa tus valores
npm start
```

El servidor queda escuchando en `http://localhost:8003`.

## Cómo correr con Docker

```bash
docker build -t usuario/membresias-reservas .

docker run -d --name membresias-reservas \
  -p 8003:8003 \
  -e MONGO_URI=mongodb://host.docker.internal:27017 \
  -e MONGO_DB_NAME=ludoteca_membresias \
  usuario/membresias-reservas
```

En el `docker-compose` final del proyecto, `MONGO_URI` apuntará al nombre del servicio de Mongo dentro de la red de contenedores (ej. `mongodb://mongo-membresias:27017`).

## Datos de prueba (carga masiva)

Se incluye un script de seed que inserta **20,000 clientes ficticios** (con reservas aleatorias embebidas) en la colección `clientes`, generados con [`@faker-js/faker`](https://fakerjs.dev/).

```bash
npm run seed              # inserta 20,000 clientes (default)
npm run seed -- 30000     # inserta una cantidad distinta
```

> ⚠️ El script vacía la colección `clientes` antes de insertar, para evitar duplicados si se corre más de una vez. Está pensado para ejecutarse una sola vez, de forma manual (no se dispara al iniciar el servidor).

## Pruebas

Se incluye una colección de Postman (`membresias-reservas-postman-collection.json`) con el CRUD completo, casos de éxito y casos de error (id inválido → 400, recurso inexistente → 404), con asserts automáticos.

Para correrla:
1. Importa el archivo en Postman.
2. Ajusta la variable de colección `base_url` si tu servicio no corre en `http://localhost:8003`.
3. Click derecho en la colección → **Run collection**.

## Estructura del proyecto

```
membresias-reservas/
├── src/
│   ├── app.js               # configuración de Express, middlewares y rutas
│   ├── db.js                # conexión a MongoDB vía variables de entorno
│   ├── swagger.js           # configuración de swagger-jsdoc / OpenAPI
│   ├── seed.js               # script de carga masiva de datos ficticios
│   ├── models/
│   │   └── Cliente.js        # esquema Mongoose de clientes y reservas
│   └── routes/
│       └── clientes.routes.js  # endpoints documentados con JSDoc/Swagger
├── server.js                 # punto de entrada, levanta el servidor en el puerto 8003
├── package.json
├── Dockerfile
├── .dockerignore
├── .gitignore
└── .env.example
```