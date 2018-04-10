angular.module('app.services')
    .factory('httpRequest', ["$http", function ($http) {
        this.get = function (url) {
            return $http({
                url: url,
                method: "GET"
            })
        }
        this.post = function (url, body) {
            return $http({
                url: url,
                method: "POST",
                data: body,
            })
        }
        this.patch = function (url, body) {
            return $http({
                url: url,
                method: "PATCH",
                data: body,
            })
        }
        return this;
    }])
