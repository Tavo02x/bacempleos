'use strict';

(function () {
    angular
        .module('BacApp.controllers.CambiarClave', [])
        .controller('CambiarClaveController',
            function ($scope, $log, RESTService, __env) {

                $scope.model = {};
                $scope.model.Usuario = '';
                $scope.model.ClaveAnterior = '';
                $scope.model.ClaveNueva = '';
                $scope.model.ClaveConfirmar = '';

                $scope.show1 = false;
                $scope.show2 = false;
                $scope.show3 = false;
                $scope.show4 = false;
                $scope.show5 = false;

                var getWebApi = function (data, table, callback) {

                    var query = Utils.getFilterParameters(data);
                    RESTService.doGet(table, query)
                        .then(callback);
                }

                var postWebApi = function (data, table, callback) {

                    //var query = Utils.getFilterObject(data);
                    var entity = {
                        Objeto: data,
                        Lista: [],
                        Token: '',
                        Id: 0
                    }

                    RESTService.doPost(table, entity)
                        .then(callback);
                }

                $scope.Cambiar = function () {
                    if ($scope.model.ClaveAnterior == '') {
                        $scope.show1 = true;
                    } else {
                        $scope.show1 = false;
                    }
                    if ($scope.model.ClaveNueva == '') {
                        $scope.show3 = true;
                    } else {
                        $scope.show3 = false;
                    }
                    if ($scope.model.ClaveConfirmar == '') {
                        $scope.show5 = true;
                    } else {
                        $scope.show5 = false;
                    }

                    if ($scope.model.ClaveAnterior == $scope.model.ClaveNueva) {
                        $scope.show2 = true;
                    } else {
                        $scope.show2 = false;
                    }

                    if ($scope.model.ClaveNueva != $scope.model.ClaveConfirmar) {
                        $scope.show4 = true;
                    } else {
                        $scope.show4 = false;
                    }

                    if (!$scope.show1 && !$scope.show2 && !$scope.show3 && !$scope.show4 && !$scope.show5) {
                        $scope.model.Usuario = Utils.getUrlParameter('username');
                        $scope.model.ClaveNueva = md5($scope.model.ClaveNueva);
                        postWebApi(
                            $scope.model,
                            ApiService.CambiarClave,
                            function (response) {
                                if (response.Resultado) {
                                    Utils.MessageBox(
                                        'Cambiar contraseña',
                                        'Cambiar contraseña',
                                        response.Mensaje,
                                        "Content/Images/IconoConfimacion1.png",
                                        function () {
                                            window.location = __env.baseUrl + 'Principal/Login';
                                        }
                                    );
                                } else {
                                    Utils.MessageBox(
                                        'Cambiar contraseña',
                                        'Cambiar contraseña',
                                        response.Mensaje,
                                        "Content/Images/IconoErrorGeneral.png",
                                        function () {
                                            $('#popupLoading').modal('hide');
                                            this.modal('hide');
                                        }
                                    );
                                }
                            }
                        );
                    }
                }

                $scope.SeguridadJS = function () {
                    var lista = JSON.parse(sessionStorage.getItem("role"));

                    if (lista != null) {
                        var listaJs = lista.where(function (x) { return x.TipoAccionId == 3 && x.ReferenciasAux == 'CambiarClaveController'; });

                        $.each(listaJs, function (index, value) {
                            var funcion = eval('$scope.' + value.ReferenciaJS);
                            if (funcion != undefined && funcion != null && funcion != '') {
                                eval('$scope.' + value.ReferenciaJS + '= function () { }');
                            }
                        });
                    }
                }
            });
})();