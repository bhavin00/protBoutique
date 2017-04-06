angular.module('starter.reports', [])
    .controller('ReportCtrl', function ($scope, $state, Restangular) {
          var vm = this;
        var d = new Date();
        vm.months = ['January ' + d.getFullYear(), 'February ' + d.getFullYear(), 'March ' + d.getFullYear(), 'April ' + d.getFullYear(), 'May ' + d.getFullYear(), 'June ' + d.getFullYear(), 'July ' + d.getFullYear(), 'August ' + d.getFullYear(), 'September ' + d.getFullYear(), 'October ' + d.getFullYear(), 'November ' + d.getFullYear(), 'December ' + d.getFullYear()];
        vm.example1model = [];
        vm.example1data = [{ id: 1, label: "New" }, { id: 2, label: "Stitching" }, { id: 3, label: "Completed" }, { id: 4, label: "Cancelled" }];

        vm.openCal = openCal;
        vm.openCal2 = openCal2;
        vm.myValueFunction = myValueFunction;
        vm.filter = filter;
        vm.filter3 = filter3;
        vm.showRecords = showRecords;
        vm.getCustomerList = getCustomerList;
        vm.customerChange = customerChange;


        vm.collection = 0;
        vm.showtable = false;
        vm.showtable2 = false;
        vm.showtable3 = false;
        vm.orderIdColumn = false;

        function filter3() {
            var newObj = { CustomerId:vm.custId ,OrderStatusId:vm.example1model[0].id,start: vm.datefrom3, end: vm.dateto3 };
            console.log(newObj);
            Restangular.all('api/customerreport').post(newObj).then(function (res) {
                console.log(res);
            }, function (err) {
                console.log(err);
            });
        }



        function getCustomerList() {
            Restangular.all('api/customer').getList().then(function (res) {
                vm.customers = res.data;
            });
        }

        function customerChange(custId) {
            vm.custId = custId;
            // vm.cust = _.find(vm.customers, ['id', parseInt(custId)]);
            // console.log(custId);
        }

        function openCal() {
            vm.open_orderDate = !vm.open_orderDate;
        }

        function openCal2() {
            vm.open_orderDate2 = !vm.open_orderDate2;
        }

        function myValueFunction(date) {
            return new Date(date)
        }

        function showRecords() {
            vm.filter = !vm.fil
        }

        function groupBy(xs, key) {
            return xs.reduce(function (rv, x) {
                (rv[x[key]] = rv[x[key]] || []).push(x);
                return rv;
            }, {});
        }

        function pad(d) {
            return (d < 10) ? '0' + d.toString() : d.toString();
        }


        function filter() {

            if (vm.option == 'frequency') {
                switch (vm.frequency) {
                    case 'today':
                        vm.showtable = true;
                        vm.orderIdColumn = true;
                        vm.showtable2 = false;
                        vm.showtable3 = false;

                        vm.records = [];
                        Restangular.all('api/listall').getList().then(function (res) {
                            res.data.forEach(function (element) {
                                var t = new Date(element.orderDate);
                                if (t.getDate() == d.getDate() && t.getMonth() == d.getMonth() && t.getFullYear() == d.getFullYear()) {
                                    vm.records.push(element);
                                    vm.collection += element.totalamount;
                                }
                            }, this);
                        });
                        break;
                    case 'week':
                        vm.showtable3 = false;
                        vm.showtable2 = true;
                        vm.showtable = false;
                        vm.orderIdColumn = false;

                        vm.records = [];
                        vm.array = [];

                        var startDate = new Date();
                        startDate.setDate(startDate.getDate() - 7);
                        var start = new Date();
                        start.setDate(start.getDate() - 7);
                        start.setHours(0, 0, 0, 0);
                        var endDate = new Date();
                        endDate.setHours(0, 0, 0, 0);

                        while (start < endDate) {
                            vm.array.push({ orderDate: start, totalamount: 0 })
                            var newDate = start.setDate(start.getDate() + 1);
                            start = new Date(newDate);

                        }

                        Restangular.all('api/report').post({ start: startDate, end: endDate }).then(function (res) {
                            res.data.forEach(function (element) {
                                var orderDate = new Date(element.orderDate);
                                orderDate.setHours(0, 0, 0, 0);

                                vm.array.push({ orderDate: orderDate, totalamount: element.totalamount });
                            }, this);
                            vm.array.reduce(function (res, value) {
                                if (!res[value.orderDate]) {
                                    res[value.orderDate] = {
                                        totalamount: 0,
                                        orderDate: value.orderDate
                                    };
                                    vm.records.push(res[value.orderDate])
                                }
                                res[value.orderDate].totalamount += value.totalamount
                                return res;
                            }, {});
                        }, function (err) {
                            console.log(err);
                        });



                        break;
                    case 'month':
                        vm.showtable3 = false;
                        vm.showtable2 = true;
                        vm.showtable = false;
                        vm.orderIdColumn = false;

                        vm.records = [];
                        vm.array = [];

                        var startDate = new Date();
                        startDate.setDate(startDate.getDate() - 30);
                        var start = new Date();
                        start.setDate(start.getDate() - 30);
                        start.setHours(0, 0, 0, 0);
                        var endDate = new Date();
                        endDate.setHours(0, 0, 0, 0);


                        while (start < endDate) {
                            var newDate = start.setDate(start.getDate() + 1);
                            start = new Date(newDate);
                            vm.array.push({ orderDate: start, totalamount: 0 })
                        }

                        Restangular.all('api/report').post({ start: startDate, end: endDate }).then(function (res) {
                            res.data.forEach(function (element) {
                                var orderDate = new Date(element.orderDate);
                                orderDate.setHours(0, 0, 0, 0);

                                vm.array.push({ orderDate: orderDate, totalamount: element.totalamount });
                            }, this);
                            vm.array.reduce(function (res, value) {
                                if (!res[value.orderDate]) {
                                    res[value.orderDate] = {
                                        totalamount: 0,
                                        orderDate: value.orderDate
                                    };
                                    vm.records.push(res[value.orderDate])
                                }
                                res[value.orderDate].totalamount += value.totalamount
                                return res;
                            }, {});
                        }, function (err) {
                            console.log(err);
                        });

                        break;
                    case 'monthly':
                        vm.showtable3 = true;
                        vm.showtable2 = false;
                        vm.showtable = false;
                        vm.orderIdColumn = false;

                        vm.records = [];
                        vm.array = [];

                        var startDate = new Date();
                        startDate.setMonth(0);
                        startDate.setDate(1);
                        startDate.setHours(0, 0, 0, 0);

                        var endDate = new Date();
                        endDate.setMonth(11);
                        endDate.setDate(31);
                        endDate.setHours(0, 0, 0, 0);

                        for (var index = 1; index <= 12; index++) {
                            vm.array.push({ createdat: "0" + index, val: 0 });
                        }

                        Restangular.all('api/report').post({ start: startDate, end: endDate }).then(function (res) {
                            var groupedByDateData = _.groupBy(res.data, function (date) {
                                return date.createdAt.substring(5, 7);
                            });



                            vm.aggregateByDate = _.map(groupedByDateData, function (invoiceObject, createdat) {
                                return {
                                    createdat: createdat,
                                    val: _.reduce(invoiceObject, function (m, x) {
                                        return m + x.totalamount;
                                    }, 0)
                                };
                            });

                            vm.array.push(vm.aggregateByDate[0]);

                            vm.array.reduce(function (res, value) {
                                if (!res[value.createdat]) {
                                    res[value.createdat] = {
                                        val: 0,
                                        createdat: value.createdat
                                    };
                                    vm.records.push(res[value.createdat])
                                }
                                res[value.createdat].val += value.val
                                return res;
                            }, {});
                        }, function (err) {
                            console.log(err);
                        });

                        break;
                    // case 'yearly':
                    //     vm.showtable2 = true;
                    //     vm.showtable = false;

                    //     break;
                    default:
                        break;
                }
            }

            // }
            else {
                if (vm.datefrom && vm.dateto) {
                    vm.showtable = true;
                    vm.showtable2 = false;
                    vm.showtable3 = false;
                    vm.orderIdColumn = false;
                    vm.error = '';

                    vm.records = [];
                    vm.array = [];

                    var startDate = new Date(vm.datefrom);
                    startDate.setHours(0, 0, 0, 0);

                    var start = startDate;
                    start.setDate(start.getDate() - 2);

                    var endDate = new Date(vm.dateto);
                    endDate.setHours(0, 0, 0, 0);

                    while (start < endDate) {
                        var newDate = start.setDate(start.getDate() + 1);
                        start = new Date(newDate);
                        vm.array.push({ orderDate: start, totalamount: 0, id: '-' })
                    }

                    Restangular.all('api/report').post({ start: startDate, end: endDate }).then(function (res) {
                        res.data.forEach(function (element) {
                            var orderDate = new Date(element.orderDate);
                            orderDate.setHours(0, 0, 0, 0);

                            vm.array.push({ orderDate: orderDate, totalamount: element.totalamount, id: element.id });
                        }, this);
                        vm.array.reduce(function (res, value) {
                            if (!res[value.orderDate]) {
                                res[value.orderDate] = {
                                    totalamount: 0,
                                    orderDate: value.orderDate,
                                    id: value.id
                                };
                                vm.records.push(res[value.orderDate])
                            }
                            res[value.orderDate].totalamount += value.totalamount
                            return res;
                        }, {});
                    }, function (err) {
                        console.log(err);
                    });
                }
                else {
                    vm.error = "Please Select Date Range.";
                }
            }
        }

    });
