const determinarEstadoSubasta = (fechaActivacion, fechaRemate, horaRemate) => {
    const now = new Date();
    const fechaActivacionDate = new Date(fechaActivacion);
    const fechaRemateDate = new Date(fechaRemate);
    fechaRemateDate.setHours(horaRemate.split(':')[0], horaRemate.split(':')[1], 0);

    let estaEnCurso = false;
    let estaTerminada = false;
    let estaActiva = false;

    if (now >= fechaActivacionDate && now < fechaRemateDate) {
        estaActiva = true;
    } else if (now >= fechaRemateDate) {
        estaTerminada = true;
    } else {
        estaEnCurso = true;
    }

    return {
        estaEnCurso,
        estaTerminada,
        estaActiva
    };
};

const formatearNumero = (num) => {
    return new Intl.NumberFormat('es-PE').format(num);
};

const formatearFecha = (fecha) => {
    if (!fecha) return '';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-PE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const formatearHora = (hora) => {
    if (!hora) return '';
    const [hours, minutes] = hora.split(':');
    return new Date(0, 0, 0, hours, minutes).toLocaleTimeString('es-PE', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
};

module.exports = {
    determinarEstadoSubasta,
    formatearNumero,
    formatearFecha,
    formatearHora
};