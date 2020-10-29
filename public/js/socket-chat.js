var socket = io();

var params =  new URLSearchParams(window.location.search);
if (!params.has('nombre') || !params.has('sala')) {
    window.location = 'index.html'; 
    throw new Error('El nombre y sala son necesarios');
}

var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
}

socket.on('connect', function() {
    console.log('Conectado al servidor');

    // para que el servidor sepa quien se conecto al chat
    // nombre evento, data que se manda, callback aceptado
    socket.emit('entrarChat', usuario, function( resp ) {
        // respuesta usuarios conectados
        console.log('Usuarios conectados', resp);

    });

});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});

// Enviar información
/* socket.emit('crearMensaje', {
    usuario: 'Fernando',
    mensaje: 'Hola Mundo'
}, function(resp) {
    console.log('respuesta server: ', resp);
}); */

// Escuchar información
socket.on('crearMensaje', function(mensaje) {

    console.log('Servidor:', mensaje);

});

// escuchar cambios de usuarios cuando uno entra o sale del chat
socket.on('listaPersonas', function(personas){
    console.log(personas);
});


// Mensajes Privados
socket.on('mensajePrivado', function(mensaje) {
    console.log(`Mensaje Privado: `, mensaje);
});