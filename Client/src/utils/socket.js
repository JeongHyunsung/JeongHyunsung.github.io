import io from 'socket.io-client';

let socket

export const initializeSocket = ()=>{
    if(!socket){
        socket = io('/', {withCredentials: true, secure: true})
    }
    socket.on('connect', ()=>{
        console.log('Connected')
    })
    socket.on('reconnect_attempt', () => {
        console.log('Attempting to reconnect...');
    })
    socket.on('disconnect', ()=>{
        console.log('Disconnected')
    })
}

export const getSocket = ()=> socket

export const disconnectSocket = ()=>{
    if(socket){
        socket.disconnect()
        socket = null
    }
}

