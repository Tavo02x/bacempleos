'use strict';

(function () {
    angular
        .module('BacApp.services.rest', [])
        .service('RESTService', function ($http, $q) {

            var RESTService = {};

            //This function will recieve a string and object to create a promise
            RESTService.doPost = function (url, data) {
                $('#popupLoading').modal('show');
                if (SessionStatus != undefined)
                {
                    if (SessionStatus.toLowerCase() == 'true') {
                        Session.Logout();
                    }
                }

                var config = {};
                if (sessionStorage.hasOwnProperty("token")) {
                    var token = sessionStorage.getItem("token");

                    var decode = Utils.decodeJWT();
                    config = {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + token,
                            'username': decode.unique_name
                        }
                    }
                }
                else {
                    config = {
                        headers: {}
                    }
                }

                var sendUrl = __env.apiUrl + url;
                var deferred = $q.defer();
                $http.post(sendUrl, data, config).then(
                    function (response) {
                        deferred.resolve(response.data);
                    },
                    function (response) {
                        deferred.reject(response);
                    }
                );

                return deferred.promise;
            };

            RESTService.doGet = function (url, query) {
                //$('#popupLoading').modal('show');
                var config = {};
                if (SessionStatus != undefined) {
                    if (SessionStatus.toLowerCase() == 'true') {
                        Session.Logout();
                    }
                }
                if (sessionStorage.hasOwnProperty("token")) {
                    var token = sessionStorage.getItem("token");

                    var decode = Utils.decodeJWT();
                    config = {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + token,
                            'username': decode.unique_name
                        }
                    }
                }
                else {
                    config = {
                        headers: {}
                    }
                }

                var sendUrl = __env.apiUrl + url;
                var deferred = $q.defer();
                $http.get(sendUrl + query, config).then(
                    function (response) {
                        //$('#popupLoading').modal('hide');
                        deferred.resolve(response.data);
                    },
                    function (response) {
                        //$('#popupLoading').modal('hide');
                        deferred.reject(response);
                    }
                );

                //$('#popupLoading').modal('hide');
                return deferred.promise;
            };

            return RESTService;
        });
})();