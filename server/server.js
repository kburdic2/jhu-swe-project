const io = require('socket.io')(3000, {
    cors:{
        origin: ['htpp://localhost:8080']
    }
})

io.on("connection", socket => {
    console.log(socket.id)
    socket.on('custom-event', (number, string, obj) => {
        console.log(number, string, obj)
    })
})

