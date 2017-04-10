angular.module('starter.material', [])//Restangular, $state, SweetAlert, $stateParams
    .controller('MaterialCtrl', function (Restangular,$scope, $state,$stateParams, $ionicModal, $timeout) {
         var vm = this;
        vm.list = [];
        vm.save = save;
        vm.edit = edit;
        vm.getList = getList;
        vm.material = {
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
            Restangular.one('api/material/' + $stateParams.id).get().then(function(res) {
                vm.material = res.data;
            });
        }

        function edit(obj) {
            $state.go('app.edit-material', {
                id: obj.id
            });
        }

        function save(form) {
            if (form.$invalid) {
                console.log(form);
                _.forEach(form.$error.required, function(frm) {
                    frm.$setDirty();
                });
                vm.isSubmitted = true;
                return;
            }
            vm.startProcessing = true;
            if (!vm.material.id) {
                Restangular.all('api/material').post(vm.material).then(function(res) {
                    $state.go('app.material');
                }, function(err) {
                    vm.error = err.data.message;
                    vm.startProcessing = false;
                });
            } else {
                Restangular.one('api/material/' + vm.material.id).patch(vm.material).then(function(res) {
                    $state.go('app.material');
                }, function(err) {
                    vm.error = err.data.message;
                    vm.startProcessing = false;
                });
            }
        }

        function getList() {
            Restangular.all('api/material').getList(vm.options).then(function(res) {
                vm.list = res.data;
                // console.log(res.data);
                vm.options.totalItems = parseInt(res.headers('total'));
            });
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