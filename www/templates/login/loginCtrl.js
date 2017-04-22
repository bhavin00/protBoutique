angular.module('starter.login', [])
    // $ionicModal, $timeout//this is extra right now
    //app.js index.html controller nd its function(not necessary)
    .controller('LoginCtrl', function ($scope, $http, $state, sessionService, $ionicModal, $timeout, Restangular,$ionicLoading) {
        var vm = this;
        vm.error = '';
        vm.login = login;
        vm.loginBtnText = 'Login';
        //loading show start from here 
        $scope.show = function () {
            $ionicLoading.show({
                // template: '<p>Loading...</p><ion-spinner></ion-spinner>'
                template:'<p>Loading...</p> <ion-spinner icon="lines" class="spinner-calm"></ion-spinner>'
            });
        };

        $scope.hide = function () {
            $ionicLoading.hide();
        };
        //loading show end  here
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
            vm.loginBtnText = 'Login';
            $scope.show($ionicLoading);
            sessionService.login(vm.user).then(function (res) {
                if (res == "error") {
                    vm.error = 'Internal Server Error';
                    vm.startProcessing = false;
                    vm.loginBtnText = 'Login';
                } else
                    if (res == "true") {
                        $scope.hide($ionicLoading);
                        $state.go('app.home');
                    }
                    else {
                        vm.error = 'Username and/or Password does not match.';
                        vm.startProcessing = false;
                        $scope.hide($ionicLoading);
                    }
            });
        }



    });
