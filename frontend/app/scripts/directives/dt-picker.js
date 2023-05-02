(function() {
    'use strict';
    angular.module('theHiveDirectives').directive('dtPicker',['$translate', function($translate) {
        return {
            restrict: 'E',
            scope: {
                'date': '=',
                placeholder: '@?',
                required: '='
            },
            templateUrl: 'views/directives/dt-picker.html',
            link: function(scope, elem) {
                var langKey = localStorage.getItem('language');
                var dtEl = $(elem).find('.input-datetime');
                /*var dtPicker = */
                dtEl.datetimepicker({
                    format: 'dd-mm-yyyy',
                    weekStart: 1,
                    startView: 2,
                    minView: 2,
                    language: langKey,
                    autoclose: true
                });

                if(scope.date){
                    scope.dateValue = moment(scope.date).format('DD-MM-YYYY');
                }

                scope.$watch('date', function(date) {
                    if(date) {
                        scope.dateValue = moment(scope.date).format('DD-MM-YYYY');
                    } else {
                        scope.dateValue = null;
                    }
                });

                scope.$watch('dateValue', function(dateValue) {
                    var m = moment(dateValue, 'DD-MM-YYYY');
                    if (m.isValid()) {
                        scope.date = m.toDate();
                    } else {
                        scope.date = null;
                        $(elem).find('input').val(null);
                    }
                });

                scope.clear = function() {
                    scope.dateValue = null;
                };

                elem.on('$destroy', function() {
                    dtEl.datetimepicker('remove');
                });
            }
        };
    }]);

})();
