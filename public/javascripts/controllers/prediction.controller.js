angular.module('app.controllers')
    .controller('prediction', ['$scope', 'httpRequest', '$rootScope', '$timeout',
        function ($scope, httpRequest, $rootScope, $timeout) {

            var dishes = [], prediction = [];
            $scope.dishes = [];
            var getData = async function () {

                await httpRequest.get("/api/dishes").then(function (params) {
                    $scope.dishes = params.data;
                    
                }, function () {

                })

                await httpRequest.get("/api/prediction").then(function (params) {
                    prediction = params.data;
                    console.log(prediction);
                }, function () {

                })

                var pHash = prediction.reduce(function (i, pred) {
                    var temp = Object.assign({}, i);
                    temp[pred.dishId] = parseInt(pred.quantity) || 0;
                    return temp;
                }, {})
                
                dishes = $scope.dishes.map(function (dish) {
                    var temp = Object.assign({}, dish);
                    temp.dishId = dish.dishId[0];
                    temp.prediction = pHash[dish.dishId] || 0;
                    return temp;
                })
                $timeout(function () {
                    $scope.dishes = dishes;
                }, 10)
            }
            getData();
            $scope.addPrediction = function (dish) {

                if (!dish.prediction) {
                    alert("The prediction value was incorrect");
                    return;
                }
                return httpRequest.post('/api/prediction', { dishId: dish.dishId, quantity: dish.prediction })
                    .then(function (data) {
                        alert("The prediction for " + dish.name + " was set to " + dish.prediction + " for today");
                    }, function (err) {
                        alert("Some error occured.Try Again");
                    })

            }

        }])