angular.module('starter.design', [])
    .controller('DesignCtrl', function ($scope, $state, $ionicModal, $stateParams, $timeout, Restangular, $ionicHistory, $ionicLoading) {
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
        vm.getMeasurementList = getMeasurementList;
        vm.addInDesignMeasurement = addInDesignMeasurement;
        vm.getCommaSeperatedMeasurement = getCommaSeperatedMeasurement;
        vm.deleteDesignMeasurement = deleteDesignMeasurement;
        vm.design = {
            DesignMeasurements: [],
            isActive: true
        };

        vm.search = search;
        vm.searching = false;
        vm.order = order;
        vm.pageChange = pageChange;
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
                template: '<p>Loading...</p>  <ion-spinner icon="lines" class="spinner-calm"></ion-spinner>'
            });
        };

        $scope.hide = function () {
            $ionicLoading.hide();
        };
        //loading show end  here 
        if ($stateParams.id && $stateParams.id != 'new') {
            Restangular.one('api/design/' + $stateParams.id).get().then(function (res) {
                vm.design = res.data;
            }, function (err) {
                console.log(err);
                vm.error = err.data.message;
            });
        }

        function edit(obj) {
            $state.go('app.edit-design', { id: obj.id });
        }

        function save(form) {
            if (form.$invalid || vm.design.DesignMeasurements.length == 0) {
                _.forEach(form.$error.required, function (frm) {
                    frm.$setDirty();
                });
                vm.isSubmitted = true;
                return;
            }
            $scope.show($ionicLoading);
            if (!vm.design.id) {
                Restangular.all('api/design').post(vm.design).then(function (res) {
                    $scope.hide($ionicLoading);
                    $ionicHistory.clearCache().then(function () { $state.go('app.design') })
                }, function (err) {
                    console.log(err);
                    vm.error = err.data.message;
                    vm.startProcessing = false;
                });
            }
            else {
                Restangular.one('api/design/' + vm.design.id).patch(vm.design).then(function (res) {
                    $scope.hide($ionicLoading);
                    $ionicHistory.clearCache().then(function () { $state.go('app.design') })
                }, function (err) {
                    console.log(err);
                    vm.error = err.data.message;
                    vm.startProcessing = false;
                });
            }
        }

        vm.lists = [];
        function getList() {
            vm.inProcess = true;
            $scope.show($ionicLoading);
            vm.searching = true;
            Restangular.all('api/design').getList(vm.options).then(function (res) {
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
                vm.searching = false;
            });
        }

        function getMeasurementList() {
            Restangular.all('api/measurement').getList().then(function (res) {
                vm.mesaurements = res.data;
            }, function (err) {
                console.log(err);
                vm.error = err.data.message;
            });
        }

        function addInDesignMeasurement(msrmnt) {
            vm.isDesignMeasurementPreset = false;
            vm.tempMeasurement = undefined;
            if (!msrmnt.id) {
                return true;
            }

            vm.design.DesignMeasurements = vm.design.DesignMeasurements || [];
            var chk = _.find(vm.design.DesignMeasurements, ['MeasurementId', msrmnt.id]);
            if (!chk) {
                vm.design.DesignMeasurements.push({ MeasurementId: msrmnt.id, Measurement: msrmnt });
            }
            else {
                vm.isDesignMeasurementPreset = true;
            }
            vm.selectMeasurement = {};
            vm.tempMeasurement = angular.copy(msrmnt.title);
        }

        function getCommaSeperatedMeasurement(arr) {
            var strArr = [];
            _.forEach(arr, function (msr) {
                strArr.push(msr.Measurement.title);
            });
            return strArr.join(', ');
        }

        function deleteDesignMeasurement(msrmnt, idx) {
            vm.design.DesignMeasurements.splice(idx, 1);
        }


        function pageChange() {
            getList();
        }
        function search() {
            vm.options.page = 1;
            vm.lists = [];
            vm.options.where = 'title;$like|s|%' + vm.options.search + '%';
            if(!vm.searching){
                getList();
            }
            return;
        }

        function order(col, ord) {
            vm.asc = !vm.asc;
            var ascL = vm.asc ? 'asc' : 'desc';
            vm.options.sort = col + ' ' + ascL;
            vm.options.page = 1;
            getList();
        }
    });