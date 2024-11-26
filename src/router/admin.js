const express = require('express');
const router = express.Router();
const pool = require('../database/db')
require('dotenv').config();


/* RUTA ADMIN_CLIENTE */
router.get("/clientes_admin", async (req, res) => {
    try {
        const [clientes] = await pool.query(`
        SELECT * FROM usuarios`);
        // Mostrar los datos obtenidos en consola
        console.log("Datos de clientes obtenidos:", clientes);

        // Verifica el tipo de datos y estructura
        if (Array.isArray(clientes)) {
            console.log(`Se obtuvieron ${clientes.length} clientes`);
        } else {
            console.log("Los datos de clientes no están en el formato esperado.");
        }

        res.render('clientes_admin', { clientes });
    } catch (error) {
        console.error('Error fetching clientes:', error);
        res.status(500).send('Error al cargar los datos');
    }
});


module.exports = router;