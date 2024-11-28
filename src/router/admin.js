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

/*Actualizar oportunidades*/  
router.post("/actualizar-oportunidades/:id", async (req, res) => { 
  try { 
      const clienteId = req.params.id; 
      // Primero verificamos las oportunidades actuales 
      const [cliente] = await pool.query( 
          'SELECT oportunidades FROM usuarios WHERE id = ?',  
          [clienteId] 
      ); 
      if (cliente[0].oportunidades === 1) { 
          // Actualizamos a 10 oportunidades 
          await pool.query( 
              'UPDATE usuarios SET oportunidades = 10 WHERE id = ?', 
              [clienteId] 
          ); 
          res.json({  
              success: true,  
              message: 'Oportunidades actualizadas correctamente'  
          }); 
      } else { 
          res.json({  
              success: false,  
              message: 'El cliente no es elegible para actualizar oportunidades'  
          }); 
      } 
  } catch (error) { 
      console.error('Error al actualizar oportunidades:', error); 
      res.status(500).json({  
          success: false,  
          message: 'Error al actualizar oportunidades'  
      }); 
  } 
}); 

module.exports = router;