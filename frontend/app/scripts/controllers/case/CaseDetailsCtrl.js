(function() {
    'use strict';

    angular.module('theHiveControllers').controller('CaseDetailsCtrl', function($scope, $state, $uibModal, PaginatedQuerySrv, CaseTabsSrv, UserSrv, TagSrv, i18n) {

        CaseTabsSrv.activateTab($state.current.data.tab);

        $scope.isDefined = false;
        $scope.state = {
            'editing': false,
            'isCollapsed': true
        };

        $scope.attachments = new PaginatedQuerySrv({
            name: 'case-attachments',
            skipStream: true,
            version: 'v1',
            loadAll: false,
            filter: {
                '_contains': 'attachment.id'
            },
            extraData: ['taskId'],
            pageSize: 100,
            operations: [
                { '_name': 'getCase', 'idOrName': $scope.caseId },
                { '_name': 'tasks' },
                { '_name': 'filter', '_ne':{'_field': 'status', '_value': 'Cancel'}},
                { '_name': 'logs' },
            ]
        });

        $scope.assignableUsersQuery = [
            {_name: 'getCase', idOrName: $scope.caseId},
            {_name: 'assignableUsers'}
        ];

        var connectors = $scope.appConfig.connectors;
        if(connectors.cortex && connectors.cortex.enabled) {
            $scope.actions = new PaginatedQuerySrv({
                name: 'case-actions',
                version: 'v1',
                scope: $scope,
                streamObjectType: 'action',
                loadAll: true,
                sort: ['-startDate'],
                pageSize: 100,
                operations: [
                    { '_name': 'getCase', 'idOrName': $scope.caseId },
                    { '_name': 'actions' }
                ],
                guard: function(updates) {
                    return _.find(updates, function(item) {
                        return (item.base.details.objectType === 'Case') && (item.base.details.objectId === $scope.caseId);
                    }) !== undefined;
                }
            });
        }

        $scope.openAttachment = function(attachment) {
            $state.go('app.case.tasks-item', {
                caseId: $scope.caze._id,
                itemId: attachment.extraData.taskId
            });
        };

        $scope.getCaseTags = function(query) {
            return TagSrv.autoComplete(query);
        };
    });

    angular.module('theHiveControllers').controller('CaseCustomFieldsCtrl', function($scope, $uibModal, NotificationSrv, ModalUtilsSrv, CustomFieldsSrv, CaseSrv, i18n) {

        $scope.getCustomFieldName = function(fieldDef) {
            return 'customFields.' + fieldDef.reference + '.' + fieldDef.type;
        };

        $scope.addCustomField = function(customField) {
            var modalInstance = $uibModal.open({
                scope: $scope,
                templateUrl: 'views/partials/case/case.add.field.html',
                controller: 'CaseAddMetadataConfirmCtrl',
                size: '',
                resolve: {
                    data: function() {
                        return customField;
                    }
                }
            });

            modalInstance.result.then(function() {
                var customFieldValue = {};
                customFieldValue[customField.type] = null;
                customFieldValue.order = _.max(_.pluck($scope.caze.customFields, 'order')) + 1;

                $scope.updateField('customFields.' + customField.reference, customFieldValue);
            });
        };

        $scope.updateCustomFieldsList = function() {
            CustomFieldsSrv.all().then(function(fields) {
                $scope.allCustomFields = _.omit(fields, _.pluck($scope.caze.customFields, 'name'));
                $scope.customFieldsAvailable = _.keys($scope.allCustomFields).length > 0;
            });
        };

        $scope.removeField = function(fieldId) {
            ModalUtilsSrv.confirm(i18n.t("controllers.case.CaseDetailsCtrl.remove_custom_field_value", "Remove custom field value"), i18n.t("controllers.case.CaseDetailsCtrl.are_you_sure_you_want_to_delete_this_case_custom_field_value?", "Are you sure you want to delete this case custom field value?"), {
                okText: i18n.t("controllers.case.CaseDetailsCtrl.yes,_remove_it", "Yes, remove it"),
                flavor: 'danger'
            })
                .then(function () {
                    return CaseSrv.removeCustomField(fieldId);
                })
                .then(function() {
                    var newList = _.reject($scope.caze.customFields, function(item) {
                        return item._id === fieldId
                    });

                    $scope.caze.customFields = newList;

                    $scope.updateCustomFieldsList();
                })
                .catch(function(err) {
                    if(err && !_.isString(err)) {
                        NotificationSrv.error(i18n.t("controllers.case.CaseDetailsCtrl.remove_custom_field", "Remove custom field"), err.data, err.status);
                    }
                });
        }

        $scope.keys = function(obj) {
            return _.keys(obj);
        };

        $scope.updateCustomFieldsList();

        $scope.$on('case:refresh-custom-fields', function() {
            $scope.updateCustomFieldsList();
        });

        $scope.$watch('caze.customFields', function() {
            $scope.updateCustomFieldsList();
        });
    });

    angular.module('theHiveControllers').controller('CaseAddMetadataConfirmCtrl', function($scope, $uibModalInstance, data) {
        $scope.data = data;

        $scope.cancel = function() {
            $uibModalInstance.dismiss(data);
        };

        $scope.confirm = function() {
            $uibModalInstance.close(data);
        };
    });

})();
