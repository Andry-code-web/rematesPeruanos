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

/* RUTA ADMIN VER USUARIOS */
router.get('/admin', async (req, res) => {
    try {
        const [usuarios] = await pool.query(`
        SELECT
            r.id AS id,
            r.dni,
            r.nombres_apellidos,
            r.correo,
            r.fecha_nacimiento,
            r.sexo,
            r.celular,
            r.departamento,
            r.provincia,
            r.distrito,
            r.direccion,
            r.usuario,
            r.oportunidades
        FROM usuarios r
        `);

        console.log("Datos de usuarios obtenidos:", usuarios);

        if (Array.isArray(usuarios)) {
            console.log(`Se obtuvieron ${usuarios.length} usuarios`);
        } else {
            console.log("Los datos de usuarios no están en el formato esperado.");
        }

        // Pasar los usuarios a la vista
        res.render('admin', { usuarios });
    } catch (error) {
        console.error('Error fetching usuarios:', error);
        res.status(500).send('Error al cargar los datos');
    }
});

// Ruta para eliminar un usuario
router.delete('/admin/eliminar-usuario', async (req, res) => {
    const { deleteId } = req.query;  // Obtenemos el ID del usuario a eliminar
    if (deleteId) {
        try {
            // Eliminamos el usuario de la tabla 'usuarios'
            const result = await pool.query('DELETE FROM usuarios WHERE id = ?', [deleteId]);
            if (result.affectedRows > 0) {
                return res.json({ success: true });  // Respuesta de éxito en formato JSON
            } else {
                return res.json({ success: false, error: 'Usuario eliminado.' });
            }
        } catch (error) {
            console.error('Error al eliminar el usuario:', error);
            return res.json({ success: false, error: error.message });
        }
    } else {
        return res.json({ success: false, error: 'ID de usuario no proporcionado.' });
    }
});

module.exports = router;
