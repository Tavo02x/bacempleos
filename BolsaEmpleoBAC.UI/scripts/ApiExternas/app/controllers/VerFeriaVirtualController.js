'use strict';

(function () {
    angular
        .module('BacApp.controllers.VerFeriaVirtual', [])
        .controller('VerFeriaVirtualController',
            function ($scope, $log, RESTService, __env) {

                $scope.model = {};
                $scope.model.IdArea = 0;
                $scope.model.Area = '';
                $scope.model.Borrado = 0;
                $scope.model.FechaCreacion = Date.now;
                $scope.model.nombre = '';

                $scope.Create = function ()
                {
                    window.location = __env.baseUrl +'FeriaVirtual/MantenimientoFeriaVirtual'
                }

                var getWebApi = function (data, table, callback) {

                    //Utils.Show();
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

                $scope.LoadGrid = function () {
                    var lista = JSON.parse(sessionStorage.getItem("role"));

                    var value = lista.where(function (x) { return x.AccionId == 39 });

                    var decode = Utils.decodeJWT();

                    var paises = eval(decode.PaisesFiltro);

                    var data = {
                        IdPais: { value: paises, cond: OConfig.condLike, type: OTypes.string, comp: '||' }
                    };

                    var width = Utils.GetWidthWindow();

                    if (width <= 764) {
                        Utils.getGrid((value.length == 0 ? ApiService.FeriaGridTodas : ApiService.FeriaGrid), data, 'divFeriaVirtual', (value.length == 0 ? ['', ''] : ['', '']), (value.length == 0 ? 'MobileColumn' : 'MobileColumn1'), $scope.Redirect, 5, 'totalGrid', 'IdFeriaEmpleo', 'IdFeriaEmpleo', 'desc');
                    }
                    else {
                        Utils.getGrid((value.length == 0 ? ApiService.FeriaGridTodas : ApiService.FeriaGrid) , data, 'divFeriaVirtual', (value.length == 0 ? ['Título de la feria', 'País', 'Fecha de cierre', 'Postulante', 'Ver'] : ['Título de la feria', 'País', 'Fecha de cierre', 'Ver']), (value.length == 0 ? 'Descripcion,NombrePais,FechaFinal,Aplicantes' : 'Descripcion,NombrePais,FechaFinal'), $scope.Redirect, 5, 'totalGrid', 'IdFeriaEmpleo', 'IdFeriaEmpleo', 'desc');
                    }
                }

                $scope.FilterGrid = function () {

                    var paises = $scope.model.pais;

                    var lista = JSON.parse(sessionStorage.getItem("role"));

                    var value = lista.where(function (x) { return x.AccionId == 39 });

                    var decode = Utils.decodeJWT();
                  
                    var data = {};

                    if (paises == '' || paises == undefined) {
                        paises = eval(decode.PaisesFiltro);
                    }

                    data = {
                        Descripcion: { value: $scope.model.nombre, cond: OConfig.condLike, type: OTypes.string, comp: '&&'},
                        IdPais: { value: $scope.model.pais, cond: OConfig.condLike, type: OTypes.string, comp: '||' }
                    };
                    var width = Utils.GetWidthWindow();

                    if (width <= 764) {
                        Utils.getGrid((value.length == 0 ? ApiService.FeriaGridTodas : ApiService.FeriaGrid), data, 'divFeriaVirtual', (value.length == 0 ? ['', ''] : ['', '']), (value.length == 0 ? 'MobileColumn' : 'MobileColumn1'), $scope.Redirect, 5, 'totalGrid', 'IdFeriaEmpleo', 'IdFeriaEmpleo', 'desc');
                    }
                    else {
                        Utils.getGrid((value.length == 0 ? ApiService.FeriaGridTodas : ApiService.FeriaGrid), data, 'divFeriaVirtual', (value.length == 0 ? ['Título de la feria', 'País', 'Fecha de cierre', 'Postulante', 'Ver'] : ['Título de la feria', 'País', 'Fecha de cierre', 'Ver']), (value.length == 0 ? 'Descripcion,NombrePais,FechaFinal,Aplicantes' : 'Descripcion,NombrePais,FechaFinal'), $scope.Redirect, 5, 'totalGrid', 'IdFeriaEmpleo', 'IdFeriaEmpleo', 'desc');
                    }
                }

                $scope.Redirect = function (param) {
                    $scope.$apply(function () {
                        $scope.model.IdArea = param.IdArea;
                        $scope.model.Area = param.Area;
                        $scope.model.Borrado = param.Borrado;


                        var lista = JSON.parse(sessionStorage.getItem("role"));

                        var value = lista.where(function (x) { return x.AccionId == 39 });

                        window.location = __env.baseUrl + (value.length == 0 ? 'FeriaVirtual/DetalleFeriaVirtual?IdFeriaEmpleo=' + param.IdFeriaEmpleo : 'FeriaVirtual/DetalleFeriaVirtualPostulante?IdFeriaEmpleo=' + param.IdFeriaEmpleo);
                    });
                }

                $scope.Guardar = function () {
                    postWebApi(
                        $scope.model,
                        ApiService.AreaLaboralSave,
                        function (response) {
                            if (response.Resultado) {
                                Utils.MessageBox(
                                    'Mantenimiento Areas Laborales',
                                    'Areás Laborales',
                                    response.Mensaje,
                                    "~/Content/Images/IconoConfimacion1.png",
                                    function () {
                                        return false;
                                    }
                                );
                            } else {
                                Utils.MessageBox(
                                    'Mantenimiento Areas Laborales',
                                    'Areas Laborales',
                                    response.Mensaje,
                                    "~/Content/Images/IconoErrorGeneral.png",
                                    function () {
                                        return false;
                                    }
                                );
                            }
                        }
                    );
                }

                $scope.Cancelar = function () {
                    $scope.model.Descripcion = '';
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
                                $scope.LoadGrid();
                            })

                    }
                    else { $scope.LoadGrid(); }
                }

                $scope.SeguridadJS = function () {
                    var lista = JSON.parse(sessionStorage.getItem("role"));

                    if (lista != null) {
                        var listaJs = lista.where(function (x) { return x.TipoAccionId == 3 && x.ReferenciasAux == 'VerFeriaVirtualController'; });

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