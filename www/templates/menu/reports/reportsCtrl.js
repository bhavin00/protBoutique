angular.module('starter.reports', [])
    .controller('ReportCtrl', function ($scope, $state, Restangular) {
        
      var vm = this;
        var d = new Date();
        vm.today = d;
        vm.getFullYear = d.getFullYear();
        vm.months = ['January ', 'February ', 'March ', 'April ', 'May ', 'June ', 'July ', 'August ', 'September ', 'October ', 'November ', 'December '];

        vm.openCal = openCal;
        vm.openCal2 = openCal2;

        vm.filter = filter;
        vm.filter3 = filter3;

        vm.getCustomerList = getCustomerList;
        vm.customerChange = customerChange;
        vm.exportToExcel = exportToExcel;

        vm.CustomerId = 0
        vm.collection = 0;
        vm.showtable = false;
        vm.showtable2 = false;
        vm.showtable3 = false;
        vm.showtable4 = false;
        vm.temp = true;

        vm.roles = [
            { id: 1, text: 'New' },
            { id: 2, text: 'Stitching' },
            { id: 3, text: 'Completed' },
            { id: 4, text: 'Cancelled' }
        ];

        vm.user = {
            roles: [1, 2, 3, 4]
        };

        vm.checkAll = function () {
            vm.user.roles = vm.roles.map(function (item) { return item.id; });
        };
        vm.uncheckAll = function () {
            vm.user.roles = [];
        };
        vm.checkUncheck = function (tmp) {
            if (tmp == true) vm.checkAll();
            else vm.uncheckAll();
        }
        vm.something = function () {
            vm.temp = false;
        }

        function getCustomerList() {
            Restangular.all('api/customer').getList().then(function (res) {
                vm.customers = res.data;
            });
        }

        function customerChange(custId) {
            vm.custId = custId;
        }

        function openCal() {
            vm.open_orderDate = !vm.open_orderDate;
        }

        function openCal2() {
            vm.open_orderDate2 = !vm.open_orderDate2;
        }

        function generateFile(info) {
            if (info.data.length > 0) {
                alasql('SELECT * INTO XLSX("Report.xlsx",{headers:true}) FROM ?', [info.data], function () {
                    // $scope.query.page = 1
                    // $scope.query.limit = '10';
                    // getData();
                    var page = 1;
                    var limit = '10';
                    getData(angular.extend({}, $scope.query, { page: page, limit: limit }));
                });
            }

        }

        function exportToExcel() {
            console.log(document.getElementById('my-table'));
            html2canvas(document.getElementById('my-table'), {
                onrendered: function (canvas) {
                    var data = canvas.toDataURL();
                    var docDefinition = {
                        content: [
                            { text: 'January Transport Inc.', fontSize: 10, bold: false, alignment: 'center', margin: [0, 5, 0, 5] },
                            { text: 'All Drivers', fontSize: 12, bold: false, alignment: 'center' },
                            {
                                image: data,
                                width: 530
                            }]
                    };
                    pdfMake.createPdf(docDefinition).download("report.pdf");
                }
            });
        }


        function filter() {

            if (vm.option == 'frequency') {
                switch (vm.frequency) {
                    case 'today':
                        vm.showtable = false;
                        vm.showtable2 = true;
                        vm.showtable3 = false;


                        var startDate = new Date();
                        startDate.setHours(0, 0, 0, 0);
                        var endDate = new Date();
                        endDate.setHours(23, 59, 59, 999);

                        Restangular.all('api/report').post({ start: startDate, end: endDate }).then(function (res) {
                            vm.filterTotal = 0;
                            vm.records = res.data;
                            res.data.forEach(function (element) {
                                vm.filterTotal += element.totalamount;
                            }, this);
                        }, function (err) {
                            console.log(err);
                        });

                        break;
                    case 'week':
                        vm.showtable3 = false;
                        vm.showtable2 = false;
                        vm.showtable = true;


                        vm.records = [];
                        vm.array = [];

                        var startDate = new Date();
                        startDate.setDate(startDate.getDate() - 6);
                        startDate.setHours(0, 0, 0, 0);

                        var endDate = new Date();
                        endDate.setHours(23, 59, 59, 999);

                        var start = angular.copy(startDate);

                        while (start < endDate) {
                            var startCopy = angular.copy(start);
                            vm.array.push({ orderDate: startCopy, totalamount: 0 })
                            var newDate = start.setDate(start.getDate() + 1);
                            start = new Date(newDate);

                        }

                        Restangular.all('api/report').post({ start: startDate, end: endDate }).then(function (res) {
                            vm.filterTotal = 0;
                            res.data.forEach(function (element) {
                                vm.filterTotal += element.totalamount;
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
                            vm.records = _.sortBy(vm.records, 'orderDate').reverse();
                        }, function (err) {
                            console.log(err);
                        });



                        break;
                    case 'month':
                        vm.showtable3 = false;
                        vm.showtable2 = false;
                        vm.showtable = true;

                        vm.records = [];
                        vm.array = [];

                        var startDate = new Date();
                        startDate.setDate(startDate.getDate() - 29);
                        startDate.setHours(0, 0, 0, 0);

                        var start = angular.copy(startDate);

                        var endDate = new Date();
                        endDate.setHours(23, 59, 59, 999);


                        while (start < endDate) {
                            var startCopy = angular.copy(start);
                            vm.array.push({ orderDate: startCopy, totalamount: 0 })
                            var newDate = start.setDate(start.getDate() + 1);
                            start = new Date(newDate);
                        }

                        Restangular.all('api/report').post({ start: startDate, end: endDate }).then(function (res) {
                            vm.filterTotal = 0;
                            res.data.forEach(function (element) {
                                vm.filterTotal += element.totalamount;
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
                            vm.records = _.sortBy(vm.records, 'orderDate').reverse();
                        }, function (err) {
                            console.log(err);
                        });

                        break;
                    case 'monthly':
                        vm.showtable3 = true;
                        vm.showtable2 = false;
                        vm.showtable = false;


                        vm.records = [];
                        vm.array = [];

                        var startDate = new Date();
                        startDate.setMonth(0);
                        startDate.setDate(1);
                        startDate.setHours(0, 0, 0, 0);

                        var endDate = new Date();
                        endDate.setMonth(11);
                        endDate.setDate(31);
                        endDate.setHours(23, 59, 59, 999);

                        for (var index = 1; index <= 12; index++) {
                            if (index < 10) {
                                vm.array.push({ createdat: "0" + index, val: 0 });
                            }
                            else vm.array.push({ createdat: index.toString(), val: 0 });
                        }

                        Restangular.all('api/report').post({ start: startDate, end: endDate }).then(function (res) {
                            vm.filterTotal = 0;

                            res.data.forEach(function (element) {
                                vm.filterTotal += element.totalamount;
                            }, this);

                            var groupedByDateData = _.groupBy(res.data, function (date) {
                                return date.orderDate.substring(5, 7);
                            });

                            var aggregateByDate = _.map(groupedByDateData, function (invoiceObject, createdat) {
                                return {
                                    createdat: createdat,
                                    val: _.reduce(invoiceObject, function (m, x) {
                                        return m + x.totalamount;
                                    }, 0)
                                };
                            });

                            aggregateByDate.forEach(function (element) {
                                vm.array.push(element);
                            }, this);

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
                    default:
                        break;
                }
            }

            else {
                if (vm.datefrom && vm.dateto) {
                    vm.showtable = true;
                    vm.showtable2 = false;
                    vm.showtable3 = false;
                    vm.error = '';
                    vm.records = [];
                    vm.array = [];

                    vm.datefrom.setHours(0, 0, 0, 0);
                    vm.dateto.setHours(23, 59, 59, 999);

                    var start = vm.datefrom;

                    while (start < endDate) {
                        var newDate = start.setDate(start.getDate() + 1);
                        start = new Date(newDate);
                        vm.array.push({ orderDate: start, totalamount: 0 })
                    }

                    Restangular.all('api/report').post({ start: vm.datefrom, end: vm.dateto }).then(function (res) {
                        vm.filterTotal = 0;
                        res.data.forEach(function (element) {
                            vm.filterTotal += element.totalamount;
                            var orderDate = new Date(element.orderDate);
                            orderDate.setHours(0, 0, 0, 0);

                            vm.array.push({ orderDate: orderDate, totalamount: element.totalamount });
                        }, this);
                        vm.array.reduce(function (res, value) {
                            if (!res[value.orderDate]) {
                                res[value.orderDate] = {
                                    totalamount: 0,
                                    orderDate: value.orderDate,
                                };
                                vm.records.push(res[value.orderDate])
                            }
                            res[value.orderDate].totalamount += value.totalamount
                            return res;
                        }, {});
                        vm.records = _.sortBy(vm.records, 'orderDate');
                    }, function (err) {
                        console.log(err);
                    });

                }
                else {
                    vm.showtable = false;
                    vm.showtable2 = false;
                    vm.showtable3 = false;
                    vm.error = "Please Select Date Range.";
                }
            }
        }

        function filter3() {
            vm.showtable4 = true;
            vm.showtable = false;
            vm.showtable2 = false;
            vm.showtable3 = false;

            if (vm.option3 == 'frequency') {
                vm.CustomerBasedReports = [];
                switch (vm.frequencyOption3) {
                    case 'today':

                        var startDate = new Date();
                        startDate.setHours(0, 0, 0, 0);
                        var endDate = new Date();
                        endDate.setHours(23, 59, 59, 999);

                        var newObj = { CustomerId: vm.custId, OrderStatusId: vm.user.roles, start: startDate, end: endDate };
                        Restangular.all('api/customerreport').post(newObj).then(function (res) {
                            res.data.forEach(function (element) {
                                element.OrderItems.forEach(function (ele) {
                                    vm.CustomerBasedReports.push(
                                        {
                                            id: element.id,
                                            name: element.Customer.name,
                                            Design: ele.Design.title,
                                            Style: ele.Style.title,
                                            OrderStatus: ele.OrderStatus.title,
                                            deliveryDate: ele.deliveryDate
                                        });
                                }, this);
                            }, this);
                        }, function (err) {
                            console.log(err);
                        });
                        break;
                    case 'week':
                        var startDate = new Date();
                        startDate.setDate(startDate.getDate() - 6);
                        startDate.setHours(0, 0, 0, 0);
                        var endDate = new Date();
                        endDate.setHours(23, 59, 59, 999);

                        var newObj = { CustomerId: vm.custId, OrderStatusId: vm.user.roles, start: startDate, end: endDate };
                        Restangular.all('api/customerreport').post(newObj).then(function (res) {
                            res.data.forEach(function (element) {
                                element.OrderItems.forEach(function (ele) {
                                    vm.CustomerBasedReports.push(
                                        {
                                            id: element.id,
                                            name: element.Customer.name,
                                            Design: ele.Design.title,
                                            Style: ele.Style.title,
                                            OrderStatus: ele.OrderStatus.title,
                                            deliveryDate: ele.deliveryDate
                                        });
                                }, this);
                            }, this);
                        }, function (err) {
                            console.log(err);
                        });
                        break;
                    case 'month':
                        var startDate = new Date();
                        startDate.setDate(startDate.getDate() - 29);
                        startDate.setHours(0, 0, 0, 0);
                        var endDate = new Date();
                        endDate.setHours(23, 59, 59, 999);

                        var newObj = { CustomerId: vm.custId, OrderStatusId: vm.user.roles, start: startDate, end: endDate };
                        Restangular.all('api/customerreport').post(newObj).then(function (res) {

                            res.data.forEach(function (element) {
                                element.OrderItems.forEach(function (ele) {
                                    console.log(ele.Design.title);
                                    vm.CustomerBasedReports.push(
                                        {
                                            id: element.id,
                                            name: element.Customer.name,
                                            Design: ele.Design.title,
                                            Style: ele.Style.title,
                                            OrderStatus: ele.OrderStatus.title,
                                            deliveryDate: ele.deliveryDate
                                        });
                                }, this);
                            }, this);
                        }, function (err) {
                            console.log(err);
                        });
                        break;
                    default:
                        break;
                }

            }
            else {
                if (vm.datefrom3 && vm.dateto3) {
                    vm.error = null;
                    vm.CustomerBasedReports = [];

                    vm.datefrom3.setHours(0, 0, 0, 0);
                    vm.dateto3.setHours(23, 59, 59, 999);

                    var newObj = { CustomerId: vm.custId, OrderStatusId: vm.user.roles, start: vm.datefrom3, end: vm.dateto3 };
                    Restangular.all('api/customerreport').post(newObj).then(function (res) {
                        res.data.forEach(function (element) {
                            element.OrderItems.forEach(function (ele) {
                                vm.CustomerBasedReports.push(
                                    {
                                        id: element.id,
                                        name: element.Customer.name,
                                        Design: ele.Design.title,
                                        Style: ele.Style.title,
                                        OrderStatus: ele.OrderStatus.title,
                                        deliveryDate: ele.deliveryDate
                                    });
                            }, this);
                        }, this);
                    }, function (err) {
                        console.log(err);
                    });
                }
                else {
                    vm.error = "Please Select Date Range.";
                    vm.showtable4 = false;
                }

            }

        }
    });
