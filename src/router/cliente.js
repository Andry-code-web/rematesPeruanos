const express = require('express');
const router = express.Router();
require('dotenv').config();

/* RUTA INICIO */
router.get('/', (req, res) =>{
    res.render("inicio");
});

/* RUTA REMATES */
router.get('/remates', (req, res) =>{
    res.render("remates");
});

/* RUTA SUBASTAS */
router.get('/subasta', (req, res) =>{
    res.render("subasta");
});

/* RUTA CONTACTOS */
router.get('/contacto', (req, res) =>{
    res.render("contactos");
});

/* RUTA ADMIN */
router.get('/admin',(req, res) =>{
    res.render("admin");
})

module.exports = router;