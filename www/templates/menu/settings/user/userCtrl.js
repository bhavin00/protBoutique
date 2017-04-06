angular.module('starter.user', [])
    .controller('UserCtrl', function ($scope, $state, $ionicModal, $stateParams, $timeout, Restangular) {
//for modal

        $ionicModal.fromTemplateUrl('user.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        });
        $scope.openModal = function () {
            $scope.modal.show();
        };
        $scope.closeModal = function () {
            $scope.modal.hide();
        };
        // Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function () {
            $scope.modal.remove();
        });
        // Execute action on hide modal
        $scope.$on('modal.hidden', function () {
            // Execute action
        });
        // Execute action on remove modal
        $scope.$on('modal.removed', function () {
            // Execute action
        });
        
//for modal

        var vm = this;
        // vm.currentUser = Authentication.user;
        vm.list = [];
        vm.save = save;
        vm.edit = edit;
        vm.user = {
            isActive: true
        }
        vm.search = search;
        vm.order = order;
        vm.pageChange = pageChange;
        vm.resetPassword = resetPassword;
        vm.options = {
            pagesize: 10,
            totalItems: 0,
            page: 1,
            search: ''
        }
        vm.getList = getList;
        vm.resetUser = resetUser;
        if ($stateParams.id && $stateParams.id != 'new') {
            Restangular.one('api/user/' + $stateParams.id).get().then(function (res) {
                vm.user = res.data;
            }, function (err) {
                console.log(err);
                vm.error = err.data.message;
            });
        }

        function edit(obj) {
            $state.go('secure.setting.edit-user', { id: obj.id });
        }

        function resetUser(obj) {
            $state.go('secure.setting.reset-user', { id: obj.id });
        }

        function resetPassword(form) {
            vm.error = '';
            if (form.$invalid || vm.user1.password != vm.confirmPassword) {
                _.forEach(form.$error, function (err) {
                    _.forEach(err, function (frm) {
                        frm.$setDirty();
                    });
                });
                vm.isSubmitted = true;
                return;
            }
            vm.startProcessing = true;
            Restangular.one('api/user/' + vm.user.id + '/reset').patch(vm.user1).then(function (res) {
                // SweetAlert.swal("Password reset successfully!");
                $state.go('app.user');
            }, function (err) {
                console.log(err);
                vm.error = err.data.message;
                vm.startProcessing = false;
            });

        }

        function save(form) {
            vm.error = '';
            if (form.$invalid) {
                _.forEach(form.$error, function (err) {
                    _.forEach(err, function (frm) {
                        frm.$setDirty();
                    });
                });
                vm.isSubmitted = true;
                return;
            }
            vm.startProcessing = true;
            if (!vm.user.id) {
                if (vm.user.password != vm.confirmPassword) {
                    vm.startProcessing = false;
                    return true;
                }
                Restangular.all('api/user').post(vm.user).then(function (res) {
                    // SweetAlert.swal("User saved successfully!");
                    $state.go('app.user');
                }, function (err) {
                    console.log(err);
                    vm.error = err.data.message;
                    vm.startProcessing = false;
                });
            }
            else {
                Restangular.one('api/user/' + vm.user.id).patch(vm.user).then(function (res) {
                    // SweetAlert.swal("User updated successfully!");
                    $state.go('app.user');
                }, function (err) {
                    console.log(err);
                    vm.error = err.data.message;
                    vm.startProcessing = false;
                });
            }
        }

        function getList() {
            Restangular.all('api/user').getList(vm.options).then(function (res) {
                vm.list = res.data;
                vm.options.totalItems = parseInt(res.headers('total'));
            }, function (err) {
                console.log(err);
                vm.error = err.data.message;
            });
        }

        function pageChange() {
            getList();
        }
        function search() {
            vm.options.page = 1;
            vm.options.where = 'fullname;$like|s|%' + vm.options.search + '%';
            getList();
        }

        function order(col, ord) {
            if (vm.asc != undefined) {
                var cp = angular.copy(vm.asc[col]);
                vm.asc = {};
                vm.asc[col] = !cp;
            } else {
                vm.asc = {};
                vm.asc[col] = !vm.asc[col];
            }
            var ascL = vm.asc[col] ? 'asc' : 'desc';
            vm.options.sort = col + ' ' + ascL;
            vm.options.page = 1;
            getList();
        }
    });
