angular.module('starter.customer', [])
    .controller('CustomerCtrl', function (Restangular, $scope, $state, $ionicModal, $timeout, $stateParams, $ionicHistory, $ionicLoading) {
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
        vm.list = [];
        vm.save = save;
        vm.edit = edit;
        vm.getList = getList;
        vm.activate = activate;
        vm.search = search;
        vm.order = order;
        vm.pageChange = pageChange;
        vm.orderDetail = orderDetail;
        vm.options = {
            pagesize: 15,
            totalItems: 0,
            page: 1,
            search: ''
        }
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
        vm.today = new Date();
        //vm.getMeasurementList = getMeasurementList;

        function edit(obj) {
            $state.go('app.edit-customer', {
                id: obj.id
            });
        }

        function orderDetail(obj) {
            $state.go('app.customer-order-detail', {
                customerId: obj.id
            });
        }

        function save(form) {
            if (form.$invalid) {
                _.forEach(form.$error.required, function (frm) {
                    frm.$setDirty();
                });
                vm.isSubmitted = true;
                return;
            }
            vm.startProcessing = true;
            $scope.show($ionicLoading);
            if (!vm.customer.id) {
                Restangular.all('api/customer').post(vm.customer).then(function (res) {
                    // SweetAlert.swal("Customer saved successfully!");
                    $ionicHistory.clearCache().then(function () { $state.go('app.customer') })
                }, function (err) {
                    console.log(err);
                    vm.error = err.data.message;
                    vm.startProcessing = false;
                    $scope.hide($ionicLoading);
                });
            } else {
                Restangular.one('api/customer/' + vm.customer.id).patch(vm.customer).then(function (res) {
                    // SweetAlert.swal("Customer updated successfully!");
                    $ionicHistory.clearCache().then(function () { $state.go('app.customer') })
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
            Restangular.all('api/customer').getList(vm.options).then(function (res) {
                // vm.lists = [];
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
        //function getMeasurementList() {
        //    Restangular.all('api/measurement').getList().then(function (res) {
        //        vm.mesaurements = res;
        //        vm.mesaurements = _.filter(vm.mesaurements, ['isActive', true]);
        //    });
        //}


        function pageChange() {
            getList();
        }

        function search() {
            vm.options.search = vm.options.search;
            vm.options.page = 1;
            vm.lists = [];
            vm.options.where = 'name;$like|s|%' + vm.options.search + '%';
            getList();
        }

        function order(col, ord) {

            vm.asc = !vm.asc;
            var ascL = vm.asc ? 'asc' : 'desc';
            vm.options.sort = col + ' ' + ascL;
            vm.options.page = 1;
            getList();
        }

        function activate() {
            Restangular.all('api/measurement').getList().then(function (res) {
                vm.mesaurements = res.data;
                vm.customer = {
                    CustomerMeasurements: []
                };
                var arr = [];
                _.forEach(vm.mesaurements, function (msr) {
                    if (msr.isActive) {
                        arr.push({
                            val: '',
                            MeasurementId: msr.id,
                            Measurement: msr
                        });
                    }
                });
                if ($stateParams.id != 'new') {
                    Restangular.one('api/customer/' + $stateParams.id).get().then(function (res) {
                        vm.customer = res.data;
                        console.log(res.data);
                        vm.customer.dob = new Date(vm.customer.dob);
                        vm.customer.annerversary = new Date(vm.customer.annerversary);

                        _.forEach(arr, function (msr) {
                            //check for value for user
                            var chk = _.find(vm.customer.CustomerMeasurements, ['MeasurementId', msr.MeasurementId]);
                            if (chk) {
                                msr.val = chk.val;
                            }
                        });
                        vm.customer.CustomerMeasurements = vm.customer.CustomerMeasurements || [];
                        vm.customer.CustomerMeasurements = arr;
                    });
                } else {
                    vm.customer.CustomerMeasurements = arr;
                }

            });


        }
    });
