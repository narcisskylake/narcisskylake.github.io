angular.module('passcodeService', []).service("PasscodeService", ["$http",
    function ($http) {
        let PasscodeService = [];

        let appsScriptAPI = 'https://script.google.com/macros/s/AKfycbypS5aFg-xc5WDe7f8gs79xi7ZPbx1LhUrKyVFP4DICGJEqEF4l/exec';

        PasscodeService.getPasscode = function(userPass) {
            let payload = {
                action: "getPasscode",
                userPass: userPass
            };

            return $http.get(appsScriptAPI, {params: payload}).then(function (response) {
                return response.data;
            });
        };


        PasscodeService.updateName = function(userName) {
            let payload = {
                action: "updateName",
                userPass: userName
            };

            return $http.get(appsScriptAPI, {params: payload}).then(function (response) { });
        };



        return PasscodeService;

    }
]);