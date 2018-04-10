angular.module('app.controllers')
    .controller('order', ['$scope', 'httpRequest', '$rootScope', function ($scope, httpRequest, $rootScope) {
        httpRequest.get("/api/dishes").then(function (params) {
            $scope.dishes = params.data;

        }, function () {

        })

        $scope.addDish = function (dish, t) {
            $rootScope.dishList[dish.dishId] = t.count;
            if (!t.count) {
                delete $rootScope.dishList[dish.dishId];
            }

            $rootScope.dishCount = Object.keys($rootScope.dishList).reduce(function (inVal, key) {
                return inVal + $rootScope.dishList[key];
            }, 0);


        }

    }])