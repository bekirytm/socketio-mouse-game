app.controller('indexController' , ['$scope' , 'indexFactory' , ($scope , indexFactory) => {

    $scope.messages = [ ];
    $scope.players = { };

    $scope.init = () => {       //kullanıcıdan isim alma ve bağlantıyı sağlama
        const username = prompt('please enter username');

        if(username){
            initSocket(username);
        }else{
            return false;
        }
    }

    function scrollTop() {
        setTimeout(() => {
            const element = document.getElementById('chat-area');
            element.scrollTop = element.scrollHeight;
        });
    }

    function showBubble(id, message) {
        $('#' + id).find('.message').show().html(message);

        setTimeout(() => {
            $('#' + id).find('.message').hide();
        }, 2000);
    }

    function initSocket(username) {

        const connectionOptions = {
            reconnectionAttempts: 3,
            reconnectionDelay: 500
        }

        indexFactory.connectSocket('http://localhost:3000' , connectionOptions)
            .then((socket) => {
                socket.emit('newUser' , { username });

                socket.on('initPLayers' , (players) => {        //Kişi pozisyonu
                    $scope.players = players;
                    $scope.$apply();
                    console.log(players);
                });

                socket.on('newUser' , (data) => {
                    const messageData = {
                        type: {
                            code: 0,        //server or user message
                            message:1       //login or disconnect message
                        },
                        username: data.username
                    };
                    $scope.messages.push(messageData);
                    $scope.players[data.id] = data;
                    $scope.$apply();
                });

                socket.on('disUser' , (data) => {
                    const messageData = {
                        type: {
                            code: 0,
                            message: 0
                        },
                        username: data.username
                    };
                    $scope.messages.push(messageData);
                    delete $scope.players[data.id];
                    $scope.$apply();

                });

                socket.on('animate' , (data) => {
                    console.log(data);
                    $('#' + data.socketId).animate({'left': data.x, 'top': data.y}, () => {
                        animate = false;
                    });
                });

                //Animasyon İşlemi
                let animate = false;
                $scope.onClickPlayer = ($event) => {
                    let x = $event.offsetX;
                    let y = $event.offsetY;

                    socket.emit('animate' , { x, y });

                    if(!animate){
                        animate = true;
                        $('#' + socket.id).animate({'left': x, 'top': y}, () => {
                            animate = false;
                        });
                    }
                };

                //Chat Sistemi
                $scope.newMessage = () => {
                    let message = $scope.message;
                    const messageData = {
                        type: {
                            code: 1,        //server or user message
                        },
                        username: username,
                        text : message
                    };
                    $scope.messages.push(messageData);
                    $scope.message = '';
                    socket.emit('newMessage' , messageData);    //Mesajı server'a gönderme

                    showBubble(socket.id, message);
                    scrollTop();
                }

                socket.on('newMessage' , (data) => {    //Mesajı herkese gönderme gösterme
                    $scope.messages.push(data);
                    $scope.$apply();

                    showBubble(data.socketId , data.text);
                    scrollTop();
                });


            }).catch((err) => {
            console.log(err);
        });

    }

}]);