const socketio = require("socket.io");
const io = socketio();

const socketApi = { };
socketApi.io = io;

const users = { };

io.on('connection' , (socket) => {
    console.log("Kullanıcı Bağlandı.");

    socket.on('newUser' , (data) => {
        const defaultData = {               //Varsayılan kullanıcı bilgileri
            id: socket.id,
            position: {
                x: 0,
                y: 0
            }
        }

        const userData = Object.assign(data,defaultData);
        users[socket.id] = userData;
        
        socket.broadcast.emit('newUser' , userData);

    });
});


module.exports = socketApi;