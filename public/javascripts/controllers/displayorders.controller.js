angular.module('app.controllers')
    .controller('displayOrders', ["$scope", "httpRequest", 'socket', '$timeout', function ($scope, httpRequest, socket, $timeout) {
        httpRequest.get("/api/orders").then(function (params) {
            $scope.orders = params.data;
            console.log(params);

        }, function () {
        })

        socket.on('updateDisplay', function (data) {

            $timeout(function () {
                console.log(data);
                $scope.orders = data;
            }, 10);
        })

        socket.on('error1', function (data) {
            alert("err");
        })

        $scope.changeStatus = function (kitchenId) {

            socket.emit("updateOrder", kitchenId)



            // httpRequest.patch("/api/orders/" + kitchenId, { status: true }).then(function (data) {
            //     console.log(data);
            // }, function (error) {

            // })
        }
    }])