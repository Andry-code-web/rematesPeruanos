const express = require('express');
const router = express.Router();
const pool = require('../database/db');
const subastaService = require('../servises/subastaService');
const { determinarEstadoSubasta, formatearNumero, formatearFecha, formatearHora } = require('../utils/subastaUtils');
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

        console.log("Datos de remates obtenidos:", remates);

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

router.get('/subasta/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const subasta = await subastaService.obtenerSubasta(id);
        
        if (!subasta) {
            return res.status(404).send('Subasta no encontrada');
        }

        const totalVisitas = await subastaService.obtenerTotalVisitas(id);
        const ultimaOferta = await subastaService.obtenerUltimaOferta(id);

        const estadoSubasta = determinarEstadoSubasta(
            subasta.fecha_activacion,
            subasta.fecha_remate,
            subasta.hora_remate
        );

        const fechaRemate = new Date(subasta.fecha_remate);
        fechaRemate.setHours(subasta.hora_remate.split(':')[0], subasta.hora_remate.split(':')[1], 0);

        const viewData = {
            subasta,
            totalVisitas,
            ...estadoSubasta,
            ofertaActual: ultimaOferta || subasta.precios,
            fechaHoraFinSubasta: fechaRemate,
            fechaHoraAperturaSubasta: new Date(subasta.fecha_activacion),
            initialPrice: subasta.precios,
            formatNumber: formatearNumero,
            fechaFormateadaEsp: formatearFecha(subasta.fecha_remate),
            horaFormateada: formatearHora(subasta.hora_remate)
        };

        res.render('subasta', viewData);
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