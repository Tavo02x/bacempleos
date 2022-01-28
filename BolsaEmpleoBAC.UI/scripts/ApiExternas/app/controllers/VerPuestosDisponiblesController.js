'use strict';

(function () {
    angular
        .module('BacApp.controllers.VerPuestosDisponibles', [])
        .controller('VerPuestosDisponiblesController',
            function ($scope, $log, RESTService, __env) {

                $scope.model = {};
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

                $scope.getPreparacionAcademica = function () {

                    getWebApi({}, ApiService.GradoAcademicoGet,
                        function (response) {
                            $scope.PreparacionAcademica = response.Lista;
                        }
                    )
                }

                $scope.getJornadaLaboral = function () {

                    getWebApi({}, ApiService.JornadaLaboralGet,
                        function (response) {
                            $scope.JornadaLaboral = response.Lista;
                        }
                    )
                }

                $scope.CleanFilter = function ()
                {
                    $scope.AreaLaboralGet();
                    $scope.getPaises();
                    $scope.getJornadaLaboral();
                    $scope.getPreparacionAcademica();
                    $scope.LoadGrid();
                }

                $scope.LoadGrid = function () {
                    var width = Utils.GetWidthWindow();

                    var decode = Utils.decodeJWT();

                    var paises = eval(decode.PaisesFiltro);

                    var data = {
                        IdPais: { value: paises, cond: OConfig.condEquals, type: OTypes.default, comp: '||' }
                    };

                    if (width <= 764) {
                        Utils.getGrid(ApiService.PuestosDisponiblesGrid, data, 'tablaPostulantes', ['', ''], 'MobileColumn', $scope.redirect, 5, 'totalGrid', 'IdPuesto', 'IdPuesto', 'desc');
                    } else {
                        Utils.getGrid(ApiService.PuestosDisponiblesGrid, data, 'tablaPostulantes', ['Título del puesto', 'País', 'Fecha de cierre', 'Ver'], 'Puesto,Pais,FechaCierreOferta', $scope.redirect, 5, 'totalGrid', 'IdPuesto', 'IdPuesto', 'desc');
                    }
                }

                $scope.redirect = function (param) {
                    sessionStorage.setItem("volver", __env.baseUrl + "Puesto/Puestosdisponibles");
                    window.location = __env.baseUrl + 'Puesto/VerPuesto?IdPuesto=' + (param == undefined ? 0 : param.IdPuesto);
                }

                $scope.redirect1 = function (param) {
                    window.location = __env.baseUrl + 'Puesto/MantenimientoPuesto';
                }

                $scope.Filter = function () {
                    var decode = Utils.decodeJWT();
                    var areas = Utils.getValCheck('areas');
                    var paises = Utils.getValCheck('pais');
                    var academica = Utils.getValCheck('academica');
                    var jornada = Utils.getValCheck('jornada');

                    //$scope.model.nombre = '';

                    if (paises.length == 0)
                    {
                        paises = eval(decode.PaisesFiltro);
                    }

                    var data =
                    {
                        Puesto: { value: $scope.model.nombre, cond: OConfig.condLike, type: OTypes.string, comp: '||' },
                        IdPais: { value: paises, cond: OConfig.condEquals, type: OTypes.default, comp: '||' },
                        IdArea: { value: areas, cond: OConfig.condEquals, type: OTypes.default, comp: '||' },
                        IdJornada: { value: jornada, cond: OConfig.condEquals, type: OTypes.default, comp: '||' },
                        IdNivelAcademico: { value: academica, cond: OConfig.condEquals, type: OTypes.default, comp: '||' }
                    }

                    var width = Utils.GetWidthWindow();

                    if (width <= 764) {
                        Utils.getGrid(ApiService.PuestosDisponiblesGrid, data, 'tablaPostulantes', ['', ''], 'MobileColumn', $scope.redirect, 5, 'totalGrid', 'IdPuesto', 'IdPuesto', 'desc');
                    } else {
                        Utils.getGrid(ApiService.PuestosDisponiblesGrid, data, 'tablaPostulantes', ['Título del puesto', 'País', 'Fecha de cierre', 'Ver'], 'Puesto,Pais,FechaCierreOferta', $scope.redirect, 5, 'totalGrid', 'IdPuesto', 'IdPuesto', 'desc');
                    }
                }

                $scope.FilterWord = function () {

                    Utils.clearCheckboxes();
                    var nombre = $scope.model.nombre;

                    var width = Utils.GetWidthWindow();

                    if (width <= 764) {
                        Utils.getGrid(ApiService.PuestosDisponiblesGrid, {}, 'tablaPostulantes', ['', ''], 'MobileColumn', $scope.redirect, 5, 'totalGrid', 'IdPuesto', 'IdPuesto', 'desc');
                    } else {
                        Utils.getGrid(ApiService.PuestosDisponiblesGrid, {}, 'tablaPostulantes', ['Título del puesto', 'País', 'Fecha de cierre', 'Ver'], 'Puesto,Pais,FechaCierreOferta', $scope.redirect, 5, 'totalGrid', 'IdPuesto', 'IdPuesto', 'desc', ['Puesto'], nombre);
                    }
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
                    else
                    {
                        $scope.SeguridadJS();
                    }
                }

                $scope.SeguridadJS = function () {

                    var lista = JSON.parse(sessionStorage.getItem("role"));
                
                    if (lista != null) {
                    var listaJs = lista.where(function (x) { return x.TipoAccionId == 3 && x.ReferenciasAux == 'VerPuestosDisponiblesController'; });
         
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