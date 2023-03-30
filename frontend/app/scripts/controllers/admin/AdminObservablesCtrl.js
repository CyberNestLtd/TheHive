(function() {
    'use strict';

    angular.module('theHiveControllers').controller('AdminObservablesCtrl',
        function(ModalUtilsSrv, NotificationSrv, ObservableTypeSrv, types, i18n) {
            var self = this;

            self.dataTypeList = types;
            self.params = {
                newDataType: null
            };

            self.load = function() {
                ObservableTypeSrv.list()
                    .then(function(response) {
                        self.dataTypeList = response.data;
                    })
                    .catch(function(response) {
                        NotificationSrv.error('AdminObservablesCtrl', response.data, response.status);
                    });
            };

            self.addArtifactDataTypeList = function() {
                ObservableTypeSrv.create({
                    name: self.params.newDataType
                }).then(function(/*response*/) {
                    NotificationSrv.log(i18n.t("controllers.admin.AdminObservablesCtrl.observable_type_created_successfully", "Observable type created successfully"), 'success');
                    self.load();
                }).catch(function(response) {
                    NotificationSrv.error('AdminObservablesCtrl', response.data, response.status);
                });

                self.params.newDataType = '';
            };

            self.deleteArtifactDataType = function(type) {
                ModalUtilsSrv.confirm(i18n.t("controllers.admin.AdminObservablesCtrl.remove_observable_type", "Remove observable type"), s.sprintf(i18n.t("controllers.admin.AdminObservablesCtrl.are_your_sure_your_want_to_remove_the_observable_type", "Are your sure your want to remove the observable type ")+'<strong>%s</strong>', type.name), {
                    okText: i18n.t("controllers.admin.AdminObservablesCtrl.yes_remove_it", "Yes, remove it"),
                    flavor: 'danger',
                    isHtml: true
                })
                    .then(function() {
                        return ObservableTypeSrv.remove(type._id);
                    })
                    .then(function(/*response*/) {
                        NotificationSrv.log(i18n.t("controllers.admin.AdminObservablesCtrl.observable_type_removed_successfully", "Observable type removed successfully"), 'success');
                        self.load();
                    })
                    .catch(function(err){
                        if (err && !_.isString(err)) {
                            NotificationSrv.error('AdminObservablesCtrl', err.data, err.status);
                        }
                    });
            };
        });

})();
