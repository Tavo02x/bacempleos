'use strict';

(function () {
    angular
        .module('BacApp.controllers.Zona', [])
        .controller('ZonaController',
            function ($scope, $log, RESTService, __env) {

                $scope.Zona1 = {};
                $scope.Zona1.IdZona1 = 0;
                $scope.Zona1.Descripcion = '';
                $scope.Zona1.IdPais = '';
                $scope.Zona1.FechaCreacion = Date.now;
                $scope.Zona1.Borrado = false;

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
                        Id: data.IdZona1
                    }

                    RESTService.doPost(table, entity)
                        .then(callback);
                }

                $scope.loadGridZona1 = function () {
                    Utils.getGrid(ApiService.Zona1Grid, {}, 'tablezona1', ['Nombre', 'País', 'Ver'], 'nombreZona,nombrePais', $scope.Cargar1, 5, 'totalGrid', 'IdZona1,IdPais,Borrado');
                }

                $scope.getPaises = function () {
                    var decode = Utils.decodeJWT();

                    var data = {
                        id: { value: decode.UserId }
                    }

                    getWebApi({}, ApiService.GetPaises,
                        function (response) {
                            $scope.Paises = response.Lista;
                        })
                }
                
                $scope.Guardar = function () {
                    $('#popupArea').modal('hide');
                    postWebApi(
                        $scope.Zona1,
                        ApiService.Zona1Save,
                        function (response) {
                            if (response.Resultado) {
                                Utils.MessageBox(
                                    'Mantenimiento Zonas',
                                    'Zona 1',
                                    response.Mensaje,
                                    "Content/Images/IconoConfimacion1.png",
                                    function () {
                                        $scope.loadGridZona1();
                                        $scope.LimpiarPaso1();
                                        this.modal('hide');
                                        $('#popupLoading').modal('hide');
                                    }
                                );
                            } else {
                                Utils.MessageBox(
                                    'Mantenimiento Zonas',
                                    'Zona 1',
                                    response.Mensaje,
                                    "Content/Images/IconoErrorGeneral.png",
                                    function () {
                                        $scope.loadGridZona1();
                                        $scope.LimpiarPaso1();
                                        this.modal('hide');
                                        $('#popupLoading').modal('hide');
                                    }
                                );
                            }
                        }
                    );
                }

                $scope.LimpiarPaso1 = function () {
                    $scope.$apply(function () {
                        $scope.Zona1.IdPais = '';
                        $scope.Zona1.IdZona1 = 0;
                        $scope.Zona1.Descripcion = '';
                        $scope.Zona1.Borrado = false;
                        $scope.Zona1.FechaCreacion = Date.now;
                    });
                }

                $scope.Cargar1 = function (param) {
                    $('#popupArea').modal('show');
                    $scope.$apply(function () {
                        $scope.Zona1.IdZona1 = param.IdZona1;
                        $scope.Zona1.Descripcion = param.nombreZona;
                        $scope.Zona1.IdPais = param.IdPais;
                        $scope.Zona1.FechaCreacion = Date.now;
                        $scope.Zona1.Borrado = param.Borrado;
                    });
                }

                $scope.Cancelar = function () {
                    $scope.LimpiarPaso1();
                }

                $scope.SeguridadJS = function () {
                    var lista = JSON.parse(sessionStorage.getItem("role"));

                    if (lista != null) {
                        var listaJs = lista.where(function (x) { return x.TipoAccionId == 3 && x.ReferenciasAux == 'ZonaController'; });

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