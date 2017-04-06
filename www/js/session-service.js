(function () {

    angular.module('starter')
        .service('sessionService', SessionService);

    SessionService.$inject = ['$q', '$http', '$rootScope', 'Restangular', '$state'];

    function SessionService($q, $http, $rootScope, Restangular, $state) {
        var m = {
            login: login,
            isAuthenticated: isAuthenticated,
            logout: logout
        }
        function login(data) {
            var deferred = $q.defer();

            Restangular.all('signin').post(data).then(function (res) {
                if (res.data.message) {
                    deferred.resolve("false");
                } else {
                    localStorage.setItem('authId', res.data.id);
                    localStorage.setItem('authUsername', res.data.username);
                    deferred.resolve("true");
                }
            }, function (err) {
                deferred.resolve("error");
            });
            return deferred.promise;
        }



        function isAuthenticated() {
            if (localStorage.getItem("authId")) {
                return true;
            }
        };
        function logout() {
            localStorage.removeItem('authId');
            localStorage.removeItem('authUsername');
            $state.go('login');
        }
        return m;
    }
})();
