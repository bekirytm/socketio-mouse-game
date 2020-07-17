app.controller('indexController' , ['$scope' , 'indexFactory' , ($scope , indexFactory) => {

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
            }).catch((err) => {
            console.log(err);
        });

    }

}]);