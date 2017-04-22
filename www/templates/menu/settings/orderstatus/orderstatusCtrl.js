angular.module('starter.orderstatus', [])
    .controller('OrderStatusCtrl', function ($scope, $state, $ionicModal, $stateParams,$timeout,Restangular,$ionicHistory) {
        var vm = this;
        vm.list = [];
        vm.save = save;
        vm.edit = edit;
        vm.orderStatus = {
            isActive: true
        }
        vm.search = search;
        vm.order = order;
        vm.pageChange = pageChange;
        vm.options = {
            pagesize: 10,
            totalItems: 0,
            page: 1,
            search: ''
        }
        vm.getList = getList;
        if ($stateParams.id && $stateParams.id != 'new') {
            Restangular.one('api/orderStatus/' + $stateParams.id).get().then(function (res) {
                vm.orderStatus = res.data;
            });
        }

        function edit(obj) {
            $state.go('app.edit-orderstatus', { id: obj.id });
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
            if (!vm.orderStatus.id) {
                Restangular.all('api/orderStatus').post(vm.orderStatus).then(function (res) {
                    // SweetAlert.swal("Order Status saved successfully!");
                     $ionicHistory.clearCache().then(function(){ $state.go('app.orderStatus') })
                }, function (err) {
                    console.log(err);
                    vm.error = err.data.message;
                    vm.startProcessing = false;
                });
            }
            else {
                Restangular.one('api/orderStatus/' + vm.orderStatus.id).patch(vm.orderStatus).then(function (res) {
                    // SweetAlert.swal("Order Status updated successfully!");
                     $ionicHistory.clearCache().then(function(){ $state.go('app.orderStatus') })
                }, function (err) {
                    console.log(err);
                    vm.error = err.data.message;
                    vm.startProcessing = false;
                });
            }
        }

        function getList() {
            Restangular.all('api/orderStatus').getList(vm.options).then(function (res) {
                vm.list = res.data;
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