(function() {
    'use strict';
    angular.module('theHiveServices')
        .value('duScrollOffset', 30)
        .value('CaseResolutionStatus', {
            Indeterminate: 'Indeterminate',
            FalsePositive: 'False Positive',
            TruePositive: 'True Positive',
            Duplicated: 'Duplicated',
            Other: 'Other'
        })
        .value('CaseImpactStatus', {
            NoImpact: 'No Impact',
            WithImpact: 'With Impact',
            NotApplicable: 'Not Applicable'
        })
        .value('Severity', {
            keys: {
                Critical: 4,
                High: 3,
                Medium: 2,
                Low: 1
            },
            values: ['unknown', 'low', 'medium', 'high', 'critical']
        })
        .value('AlertStatus', {
            values: ['new', 'updated', 'ignored', 'imported']
        })
        .value('Tlp', {
            keys: {
                Red: 3,
                Amber: 2,
                Green: 1,
                White: 0
            },
            values: ['white', 'green', 'amber', 'red']
        });
})();
