const socketIO = require('socket.io');


function setupSocketIO(server, sessionMiddleware){
    console.log("Socket Setup")
    const io = socketIO(server, {
        cors: {
            origin: 'https://refactored-space-barnacle-q5v997wpr5xh5xv-3000.app.github.dev/',
            methods: ['GET', 'POST'],
            credentials: true
        }
    })
/*
    io.use((socket, next) => {
        const sessionId = socket.handshake.query.sessionId;
        
        if (sessionId) {
            // 세션 ID로 세션 데이터 조회
            const sessionStore = server.get('sessionStore');
            sessionStore.get(sessionId, (err, session) => {
                if (err || !session) {
                    return next(new Error('Authentication error'));
                }
                socket.session = session;
                next();
            });
        } else {
            next(new Error('No session ID'));
        }
    });
    */
    io.use((socket, next) => {
        console.log('Handshake query:', socket.handshake.query);
        next();
    })

    io.on('connection', (socket)=>{
        console.log("연결됨")
        socket.on('message', (msg)=>{
            console.log("메시지 "+ msg)
            socket.emit('response', '서버가 수신함')

        })

        socket.on('error', (err)=>{
            console.error('소켓 에러:', err)
        })
      
        socket.on('disconnect', ()=>{
            console.log('사용자 연결 해제됨')
        })
    })
    
    return io  
}

module.exports = setupSocketIO