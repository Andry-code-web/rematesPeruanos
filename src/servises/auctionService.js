const pool = require('../database/db');

class AuctionService {
  static async getUserId(username) {
    try {
      const [rows] = await pool.query('SELECT id FROM usuarios WHERE usuario = ?', [username]);
      return rows.length > 0 ? rows[0].id : null;
    } catch (error) {
      console.error('Error al obtener userId:', error);
      throw error;
    }
  }

  static async getAuctionState(remateId) {
    try {
      const [remate] = await pool.query(`
        SELECT r.*, o.monto_oferta, o.usuarios_id as ultimo_postor
        FROM remates r
        LEFT JOIN ofertas o ON r.id = o.remates_id
        WHERE r.id = ?
        ORDER BY o.fecha_subasta DESC, o.hora_subasta DESC
        LIMIT 1
      `, [remateId]);

      if (remate.length === 0) return null;

      const [ultimoPostor] = await pool.query(
        'SELECT nombres_apellidos FROM usuarios WHERE id = ?',
        [remate[0].ultimo_postor]
      );
      
      return {
        id: remate[0].id,
        precio_actual: remate[0].monto_oferta || remate[0].precios,
        estado: remate[0].estado,
        ultimo_postor: ultimoPostor.length > 0 ? ultimoPostor[0].nombres_apellidos : null,
        categoria: remate[0].categoria,
        ubicacion: remate[0].ubicacion
      };
    } catch (error) {
      console.error('Error al obtener estado de remate:', error);
      throw error;
    }
  }

  static async saveBid(remateId, userId, amount) {
    try {
      const [currentAuction] = await pool.query(
        'SELECT estado, precios FROM remates WHERE id = ?',
        [remateId]
      );
      
      if (currentAuction[0].estado !== 'en_curso') {
        return { success: false, message: 'El remate no está en curso' };
      }

      const [lastBid] = await pool.query(`
        SELECT monto_oferta 
        FROM ofertas 
        WHERE remates_id = ? 
        ORDER BY fecha_subasta DESC, hora_subasta DESC 
        LIMIT 1
      `, [remateId]);

      const minBid = lastBid.length > 0 ? lastBid[0].monto_oferta * 1.05 : currentAuction[0].precios;

      if (amount < minBid) {
        return { success: false, message: 'La oferta debe ser al menos 5% mayor que la anterior' };
      }

      await pool.query(`
        INSERT INTO ofertas (remates_id, usuarios_id, monto_oferta, fecha_subasta, hora_subasta) 
        VALUES (?, ?, ?, CURDATE(), CURTIME())
      `, [remateId, userId, amount]);

      return { success: true };
    } catch (error) {
      console.error('Error al guardar oferta:', error);
      throw error;
    }
  }

  static async endAuction(remateId) {
    try {
      // Obtener la oferta más alta
      const [winner] = await pool.query(`
        SELECT u.nombres_apellidos, o.monto_oferta
        FROM ofertas o
        JOIN usuarios u ON o.usuarios_id = u.id
        WHERE o.remates_id = ?
        ORDER BY o.monto_oferta DESC, o.fecha_subasta ASC, o.hora_subasta ASC
        LIMIT 1
      `, [remateId]);

      if (winner.length > 0) {
        // Actualizar el remate con el ganador y el monto final
        await pool.query(`
          UPDATE remates 
          SET estado = 'finalizado', 
              ganador = ?,
              monto_venta = ?
          WHERE id = ?
        `, [winner[0].nombres_apellidos, winner[0].monto_oferta, remateId]);

        return winner[0];
      } else {
        await pool.query('UPDATE remates SET estado = "finalizado" WHERE id = ?', [remateId]);
        return null;
      }
    } catch (error) {
      console.error('Error al finalizar remate:', error);
      throw error;
    }
  }
}

module.exports = AuctionService;