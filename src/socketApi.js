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
        console.log(users);
        socket.broadcast.emit('newUser' , users[socket.id]);

    });

    socket.on('disconnect' , () => {                            //Kullanıcı Ayrıldı.
        socket.broadcast.emit('disUser' , users[socket.id]);
        delete users[socket.id];
        console.log(users);
    });
});


module.exports = socketApi;