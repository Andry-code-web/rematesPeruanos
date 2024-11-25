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

/* RUTA MAPAS */
router.get('/mapa', (req, res) => {
    res.render("mapa");
});
/* RUTA ADMIN VER REMATES */
router.get('/admin', async (req, res) => {
    try {
        const [remates] = await pool.query(`
        SELECT
            r.id AS id,
            r.ubicacion,
            r.precios,
            r.descripcion,
            r.categoria,
            r.N_baños,
            r.N_habitacion,
            r.pisina,
            r.patio,
            r.cocina,
            r.cochera,
            r.balcon,
            r.jardin,
            r.pisos,
            r.comedor,
            r.sala_start,
            r.studio,
            r.lavanderia,
            r.fecha_activacion,
            r.fecha_remate,
            r.hora_remate,
            r.usuario_admin_id,
            r.ganador,
            r.like_count,
            r.monto_venta,
            r.estado
        FROM remates r
        `);

        console.log("Datos de remates obtenidos:", remates);

        if (Array.isArray(remates)) {
            console.log(`Se obtuvieron ${remates.length} remates`);
        } else {
            console.log("Los datos de remates no están en el formato esperado.");
        }

        // Pasar los remates a la vista
        res.render('admin', { remates });
    } catch (error) {
        console.error('Error fetching remates:', error);
        res.status(500).send('Error al cargar los datos');
    }
}); 

// Ruta para eliminar un remate
router.delete('/admin/eliminar-remate', async (req, res) => {
    const { deleteId } = req.query;  // Obtenemos el ID del remate a eliminar
    if (deleteId) {
        try {
            // Eliminamos el remate de la tabla 'remates'
            const result = await pool.query('DELETE FROM remates WHERE id = ?', [deleteId]);
            if (result.affectedRows > 0) {
                return res.json({ success: true });  // Respuesta de éxito en formato JSON
            } else {
                return res.json({ success: false, success: 'Remate eliminado.' });
            }
        } catch (error) {
            console.error('Error al eliminar el remate:', error);
            return res.json({ success: false, error: error.message });
        }
    } else {
        return res.json({ success: false, error: 'ID de remate no proporcionado.' });
    }
});

//editar remates   
router.get('/admin/editar-remate/:id', async (req, res) => {
    const { id } = req.query;
    try {
        const [remates] = await pool.query('SELECT * FROM remates WHERE id = ?', [id]);
        if (remates.length > 0) {
            res.json({ success: true, remate: remates[0] });
        } else {
            res.json({ success: false, error: 'Remate no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener el remate:', error);
        res.json({ success: false, error: error.message });
    }
});



module.exports = router;
