var vm = this;
        vm.date = new Date();
        vm.invoice = invoice;
        vm.print = print;
        vm.getList = getList;
        vm.edit = edit;
        vm.detail = detail;
        vm.getOrderStatusList = getOrderStatusList;
        vm.getCustomerList = getCustomerList;
        vm.getDesignList = getDesignList;
        vm.getStyleList = getStyleList;
        vm.getMaterialList = getMaterialList;
        vm.getMeasurementList = getMeasurementList;
        vm.customerChange = customerChange;
        vm.addOrderItem = addOrderItem;
        vm.removeOrderItem = removeOrderItem;
        vm.addOrderItemPair = addOrderItemPair;
        vm.styleChange = styleChange;
        vm.displayPhoto = displayPhoto;
        vm.getOrderItemMeasurement = getOrderItemMeasurement;
        vm.proceedOrder = proceedOrder;
        vm.submitOrder = submitOrder;
        vm.counttotal = counttotal;
        vm.changeOrderItemStatus = changeOrderItemStatus;
        vm.getCustomerByOrderList = getCustomerByOrderList;
        vm.searchByField = searchByField;
        vm.onDeliveryDateChange = onDeliveryDateChange;
        vm.goBack = goBack;
        vm.customers = [];
        vm.designs = [];
        vm.orderItem = {
            DesignId: '',
            StyleId: '',
            Style: {
                image: ''
            },
            MaterialId: '',
            colorCode: '',
            customization: '',
            remark: '',
            image: '',
            pair: '',
            OrderItemMeasurements: [
                //{
                //MeasurementId: '',
                //Measurement: {
                //    title: ''
                //}
                //}
            ],
            OrderStatusId: 1,
            OrderStatus: {
                title: 'New'
            }
        };
        vm.order = {
            Customer: {},
            OrderStatus: {
                title: "New"
            },
            OrderStatusId: 1,
            OrderItems: [],
            orderDate: new Date()
        };
        vm.isOrderProceed = false;
        vm.openCal = openCal;

        vm.search = search;
        vm.sort = sort;
        vm.pageChange = pageChange;
        vm.options = {
            pagesize: 10,
            totalItems: 0,
            page: 1,
            search: ''
        }
        vm.searchBy = {

        };
        vm.dateOptions = {
            dateDisabled: false,
            formatYear: 'yy',
            maxDate: new Date(2020, 5, 22),
            minDate: new Date(),
            startingDay: 1
        };
        vm.SubmitOrderText = "Submit Order";

        vm.getFilterStyle = getFilterStyle;
        vm.sprayColour = sprayColour;
        vm.sColor = true;
        vm.totalamount = 0;

        function counttotal() {
            vm.totalamount = 0;
            vm.order.OrderItems.forEach(function (element) {
                console.log(element.amount);
                if (element.amount) {
                    vm.totalamount += element.amount;
                }

            }, this);
        }

        function print(divName) {

            var printContents = document.getElementById(divName).innerHTML;
            console.log(printContents);
            var popupWin = window.open('', '_blank');
            popupWin.document.open();
            popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="/lib/style.css" /></head><body onload="window.print()">' + printContents + '</body></html>');
            popupWin.document.close();
        }


        function invoice(index) {
            localStorage.setItem('index', index);
            $state.go('app.invoice');
        }

        function sprayColour(idx, arr) {
            if (idx > 0) {
                //check for previous matched colour and maintain a flag;
                if (arr[idx].pair && arr[idx].pair != null && arr[idx].pair === arr[idx - 1].pair) {
                    return vm.sColor;
                }
                else {
                    vm.sColor = !vm.sColor;
                    return vm.sColor;
                }
            }
            else {
                vm.sColor = true;
                return vm.sColor;
            }
        }

        function getFilterStyle(arr, id) {
            return _.filter(arr, ['DesignId', parseInt(id)]);
        }

        vm.activate = activate;

        function getCustomerList() {
            Restangular.all('api/customer').getList().then(function (res) {
                vm.customers = res.data;
            });
        }
        function getDesignList() {
            Restangular.all('api/design').getList().then(function (res) {
                vm.designs = res.data;
            });
        }
        function getStyleList() {
            Restangular.all('api/style').getList().then(function (res) {
                vm.styles = [];
                res.data.forEach(function (element) {
                    if (element.isActive) {
                        vm.styles.push(element);
                    }
                }, this);
            });
        }
        function getMaterialList() {
            Restangular.all('api/material').getList().then(function (res) {
                vm.materials = [];
                res.data.forEach(function (element) {
                    if (element.isActive) {
                        vm.materials.push(element);
                    }
                }, this);
            });
        }
        function getMeasurementList() {
            Restangular.all('api/measurement').getList().then(function (res) {
                vm.measurements = [];
                res.data.forEach(function (element) {
                    if (element.isActive) {
                        vm.measurements.push(element);
                    }
                }, this);
            });
        }
        function customerChange(custId) {
            var cust = _.find(vm.customers, ['id', parseInt(custId)]);
            if (cust) {
                vm.order.Customer = {
                    address: cust.address,
                    mobile: cust.mobile
                }
            }
            else {
                vm.order.Customer = {
                    address: '',
                    mobile: ''
                }
            }
        }
        function initOrder() {
            vm.today = new Date();
            if ($stateParams.id && $stateParams.id != 'new') {
                Restangular.one('api/order/' + $stateParams.id).get().then(function (res) {
                    vm.order = res.data;
                    vm.isOrderProceed = true;
                    vm.SubmitOrderText = 'Update order';
                    vm.today = vm.order.orderDate;
                });
            }
            if (vm.order.OrderItems.length === 0) {
                addOrderItem();
            }
        }
        function edit(obj) {
            $state.go('app.edit-order', { id: obj.id });
        }
        function addOrderItem() {
            var oi = angular.copy(vm.orderItem);
            var dt = new Date();
            oi.pair = dt.getTime();
            vm.order.OrderItems.push(oi);
        }
        function addOrderItemPair(idx) {
            var oi = angular.copy(vm.orderItem);
            oi.pair = vm.order.OrderItems[idx].pair;
            oi.hasPair = true;
            vm.order.OrderItems[idx].hasPair = true;
            vm.order.OrderItems.splice(idx + 1, 0, oi);
        }
        function removeOrderItem() {
            var idx = vm.order.OrderItems.length - 1;
            if (vm.order.OrderItems[idx].hasPair) {
                vm.order.OrderItems[idx - 1].hasPair = false;
            }
            vm.order.OrderItems.splice(idx, 1);
        }
        function styleChange(idx, sid) {
            var stl = _.find(vm.styles, ['id', parseInt(sid)]);
            if (stl) {
                vm.order.OrderItems[idx].Style = stl;
            } else {
                vm.order.OrderItems[idx].Style = {};
            }
        }
        function displayPhoto(file, idx) {
            vm.files = vm.files || [];
            vm.files[idx] = file;
            Upload.base64DataUrl(file).then(function (url) {
                vm.order.OrderItems[idx].image = url;
            });
        }
        function getOrderItemMeasurement(idx, dgnId) {
            styleChange(idx, -1);
            //bind customer value as weel if customer is present and their exists value of measurement
            var cust = _.find(vm.customers, ['id', parseInt(vm.order.CustomerId)]);
            var dgn = _.find(vm.designs, ['id', parseInt(dgnId)]);
            if (dgn) {
                vm.order.OrderItems[idx].Design = dgn;

                vm.order.OrderItems[idx].OrderItemMeasurements = [];
                _.forEach(dgn.DesignMeasurements, function (dm) {
                    var val = '';
                    if (cust) {
                        var cm = _.find(cust.CustomerMeasurements, ['MeasurementId', dm.MeasurementId]);
                        if (cm && cm.val) {
                            val = cm.val;
                        }
                    }
                    vm.order.OrderItems[idx].OrderItemMeasurements.push({ MeasurementId: dm.MeasurementId, Measurement: dm.Measurement, val: val });
                });
            }
        }
        function proceedOrder(form, cform) {
            if (form.$invalid || cform.$invalid) {
                _.forEach(form.$error.required, function (frm) {
                    frm.$setDirty();
                });
                _.forEach(cform.$error.required, function (frm) {
                    frm.$setDirty();
                });
                vm.isSubmitted = true;
                return;
            }
            vm.isOrderProceed = true;
        }
        function submitOrder(form) {
            if (form.$invalid) {
                _.forEach(form.$error.required, function (frm) {
                    frm.$setDirty();
                });
                _.forEach(form.$error.max, function (frm) {
                    frm.$setDirty();
                });
                _.forEach(form.$error.min, function (frm) {
                    frm.$setDirty();
                });
                vm.isSubmitted2 = true;
                return;
            }
            vm.startProcessing = true;
            upload();
        }
        function upload() {
            var data = Restangular.stripRestangular(vm.order);
            data.totalamount = vm.totalamount;
            //delete vm.order["0"];
            //delete vm.order["1"];
            Upload.upload({
                url: 'http://localhost:3002/api/order',
                data: { order: data },
                file: vm.files
            }).then(function (resp) {
                console.log(resp);
                // if (vm.order.id) {
                //     SweetAlert.swal("Order updated successfully!");
                // }
                // else {
                //     SweetAlert.swal("Order saved successfully!");
                // }
                $state.go('app.order');
                //console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
            }, function (resp) {
                console.log(resp.data);
                vm.error2 = resp.data.message;
                vm.startProcessing = false;
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            });
        }
        function getList() {
            Restangular.all('api/order').getList(vm.options).then(function (res) {
                vm.list = res.data;
                vm.newList = res.data[localStorage.getItem('index')];
                console.log(vm.newList);
                vm.totalamount = 0;
                vm.newList.OrderItems.forEach(function (element) {
                    vm.totalamount += element.amount;
                }, this);
                vm.options.totalItems = parseInt(res.headers('total'));
            });
        }
        function getOrderStatusList() {
            Restangular.all('api/orderStatus').getList().then(function (res) {
                vm.orderStatuses = res.data;
            });
        }
        function detail() {
            vm.isOrderProceed = false;
        }
        function activate() {
            getDesignList();
            getStyleList();
            getMaterialList();
            getMeasurementList();
            getOrderStatusList();
            initOrder();

        }
        function changeOrderItemStatus() {
            var gb = _.groupBy(vm.order.OrderItems, function (d) { return d.OrderStatusId });
            if (gb[1] && gb[1].length === vm.order.OrderItems.length) {
                vm.order.OrderStatusId = 1;
            } else if (gb[2] && gb[2].length > 0) {
                vm.order.OrderStatusId = 2;
            } else if (gb[3] && gb[3].length === vm.order.OrderItems.length) {
                vm.order.OrderStatusId = 3;
            } else if (gb[4] && gb[4].length === vm.order.OrderItems.length) {
                vm.order.OrderStatusId = 4;
            } else {
                vm.order.OrderStatusId = 5;
            }
            var os = _.find(vm.orderStatuses, ['id', vm.order.OrderStatusId]);
            if (os) {
                vm.order.OrderStatus = os;
            }
        }

        function pageChange() {
            getList();
        }
        function search() {
            vm.options.page = 1;
            vm.options.where = 'name;$like|s|%' + vm.options.search + '%';
            getList();
        }

        function sort(col, ord) {
            if (vm.asc != undefined) {
                var cp = angular.copy(vm.asc[col]);
                vm.asc = {};
                vm.asc[col] = !cp;
            } else {
                vm.asc = {};
                vm.asc[col] = !vm.asc[col];
            }
            var ascL = vm.asc[col] ? 'asc' : 'desc';
            vm.options.sort = col + ' ' + ascL;
            vm.options.page = 1;
            getList();
        }

        function searchByField() {
            vm.options.page = 1;
            vm.options.where = '';
            var arr = [];
            if (vm.searchBy.OrderStatusId) {
                arr.push('OrderStatusId;' + vm.searchBy.OrderStatusId);
            }
            if (vm.searchBy.CustomerId) {
                arr.push('CustomerId;' + vm.searchBy.CustomerId);
            }
            vm.options.where = arr.join(',');
            getList();
        }

        function getCustomerByOrderList() {
            vm.searchBy.CustomerId = $stateParams.customerId || '0';
            searchByField();
        }


        function onDeliveryDateChange(idx) {
            console.log(vm.order.OrderItems[idx].deliveryDate);
            // -2 of delivery date is Alert Date if it is greater than orderdate;
            var dileverydate = new Date(vm.order.OrderItems[idx].deliveryDate);
            var orderdate = new Date(vm.order.orderDate);
            var alertdate = dileverydate.setDate(dileverydate.getDate() - 2);
            var stitchingdate = dileverydate.setDate(dileverydate.getDate() - 3);
            //-5 of delivery date is Stitiching Date if it is greater then order date;


            vm.order.OrderItems[idx].stitchingDate = new Date(stitchingdate);
            vm.order.OrderItems[idx].alertDate = new Date(alertdate);
        }



        //$scope.dateOptions = {
        //    format: 'dd-MM-yyyy',
        //    maxDate: new Date(2020, 5, 22),
        //    minDate: new Date(1970, 1, 1),
        //    startingDay: 1
        //};
        //$scope.open = function () {
        //    $scope.popup.opened = true;
        //};
        //$scope.popup = {
        //    opened: false
        //};
        function getDayClass(data) {
            var date = data.date,
                mode = data.mode;
            if (mode === 'day') {
                var dayToCheck = new Date(date).setHours(0, 0, 0, 0);
                for (var i = 0; i < $scope.events.length; i++) {
                    var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);
                    if (dayToCheck === currentDay) {
                        return $scope.events[i].status;
                    }
                }
            }
            return '';
        }

        function goBack() {
            if (vm.order.id) {
                $state.go('app.order');
            }
            else {
                vm.isOrderProceed = !vm.isOrderProceed;
            }
        }

        function openCal() {
            if (!vm.order.id)
                vm.open_orderDate = !vm.open_orderDate;
        }