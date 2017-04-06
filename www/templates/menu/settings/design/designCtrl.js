angular.module('starter.design', [])
    .controller('DesignCtrl', function ($scope, $state, $ionicModal, $stateParams, $timeout, Restangular) {

        var vm = this;
        $ionicModal.fromTemplateUrl('#/app/design', {
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
        vm.order = order;
        vm.pageChange = pageChange;
        vm.options = {
            pagesize: 10,
            totalItems: 0,
            page: 1,
            search: ''
        }
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
            vm.startProcessing = true;
            if (!vm.design.id) {
                Restangular.all('api/design').post(vm.design).then(function (res) {
                    // SweetAlert.swal("Design saved successfully!");
                    $state.go('app.design');
                }, function (err) {
                    console.log(err);
                    vm.error = err.data.message;
                    vm.startProcessing = false;
                });
            }
            else {
                Restangular.one('api/design/' + vm.design.id).patch(vm.design).then(function (res) {
                    // SweetAlert.swal("Design updated successfully!");
                    $state.go('app.design');
                }, function (err) {
                    console.log(err);
                    vm.error = err.data.message;
                    vm.startProcessing = false;
                });
            }
        }

        function getList() {
            Restangular.all('api/design').getList(vm.options).then(function (res) {
                vm.list = res.data;
                vm.options.totalItems = parseInt(res.headers('total'));
            }, function (err) {
                console.log(err);
                vm.error = err.data.message;
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
            vm.options.where = 'title;$like|s|%' + vm.options.search + '%';
            getList();
        }

        function order(col, ord) {
            vm.asc = !vm.asc;
            var ascL = vm.asc ? 'asc' : 'desc';
            vm.options.sort = col + ' ' + ascL;
            vm.options.page = 1;
            getList();
        }
    });