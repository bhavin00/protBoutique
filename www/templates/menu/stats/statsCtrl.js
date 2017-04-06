angular.module('starter.stats', [])
    .controller('StatsCtrl', function ($scope, $state, $ionicModal, $timeout, Restangular) {
       var vm = this;
        vm.newOrders = 0;
        vm.stitchingOrders = 0;
        vm.completedOrders = 0;
        vm.cancelledOrders = 0;
        var DesignIds = [];
        var StyleIds = [];
        var DesignIdsStyleIds = [];
        vm.todayCollection = 0;
        vm.thisweekCollection = 0;
        vm.thismonthCollection = 0;
        vm.todayorder = 0;
        vm.thisweekorder = 0;
        vm.thismonthorder = 0;

        vm.getList = getList;

        //=======This week data===
         var date = new Date();
         var day = date.getDay();
         var firstDayOfWeek = date.getDate() - day;
         var startDate =  new Date();
         startDate.setDate(firstDayOfWeek);
         var endDate = new Date();
         endDate.setDate(startDate.getDate() + 6);

        function getList() {
            var d = new Date();

            Restangular.all('api/listall').getList().then(function (res) {
                res.data.forEach(function(element) {
                    var t = new Date(element.orderDate);
                    if(t.getDate() == d.getDate() && t.getMonth() == d.getMonth() && t.getFullYear() == d.getFullYear()){
                        vm.todayCollection += element.totalamount;
                        vm.todayorder++;
                    }
                    if(t>=startDate && t<=endDate){
                        vm.thisweekCollection += element.totalamount;
                        vm.thisweekorder++;
                    }
                    if(t.getMonth() == d.getMonth() && t.getFullYear() == d.getFullYear()){
                        vm.thismonthCollection += element.totalamount;
                        vm.thismonthorder++;
                    }
                }, this);
            });

            Restangular.all('api/customer').getList(vm.options).then(function (res) {
                vm.totalCustomers = res.data.length;
            });

            Restangular.all('api/notify').getList(vm.options).then(function (res) {
                console.log(res.data);
                res.data.forEach(function (element) {
                    DesignIds.push(element.Design.title);
                    StyleIds.push(element.Style.title);
                    DesignIdsStyleIds.push(element.Design.title+" + "+element.Style.title);
                }, this);

                var newDesignId = DesignIds.slice().sort(), most = [undefined, 0], counter = 0;
                var newStyleId = StyleIds.slice().sort(), most1 = [undefined, 0], counter = 0;
                var DesignIdsStyleId = DesignIdsStyleIds.slice().sort(), most2 = [undefined, 0], counter = 0;

                newDesignId.reduce(function (old, chr) {
                    old == chr ? ++counter > most[1] && (most = [chr, counter]) : (counter = 1)
                    return chr
                });
                newStyleId.reduce(function (old, chr) {
                    old == chr ? ++counter > most1[1] && (most1 = [chr, counter]) : (counter = 1)
                    return chr
                });
                DesignIdsStyleId.reduce(function (old, chr) {
                    old == chr ? ++counter > most2[1] && (most2 = [chr, counter]) : (counter = 1)
                    return chr
                });

                vm.bestDesign = most[0];
                vm.bestStyle = most1[0];
                vm.bestCombo = most2[0];
            });

            Restangular.all('api/order').getList(vm.options).then(function (res) {
                console.log(res);
                vm.totalOrders = res.data.length;
                res.data.forEach(function (element) {
                    if (element.OrderStatusId == 1) {
                        vm.newOrders++;
                    }
                    if (element.OrderStatusId == 2) {
                        vm.stitchingOrders++;
                    }
                    if (element.OrderStatusId == 3) {
                        vm.completedOrders++;
                    }
                    if (element.OrderStatusId == 4) {
                        vm.cancelledOrders++;
                    }
                }, this);
            });
        }

    });
