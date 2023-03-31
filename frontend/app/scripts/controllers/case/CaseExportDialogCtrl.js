(function() {
    'use strict';

    angular
        .module('theHiveControllers')
        .controller('CaseExportDialogCtrl', function(MispSrv, NotificationSrv, clipboard, $uibModalInstance, caze, config, i18n) {
            var self = this;

            this.caze = caze;
            this.mode = '';
            this.servers = _.filter(config.servers, function(server) {
                return !server.purpose || (server.purpose === 'ImportAndExport' || server.purpose === 'ExportOnly');
            });
            this.failures = [];

            this.existingExports = {};
            this.loading = false;

            _.each(_.filter(this.caze.extraData.alerts || [], function(item) {
                return item.type === 'misp';
            }), function(item) {
                self.existingExports[item.source] = true;
            });

            var extractExportErrors = function (errors) {
                var result = [];

                result = errors.map(function(item) {
                    return {
                        data: item.object.dataType === 'file' ? item.object.attachment.name : item.object.data,
                        message: item.message
                    };
                });

                return result;
            };

            this.copyToClipboard = function() {
                clipboard.copyText(_.pluck(self.failures, 'data').join('\n'));
                $uibModalInstance.dismiss();
            };

            this.cancel = function() {
                $uibModalInstance.dismiss();
            };

            this.confirm = function() {
                $uibModalInstance.close();
            };

            this.export = function(server) {
                self.loading = true;
                self.failures = [];

                MispSrv.export(self.caze._id, server.name)
                .then(function(response){
                    var success = 0,
                        failure = 0;

                    if (response.status === 207) {
                        success = response.data.success.length;
                        failure = response.data.failure.length;

                        self.mode = 'error';
                        self.failures = extractExportErrors(response.data.failure);

                        NotificationSrv.log(i18n.t("controllers.case.CaseExportDialogCtrl.the_case_has_been_successfully_exported,_but", "The case has been successfully exported, but")+' '+ failure +' '+ i18n.t("controllers.case.CaseExportDialogCtrl.observable(s)_failed", "observable(s) failed"), 'warning');
                    } else {
                        success = angular.isArray(response.data) ? response.data.length : 1 ;
                        NotificationSrv.log(i18n.t("controllers.case.CaseExportDialogCtrl.the_case_has_been_successfully_exported_with", "The case has been successfully exported with")+' '+ success +' '+ i18n.t("controllers.case.CaseExportDialogCtrl.observable(s)", "observable(s)"), 'success');
                        $uibModalInstance.close();
                    }
                    self.loading = false;

                }, function(err) {
                    if(!err) {
                        return;
                    }

                    if (err.status === 400) {
                        self.mode = 'error';
                        self.failures = extractExportErrors(err.data);
                    } else {
                        NotificationSrv.error('CaseExportCtrl', i18n.t("controllers.case.CaseExportDialogCtrl.an_unexpected_error_occurred_while_exporting_case", "An unexpected error occurred while exporting case"), err.status);
                    }
                    self.loading = false;
                });
            };
        });
})();
