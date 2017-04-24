angular.module('starter.user', [])
    .controller('UserCtrl', function ($scope, $state, $ionicModal, $stateParams, $timeout, Restangular, sessionService, $ionicHistory, $ionicLoading) {
        var vm = this;
        vm.inProcess = true;
        $scope.loadMore = function () {
            if (!vm.stopload) {
                vm.options.page++;
                console.log(vm.options.page)
                pageChange();
                $scope.$broadcast('scroll.infiniteScrollComplete');
            } else {
                if (vm.stopload > vm.options.page) {
                    vm.options.page++;
                    console.log(vm.options.page)
                    pageChange();
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }
            }
            if (vm.list.length == 0) {
                vm.stopload = vm.options.page;
                $scope.$broadcast('scroll.infiniteScrollComplete');
                return;
            }
        }
        vm.currentUser = sessionService.getDATA();
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
            pagesize: 15,
            totalItems: 0,
            page: 1,
            search: ''
        }
        vm.getList = getList;
        vm.resetUser = resetUser;
        //loading show start from here 
        $scope.show = function () {
            $ionicLoading.show({
                // template: '<p>Loading...</p><ion-spinner></ion-spinner>'
                template: '<p>Loading...</p> <ion-spinner icon="lines" class="spinner-calm"></ion-spinner>'
            });
        };

        $scope.hide = function () {
            $ionicLoading.hide();
        };
        //loading show end  here 

        if ($stateParams.id && $stateParams.id != 'new') {
            Restangular.one('api/user/' + $stateParams.id).get().then(function (res) {
                vm.user = res.data;
            }, function (err) {
                console.log(err);
                vm.error = err.data.message;
            });
        }

        function edit(obj) {
            $state.go('app.edit-user', { id: obj.id });
        }

        function resetUser(obj) {
            $state.go('app.reset-user', { id: obj.id });
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
            $scope.show($ionicLoading);
            Restangular.one('api/user/' + vm.user.id + '/reset').patch(vm.user1).then(function (res) {
                // SweetAlert.swal("Password reset successfully!");
                $ionicHistory.clearCache().then(function () { $state.go('app.user') })
            }, function (err) {
                console.log(err);
                vm.error = err.data.message;
                vm.startProcessing = false;
                $scope.hide($ionicLoading);
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
            $scope.show($ionicLoading);
            if (!vm.user.id) {
                if (vm.user.password != vm.confirmPassword) {
                    vm.startProcessing = false;
                    $scope.hide($ionicLoading);
                    return true;
                }
                Restangular.all('api/user').post(vm.user).then(function (res) {
                    // SweetAlert.swal("User saved successfully!");
                    $ionicHistory.clearCache().then(function () { $state.go('app.user') })
                }, function (err) {
                    console.log(err);
                    vm.error = err.data.message;
                    vm.startProcessing = false;
                    $scope.hide($ionicLoading);
                });
            }
            else {
                Restangular.one('api/user/' + vm.user.id).patch(vm.user).then(function (res) {
                    // SweetAlert.swal("User updated successfully!");
                    $ionicHistory.clearCache().then(function () { $state.go('app.user') })
                }, function (err) {
                    console.log(err);
                    vm.error = err.data.message;
                    vm.startProcessing = false;
                    $scope.hide($ionicLoading);
                });
            }
        }
        vm.lists = [];
        function getList() {
            vm.inProcess = true;
            $scope.show($ionicLoading);
            Restangular.all('api/user').getList(vm.options).then(function (res) {
                vm.lists = [];
                vm.list = Restangular.stripRestangular(res.data);
                // var temp = angular.copy(vm.list);
                Array.prototype.pushArray = function () {
                    this.push.apply(this, this.concat.apply([], arguments));
                };
                vm.lists.pushArray(vm.list);
                console.log(vm.list);
                console.log(vm.lists);
                vm.options.totalItems = parseInt(res.headers('total'));
                $scope.hide($ionicLoading);
                vm.inProcess = false;
            });
        }

        function pageChange() {
            getList();
        }
        function search() {
                vm.options.page = 1;
                vm.lists = [];
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
