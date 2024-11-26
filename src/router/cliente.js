const express = require('express');
const router = express.Router();
const pool = require('../database/db')
require('dotenv').config();
const multer = require('multer');
const upload = multer();

/* LOGIN */
router.post('/iniciar-sesion', (req, res) => {
    res.render('login'); // Asegúrate de pasar un nombre de vista válido
})

/* REGISTRO */
router.get('/registrar', (req, res) => {
    res.render('registro');
})

router.post('/registrar', (req, res) => {
    // Lógica para manejar el registro
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
            r.N_banos,
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

        res.render('admin', { remates });
    } catch (error) {
        console.error('Error fetching remates:', error);
        res.status(500).send('Error al cargar los datos');
    }
});



// Ruta para eliminar un remate
router.delete('/admin/eliminar-remate', async (req, res) => {
    const { deleteId } = req.query;
    if (deleteId) {
        try {
            const [result] = await pool.query('DELETE FROM remates WHERE id = ?', [deleteId]);
            if (result.affectedRows > 0) {
                return res.json({ success: true });
            } else {
                return res.json({ success: false, error: 'Remate no encontrado.' });
            }
        } catch (error) {
            console.error('Error al eliminar el remate:', error);
            return res.json({ success: false, error: error.message });
        }
    } else {
        return res.json({ success: false, error: 'ID de remate no proporcionado.' });
    }
});



// Editar remates   
router.get('/admin/editar-remate/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [remates] = await pool.query('SELECT * FROM remates WHERE id = ?', [id]);
        if (remates.length > 0) {
            // Responder con los datos del remate en formato JSON
            res.json({ remate: remates[0] });
        } else {
            res.json({ success: false, error: 'Remate no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener el remate:', error);
        res.json({ success: false, error: error.message });
    }
});




// Añadir remate
router.post('/admin/nuevo-remate', upload.none(), async (req, res) => {
    try {
        const {
            ubicacion, precios, descripcion, categoria,
            N_banos, N_habitacion, pisina, patio,
            cocina, cochera, balcon, jardin, pisos,
            comedor, sala_start, studio, lavanderia,
            fecha_remate, hora_remate
        } = req.body;

        const booleanFields = ['pisina', 'patio', 'cocina', 'cochera', 'balcon', 'jardin', 'comedor', 'sala_start', 'studio', 'lavanderia'];
        const processedFields = booleanFields.reduce((acc, field) => {
            acc[field] = req.body[field] === 'on' ? 'si' : 'no';
            return acc;
        }, {});

        const [result] = await pool.query(`
            INSERT INTO remates (
                ubicacion, precios, descripcion, categoria,
                N_banos, N_habitacion, pisina, patio,
                cocina, cochera, balcon, jardin, pisos,
                comedor, sala_start, studio, lavanderia,
                fecha_remate, hora_remate, estado,
                fecha_activacion, hora_activacion, usuario_admin_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'activo', CURDATE(), CURTIME(), ?)
        `, [
            ubicacion, precios, descripcion, categoria,
            N_banos, N_habitacion, 
            processedFields.pisina, processedFields.patio,
            processedFields.cocina, processedFields.cochera, 
            processedFields.balcon, processedFields.jardin, 
            pisos,
            processedFields.comedor, processedFields.sala_start, 
            processedFields.studio, processedFields.lavanderia,
            fecha_remate, hora_remate,
            1 // Reemplazar con el ID real del usuario administrador de la sesión
        ]);

        res.json({ success: true, id: result.insertId });
    } catch (error) {
        console.error('Error al crear remate:', error);
        res.json({ success: false, error: error.message });
    }
});



// Editar remates   
router.get('/admin/editar-remate/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [remates] = await pool.query('SELECT * FROM remates WHERE id = ?', [id]);
        if (remates.length > 0) {
            res.json({ success: true, remate: remates[0] });
        } else {
            res.status(404).json({ success: false, error: 'Remate no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener el remate:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Actualizar remate
router.put('/admin/actualizar-remate/:id', upload.none(), async (req, res) => {
    const { id } = req.params;
    try {
        const {
            ubicacion, precios, descripcion, categoria,
            N_banos, N_habitacion, pisina, patio,
            cocina, cochera, balcon, jardin, pisos,
            comedor, sala_start, studio, lavanderia,
            fecha_remate, hora_remate, estado
        } = req.body;

        const booleanFields = ['pisina', 'patio', 'cocina', 'cochera', 'balcon', 'jardin', 'comedor', 'sala_start', 'studio', 'lavanderia'];
        const processedFields = booleanFields.reduce((acc, field) => {
            acc[field] = req.body[field] === 'on' ? 'si' : 'no';
            return acc;
        }, {});

        const [result] = await pool.query(`
            UPDATE remates SET
                ubicacion = ?, precios = ?, descripcion = ?, categoria = ?,
                N_banos = ?, N_habitacion = ?, pisina = ?, patio = ?,
                cocina = ?, cochera = ?, balcon = ?, jardin = ?, pisos = ?,
                comedor = ?, sala_start = ?, studio = ?, lavanderia = ?,
                fecha_remate = ?, hora_remate = ?, estado = ?
            WHERE id = ?
        `, [
            ubicacion, precios, descripcion, categoria,
            N_banos, N_habitacion, 
            processedFields.pisina, processedFields.patio,
            processedFields.cocina, processedFields.cochera, 
            processedFields.balcon, processedFields.jardin, 
            pisos,
            processedFields.comedor, processedFields.sala_start, 
            processedFields.studio, processedFields.lavanderia,
            fecha_remate, hora_remate, estado,
            id
        ]);

        if (result.affectedRows > 0) {
            res.json({ success: true, message: 'Remate actualizado correctamente' });
        } else {
            res.status(404).json({ success: false, error: 'Remate no encontrado' });
        }
    } catch (error) {
        console.error('Error al actualizar el remate:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});


module.exports = router;
