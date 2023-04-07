(function() {
    'use strict';
    angular.module('theHiveServices')
        .value('duScrollOffset', 30)
        .value('CaseResolutionStatus', {
            Indeterminate: '{{ "controllers.resolutionStatus.indeterminate" | translate }}',
            FalsePositive: '{{ "controllers.resolutionStatus.falsePositive" | translate }}',
            TruePositive: '{{ "controllers.resolutionStatus.truePositive" | translate }}',
            Duplicated: '{{ "controllers.resolutionStatus.duplicated" | translate }}',
            Other: '{{ "controllers.resolutionStatus.other" | translate }}'
        })
        .value('CaseImpactStatus', {
            NoImpact: '{{ "controllers.impactStatus.noImpact" | translate }}',
            WithImpact: '{{ "controllers.impactStatus.withImpact" | translate }}',
            NotApplicable: '{{ "controllers.impactStatus.notApplicable" | translate }}'
        })
        .value('Severity', {
            keys: {
                Critical: 4,
                High: 3,
                Medium: 2,
                Low: 1
            },
            values: ['{{ "controllers.severity.unknown" | translate }}', '{{ "controllers.severity.low" | translate }}', '{{ "controllers.severity.medium" | translate }}', '{{ "controllers.severity.high" | translate }}', '{{ "controllers.severity.critical" | translate }}']
        })
        .value('AlertStatus', {
            values: ['{{ "controllers.alertStatus.new" | translate }}', '{{ "controllers.alertStatus.updated" | translate }}', '{{ "controllers.alertStatus.ignored" | translate }}', '{{ "controllers.alertStatus.imported" | translate }}']
        })
        .value('Tlp', {
            keys: {
                Red: 3,
                Amber: 2,
                Green: 1,
                White: 0
            },
            values: ['{{ "controllers.tlp.white" | translate }}', '{{ "controllers.tlp.green" | translate }}', '{{ "controllers.tlp.amber" | translate }}', '{{ "controllers.tlp.red" | translate }}']
        });
})();
