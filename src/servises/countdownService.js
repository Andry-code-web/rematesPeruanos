class CountdownService {
    constructor(io) {
      this.io = io;
      this.countdowns = new Map();
      this.intervals = new Map();
      this.DEFAULT_COUNTDOWN = 30; // 30 segundos por defecto
    }
  
    async startCountdown(room) {
      try {
        if (this.intervals.has(room)) {
          clearInterval(this.intervals.get(room));
        }
  
        // Actualizar estado del remate a 'en_curso'
        await this.updateAuctionStatus(room, 'en_curso');
  
        this.countdowns.set(room, this.DEFAULT_COUNTDOWN);
  
        const interval = setInterval(() => {
          const timeLeft = this.countdowns.get(room);
          
          if (timeLeft <= 0) {
            this.stopCountDown(room);
            this.io.to(room).emit('countdownEnd', { room });
            return;
          }
  
          this.countdowns.set(room, timeLeft - 1);
          this.io.to(room).emit('timeUpdate', {
            room,
            timeLeft: timeLeft - 1
          });
        }, 1000);
  
        this.intervals.set(room, interval);
      } catch (error) {
        console.error('Error al iniciar countdown:', error);
        throw error;
      }
    }
  
    async stopCountDown(room) {
      try {
        if (this.intervals.has(room)) {
          clearInterval(this.intervals.get(room));
          this.intervals.delete(room);
          
          // Actualizar estado del remate a 'finalizado'
          await this.updateAuctionStatus(room, 'finalizado');
        }
        this.countdowns.delete(room);
      } catch (error) {
        console.error('Error al detener countdown:', error);
        throw error;
      }
    }
  
    async updateAuctionStatus(remateId, estado) {
      try {
        const pool = require('../database/db');
        await pool.query('UPDATE remates SET estado = ? WHERE id = ?', [estado, remateId]);
      } catch (error) {
        console.error('Error al actualizar estado del remate:', error);
        throw error;
      }
    }
  
    resetCountDown(room) {
      this.countdowns.set(room, this.DEFAULT_COUNTDOWN);
    }
  
    getTimeLeft(room) {
      return this.countdowns.get(room) || 0;
    }
  
    isRunning(room) {
      return this.intervals.has(room);
    }
  }
  
  module.exports = CountdownService;