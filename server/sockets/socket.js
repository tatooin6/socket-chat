const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');

const usuarios = new Usuarios();
const { crearMensaje } = require('../utils/utilidades');


io.on('connection', (client) => {

    
    client.on('entrarChat', (data, callback) => {
        
        if (!data.nombre || !data.sala) {
            return callback({
                error:true,
                mensaje: 'El nombre/sala es necesario'
            });
        }

        // para unirlo a una sala con nombre del mismo ID
        // nombre sala
        client.join(data.sala);

        // id y nombre
        /* let personas =  */
        usuarios.agregarPersona(client.id, data.nombre, data.sala);

        // cuando una persona entra o sale del chat (a todos)
        // client.broadcast.emit('listaPersonas', usuarios.getPersonas());

        // a una sala de chat, mandandole el nombre de la sala
        client.broadcast.to(data.sala).emit('listaPersonas', usuarios.getPersonasPorSala(data.sala));

        // se retornan todas las personas conectadas al chat
        // callback(personas);

        // se retorna a las personas de la sala unicamente
        callback(usuarios.getPersonasPorSala(data.sala));
    });


    // servidor esta escuchando cuando algun usuario llama a ese metodo de crear mensaje
    /* mandar de consola lo siguiente para personalbar
    socket.emit('crearMensaje',{nombre:'Raul',mensaje:'hola, soy raul?'}); */
    client.on( 'crearMensaje', (data) => {

        let persona = usuarios.getPersona(client.id);

        let mensaje = crearMensaje( persona.nombre, data.mensaje );
        // se manda solamente el mensaje a la sala con .to(persona.sala)
        client.broadcast.to(persona.sala).emit( 'crearMensaje', mensaje );

    });

    client.on('disconnect', () => {
        
        let personaBorrada = usuarios.borrarPersona( client.id );

        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} salió del chat`));
        // para devolver a las personas de todas las salas
        // client.broadcast.to(personaBorrada.sala).emit('listaPersonas', usuarios.getPersonas());

        // para devolver el mensaje del desconectado a las personas en esa sala
        client.broadcast.to(personaBorrada.sala).emit('listaPersonas', usuarios.getPersonasPorSala(personaBorrada.sala));
    });

    // Mensajes Privados
    client.on('mensajePrivado', data => {

        let persona = usuarios.getPersona(client.id);

        // data.para es el id del cliente al que se le quiere mandar el mensaje privado
        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));
    }); 
});