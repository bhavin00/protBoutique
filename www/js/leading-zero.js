(function () {
    'use strict';

    angular.module('starter').filter('leadingZero', leadingZero);

    leadingZero.$inject = [];

    function leadingZero() {
        return function (input) {
            if (input < 10) input = '0000' + input;
            else if (input >= 10 && input < 100) input = '000' + input;
            else if (input >= 100 && input < 1000) input = '00' + input;
            else if (input >= 1000 && input < 10000) input = '0' + input;
            return input;
        };
    }
})();