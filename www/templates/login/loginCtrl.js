angular.module('starter.login', [])
    // $ionicModal, $timeout//this is extra right now
    //app.js index.html controller nd its function(not necessary)
    .controller('LoginCtrl', function ($scope, $http, $state, sessionService, $ionicModal, $timeout, Restangular) {
        var vm = this;
        vm.error = '';
        vm.login = login;
        vm.loginBtnText = 'Login';

        function login(form) {
            vm.loginBtnText = 'Login';
            if (form.$invalid) {
                _.forEach(form.$error.required, function (frm) {
                    frm.$setDirty();
                });
                vm.isSubmitted = true;
                return;
            }
            vm.startProcessing = true;
            vm.loginBtnText = 'Loging In...';

            sessionService.login(vm.user).then(function (res) {
                if (res == "error") {
                    vm.error = 'Internal Server Error';
                    vm.startProcessing = false;
                    vm.loginBtnText = 'Login';
                } else
                    if (res == "true") {
                        $state.go('app.home');
                    }
                    else {
                        vm.error = 'Username and/or Password does not match.';
                        vm.startProcessing = false;
                        vm.loginBtnText = 'Login';
                    }
            });
        }



    });
