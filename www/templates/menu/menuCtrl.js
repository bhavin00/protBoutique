angular.module('starter.menu', [])

    .controller('MenuCtrl', function ($scope, $state, $ionicModal, $timeout,sessionService,$ionicHistory) {
        var vm = this;
        vm.logout = logout;
        //for group submenu toggles
        $scope.groups = [];
        $scope.groups[0] = {
            name : "Settings",
            items : ["Manage Users", "Manage Order Status","Manage Measurements","Manage Designs","Manage Styles","Manage Material Types"],
            page : ["user","orderstatus", "measurement", "design","style","material"]
        }
      
        $scope.toggleGroup = function (group) {
            if ($scope.isGroupShown(group)) {
                $scope.shownGroup = null;
            } else {
                $scope.shownGroup = group;
            }
        };
        $scope.isGroupShown = function (group) {
            return $scope.shownGroup === group;
        };
        function logout(){
            sessionService.logout();
        }
        //for group submenu toggles
         $scope.clearCache = function(){
            $ionicHistory.clearCache().then(function(){ $state.go('app.stats') })
         }
    });
