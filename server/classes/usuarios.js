class Usuarios {
    constructor() {
        this.personas = [];
    }

    agregarPersona(id, nombre, sala) {
        // otra forma de decir que se creara un objeto con id: id y nombre: nombre
        let persona = { id, nombre, sala };
    
        this.personas.push(persona);

        return this.personas;
    }

    getPersona(id) {
        // filter devuelve siempre un arreglo por eso se coloca el [0] primera posicion
        let persona = this.personas.filter(persona => persona.id === id)[0];

        // si encuentra persona entonces sera de forma object si no undefined  
        return persona;
    }

    getPersonas() {
        return this.personas;
    }

    getPersonasPorSala(sala) {
        let personasEnSala = this.personas.filter(persona => persona.sala === sala);
        return personasEnSala;
    }

    borrarPersona(id) {

        let personaBorrada = this.getPersona(id);

        this.personas = this.personas.filter(persona => persona.id != id);

        return personaBorrada;
    }
}

module.exports = {
    Usuarios
}