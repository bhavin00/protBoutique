angular.module('starter.style', [])
    .controller('StyleCtrl', function ($scope, $state, $ionicModal, $stateParams, $timeout, Restangular, Upload) {
        var vm = this;
        vm.list = [];
        vm.save = save;
        vm.edit = edit;
        vm.style = {
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
        vm.getList = getList;
        vm.getDesignList = getDesignList;
        vm.displayPhoto = displayPhoto;
        vm.activate = activate;


        function edit(obj) {
            $state.go('app.edit-style', { id: obj.id });
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
            if (!vm.style.id) {
                upload('http://localhost:3002/api/style');
            }
            else {

                if (vm.file) {
                    upload('http://localhost:3002/api/style');
                }
                else {
                    Restangular.one('api/style/' + vm.style.id).patch(vm.style).then(function (res) {
                        // SweetAlert.swal("Style updated successfully!");
                        $state.go('app.style');
                    });
                }
            }
        }
        function upload(url) {
            Upload.upload({
                url: url,
                data: { file: vm.file, style: vm.style }
            }).then(function (resp) {
                console.log(resp);
                // SweetAlert.swal("Style saved successfully!");
                $state.go('app.style');
                //console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
            }, function (resp) {
                console.log(resp.data);
                vm.error = resp.data.message;
                vm.startProcessing = false;
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            });
        }

        function getList() {
            Restangular.all('api/style').getList(vm.options).then(function (res) {
                vm.list = res.data;
                vm.options.totalItems = parseInt(res.headers('total'));
            });
        }
        function getDesignList() {
            Restangular.all('api/design').getList().then(function (res) {
                vm.designs = res.data;
                _.forEach(vm.designs, function (dgn) {
                    dgn.id = '' + dgn.id;
                });
            });
        }

        function displayPhoto(file) {
            Upload.base64DataUrl(file).then(function (url) {
                vm.localPicture = url;
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

        function activate() {
            Restangular.all('api/design').getList().then(function (res) {
                vm.designs = res.data;
                if ($stateParams.id != 'new') {
                    Restangular.one('api/style/' + $stateParams.id).get().then(function (res) {
                        vm.style = res.data;
                        vm.style.image = "http://localhost:3002/" + vm.style.image;
                        vm.style.DesignId = '' + vm.style.DesignId;
                    });
                }
            });

        }
    });