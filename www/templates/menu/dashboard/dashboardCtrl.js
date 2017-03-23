angular.module('starter.dashboard', [])
    .controller('DashboardCtrl', function ($scope, $state, $ionicModal, $timeout) {
        var vm = this;
        vm.bhavin = "Dashboard";
        
    });

// (function () {
//     'use strict';

//     angular.module('starter.dashboard').controller('DashboardCtrl', DashboardController);

//     DashboardCtrl.$inject = ['Restangular','$state'];
    
//     function DashboardCtrl(Restangular, $state) {
//         var vm = this;
//         vm.getList = getList;
//         vm.search = search;
//         vm.order = order;
//         vm.pageChange = pageChange;
//         vm.activate = activate;
//         vm.edit = edit;
//         vm.list = {
//             //one: [],
//             //two: [],
//             //three: [],
//             //four : []
//         }
//         vm.options = {
//             one: {
//                 pagesize: 10,
//                 totalItems: 0,
//                 page: 1,
//                 search: '',
//                 where: 'OrderStatusId;$or|a|1.2',
//                 sort: 'deliveryDate asc'
//             },
//             two: {
//                 pagesize: 10,
//                 totalItems: 0,
//                 page: 1,
//                 search: '',
//                 where: 'OrderStatusId;1',
//                 sort: 'deliveryDate asc'
//             },
//             three: {
//                 pagesize: 10,
//                 totalItems: 0,
//                 page: 1,
//                 search: '',
//                 where: 'OrderStatusId;3',
//                 sort: 'completeDate desc'
//             },
//             four: {
//                 pagesize: 10,
//                 totalItems: 0,
//                 page: 1,
//                 search: '',
//                 where: 'OrderStatusId;4',
//                 sort: 'cancelDate desc'
//             }
//         }

//         function edit(obj) {
//             $state.go('secure.edit-order', { id: obj.OrderId });
//         }
//         function getList(typ) {
//             Restangular.all('api/orderItem').getList(vm.options[typ]).then(function (res) {
//                 vm.list[typ] = res.data;
//                 vm.options[typ].totalItems = parseInt(res.headers('total'));
//             });
//         }
//         function activate() {
//             getList('one');
//             getList('two');
//             getList('three');
//             getList('four');
//         }

//         function pageChange(typ) {
//             getList(typ);
//         }
//         function search(typ) {
//             vm.options[typ].page = 1;
//             getList(typ);
//         }

//         function order(col, ord) {
//             vm.asc = !vm.asc;
//             var ascL = vm.asc ? 'asc' : 'desc';
//             vm.options.sort = col + ' ' + ascL;
//             vm.options.page = 1;
//             getList(typ);
//         }
//     }

// })();