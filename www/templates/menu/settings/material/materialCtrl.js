angular.module('starter.material', [])//Restangular, $state, SweetAlert, $stateParams
    .controller('MaterialCtrl', function (Restangular, $scope, $state, $stateParams, $ionicHistory, $ionicLoading) {



        var vm = this;
        vm.inProcess=true;
        $scope.loadMore = function () {
            if (!vm.stopload) {
                vm.options.page++;
                console.log(vm.options.page)
                pageChange();
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }else{
                if(vm.stopload > vm.options.page){
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
        vm.material = {
            isActive: true
        };
        vm.search = search;
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
                template: '<p>Loading...</p> <ion-spinner icon="lines" class="spinner-calm"></ion-spinner>'
            });
        };

        $scope.hide = function () {
            $ionicLoading.hide();
        };
        //loading show end  here
        if ($stateParams.id && $stateParams.id != 'new') {
            Restangular.one('api/material/' + $stateParams.id).get().then(function (res) {
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
                _.forEach(form.$error.required, function (frm) {
                    frm.$setDirty();
                });
                vm.isSubmitted = true;
                return;
            }
            vm.startProcessing = true;
            $scope.show($ionicLoading);
            if (!vm.material.id) {
                Restangular.all('api/material').post(vm.material).then(function (res) {
                    $ionicHistory.clearCache().then(function () { $state.go('app.material') })
                }, function (err) {
                    vm.error = err.data.message;
                    vm.startProcessing = false;
                    $scope.hide($ionicLoading);
                });
            } else {
                Restangular.one('api/material/' + vm.material.id).patch(vm.material).then(function (res) {
                    $ionicHistory.clearCache().then(function () { $state.go('app.material') })
                }, function (err) {
                    vm.error = err.data.message;
                    vm.startProcessing = false;
                    $scope.hide($ionicLoading);
                });
            }
        }
        vm.lists = [];
        function getList() {
            vm.inProcess=true;
            $scope.show($ionicLoading);
            Restangular.all('api/material').getList(vm.options).then(function (res) {
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
                vm.inProcess=false;
            });
        }

        function pageChange() {
            getList();
        }

        function search() {
            vm.options.page = 1;
            vm.lists = [];
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