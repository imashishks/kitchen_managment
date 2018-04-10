var app = angular.module("app", ['ngRoute', 'app.controllers', 'app.services'])


app.config(['$routeProvider', '$locationProvider',
    function ($routeProvider, $locationProvider) {

        $locationProvider.html5Mode(true);

        $routeProvider
            .when('/', {
                templateUrl: 'views/dishes.html',
                controller: 'order'
            })
            .when('/dishes', {
                templateUrl: 'views/dishes.html',
                controller: 'order'
            })
            .when('/orders', {
                templateUrl: 'views/orders.html',
                controller: 'displayOrders'
            })
            .when('/report', {
                templateUrl: 'views/report.html',
                controller: 'report'
            })
            .when('/prediction', {
                templateUrl: 'views/prediction.html',
                controller: 'prediction'
            })
            .otherwise({ redirectTo: '/dishes' })
    }
])
    .factory("socket", socketSvc)

socketSvc.$inject = ['$window'];

function socketSvc($window) {
    return $window.socket
}