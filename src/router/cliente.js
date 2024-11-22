const express = require('express');
const router = express.Router();
const pool = require('../database/db')
require('dotenv').config();

/* LOGIN */
router.post('/iniciar-session', (req, res) => {
    res.render()
})

/* REGISTRO */
router.get('/registrar', (res, req) => {
    res.render('registro')
})

router.post('/registrar', (res, req) => {

})

/* RUTA INICIO */
router.get('/', async (req, res) => {
    try {
        const [remates] = await pool.query(`
        SELECT 
          r.id AS id,
          r.ubicacion,
          r.precios,
          r.fecha_activacion,
          r.estado,
          r.descripcion,
          r.categoria
        FROM remates r
      `);
        // Mostrar los datos obtenidos en consola
        console.log("Datos de remates obtenidos:", remates);

        // Verifica el tipo de datos y estructura
        if (Array.isArray(remates)) {
            console.log(`Se obtuvieron ${remates.length} remates`);
        } else {
            console.log("Los datos de remates no están en el formato esperado.");
        }

        res.render('inicio', { remates });
    } catch (error) {
        console.error('Error fetching remates:', error);
        res.status(500).send('Error al cargar los datos');
    }
});


/* RUTA REMATES */
router.get('/remates', (req, res) => {
    res.render("remates");
});

/* RUTA SUBASTAS */
router.get('/subasta', (req, res) => {
    res.render("subasta");
});

/* RUTA CONTACTOS */
router.get('/contacto', (req, res) => {
    res.render("contactos");
});

/*RUTA MAPAS*/

router.get('/mapa', (req, res) => {
    res.render("mapa");
})

/*admin*/
router.get('/admin', (req, res) => {
    res.render("admin");
})

module.exports = router;