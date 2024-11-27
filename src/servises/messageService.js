const pool = require('../database/db');

class MessageService {
  static async saveMessage(remateId, userId, message, monto) {
    try {
      const [result] = await pool.query(`
        INSERT INTO mensajes (remates_id, usuarios_id, ofertas_subasta, monto)
        VALUES (?, ?, ?, ?)
      `, [remateId, userId, message, monto]);

      return result.insertId;
    } catch (error) {
      console.error('Error al guardar mensaje:', error);
      throw error;
    }
  }

  static async getMessages(remateId) {
    try {
      const [messages] = await pool.query(`
        SELECT m.*, u.nombres_apellidos as usuario_nombre
        FROM mensajes m
        JOIN usuarios u ON m.usuarios_id = u.id
        WHERE m.remates_id = ?
        ORDER BY m.id ASC
      `, [remateId]);

      return messages;
    } catch (error) {
      console.error('Error al obtener mensajes:', error);
      throw error;
    }
  }
}

module.exports = MessageService;