// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngCordova', 'ngLodash', 'restangular', 'ngFileUpload', 'ui.bootstrap',
  'starter.login',
  'starter.menu', 'starter.customer', 'starter.home',
  'starter.order', 'starter.dashboard', 'starter.stats',
  'starter.user', 'starter.style', 'starter.design', 'starter.material',
  'starter.measurement', 'starter.orderstatus', 'starter.reports', 'starter.notifications', 'starter.designmodal' ,'checklist-model'
])

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
  })

  .config(function ($stateProvider, $urlRouterProvider, RestangularProvider) {
    RestangularProvider.setBaseUrl('http://localhost\:3002');
    RestangularProvider.setFullResponse(true);
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'templates/login/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'vm',
        onEnter: ['$state', 'sessionService', function ($state, sessionService) {
          if (sessionService.isAuthenticated()) {
            $state.go('app.home');
          }
        }],
      })
      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu/menu.html',
        controller: 'MenuCtrl',
        controllerAs: 'vm',
        onEnter: ['$state', 'sessionService', function ($state, sessionService) {
          if (!sessionService.isAuthenticated()) {
            $state.go('login');
          }
        }],
      })
      .state('app.home', {
        url: '/home',
        views: {
          'menuContent': {
            templateUrl: 'templates/menu/home/home.html',
            controller: 'HomeCtrl',
            controllerAs: 'vm'
          }
        }
      })
      .state('app.dashboard', {
        url: '/dashboard',
        views: {
          'menuContent': {
            templateUrl: 'templates/menu/dashboard/dashboard.html',
            controller: 'DashboardCtrl',
            controllerAs: 'vm'
          }
        }
      })
      .state('app.customer', {
        url: '/customer',
        views: {
          'menuContent': {
            templateUrl: 'templates/menu/customer/customer.html',
            controller: 'CustomerCtrl',
            controllerAs: 'vm'
          }
        }
      })
      .state('app.edit-customer', {
        url: '/edit-customer/{id}',
        params: {
          id: { value: 'new' }
        },
        views: {
          'menuContent': {
            templateUrl: 'templates/menu/customer/edit-customer.html',
            controller: 'CustomerCtrl',
            controllerAs: 'vm'
          }
        }
      })
      .state('app.order', {
        url: '/order',
        views: {
          'menuContent': {
            templateUrl: 'templates/menu/order/order.html',
            controller: 'OrderCtrl',
            controllerAs: 'vm'
          }
        }
      })
      .state('app.edit-order', {
        url: '/edit-order/{id}',
        params: {
          id: { value: 'new' }
        },
        views: {
          'menuContent': {
            templateUrl: 'templates/menu/order/edit-order.html',
            controller: 'OrderCtrl',
            controllerAs: 'vm'
          }
        }
      })
      .state('app.customer-order-detail', {
        url: '/customer/{customerId}/order',
        templateUrl: 'templates/menu/order/customer-order-detail.html',
        controller: 'OrderCtrl',
        controllerAs: 'vm'
      })
      .state('app.invoice', {
        url: '/invoice',
        templateUrl: 'templates/menu/order/invoice.html',
        controller: 'OrderCtrl',
        controllerAs: 'vm'
      })
      .state('app.stats', {
        url: '/stats',
        views: {
          'menuContent': {
            templateUrl: 'templates/menu/stats/stats.html',
            controller: 'StatsCtrl',
            controllerAs: 'vm'
          }
        }
      })
      .state('app.design', {
        url: '/design',
        views: {
          'menuContent': {
            templateUrl: 'templates/menu/settings/design/design.html',
            controller: 'DesignCtrl',
            controllerAs: 'vm'
          }
        }
      })
      .state('app.designModal', {
        url: '/designModal',
        views: {
          'menuContent': {
            templateUrl: 'templates/menu/settings/design/modal/designModal.html',
            controller: 'DesignModalCtrl',
            controllerAs: 'vm'
          }
        }
      })
      .state('app.edit-design', {
        url: '/edit-design/{id}',
        params: {
          id: { value: 'new' }
        },
        views: {
          'menuContent': {
            templateUrl: 'templates/menu/settings/design/edit-design.html',
            controller: 'DesignCtrl',
            controllerAs: 'vm'
          }
        }
      })
      .state('app.material', {
        url: '/material',
        views: {
          'menuContent': {
            templateUrl: 'templates/menu/settings/material/material.html',
            controller: 'MaterialCtrl',
            controllerAs: 'vm'
          }
        }
      })
      .state('app.edit-material', {
        url: '/edit-material/{id}',
        params: {
          id: { value: 'new' }
        },
        views: {
          'menuContent': {
            templateUrl: 'templates/menu/settings/material/edit-material.html',
            controller: 'MaterialCtrl',
            controllerAs: 'vm'
          }
        }
      })
      .state('app.measurement', {
        url: '/measurement',
        views: {
          'menuContent': {
            templateUrl: 'templates/menu/settings/measurement/measurement.html',
            controller: 'MeasurementCtrl',
            controllerAs: 'vm'
          }
        }
      })
      .state('app.edit-measurement', {
        url: '/edit-measurement/{id}',
        params: {
          id: { value: 'new' }
        },
        views: {
          'menuContent': {
            templateUrl: 'templates/menu/settings/measurement/edit-measurement.html',
            controller: 'MeasurementCtrl',
            controllerAs: 'vm'
          }
        }
      })
      .state('app.orderstatus', {
        url: '/orderstatus',
        views: {
          'menuContent': {
            templateUrl: 'templates/menu/settings/orderstatus/orderstatus.html',
            controller: 'OrderStatusCtrl',
            controllerAs: 'vm'
          }
        }
      })
      .state('app.edit-orderstatus', {
        url: '/edit-orderstatus/{id}',
        params: {
          id: { value: 'new' }
        },
        views: {
          'menuContent': {
            templateUrl: 'templates/menu/settings/orderstatus/edit-orderstatus.html',
            controller: 'OrderStatusCtrl',
            controllerAs: 'vm'
          }
        }
      })
      .state('app.style', {
        url: '/style',
        views: {
          'menuContent': {
            templateUrl: 'templates/menu/settings/style/style.html',
            controller: 'StyleCtrl',
            controllerAs: 'vm'
          }
        }
      })
      .state('app.edit-style', {
        url: '/edit-style/{id}',
        params: {
          id: { value: 'new' }
        },
        views: {
          'menuContent': {
            templateUrl: 'templates/menu/settings/style/edit-style.html',
            controller: 'StyleCtrl',
            controllerAs: 'vm'
          }
        }
      })
      .state('app.user', {
        url: '/user',
        views: {
          'menuContent': {
            templateUrl: 'templates/menu/settings/user/user.html',
            controller: 'UserCtrl',
            controllerAs: 'vm'
          }
        }
      })
      .state('app.edit-user', {
        url: '/edit-user/{id}',
        params: {
          id: { value: 'new' }
        },
        views: {
          'menuContent': {
            templateUrl: 'templates/menu/settings/user/edit-user.html',
            controller: 'UserCtrl',
            controllerAs: 'vm'
          }
        }
      })
      .state('app.reset-user', {
        url: '/reset-user',
        views: {
          'menuContent': {
            templateUrl: 'templates/menu/settings/user/reset-user.html',
            controller: 'UserCtrl',
            controllerAs: 'vm'
          }
        }
      })
      .state('app.reports', {
        url: '/reports',
        views: {
          'menuContent': {
            templateUrl: 'templates/menu/reports/reports.html',
            controller: 'ReportCtrl',
            controllerAs: 'vm'
          }
        }
      })
      .state('app.notifications', {
        url: '/notifications',
        views: {
          'menuContent': {
        templateUrl: 'templates/menu/notifications/notifications.html',
        controller: 'NotificationsCtrl',
        controllerAs: 'vm'
          }
        }
      });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');
  });
