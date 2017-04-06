(function () {
    'use strict';

    angular.module('starter').directive('convertToDate', convertToDate);

    convertToDate.$inject = ['dateFilter'];

    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

    function convertToDate(dateFilter) {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, ngModel) {
                ngModel.$parsers.push(function (val) {
                    return val != null ? new Date(val) : null;
                });
                ngModel.$formatters.push(function (val) {
                    //return val != null ? '' + val : null;
                    //return new Date(val);
                    //return (val != null | val != undefined) ? new Date(val) : null;
                    if(val && typeof val === 'object') {
                        //check for invalid date or 1-1-1970
                        var dt = new Date(val);
                        var format = formatDate(dt);
                        console.log(format);
                        if (format == '1970-01-01') {
                            return null;
                        }
                        return dt;
                    }
                    if (val && typeof val === 'string') {
                        return new Date(val);
                    }
                    return null;
                });
            }
        };
    }
})();