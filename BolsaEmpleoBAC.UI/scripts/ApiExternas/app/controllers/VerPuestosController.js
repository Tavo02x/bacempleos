'use strict';

(function () {
    angular
        .module('BacApp.controllers.VerPuestos', [])
        .controller('VerPuestosController',
            function ($scope, $log, RESTService, __env) {
                
                $scope.model = {};
                $scope.model.nombre = '';
                $scope.count = 0;
                $scope.IsClean = false;

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

                $scope.LoadGrid = function () {
                    var decode = Utils.decodeJWT();

                    var paises = eval(decode.PaisesFiltro);

                    var data = {
                        IdPais: { value: paises, cond: OConfig.condEquals, type: OTypes.default, comp: '||' }
                    };
                    var width = Utils.GetWidthWindow();

                    if (width <= 764) {
                        Utils.getGrid(ApiService.PuestoGrid, data, 'tablaPostulantes', ['', ''], 'MobileColumn', $scope.redirect, 5, 'totalGrid', 'IdPuesto', 'IdPuesto', 'desc');
                    }
                    else {
                        Utils.getGrid(ApiService.PuestoGrid, data, 'tablaPostulantes', ['Título del puesto', 'País', 'Fecha de cierre', 'Ver'], 'Puesto,Pais,FechaCierreOferta', $scope.redirect, 5, 'totalGrid', 'IdPuesto', 'IdPuesto', 'desc');
                    }
                }

                $scope.redirect = function (param) {
                    sessionStorage.setItem("volver", __env.baseUrl + "Puesto/FiltrarPuestos");
                    window.location = __env.baseUrl + 'Puesto/VerPuesto?IdPuesto=' + (param == undefined ? 0 : param.IdPuesto + '&pais=' + param.Pais);
                }

                $scope.redirect1 = function (param) {
                    window.location = __env.baseUrl + 'Puesto/MantenimientoPuesto';
                }

                $scope.ClearFilter = function () {
                    $("input[name=areas]").each(function () {
                        var value = $(this).val();
                        var result = false;

                        $(this).prop('checked', result);
                        $(this).prop('value', result);

                    });

                    $("input[name=pais]").each(function () {
                        var value = $(this).val();
                        var result = false;

                        $(this).prop('checked', result);
                        $(this).prop('value', result);

                    });

                    $("input[name=publicado]").each(function () {
                        var value = $(this).val();
                        var result = false;

                        $(this).prop('checked', result);
                        $(this).prop('value', result);

                    });
                    $scope.IsClean = true;
                    $scope.LoadGrid();
                }

                $scope.Filter = function () {

                    var areas = [];
                    var paises = [];
                    var publicado = [];
                    if ($scope.IsClean) {
                        areas = Utils.getValCheckEdit('areas');
                        paises = Utils.getValCheckEdit('pais');
                        publicado = Utils.getValCheckEdit('publicado');
                    }
                    else {
                        areas = Utils.getValCheck('areas');
                        paises = Utils.getValCheck('pais');
                        publicado = Utils.getValCheck('publicado');
                    }

                    //$scope.model.nombre = '';

                    var width = Utils.GetWidthWindow();

                    var data =
                    {
                        Puesto: { value: $scope.model.nombre, cond: OConfig.condLike, type: OTypes.string, comp: '||' },
                        IdPais: { value: paises, cond: OConfig.condEquals, type: OTypes.default, comp: '||' },
                        IdArea: { value: areas, cond: OConfig.condEquals, type: OTypes.default, comp: '||' },
                        Publicado: { value: publicado, cond: OConfig.condEquals, type: OTypes.default, comp: '||' }
                    }

                    if (width <= 764) {
                        Utils.getGrid(ApiService.PuestoGrid, data, 'tablaPostulantes', ['', ''], 'MobileColumn', $scope.redirect, 5, 'totalGrid', 'IdPuesto', 'IdPuesto', 'desc');
                    }
                    else {
                        Utils.getGrid(ApiService.PuestoGrid, data, 'tablaPostulantes', ['Título del puesto', 'País', 'Fecha de cierre', 'Ver'], 'Puesto,Pais,FechaCierreOferta', $scope.redirect, 5, 'totalGrid', 'IdPuesto', 'IdPuesto', 'desc');
                    }
                }

                $scope.FilterWord = function () {

                    Utils.clearCheckboxes();
                    var nombre = $scope.model.nombre;

                    if (width <= 764) {
                        Utils.getGrid(ApiService.PuestoGrid, {}, 'tablaPostulantes', ['', ''], 'MobileColumn', $scope.redirect, 5, 'totalGrid', 'IdPuesto', 'IdPuesto', 'desc');
                    }
                    else {
                        Utils.getGrid(ApiService.PuestoGrid, {}, 'tablaPostulantes', ['Título del puesto', 'País', 'Fecha de cierre', 'Ver'], 'Puesto,Pais,FechaCierreOferta', $scope.redirect, 5, 'totalGrid', 'IdPuesto', 'IdPuesto', 'desc', ['Puesto'], nombre);
                    }
                }

                $scope.SeguridadJS = function () {
                    var lista = JSON.parse(sessionStorage.getItem("role"));

                    if (lista != null) {
                        var listaJs = lista.where(function (x) { return x.TipoAccionId == 3 && x.ReferenciasAux == 'VerPuestosController'; });

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