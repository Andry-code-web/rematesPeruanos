const pool = require('../database/db');

const obtenerSubasta = async (id) => {
    const [result] = await pool.query('SELECT * FROM remates WHERE id = ?', [id]);
    return result[0];
};

const obtenerTotalVisitas = async (id) => {
    const [result] = await pool.query(
        'SELECT COUNT(*) as total FROM visitas WHERE remate_id = ?',
        [id]
    );
    return result[0].total;
};

const obtenerUltimaOferta = async (id) => {
    const [result] = await pool.query(
        'SELECT monto_oferta FROM ofertas WHERE remates_id = ? ORDER BY id DESC LIMIT 1',
        [id]
    );
    return result[0]?.monto_oferta;
};

module.exports = {
    obtenerSubasta,
    obtenerTotalVisitas,
    obtenerUltimaOferta
};