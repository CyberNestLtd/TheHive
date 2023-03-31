(function() {
    'use strict';

    angular.module('theHiveControllers')
        .controller('CaseReopenModalCtrl', function($scope, $uibModalInstance, NotificationSrv, i18n) {

            $scope.cancel = function() {
                $uibModalInstance.dismiss();
            };

            $scope.confirm = function() {
                $scope.updateField('status', 'Open')
                    .then(function(caze) {
                        $scope.caze = caze;

                        NotificationSrv.log(i18n.t("controllers.case.CaseReopenModalCtrl.the_case_#", "The case #") + caze.number +' '+ i18n.t("controllers.case.CaseReopenModalCtrl.has_been_reopened", "has been reopened"), 'success');
                    });
                $uibModalInstance.close();
            };
        });
})();
