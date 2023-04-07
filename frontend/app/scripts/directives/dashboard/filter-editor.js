(function() {
    'use strict';
    angular.module('theHiveDirectives').directive('filterEditor', function($q, AuthenticationSrv, TaxonomyCacheSrv, UserSrv, TagSrv, UtilsSrv, i18n) {
        return {
            restrict: 'E',
            scope: {
                filter: '=?',
                entity: '=',
                metadata: '='
            },
            templateUrl: 'views/directives/dashboard/filter-editor.html',
            link: function(scope) {
                scope.operatorMap = {
                    empty: (i18n.t("controllers.directives.dashboard.filter-editor.is_empty") || "Is Empty"),
                    any: (i18n.t("controllers.directives.dashboard.filter-editor.any_of") || "Any of"),
                    none: (i18n.t("controllers.directives.dashboard.filter-editor.none_of") || "None Of"),
                    all: (i18n.t("controllers.directives.dashboard.filter-editor.all_of") || "All Of")
                };

                scope.dateOperator = {
                    empty: (i18n.t("controllers.directives.dashboard.filter-editor.empty") || "Empty"),
                    custom: (i18n.t("controllers.directives.dashboard.filter-editor.custom") || "Custom"),
                    today: (i18n.t("controllers.directives.dashboard.filter-editor.today") || "Today"),
                    last7days: (i18n.t("controllers.directives.dashboard.filter-editor.last_7_days") || "Last 7 days"),
                    last30days: (i18n.t("controllers.directives.dashboard.filter-editor.last_30_days") || "Last 30 days"),
                    last3months: (i18n.t("controllers.directives.dashboard.filter-editor.last_3_months") || "Last 3 months"),
                    last6months: (i18n.t("controllers.directives.dashboard.filter-editor.last_6_months") || "Last 6 months"),
                    lastyear: (i18n.t("controllers.directives.dashboard.filter-editor.last_year") || "Last year")
                };

                scope.setDateFilterOperator = function(filter, operator) {
                    operator = operator || 'custom';

                    var dateRange = UtilsSrv.getDateRange(operator);

                    if(operator === 'custom') {
                        filter.value = {
                            operator: operator,
                            from: dateRange.from,
                            to: dateRange.to
                        };
                    } else {
                        filter.value = {
                            operator: operator,
                            from: null,
                            to: null
                        };
                    }

                };

                scope.editorFor = function(filter) {
                    if (filter.type === null) {
                        return;
                    }
                    var field = scope.metadata[scope.entity].attributes[filter.field];

                    if(!field) {
                        return;
                    }

                    if(field.name === 'tags') {
                        return field.name;
                    }

                    var type = field.type;

                    if ((type === 'string' || type === 'number' || type === 'integer'  || type === 'float' ) && field.values.length > 0) {
                        return 'enumeration';
                    }

                    return filter.type;
                };

                scope.fromTagLibrary = function(filter) {
                    TaxonomyCacheSrv.openTagLibrary()
                        .then(function(tags){
                            filter.value.list = filter.value.list.concat(tags);
                        })
                }

                scope.promiseFor = function(filter, query) {
                    var field = scope.metadata[scope.entity].attributes[filter.field];

                    var promise = null;

                    if(field.name === 'tags') {
                        return TagSrv.autoComplete(query);
                    } else if(field.type === 'user') {
                        promise = AuthenticationSrv.current()
                            .then(function(user) {
                                return UserSrv.autoComplete(user.organisation, query);
                            });
                    } else if (field.values.length > 0) {
                        promise = $q.resolve(
                            _.map(field.values, function(item, index) {
                                return {
                                    text: item,
                                    label: field.labels[index] || item
                                };
                            })
                        );
                    } else {
                        promise = $q.resolve([]);
                    }

                    return promise.then(function(response) {
                        var list = [];

                        list = _.filter(response, function(item) {
                            var regex = new RegExp(query, 'gi');
                            return regex.test(item.label);
                        });

                        return $q.resolve(list);
                    });
                };
            }
        };
    });
})();
