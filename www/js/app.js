// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.login', 'starter.menu', 'starter.customer','starter.home','starter.order','starter.dashboard'])

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

  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('login', {
        url: '/login',
        templateUrl: 'templates/login/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'vm'
      })
      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu/menu.html',
        controller: 'MenuCtrl',
        controllerAs: 'vm'
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
      ;
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');
  });
