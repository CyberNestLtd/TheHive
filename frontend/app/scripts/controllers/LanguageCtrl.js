(function() {
    'use strict';

    angular.module('theHiveControllers')
        .controller('LanguageController', function($scope, $translate, languageService) {

        var language = localStorage.getItem('language');
        if (language) {
            $translate.use(language);
        }

        $scope.selectedLanguage = languageService.getLanguage();
        $scope.languages = LANGUAGES;



        $scope.changeLanguage = function(langKey) {
            $translate.use(langKey);
            languageService.setLanguage(langKey);
            localStorage.setItem('language', langKey);
            location.reload();
            $translate.refresh()
            $translate.preferredLanguage(langKey);
        };

    })
})();
