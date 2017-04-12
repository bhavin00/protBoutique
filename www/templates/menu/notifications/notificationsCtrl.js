angular.module('starter.notifications', [])
    .controller('NotificationsCtrl', function (Restangular, $state) {
          var vm = this;
        vm.selectedDate = new Date();

        vm.edit = edit;
        vm.edit2 = edit2;
        vm.edit3 = edit3;
        vm.openCal = openCal;
        vm.change = change;

        function edit(obj) {
            $state.go('app.edit-customer', { id: obj.id });
        }

        function edit2(obj) {
            $state.go('app.edit-customer', { id: obj });
        }

        function edit3(obj) {
            $state.go('app.edit-order', { id: obj });
        }

        function openCal() {
            vm.open_orderDate = !vm.open_orderDate;
        }
        
        function change(date) {
            vm.annerversarys = [];
            vm.birthdays = [];
            vm.alerts = [];
            vm.deliverys = [];
            var date1 = new Date(date);
            Restangular.all('api/customer').getList().then(function (res) {
                res.data.forEach(function (element) {
                    var date2 = new Date(element.annerversary);
                    if (date2.getDate() == date1.getDate() && date2.getMonth() == date1.getMonth()) {
                        vm.annerversarys.push(element);
                    }
                    var date3 = new Date(element.dob);
                    if (date3.getDate() == date1.getDate() && date3.getMonth() == date1.getMonth()) {
                        vm.birthdays.push(element);
                    }
                }, this);
                console.log(vm.annerversarys);
                console.log(vm.birthdays);
            });
            Restangular.all('api/orderItem').getList().then(function (res) {
                
                res.data.forEach(function (element) {
                    var date4 = new Date(element.alertDate);
                    if (date4.getDate() == date1.getDate() && date4.getMonth() == date1.getMonth()) {
                        vm.alerts.push(element);
                    }
                    var date5 = new Date(element.deliveryDate);
                    if (date5.getDate() == date1.getDate() && date5.getMonth() == date1.getMonth()) {
                        vm.deliverys.push(element);
                    }
                }, this);
                console.log(vm.alerts);
                console.log(vm.deliverys);
            });
        }

    });
