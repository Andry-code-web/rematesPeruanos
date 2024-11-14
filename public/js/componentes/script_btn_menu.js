const button = document.getElementById('menu_toggle');
const tablero = document.getElementById('tablero');
let isDragging = false;
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

// Cuando se comienza a arrastrar el botón
button.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - button.offsetLeft;
    offsetY = e.clientY - button.offsetTop;

    // Quitar la transición al arrastrar para hacerlo más fluido
    button.style.transition = 'none';
});

// Cuando se deja de arrastrar el botón
document.addEventListener('mouseup', () => {
    isDragging = false;

    // Encontrar la posición más cercana permitida
    let closestPosition = allowedPositions[0];
    let minDistance = Infinity;
    allowedPositions.forEach(position => {
        const distance = Math.sqrt(Math.pow(button.offsetLeft - position.left, 2) + Math.pow(button.offsetTop - position.top, 2));
        if (distance < minDistance) {
            minDistance = distance;
            closestPosition = position;
        }
    });

    // Aplicar la transición suave al soltar el botón
    button.style.transition = 'left 0.6s cubic-bezier(0.25, 1.5, 0.5, 1), top 1.5s cubic-bezier(0.25, 1.5, 0.5, 1)';
    button.style.left = closestPosition.left + 'px';
    button.style.top = closestPosition.top + 'px';

    // Asegúrate de que el tablero siga la nueva posición del botón
    tablero.style.left = button.offsetLeft + 'px';
    tablero.style.top = button.offsetTop - tablero.offsetHeight + 'px';  // El tablero se coloca encima del botón
});

// Mientras se arrastra el botón
document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        // Calcular la nueva posición
        let newLeft = e.clientX - offsetX;
        let newTop = e.clientY - offsetY;

        // Limitar la posición dentro de los límites de la pantalla
        newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - button.offsetWidth));
        newTop = Math.max(0, Math.min(newTop, window.innerHeight - button.offsetHeight));

        button.style.left = newLeft + 'px';
        button.style.top = newTop + 'px';

        // El tablero sigue la posición del botón
        tablero.style.left = newLeft + 'px';
        tablero.style.top = newTop - tablero.offsetHeight + 'px'; // El tablero se coloca encima del botón
    }
});

// Mostrar o esconder el tablero con un clic en el botón
button.addEventListener('click', function () {
    if (tablero.style.display === 'none' || tablero.style.display === '') {
        tablero.style.display = 'block';  
        tablero.style.opacity = 0;       
        tablero.style.transition = 'opacity 0.5s'; 
        setTimeout(() => {
            tablero.style.opacity = 1;   
        }, 10);
    } else {
        tablero.style.opacity = 0;        
        setTimeout(() => {
            tablero.style.display = 'none';  
        }, 500); 
    }
});
