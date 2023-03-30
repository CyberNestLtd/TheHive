(function () {
    'use strict';

    angular.module('theHiveControllers').controller('PlatformStatusCtrl', function (ModalSrv, PlatformSrv, NotificationSrv, appConfig, i18n) {
        var self = this;

        self.appConfig = appConfig;
        self.indexStatus = {};
        self.checkStats = {};

        self.loading = {
            index: false,
            check: false
        }

        this.loadIndexStatus = function () {
            self.indexStatus = {};
            self.loading.index = true;

            PlatformSrv.getIndexStatus()
                .then(function (response) {
                    self.indexStatus = response.data;
                    self.loading.index = false;
                });
        }

        this.loadCheckStats = function () {
            self.loading.check = true;

            PlatformSrv.getCheckStats()
                .then(function (response) {
                    self.checkStats = response.data;
                    self.loading.check = false;
                })
        }

        this.$onInit = function () {
            self.loadIndexStatus();
            self.loadCheckStats();
        };

        this.exportReport = function () {
            var date = new moment().format('YYYYMMDD-HH:mmZ');
            var fileName = 'Platform-Status-Report-' + date + '.json';

            var content = {
                indexStatus: self.indexStatus,
                checkStatus: self.checkStats,
                schemaStatus: self.appConfig.schemaStatus
            };

            // Create a blob of the data
            var fileToSave = new Blob([JSON.stringify(content)], {
                type: 'application/json',
                name: fileName
            });

            // Save the file
            saveAs(fileToSave, fileName);
        }

        this.reindex = function (indexName) {
            var modalInstance = ModalSrv.confirm(
                i18n.t("controllers.admin.platform.PlatformStatusCtrl.reindex", "Reindex"),
                i18n.t("controllers.admin.platform.PlatformStatusCtrl.are_you_sure_you_want_to_trigger", "Are you sure you want to trigger") +' '+ indexName +' '+ i18n.t("controllers.admin.platform.PlatformStatusCtrl.data_reindex", "data reindex"), {
                okText: i18n.t("controllers.admin.platform.PlatformStatusCtrl.yes_reindex_it", "Yes, reindex it")
            }
            );

            modalInstance.result
                .then(function () {
                    PlatformSrv.runReindex(indexName);
                })
                .then(function (/*response*/) {
                    NotificationSrv.success(i18n.t("controllers.admin.platform.PlatformStatusCtrl.reindexing_of", "Reindexing of") +' '+ indexName +' '+ i18n.t("controllers.admin.platform.PlatformStatusCtrl.data_started_sucessfully", "data started successfully"));
                })
                .catch(function (err) {
                    if (!_.isString(err)) {
                        NotificationSrv.error(i18n.t("controllers.admin.platform.PlatformStatusCtrl.platform_status", "Platform status"), err.data, err.status);
                    }
                });
        };

        this.rebuildIndex = function (indexName) {
            var modalInstance = ModalSrv.confirm(
                i18n.t("controllers.admin.platform.PlatformStatusCtrl.drop_rebuild_index", "Drop & Rebuild Index"),
                i18n.t("controllers.admin.platform.PlatformStatusCtrl.are_you_sure_you_want_to_delete_and_rebuild ", "Are you sure you want to delete and rebuild ") +' '+indexName +' '+i18n.t("controllers.admin.platform.PlatformStatusCtrl.data_reindex", "data reindex") +' '+
                i18n.t("controllers.admin.platform.PlatformStatusCtrl.this_operation_will_drop_your_existing_data_index_and_create_a_new_one.", "This operation will drop your existing data index and create a new one."), {
                okText: i18n.t("controllers.admin.platform.PlatformStatusCtrl.yes_rebuild_it", "Yes, rebuild it"),
                flavor: 'danger'
            }
            );

            modalInstance.result
                .then(function () {
                    PlatformSrv.runRebuildIndex(indexName);
                })
                .then(function (/*response*/) {
                    NotificationSrv.success(i18n.t("controllers.admin.platform.PlatformStatusCtrl.rebuild_of", "Rebuild of") +' '+ indexName +' '+ i18n.t("controllers.admin.platform.PlatformStatusCtrl.data_started_sucessfully", "data started successfully"));
                })
                .catch(function (err) {
                    if (!_.isString(err)) {
                        NotificationSrv.error(i18n.t("controllers.admin.platform.PlatformStatusCtrl.platform_status", "Platform status"), err.data, err.status);
                    }
                });
        };

        this.checkControl = function (checkName) {
            var modalInstance = ModalSrv.confirm(
                i18n.t("controllers.admin.platform.PlatformStatusCtrl.data_health_check", "Data health check"),
                i18n.t("controllers.admin.platform.PlatformStatusCtrl.are_you_sure_you_want_to_trigger", "Are you sure you want to trigger") +' '+ checkName +' '+i18n.t("controllers.admin.platform.PlatformStatusCtrl.health_check", "health check"), {
                okText: i18n.t("controllers.admin.platform.PlatformStatusCtrl.yes_trigger_it", "Yes, trigger it")
            }
            );

            modalInstance.result
                .then(function () {
                    PlatformSrv.runCheck(checkName);
                })
                .then(function (/*response*/) {
                    NotificationSrv.success(i18n.t("controllers.admin.platform.PlatformStatusCtrl.data_health_check_of ", "Data health check of ") +' '+ checkName +' '+ i18n.t("controllers.admin.platform.PlatformStatusCtrl.started_sucessfully", "started successfully"));
                })
                .catch(function (err) {
                    if (!_.isString(err)) {
                        NotificationSrv.error(i18n.t("controllers.admin.platform.PlatformStatusCtrl.platform_status", "Platform status"), err.data, err.status);
                    }
                });
        }

    });
})();
