
angular.module('starter.measurement', [])
  .controller('MeasurementCtrl', function ($stateParams, $scope, $state, $ionicModal, $timeout, $http, Restangular, $ionicHistory, $ionicLoading) {
    var vm = this;
    vm.inProcess = true;
    vm.searchFlag = false;
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
      if (vm.lists.length == 0) {
        vm.stopload = vm.options.page;
        $scope.$broadcast('scroll.infiniteScrollComplete');
        return;
      }
    }
    vm.list = [];
    
    vm.save = save;
    vm.edit = edit;
    vm.getList = getList;
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
        template: '<p>Loading...</p>  <ion-spinner icon="lines" class="spinner-calm"></ion-spinner>'
      });
    };

    $scope.hide = function () {
      $ionicLoading.hide();
    };
    //loading show end  here 
    vm.measurement = {
      isActive: true
    };



    if ($stateParams.id && $stateParams.id != 'new') {
      Restangular.one('api/measurement/' + $stateParams.id).get().then(function (res) {
        vm.measurement = res.data;
      }, function (err) {
        console.log(err);
        vm.error = err.data.message;
      });
    }

    function edit(obj) {
      $state.go('app.edit-measurement', { id: obj.id });
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
      if (!vm.measurement.id) {
        Restangular.all('api/measurement').post(vm.measurement).then(function (res) {
          // SweetAlert.swal("Measurement saved successfully!");
          $ionicHistory.clearCache().then(function () { $state.go('app.measurement') })
        }, function (err) {
          console.log(err);
          vm.error = err.data.message;
          vm.startProcessing = false;
          $scope.hide($ionicLoading);
        });
      }
      else {
        Restangular.one('api/measurement/' + vm.measurement.id).patch(vm.measurement).then(function (res) {
          // SweetAlert.swal("Measurement updated successfully!");
          $ionicHistory.clearCache().then(function () { $state.go('app.measurement') })
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
      Restangular.all('api/measurement').getList(vm.options).then(function (res) {
        if (vm.options.page == 1 && vm.searchFlag) { //vm.options.search != '' &&
          vm.lists = [];
        }
        vm.list = Restangular.stripRestangular(res.data);
        // var temp = angular.copy(vm.list);
        Array.prototype.pushArray = function () {
          this.push.apply(this, this.concat.apply([], arguments));
        };
        vm.lists.pushArray(vm.list);
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
      vm.searchFlag = true;
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
