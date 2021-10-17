import { io } from "socket.io-client"

const socket = io('http://localhost:3000')

socket.on('connect', () => {
    displayMessage(`You connected with id: ${socket.id}`)
})

socket.emit('custom-event', 10, 'hi', {a: 'a'})