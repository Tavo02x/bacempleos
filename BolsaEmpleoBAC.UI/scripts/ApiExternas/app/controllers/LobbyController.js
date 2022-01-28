'use strict';

(function () {
    angular
        .module('BacApp.controllers.Lobby', [])
        .controller('LobbyController',
            function ($scope, $log, RESTService, __env) {

                $scope.model = {};
                $scope.model.pais = '';

                var getWebApi = function (data, table, callback) {

                    var query = Utils.getFilterParameters(data);
                    RESTService.doGet(table, query)
                        .then(callback);
                }

                var postWebApi = function (data, table, callback) {

                    var entity = {
                        Objeto: 0,
                        Lista: data,
                        Token: '',
                        Id: 0
                    }

                    RESTService.doPost(table, entity)
                        .then(callback);
                }

                $scope.reload = function () {
                    $scope.LoadGrid();
                    $scope.GetPuestos();
                    $scope.GetAplicantes();
                    $scope.GetUsuarios();
                    $scope.AdministradoresRegional();
                    $scope.AdministradoresPais();
                }

                $scope.getPaises = function () {
                    var decode = Utils.decodeJWT();

                    var data = {
                        id: { value: decode.UserId }
                    }

                    getWebApi(data, ApiService.GetPais,
                        function (response) {
                            $scope.Paises = response.Lista;
                        })
                }

                $scope.GetPuestos = function () {

                    if ($scope.model.pais != null) {
                        var decode = Utils.decodeJWT();
                        var arr = [];

                        if ($scope.model.pais == '') {
                            arr = eval(decode.PaisesFiltro);
                        } else {
                            arr.push($scope.model.pais);
                        }
                        var entity = arr;

                        postWebApi(entity, ApiService.LobbyGetPuestos,
                            function (response) {
                                $scope.puestos = response.Objeto;
                            });
                    }
                }

                $scope.GetAplicantes = function () {
                    if ($scope.model.pais != null) {
                        var decode = Utils.decodeJWT();
                        var arr = [];

                        if ($scope.model.pais == '') {
                            arr = eval(decode.PaisesFiltro);
                        } else {
                            arr.push($scope.model.pais);
                        }

                        var entity = arr;

                        postWebApi(entity, ApiService.LobbyGetAplicantes,
                            function (response) {
                                $scope.aplicantes = response.Objeto;
                            })
                    }
                }

                $scope.GetUsuarios = function () {
                    if ($scope.model.pais != null) {
                        var decode = Utils.decodeJWT();
                        var arr = [];

                        if ($scope.model.pais == '') {
                            arr = eval(decode.PaisesFiltro);
                        } else {
                            arr.push($scope.model.pais);
                        }

                        var entity = arr;

                        postWebApi(entity, ApiService.LobbyGetUsuarios,
                            function (response) {
                                $scope.usuarios = response.Objeto;
                            })
                    }
                }

                $scope.AdministradoresRegional = function () {
                    if ($scope.model.pais != null) {
                        var decode = Utils.decodeJWT();
                        var arr = [];

                        if ($scope.model.pais == '') {
                            arr = eval(decode.PaisesFiltro);
                        } else {
                            arr.push($scope.model.pais);
                        }

                        var entity = arr;

                        postWebApi(entity, ApiService.LobbyAdministradoresRegional,
                            function (response) {
                                $scope.administradoresR = response.Objeto;
                            })
                    }
                }

                $scope.AdministradoresPais = function () {
                    if ($scope.model.pais != null) {
                        var decode = Utils.decodeJWT();
                        var arr = [];

                        if ($scope.model.pais == '') {
                            arr = eval(decode.PaisesFiltro);
                        } else {
                            arr.push($scope.model.pais);
                        }

                        var entity = arr;

                        postWebApi(entity, ApiService.LobbyAdministradoresPais,
                            function (response) {
                                $scope.administradoresP = response.Objeto;
                            })
                    }
                }

                $scope.LoadGrid = function () {
                    var decode = Utils.decodeJWT();

                    var paises = [];
                    if ($scope.model.pais != '' && $scope.model.pais != null && $scope.model.pais != 0) {
                        paises.push($scope.model.pais);
                    } else
                    {
                        paises = eval(decode.PaisesFiltro);
                    }

                    var data =
                    {
                        IdPais: { value: paises, cond: OConfig.condEquals, type: OTypes.default, comp: '||' }
                    }

                    Utils.getGrid(ApiService.PuestoGrid, data, 'table', ['Título del puesto', 'Fecha de cierre', 'Ver'], 'Puesto,FechaCierreOferta', $scope.verificacion, 5, 'totalGrid', 'IdPuesto', 'IdPuesto', 'desc');
                }

                $scope.verificacion = function (param) {
                    sessionStorage.setItem("volver", __env.baseUrl + "Principal/Index");
                    window.location = __env.baseUrl + 'Puesto/VerPuesto?IdPuesto=' + param.IdPuesto;
                }

                $scope.VerificarSession = function () {

                    if (Utils.getUrlParameter("token") != '') {
                        if (sessionStorage.hasOwnProperty("token")) {
                            sessionStorage.removeItem('token');
                        }
                        var Token = Utils.getUrlParameter("token");
                        sessionStorage.setItem("token", Token);
                    }

                    if (!sessionStorage.hasOwnProperty("token")) {
                        var Token = Utils.getUrlParameter("token");
                        sessionStorage.setItem("token", Token);
                        console.log(Token);
                    }

                    if (!sessionStorage.hasOwnProperty("role")) {
                        var decode = Utils.decodeJWT();
                        var data = {
                            userid: { value: decode.UserId }
                        }

                        getWebApi(data, ApiService.GetMenu,
                            function (response) {
                                sessionStorage.setItem("role", response.Objeto);
                                $scope.SeguridadJS();
                            })
                    }
                    else { $scope.SeguridadJS(); }
                }
                
                //$scope.SeguridadJS = function () {



                //    var lista = JSON.parse(sessionStorage.getItem("role"));

                //    var listaJs = lista.where(function (x) { return x.TipoAccionId == 3 });

                //    $.each(listaJs, function (index, value) {
                //        var funcion = eval('$scope.' + value.ReferenciaJS);
                //        if (funcion != undefined && funcion != null && funcion != '') {
                //            eval('$scope.' + value.ReferenciaJS + '= function () { }');
                //        }
                //    });
                //}

                $scope.SeguridadJS = function () {

                    var lista = JSON.parse(sessionStorage.getItem("role"));
                    if (lista != null) {
                        var listaJs = lista.where(function (x) { return x.TipoAccionId == 3 && x.ReferenciasAux == 'LobbyController'; });

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