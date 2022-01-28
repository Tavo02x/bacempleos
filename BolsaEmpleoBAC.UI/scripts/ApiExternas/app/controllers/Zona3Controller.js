'use strict';

(function () {
    angular
        .module('BacApp.controllers.Zona3', [])
        .controller('Zona3Controller',
            function ($scope, $log, RESTService, __env) {
                $scope.Zona3 = {};
                $scope.Zona3.IdZona3 = 0;
                $scope.Zona3.Descripcion = '';
                $scope.Zona3.IdPais = '';
                $scope.Zona3.IdZona1 = '';
                $scope.Zona3.IdZona2 = '';
                $scope.Zona3.Borrado = false;
                $scope.Zona3.FechaCreacion = Date.now;

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
                        Id: data.IdZona3
                    }

                    RESTService.doPost(table, entity)
                        .then(callback);
                }

                $scope.loadGridZona3 = function () {
                    Utils.getGrid(ApiService.Zona3Grid, {}, 'tablezona3', ['Nombre', 'Zona 2', 'Ver'], 'NombreZona3,NombreZona2', $scope.Cargar3, 5, 'totalGrid', 'IdZona3,IdPais,IdZona1,IdZona2,Borrado');
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
                        id: { value: $scope.Zona3.IdPais }
                    }

                    getWebApi(data, ApiService.Zona1Get,
                        function (response) {
                            $scope.Zona1 = response.Lista;
                        });
                }

                $scope.Zona2Get = function () {

                    var data = {
                        id: { value: $scope.Zona3.IdZona1 }
                    }
                    
                    getWebApi(data, ApiService.Zona2Get,
                        function (response) {
                            $scope.Zona2 = response.Lista;
                        }
                    );
                }

                $scope.Zona3Get = function () {
                    
                }

                $scope.Guardar = function () {
                    $('#popupArea').modal('hide');
                    postWebApi(
                        $scope.Zona3,
                        ApiService.Zona3Save,
                        function (response) {
                            if (response.Resultado) {
                                Utils.MessageBox(
                                    'Mantenimiento Zonas',
                                    'Zona 3',
                                    response.Mensaje,
                                    "Content/Images/IconoConfimacion1.png",
                                    function () {
                                        $scope.loadGridZona3();
                                        $scope.LimpiarPaso3();
                                        this.modal('hide');
                                        $('#popupLoading').modal('hide');
                                    }
                                );
                            } else {
                                Utils.MessageBox(
                                    'Mantenimiento Zonas',
                                    'Zona 3',
                                    response.Mensaje,
                                    "Content/Images/IconoErrorGeneral.png",
                                    function () {
                                        $scope.loadGridZona3();
                                        $scope.LimpiarPaso3();
                                        this.modal('hide');
                                        $('#popupLoading').modal('hide');
                                    }
                                );
                            }
                        }
                    );

                }

                $scope.LimpiarPaso3 = function () {
                    $scope.$apply(function () {
                        $scope.model.pais = '';
                        $scope.Zona3.IdZona3 = 0;
                        $scope.Zona3.Descripcion = '';
                        $scope.Zona3.IdZona1 = '';
                        $scope.Zona3.IdPais = '';
                        $scope.Zona3.IdZona2 = '';
                        $scope.Zona3.Borrado = false;
                    });
                }

                $scope.Cargar3 = function (param) {
                    $('#popupArea').modal('show');
                    $scope.$apply(function () {
                        $scope.Zona3.IdZona3 = param.IdZona3;
                        $scope.Zona3.Descripcion = param.NombreZona3;
                        $scope.Zona3.Borrado = param.Borrado;
                        $scope.Zona3.FechaCreacion = Date.now;
                        $scope.Zona3.IdPais = param.IdPais;
                        $scope.getZona();
                        $scope.Zona3.IdZona1 = param.IdZona1;
                        $scope.Zona2Get();
                        $scope.Zona3.IdZona2 = param.IdZona2;
                    });
                }

                $scope.Cancelar = function () {
                    $('#popupArea').modal('hide');
                    $scope.LimpiarPaso3();
                }

                $scope.SeguridadJS = function () {
                    var lista = JSON.parse(sessionStorage.getItem("role"));

                    if (lista != null) {
                        var listaJs = lista.where(function (x) { return x.TipoAccionId == 3 && x.ReferenciasAux == 'Zona3Controller'; });

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