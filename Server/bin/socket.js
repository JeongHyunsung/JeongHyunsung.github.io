const socketIO = require('socket.io');
const { postMessage } = require('../main/routes/utils/dbutils')

const socketIdToUserId = new Map()
const userIdToSocketId = new Map()

async function setupSocketIO(server, sessionMiddleware){
    console.log("Socket Setup")
    const io = socketIO(server, {
        cors: {
            origin: 'https://refactored-space-barnacle-q5v997wpr5xh5xv-3000.app.github.dev',
            methods: ['GET', 'POST'],
            credentials: true
        }
    })

    io.use((socket, next) => {
        sessionMiddleware(socket.request, socket.request.res || {}, next) // socket-request 에 세션이 할당됨 
    })
    io.use((socket, next) => {
        const sessionId = socket.request.sessionID
        const sessionStore = socket.request.sessionStore
        
        if (sessionId) {
            // 세션 ID로 세션 데이터 조회
            sessionStore.get(sessionId, (err, session) => {
                if (err || !session) {
                    return next(new Error('Authentication error'));
                }
                socket.session = session;
                socketIdToUserId.set(socket.id, session.userId)
                userIdToSocketId.set(session.userId, socket.id)
                next();
            });
        } else {
            next(new Error('No session ID'));
        }
    });

    io.on('connection', (socket)=>{
        console.log("연결됨")
        socket.on('message', async (msg)=>{
            if(msg.uid_sender != socket.session.userId){ 
                throw new Error("Critical Error")
            }
            try{
                if(msg.uid_recipient === 0){
                    msg.uid_recipient = parseInt(process.env.ADMIN_UID, 10)
                }
                
                const {mid, created_at} = await postMessage(msg) 
                const recipientSocketId = userIdToSocketId.get(msg.uid_recipient)
                if (recipientSocketId){
                    io.to(recipientSocketId).emit('message', {...msg, mid: mid, created_at: created_at})
                }
                if (!recipientSocketId || recipientSocketId != socket.id){
                    io.to(socket.id).emit('message', {...msg, mid: mid, created_at: created_at})
                    console.log("EMIT")
                }
                
            }catch(error){
                console.error("Error fetching admin UID")
            }
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