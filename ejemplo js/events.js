const EventEmitter = require('events')
const emitter = new EventEmitter()

emitter.on('queryDB',(data)=>{
    console.log('Querying database with data:', data)
})

emitter.emit('queryDB',{id:1, name:'John Doe'})

let prueba = {id:1, name:'John Doe'}
console.log(typeof prueba)