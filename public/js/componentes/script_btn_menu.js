const button = document.getElementById('menu_toggle');
const tablero = document.getElementById('tablero');
const closeButton = document.getElementById('close_button'); // Botón de cierre flotante
const textButton = button.querySelector('.text_buton');

let isTableroVisible = false;
let isDragging = false;
let wasDragging = false; // Nueva bandera para diferenciar clic y arrastre
let offsetX, offsetY;

// Definimos solo las posiciones permitidas en los costados y abajo 
const allowedPositions = [
    { left: 20, top: (window.innerHeight - button.offsetHeight) / 2 }, // Lado izquierdo 
    { left: window.innerWidth - button.offsetWidth - 20, top: (window.innerHeight - button.offsetHeight) / 2 }, // Lado derecho 
    { left: (window.innerWidth - button.offsetWidth) / 2, top: window.innerHeight - button.offsetHeight - 30 } // Centro inferior
];

// Posición inicial en el centro inferior 
let currentPosition = allowedPositions[2];
button.style.left = currentPosition.left + 'px';
button.style.top = currentPosition.top + 'px';

// Posiciona el tablero en función de la posición del botón
function positionTablero() {
    const buttonRect = button.getBoundingClientRect();
    const tableroWidth = tablero.offsetWidth;
    const tableroHeight = tablero.offsetHeight;

    if (buttonRect.left < window.innerWidth / 3) {
        tablero.style.left = buttonRect.right + 10 + 'px';
        tablero.style.top = buttonRect.top + (buttonRect.height / 2) - (tableroHeight / 2) + 'px';
    } else if (buttonRect.left > (window.innerWidth * 2) / 3) {
        tablero.style.left = buttonRect.left - tableroWidth - 10 + 'px';
        tablero.style.top = buttonRect.top + (buttonRect.height / 2) - (tableroHeight / 2) + 'px';
    } else {
        tablero.style.left = buttonRect.left + (buttonRect.width / 2) - (tableroWidth / 2) + 'px';
        tablero.style.top = buttonRect.top - tableroHeight - 10 + 'px';
    }

    tablero.style.transition = 'all 0.3s ease';
}

// Mostrar u ocultar el tablero con clic
button.addEventListener('click', function () {
    if (wasDragging) {
        wasDragging = false;
        return;
    }
    isTableroVisible = !isTableroVisible;
    tablero.style.display = isTableroVisible ? 'block' : 'none';
    textButton.textContent = isTableroVisible ? 'CLOSE' : 'MENU';

    if (isTableroVisible) {
        positionTablero();
    } else {
        closeButton.style.display = 'none'; // Oculta el botón de cierre cuando se cierra el tablero
    }
});

// Cuando se comienza a arrastrar el botón
button.addEventListener('mousedown', (e) => {
    isDragging = true;
    wasDragging = false;
    offsetX = e.clientX - button.offsetLeft;
    offsetY = e.clientY - button.offsetTop;
    button.style.transition = 'none';
});

// Mientras se arrastra el botón
document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        let newLeft = e.clientX - offsetX;
        let newTop = e.clientY - offsetY;

        newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - button.offsetWidth));
        newTop = Math.max(0, Math.min(newTop, window.innerHeight - button.offsetHeight));

        button.style.left = newLeft + 'px';
        button.style.top = newTop + 'px';
        wasDragging = true;
    }
});

// Cuando se deja de arrastrar el botón
document.addEventListener('mouseup', () => {
    if (isDragging) {
        isDragging = false;

        let closestPosition = allowedPositions[0];
        let minDistance = Infinity;
        allowedPositions.forEach(position => {
            const distance = Math.sqrt(Math.pow(button.offsetLeft - position.left, 2) + Math.pow(button.offsetTop - position.top, 2));
            if (distance < minDistance) {
                minDistance = distance;
                closestPosition = position;
            }
        });

        button.style.transition = 'left 1.2s cubic-bezier(0.25, 1.5, 0.5, 1), top 1.2s cubic-bezier(0.25, 1.5, 0.5, 1)';
        button.style.left = closestPosition.left + 'px';
        button.style.top = closestPosition.top + 'px';
    }
});

// Mostrar el botón de cierre flotante cuando el mouse esté fuera del tablero
document.addEventListener('mousemove', (e) => {
    if (isTableroVisible) {
        const tableroRect = tablero.getBoundingClientRect();
        if (
            e.clientX < tableroRect.left || 
            e.clientX > tableroRect.right || 
            e.clientY < tableroRect.top || 
            e.clientY > tableroRect.bottom
        ) {
            closeButton.style.display = 'block';
            closeButton.style.left = e.clientX + 'px';
            closeButton.style.top = e.clientY + 'px';
        } else {
            closeButton.style.display = 'none';
        }
    }
});

// Cerrar el tablero cuando el botón de cierre flotante sea clickeado
closeButton.addEventListener('click', () => {
    isTableroVisible = false;
    tablero.style.display = 'none';
    textButton.textContent = 'MENU';
    closeButton.style.display = 'none'; // Ocultar el botón de cierre flotante después de cerrar el tablero
});
