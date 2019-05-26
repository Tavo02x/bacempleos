'use strict';

(function () {
    angular
        .module('BacApp.controllers.login', [])
        .controller('loginController',
            function ($scope, $log, RESTService, __env) {

                $scope.model = {};  
                $scope.model.usuario ='';
                $scope.model.password = '';
                $scope.model.Correo = '';

                //validaciones
                $scope.UserInvalido = false;
                $scope.PasswordInvalido = false;
                $scope.EmailInvalido= false;

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

                $scope.Enviar = function () {

                    if ($scope.model.Correo == '') {
                        $scope.EmailInvalido = true;

                        Utils.MessageBox(
                            'Recuperar contraseña',
                            'Recuperar contraseña',
                            "Debe ingresar un correo válido.",
                            "Content/Images/IconoErrorGeneral.png",
                            function () {
                                $scope.model.Correo = '';
                                this.modal('hide');
                            }
                        );
                    } else
                    {
                        $scope.EmailInvalido = false
                    }
                    if ($scope.EmailInvalido == false)
                    {
                        postWebApi(
                            $scope.model.Correo,
                            ApiService.RecuperarClave,
                            function (response) {
                                if (response.Resultado) {
                                    Utils.MessageBox(
                                        'Recuperar contraseña',
                                        'Recuperar contraseña',
                                        "Se ha enviado un correo con las instrucciones.",
                                        "Content/Images/IconoConfimacion1.png",
                                        function () {
                                            $scope.model.Correo = '';
                                            $('#popupLoading').modal('hide');
                                            this.modal('hide');
                                        }
                                    );
                                } else {
                                    Utils.MessageBox(
                                        'Recuperar contraseña',
                                        'Recuperar contraseña',
                                        response.Mensaje,
                                        "Content/Images/IconoErrorGeneral.png",
                                        function () {
                                            $scope.model.Correo = '';
                                            $('#popupLoading').modal('hide');
                                            this.modal('hide');
                                        }
                                    );
                                }
                            }
                        );
                    }
                }

                $scope.login = function () {

                    if ($scope.model.usuario != '' && $scope.model.password != '') {
                        Session.Login($scope.model.usuario, $scope.model.password);
                    }
                    else
                    {
                        $scope.UserInvalido = true;
                        $scope.PasswordInvalido = true;
                    }
                };

                $scope.SessionEnd = function () {
                    Session.Logout();
                };

                $scope.registrar = function () {
                    window.location = __env.baseUrl + "Postulante/RegistroPostulante/";
                    //window.location = __env.baseUrl + "Registro/Index/";
                }

                $scope.SeguridadJS = function () {
                    var lista = JSON.parse(sessionStorage.getItem("role"));

                    if (lista != null) {
                        var listaJs = lista.where(function (x) { return x.TipoAccionId == 3 && x.ReferenciasAux == 'loginController'; });

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