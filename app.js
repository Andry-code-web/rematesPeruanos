const express = require("express");
//const http = require("http");
//const socketIo = require("socket.io");
//const session = require("express-session");
const morgan = require("morgan");
//const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();

/* configuracion servidor */
const app = express();
const port = process.env.PORT || 5050;



// Routers
const cliente = require("./src/router/cliente");
const admin = require("./src/router/admin");

app.use("/", cliente);
app.use("/admin", admin);

// Configuración de vistas
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views"));
app.use(express.static(path.join(__dirname, "public")));



// Iniciar el servidor
app.listen(port, () => {
    console.log(`El servidor está corriendo en el puerto ${port}`);
});