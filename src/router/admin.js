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


// Ruta para actualizar oportunidades
router.post('/clientes_admin', async (req, res) => {
    const clienteId = req.params.id;
    
    try {
      const query = 'UPDATE usuarios SET oportunidades = 10 WHERE id = ?';
      
      connection.query(query, [clienteId], (error, results) => {
        if (error) {
          console.error('Error al actualizar oportunidades:', error);
          return res.status(500).json({ 
            success: false, 
            message: 'Error al actualizar oportunidades' 
          });
        }
        
        res.json({ 
          success: true, 
          message: 'Oportunidades actualizadas correctamente' 
        });
      });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error interno del servidor' 
      });
    }
  });
module.exports = router;
