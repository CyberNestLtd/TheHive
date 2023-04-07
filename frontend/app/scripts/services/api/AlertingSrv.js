(function () {
    'use strict';
    angular.module('theHiveServices')
        .factory('AlertingSrv', function ($q, $http, $rootScope, StatSrv, StreamSrv, PSearchSrv, PaginatedQuerySrv, i18n) {

            var baseUrl = './api/alert';

            var similarityFilters = {
                'none': {
                    label: (i18n.t('controllers.services.api.AlertingSrv.none') || "None"),
                    filters: []
                },
                'open-cases': {
                    label: (i18n.t('controllers.services.api.AlertingSrv.open_cases') || "Open Cases"),
                    filters: [{
                        field: 'status',
                        type: 'enumeration',
                        value: {
                            list: [{
                                text: 'Open',
                                label: (i18n.t('controllers.services.api.AlertingSrv.open') || "Open")
                            }]
                        }
                    }]
                },
                'open-cases-last-7days': {
                    label: (i18n.t('controllers.services.api.AlertingSrv.open_cases_in_the_7_days') || "Open Cases in the last 7 days"),
                    filters: [{
                        field: 'status',
                        type: 'enumeration',
                        value: {
                            list: [{
                                text: 'Open',
                                label: (i18n.t('controllers.services.api.AlertingSrv.open') || "Open")
                            }]
                        }
                    }, {
                        field: '_createdAt',
                        type: 'date',
                        value: {
                            operator: 'last7days',
                            from: null,
                            to: null
                        }
                    }]
                },
                'open-cases-last-30days': {
                    label: (i18n.t('controllers.services.api.AlertingSrv.open_cases_in_the_30_days') || "Open Cases in the last 30 days"),
                    filters: [{
                        field: 'status',
                        type: 'enumeration',
                        value: {
                            list: [{
                                text: 'Open',
                                label: (i18n.t('controllers.services.api.AlertingSrv.open') || "Open")
                            }]
                        }
                    }, {
                        field: '_createdAt',
                        type: 'date',
                        value: {
                            operator: 'last30days',
                            from: null,
                            to: null
                        }
                    }]
                },
                'open-cases-last-3months': {
                    label: (i18n.t('controllers.services.api.AlertingSrv.open_cases_in_the_3_months') || "Open Cases in the last 3 months"),
                    filters: [{
                        field: 'status',
                        type: 'enumeration',
                        value: {
                            list: [{
                                text: 'Open',
                                label: (i18n.t('controllers.services.api.AlertingSrv.open') || "Open")
                            }]
                        }
                    }, {
                        field: '_createdAt',
                        type: 'date',
                        value: {
                            operator: 'last3months',
                            from: null,
                            to: null
                        }
                    }]
                },
                'open-cases-last-year': {
                    label: (i18n.t('controllers.services.api.AlertingSrv.open_cases_in_the_last_yaer') || "Open Cases in the last year"),
                    filters: [{
                        field: 'status',
                        type: 'enumeration',
                        value: {
                            list: [{
                                text: 'Open',
                                label: (i18n.t('controllers.services.api.AlertingSrv.open') || "Open")
                            }]
                        }
                    }, {
                        field: '_createdAt',
                        type: 'date',
                        value: {
                            operator: 'lastyear',
                            from: null,
                            to: null
                        }
                    }]
                },
                'resolved-cases': {
                    label: (i18n.t('controllers.services.api.AlertingSrv.resolved_cases') || "Resolved cases"),
                    filters: [{
                        field: 'status',
                        type: 'enumeration',
                        value: {
                            list: [{
                                text: 'Resolved',
                                label: (i18n.t('controllers.services.api.AlertingSrv.resolved') || "Resolved")
                            }]
                        }
                    }]
                }
            };

            var factory = {
                getSimilarityFilters: function () {
                    return similarityFilters;
                },
                getSimilarityFilter: function (name) {
                    return (similarityFilters[name] || {}).filters;
                },
                list: function (config, callback) {
                    return new PaginatedQuerySrv({
                        name: 'alerts',
                        root: undefined,
                        objectType: 'alert',
                        version: 'v1',
                        scope: config.scope,
                        sort: config.sort || ['-date'],
                        loadAll: config.loadAll || false,
                        pageSize: config.pageSize || 10,
                        filter: config.filter || undefined,
                        onUpdate: callback || undefined,
                        limitedCount: config.limitedCount || false,
                        operations: [
                            { '_name': 'listAlert' }
                        ],
                        extraData: ['importDate', 'caseNumber']
                    });
                },

                get: function (alertId) {
                    return $http.get('./api/v1/alert/' + alertId)
                        .then(function (response) {
                            return response.data;
                        });
                },

                create: function (alertId, data) {
                    return $http.post(baseUrl + '/' + alertId + '/createCase', data || {});
                },

                update: function (alertId, updates) {
                    return $http.patch(baseUrl + '/' + alertId, updates);
                },

                mergeInto: function (alertId, caseId) {
                    return $http.post(baseUrl + '/' + alertId + '/merge/' + caseId);
                },

                bulkMergeInto: function (alertIds, caseId) {
                    return $http.post(baseUrl + '/merge/_bulk', {
                        caseId: caseId,
                        alertIds: alertIds
                    });
                },

                canMarkAsRead: function (event) {
                    return !!!event.read;
                },

                canMarkAsUnread: function (event) {
                    return !!event.read;
                },

                markAsRead: function (alertId) {
                    return $http.post(baseUrl + '/' + alertId + '/markAsRead');
                },

                markAsUnread: function (alertId) {
                    return $http.post(baseUrl + '/' + alertId + '/markAsUnread');
                },

                follow: function (alertId) {
                    return $http.post(baseUrl + '/' + alertId + '/follow');
                },

                unfollow: function (alertId) {
                    return $http.post(baseUrl + '/' + alertId + '/unfollow');
                },

                forceRemove: function (alertId) {
                    return $http.delete(baseUrl + '/' + alertId, {
                        params: {
                            force: 1
                        }
                    });
                },

                bulkRemove: function (alertIds) {
                    return $http.post(baseUrl + '/delete/_bulk', {
                        ids: alertIds
                    }, {
                        params: {
                            force: 1
                        }
                    });
                },

                stats: function (scope) {
                    var field = 'status',
                        result = {},
                        statConfig = {
                            query: {},
                            objectType: 'alert',
                            field: field,
                            result: result
                        };

                    StreamSrv.addListener({
                        rootId: 'any',
                        objectType: 'alert',
                        scope: scope,
                        callback: function () {
                            StatSrv.get(statConfig);
                        }
                    });

                    return StatSrv.get(statConfig);
                }

            };

            return factory;
        });

})();
