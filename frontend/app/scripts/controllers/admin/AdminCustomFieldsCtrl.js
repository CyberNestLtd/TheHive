(function() {
    'use strict';

    angular.module('theHiveControllers').controller('AdminCustomFieldsCtrl',
        function($scope, $uibModal, CustomFieldsSrv, NotificationSrv, ModalUtilsSrv, i18n) {
            var self = this;

            self.reference = {
                types: ['string', 'number', 'boolean', 'date']
            };

            self.state = {
                sort: 'name',
                asc: true
            };

            self.sortBy = function(field) {
                if(self.state.sort === field) {
                    self.state.asc = !self.state.asc;
                } else {
                    self.state.sort = field;
                    self.state.asc = true;
                }
            };

            self.customFields = [];

            self.initCustomfields = function() {
                self.formData = {
                    name: null,
                    label: null,
                    description: null,
                    type: null,
                    options: []
                };

                CustomFieldsSrv.list()
                    .then(function(response) {
                        self.customFields = response.data;
                    })
                    .catch(function(response) {
                        NotificationSrv.error('AdminCustomfieldsCtrl', response.data, response.status);
                    });
            };

            self.showFieldDialog = function(customField) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'views/partials/admin/custom-field-dialog.html',
                    controller: 'AdminCustomFieldDialogCtrl',
                    controllerAs: '$vm',
                    size: 'lg',
                    resolve: {
                        customField: function() {
                            return customField.id ? angular.copy(customField, {}) : {};
                        }
                    }
                });

                modalInstance.result.then(function(/*data*/) {
                    self.initCustomfields();
                    CustomFieldsSrv.clearCache();
                    $scope.$emit('custom-fields:refresh');
                })
                .catch(function(err) {
                    if(err && !_.isString(err)) {
                        NotificationSrv.error('AdminCustomfieldsCtrl', err.data, err.status);
                    }
                });
            };

            self.deleteField = function(customField) {
                CustomFieldsSrv.usage(customField)
                    .then(function(response) {
                        var usage = response.data,
                            message,
                            isHtml = false;


                        if (usage.total === 0) {
                            message = i18n.t("controllers.admin.AdminCustomFieldsCtrl.are_you_sure_you_want_to_delete_this_custom_field") || "Are you sure you want to delete this custom field?";
                        } else {
                            var segs = [
                                i18n.t("controllers.admin.AdminCustomFieldsCtrl.are_you_sure_you_want_to_delete_this_custom_field") || "Are you sure you want to delete this custom field?",
                                '<br />',
                                '<br />',
                                i18n.t("controllers.admin.AdminCustomFieldsCtrl.this_custom_field_is_used_by") || "This custom field is used by:",
                                '<ul>'
                              ];

                            if(usage.case) {
                                segs.push('<li>' + usage.case + ' ' + (usage.case > 1 ? i18n.t("controllers.admin.AdminCustomFieldsCtrl.cases", "cases") : i18n.t("controllers.admin.AdminCustomFieldsCtrl.case", "case")) + '</li>');
                            }

                            if(usage.alert) {
                                segs.push('<li>' + usage.alert + ' ' + (usage.alert > 1 ? i18n.t("controllers.admin.AdminCustomFieldsCtrl.alerts", "alerts") : i18n.t("controllers.admin.AdminCustomFieldsCtrl.alert", "alert")) + '</li>');
                            }

                            if(usage.caseTemplate) {
                                segs.push('<li>' + usage.caseTemplate + ' case ' + ' ' + (usage.caseTemplate > 1 ? i18n.t("controllers.admin.AdminCustomFieldsCtrl.templates", "templates") : i18n.t("controllers.admin.AdminCustomFieldsCtrl.template", "template")) + '</li>');
                            }

                            segs.push('</ul>');

                            message = segs.join('');
                            isHtml = true;
                        }

                        return ModalUtilsSrv.confirm(i18n.t("controllers.admin.AdminCustomFieldsCtrl.remove_custom_field", "Remove custom field"), message, {
                            okText: i18n.t("controllers.admin.AdminCustomFieldsCtrl.yes_remove_it", "Yes, remove it"),
                            flavor: 'danger',
                            isHtml: isHtml
                        });
                    })
                    .then(function(/*response*/) {
                        return CustomFieldsSrv.removeField(customField);
                    })
                    .then(function() {
                        NotificationSrv.log(i18n.t("controllers.admin.AdminCustomFieldsCtrl.the_custom_field_has_been_removed_successfully", "The custom field has been removed successfully"), 'success');

                        self.initCustomfields();
                        CustomFieldsSrv.clearCache();
                        $scope.$emit('custom-fields:refresh');
                    })
                    .catch(function(err) {
                        if(err && !_.isString(err)) {
                            NotificationSrv.error('AdminCustomFields', err.data, err.status);
                        }
                    });
            };

            self.initCustomfields();
        });
})();
