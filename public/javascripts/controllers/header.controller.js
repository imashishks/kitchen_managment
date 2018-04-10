angular.module('app.controllers')
    .controller('header', ["$scope", "$rootScope", "httpRequest","$location", function ($scope, $rootScope, httpRequest,$location) {
        $rootScope.dishCount = 0;
        $rootScope.dishList = {};
        $rootScope.placeOrder = function () {
            if (!Object.keys($rootScope.dishList).length) {

                alert("Select your food Items");
                return;
            }
            var dishList = Object.keys($rootScope.dishList).map(function (key) {
                return {
                    dishId: key,
                    quantity: $rootScope.dishList[key]
                }
            })

            httpRequest.post("/api/orders", dishList).then(function (data) {
                alert("Your order has been placed successfully");
                window.location.reload();
                //Reseting the orders
                $rootScope.dishList = {};
                $rootScope.dishCount = 0;
            }, function (err) {
                $rootScope.notification = "Some error occured";
                alert("Some error occured");
            })

        }
        $rootScope.$on('$routeChangeSuccess', function(e, current, pre) {
            
            if($location.path()=="/dishes" || $location.path()== "/"){
                $scope.showCart=true;
                return;
            }
                $scope.showCart=false;
            
          });
    }])