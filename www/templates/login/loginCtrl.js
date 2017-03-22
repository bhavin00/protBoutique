angular.module('starter.login', [])

.controller('LoginCtrl', function($scope,$state, $ionicModal, $timeout) {
    var vm = this;
    vm.bhavin ="login";
    vm.doLogin = function(){
        $state.go('app.home');
    };
});
