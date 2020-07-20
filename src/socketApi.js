const socketio = require("socket.io");
const io = socketio();

const socketApi = { };
socketApi.io = io;

const users = { };

//Helpers
const randomColor = require('../helpers/randomColor');

io.on('connection' , (socket) => {
    console.log("Kullanıcı Bağlandı.");

    socket.on('newUser' , (data) => {
        const defaultData = {               //Varsayılan kullanıcı bilgileri
            id: socket.id,
            position: {
                x: 0,
                y: 0
            },
            color : randomColor()
        }

        const userData = Object.assign(data,defaultData);
        users[socket.id] = userData;

        socket.broadcast.emit('newUser' , users[socket.id]);
        socket.emit('initPLayers' , users);
    });

    socket.on('animate' , (data) => {
        try{
            users[socket.id].position.x = data.x;
            users[socket.id].position.y = data.y;

            socket.broadcast.emit('animate' , {
                socketId: socket.id,
                x: data.x,
                y: data.y
            });
        }catch (e) {
            console.log(e);
        }

    });

    socket.on('newMessage' , (data) => {    //Birinin gönderdiği mesajı alıp herkese gönderme
        console.log(data);
        const messageData = Object.assign({ socketId: socket.id } , data);
        socket.broadcast.emit('newMessage' , messageData);
    });

    socket.on('disconnect' , () => {                            //Kullanıcı Ayrıldı.
        socket.broadcast.emit('disUser' , users[socket.id]);
        delete users[socket.id];

    });
});


module.exports = socketApi;