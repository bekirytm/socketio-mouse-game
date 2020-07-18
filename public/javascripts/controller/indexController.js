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


            }).catch((err) => {
            console.log(err);
        });

    }

}]);