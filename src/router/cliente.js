const express = require('express');
const router = express.Router();
const pool = require('../database/db')
require('dotenv').config();

/* LOGIN */
router.post('/iniciar-session', (req, res) => {
    res.render()
})

/* REGISTRO */
router.get('/registro', (req, res) => {
    res.render('registro')
})

router.post('/registrar', (req, res) => {

})

/* RUTA INICIO */
router.get('/', async (req, res) => {
    try {
        const [remates] = await pool.query(`
            SELECT * FROM remates
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

/* s23 fe
cuota inicial = 525
cuotas seran de = 276 * 12
*/


/* RUTA REMATES */
router.get('/remates', (req, res) => {
    res.render("remates");
});

router.get('/subasta/:id', async (req, res) => {
    const { id } = req.params; // Obtén el ID de la subasta desde la URL
    try {
        // Consulta a la base de datos para obtener la subasta por ID
        const [result] = await pool.query('SELECT * FROM remates WHERE id = ?', [id]);

        if (result.length === 0) {
            // Si no se encuentra ninguna subasta con ese ID, muestra un mensaje de error
            return res.status(404).send('Subasta no encontrada');
        }

        const subasta = result[0]; // La subasta encontrada
        res.render('subasta', { subasta }); // Renderiza la vista con los datos
    } catch (error) {
        console.error('Error al obtener la subasta:', error);
        res.status(500).send('Error al cargar la subasta');
    }
});


/* RUTA CONTACTOS */
router.get('/contacto', (req, res) => {
    res.render("contactos");
});

/*RUTA MAPAS*/
router.get('/mapa', (req, res) => {
    res.render("mapa");
})
module.exports = router;