const mysql = require('mysql2');
require('dotenv').config();


const conection = mysql.createPool({
    connectionLimit: 20,  // Número máximo de conexiones en el pool
    waitForConnections: true,  // Esperar si el pool está vacío
    queueLimit: 0,  // Sin límite en la cola de espera
    connectTimeout: 60000,  // Tiempo máximo para establecer la conexión
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD
});

module.exports = { conection, adjustConectionSize};