(function() {
    'use strict';
    angular.module('theHiveControllers').service('ModelService', function(i18n) {
        this.modelConstant = {
            edit: (i18n.t("controllers.admin.organisation.OrgModelCtrl.edit") || "Edit "),
            create: (i18n.t("controllers.admin.organisation.OrgModelCtrl.create") || "Create ")
        };
    });
    angular.module('theHiveControllers').controller('OrgModalCtrl',
        function($scope, $uibModalInstance, OrganisationSrv, organisation, mode, ModelService) {
            var self = this;

            $scope.modelConstant = ModelService.modelConstant;

            this.organisation = organisation;
            this.mode = mode;

            self.initForm = function(org) {
                self.formData = _.defaults(
                    _.pick(org || {}, '_id', 'name', 'description'), {
                        name: null
                    }
                );

                self.nameIsEditable = !!!self.formData._id || self.formData.name !== OrganisationSrv.defaultOrg;
            };



            self.ok = function() {
                $uibModalInstance.close(self.formData);
            };

            this.cancel = function() {
                $uibModalInstance.dismiss('cancel');
            };

            this.initForm(this.organisation);
        });
})();
