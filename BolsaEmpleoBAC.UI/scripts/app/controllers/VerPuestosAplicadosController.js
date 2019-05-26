'use strict';

(function () {
    angular
        .module('BacApp.controllers.VerPuestosAplicados', [])
        .controller('VerPuestosAplicadosController',
            function ($scope, $log, RESTService, __env) {

                var decode = Utils.decodeJWT();
                $scope.model = {};
                $scope.model.IdPostulante = decode.UserId;
                $scope.model.nombre = '';
                $scope.count = 0;
                var getWebApi = function (data, table, callback) {

                    var query = Utils.getFilterParameters(data);
                    RESTService.doGet(table, query)
                        .then(callback);
                }

                var postWebApi = function (data, table, callback) {

                    var query = Utils.getFilterObject(data);
                    var entity = {
                        Objeto: query,
                        Lista: [],
                        Token: '',
                        Id: 0
                    }

                    RESTService.doPost(table, query)
                        .then(callback);
                }

                $scope.AreaLaboralGet = function () {

                    getWebApi({}, ApiService.AreaLaboralGet,
                        function (response) {
                            $scope.Areas = response.Lista;
                        }
                    )
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

                $scope.CleanFilter = function ()
                {
                    $scope.getPaises();
                    $scope.LoadGrid();
                }

                $scope.LoadGrid = function () {
                    var decode = Utils.decodeJWT();

                    var idsPostulante = [];
                    idsPostulante.push(decode.UserId);                    

                    var data = {
                        IdUsuario: { value: decode.UserId, cond: OConfig.condEquals, type: OTypes.default, comp: '||' },
                    }

                    var width = Utils.GetWidthWindow();

                    if (width <= 764) {
                        Utils.getGrid(ApiService.PuestosAplicadosGrid, data, 'tablaPostulantes', ['', ''], 'MobileColumn', $scope.redirect, 5, 'totalGrid', 'IdPuesto,IdPostulante', 'FechaRegistro', 'desc');
                    }
                    else {
                        Utils.getGrid(ApiService.PuestosAplicadosGrid, data, 'tablaPostulantes', ['Título del puesto', 'País', 'Fecha de cierre', 'Ver'], 'Descripcion,Pais,FechaCierreOferta', $scope.redirect, 5, 'totalGrid', 'IdPuesto,IdPostulante', 'FechaRegistro', 'desc');
                    }
                }

                $scope.redirect = function (param) {
                    sessionStorage.setItem("volver", __env.baseUrl + "Puesto/Puestosaplicados");
                    window.location = __env.baseUrl + 'Puesto/VerPuesto?IdPuesto=' + (param == undefined ? 0 : param.IdPuesto);
                }

                $scope.Filter = function () {
                    var paises = Utils.getValCheck('pais');
                    var decode = Utils.decodeJWT();

                    var data = {
                        Descripcion: { value: $scope.model.nombre, cond: OConfig.condLike, type: OTypes.string },
                        IdUsuario: { value: decode.UserId, cond: OConfig.condEquals, type: OTypes.default, comp: '||' },
                        IdPais: { value: paises, cond: OConfig.condEquals, type: OTypes.default, comp: '||' },
                    }

                    var width = Utils.GetWidthWindow();

                    if (width <= 764) {
                        Utils.getGrid(ApiService.PuestosAplicadosGrid, data, 'tablaPostulantes', ['', ''], 'MobileColumn', $scope.redirect, 5, 'totalGrid', 'IdPuesto,IdPostulante', 'FechaRegistro', 'desc');
                    }
                    else {
                        Utils.getGrid(ApiService.PuestosAplicadosGrid, data, 'tablaPostulantes', ['Título del puesto', 'País', 'Fecha de cierre', 'Ver'], 'Descripcion,Pais,FechaCierreOferta', $scope.redirect, 5, 'totalGrid', 'IdPuesto,IdPostulante', 'FechaRegistro', 'desc');
                    }
                }

                $scope.FilterWord = function () {

                    /*Utils.clearCheckboxes();

                    var data =
                    {
                        Descripcion: { value: $scope.model.nombre, cond: OConfig.condEquals, type: OTypes.string },
                        IdPostulante: { value: decode.UserId, cond: OConfig.condEquals, type: OTypes.default }
                    }*/
                    var idsPostulante = [];
                    idsPostulante.push(decode.UserId);

                    var data = {
                        Descripcion: { value: $scope.model.nombre, cond: OConfig.condEquals, type: OTypes.string },
                        /*IdPostulante: {
                            value: decode.UserId, cond: OConfig.condEquals, type: OTypes.default
                        }*/
                        IdUsuario: { value: idsPostulante, cond: OConfig.condEquals, type: OTypes.default, comp: '||' },
                    }

                    var width = Utils.GetWidthWindow();

                    if (width <= 764) {
                        Utils.getGrid(ApiService.PuestosAplicadosGrid, data, 'tablaPostulantes', ['', ''], 'MobileColumn', $scope.redirect, 5, 'totalGrid', 'IdPuesto,IdPostulante', 'FechaRegistro', 'desc');
                    }
                    else {
                        Utils.getGrid(ApiService.PuestosAplicadosGrid, data, 'tablaPostulantes', ['Título del puesto', 'País', 'Fecha de cierre', 'Ver'], 'Descripcion,Pais,FechaCierreOferta', $scope.redirect, 5, 'totalGrid', 'IdPuesto,IdPostulante', 'FechaRegistro', 'desc', ['Descripcion'], nombre);
                    }
                }

                $scope.SeguridadJS = function () {
                    var lista = JSON.parse(sessionStorage.getItem("role"));

                    if (lista != null) {
                        var listaJs = lista.where(function (x) { return x.TipoAccionId == 3 && x.ReferenciasAux == 'VerPuestosAplicadosController'; });

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