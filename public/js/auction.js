document.addEventListener('DOMContentLoaded', function() {
  const socket = io();
  const remateId = document.querySelector('[data-remate-id]')?.dataset.remateId;
  
  // Elementos del DOM
  const messageContainer = document.getElementById('messageContainer');
  const lastBidInput = document.getElementById('lastBidInput');
  const customBidInput = document.getElementById('customBidInput');
  const sendLastBidBtn = document.getElementById('sendLastBid');
  const sendCustomBidBtn = document.getElementById('sendCustomBid');
  
  let lastBidAmount = 0;

  // Funciones auxiliares
  function formatCurrency(amount) {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount);
  }

  function scrollToBottom() {
    if (messageContainer) {
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }
  }

  // Manejo de ofertas en estado activo
  const offerForm = document.getElementById('offerForm');
  if (offerForm) {
    offerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const montoOferta = document.getElementById('montoOferta').value;
      
      try {
        const response = await fetch('/api/ofertas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            remateId,
            montoOferta: parseFloat(montoOferta)
          })
        });
        
        if (response.ok) {
          offerForm.reset();
          // Mostrar mensaje de éxito
        } else {
          // Mostrar error
        }
      } catch (error) {
        console.error('Error al enviar oferta:', error);
      }
    });
  }

  // Manejo de pujas en estado en curso
  if (sendLastBidBtn && sendCustomBidBtn) {
    // Actualizar última puja
    socket.on('updateLastBid', (data) => {
      lastBidAmount = data.amount;
      lastBidInput.value = formatCurrency(lastBidAmount + 100);
    });

    // Enviar puja con incremento automático
    sendLastBidBtn.addEventListener('click', () => {
      socket.emit('newBid', {
        remateId,
        amount: lastBidAmount + 100
      });
    });

    // Enviar puja personalizada
    sendCustomBidBtn.addEventListener('click', () => {
      const amount = parseFloat(customBidInput.value);
      if (amount > lastBidAmount) {
        socket.emit('newBid', {
          remateId,
          amount
        });
        customBidInput.value = '';
      }
    });

    // Recibir nuevos mensajes
    socket.on('newMessage', (message) => {
      const messageDiv = document.createElement('div');
      messageDiv.className = `message ${message.isMine ? 'sent' : 'received'}`;
      messageDiv.innerHTML = `
        <p><strong>${message.userName}:</strong> ${formatCurrency(message.amount)}</p>
        <span class="timestamp">${message.timestamp}</span>
      `;
      messageContainer.appendChild(messageDiv);
      scrollToBottom();
    });
  }
});