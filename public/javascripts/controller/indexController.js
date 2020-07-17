app.controller('indexController' , ['$scope' , 'indexFactory' , ($scope , indexFactory) => {

    const connectionOptions = {
        reconnectionAttempts: 3,
        reconnectionDelay: 500
    }

    indexFactory.connectSocket('http://localhost:3000' , connectionOptions)
        .then((socket) => {
            console.log("Bağlantı Gerçekleşti." , socket);
        }).catch((err) => {
            console.log(err);
        });

}]);