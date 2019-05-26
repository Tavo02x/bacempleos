'use strict';

(function () {
    angular
        .module('BacApp.controllers.Zona2', [])
        .controller('Zona2Controller',
            function ($scope, $log, RESTService, __env) {

                $scope.model = {};
                
                $scope.Zona2 = {};
                $scope.Zona2.IdZona2 = 0;
                $scope.Zona2.Descripcion = '';
                $scope.Zona2.IdZona1 = '';
                $scope.Zona2.IdPais = '';
                $scope.Zona2.FechaCreacion = Date.now;
                $scope.Zona2.Borrado = false;

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
                        Id: data.IdZona2
                    }

                    RESTService.doPost(table, entity)
                        .then(callback);
                }

                $scope.loadGridZona2 = function () {
                    Utils.getGrid(ApiService.Zona2Grid, {}, 'tablezona2', ['Nombre', 'Zona 1', 'Ver'], 'nombreZona2,nombreZona1', $scope.Cargar2, 5, 'totalGrid', 'IdZona2,IdPais,IdZona1,Borrado');
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

                $scope.getZona = function () {
                    var data = {
                        id: { value: $scope.Zona2.IdPais }
                    }
                    
                    getWebApi(data, ApiService.Zona1Get,
                        function (response) {
                            $scope.Zona1 = response.Lista;
                        });
                }
                
                $scope.Guardar = function () {
                    $('#popupArea').modal('hide');
                    postWebApi(
                        $scope.Zona2,
                        ApiService.Zona2Save,
                        function (response) {
                            if (response.Resultado) {
                                Utils.MessageBox(
                                    'Mantenimiento Zonas',
                                    'Zona 2',
                                    response.Mensaje,
                                    "Content/Images/IconoConfimacion1.png",
                                    function () {
                                        $scope.loadGridZona2();
                                        $scope.LimpiarPaso2();
                                        this.modal('hide');
                                        $('#popupLoading').modal('hide');
                                    }
                                );
                            } else {
                                Utils.MessageBox(
                                    'Mantenimiento Zonas',
                                    'Zona 2',
                                    response.Mensaje,
                                    "Content/Images/IconoErrorGeneral.png",
                                    function () {
                                        $scope.loadGridZona2();
                                        $scope.LimpiarPaso2();
                                        this.modal('hide');
                                        $('#popupLoading').modal('hide');
                                    }
                                );
                            }
                        }
                    );
                }

                $scope.LimpiarPaso2 = function () {
                    $scope.$apply(function () {
                        $scope.model.pais = '';
                        $scope.Zona2.IdZona2 = 0;
                        $scope.Zona2.Descripcion = '';
                        $scope.Zona2.IdZona1 = '';
                        $scope.Zona2.IdPais = '';
                        $scope.Zona2.Borrado = false;
                    });
                }

                $scope.Cargar2 = function (param) {
                    $('#popupArea').modal('hide');
                    $scope.$apply(function () {
                        $scope.Zona2.IdZona2 = param.IdZona2;
                        $scope.Zona2.Descripcion = param.nombreZona2;
                        $scope.Zona2.IdPais = param.IdPais;
                        $scope.Zona2.IdZona1 = param.IdZona1;
                        $scope.getZona();
                        $scope.Zona2.FechaCreacion = Date.now;
                        $scope.Zona2.Borrado = param.Borrado;
                    });
                }

                $scope.Cancelar = function () {
                    $('#popupArea').modal('hide');
                    $scope.LimpiarPaso2();
                }

                $scope.SeguridadJS = function () {
                    var lista = JSON.parse(sessionStorage.getItem("role"));

                    if (lista != null) {
                        var listaJs = lista.where(function (x) { return x.TipoAccionId == 3 && x.ReferenciasAux == 'Zona2Controller'; });

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