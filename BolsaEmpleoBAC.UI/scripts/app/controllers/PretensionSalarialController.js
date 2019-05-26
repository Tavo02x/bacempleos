'use strict';

(function () {
    angular
        .module('BacApp.controllers.PretensionSalarial', [])
        .controller('PretensionSalarialController',
            function ($scope, $log, RESTService, __env) {

                $scope.model = {};
                $scope.model.IdPretension = 0;
                $scope.model.Descripcion = '';
                $scope.model.SalarioMinimo = 0;
                $scope.model.SalarioMaximo = 0;
                $scope.model.IdMoneda = '';
                $scope.model.Borrado = false;
                $scope.model.FechaCreacion = Date.now;

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
                        Id: data.IdPretension
                    }

                    RESTService.doPost(table, entity)
                        .then(callback);
                }

                $scope.GetMonedas = function () {
                    getWebApi({}, ApiService.MonedaGet,
                        function (response) {
                            $scope.monedas = response.Lista;
                        })
                }

                $scope.LoadGrid = function () {
                    Utils.getGrid(ApiService.PretensionSalarialGrid, {}, 'table', ['Nombre', 'Mínimo', 'Máximo', 'Ver'], 'Descripcion,SalarioMinimo,SalarioMaximo', $scope.Cargar, 5, 'totalGrid', 'IdPretension,Borrado,IdMoneda');
                }

                $scope.Guardar = function () {
                    $('#popupArea').modal('hide');
                    postWebApi(
                        $scope.model,
                        ApiService.PretensionSalarialSave,
                        function (response) {
                            if (response.Resultado) {
                                Utils.MessageBox(
                                    'Mantenimiento Pretensiones Salariales',
                                    'Pretensión Salarial',
                                    response.Mensaje,
                                    "Content/Images/IconoConfimacion1.png",
                                    function () {
                                        $scope.LoadGrid();
                                        $scope.Limpiar();
                                        $('#popupLoading').modal('hide');
                                        this.modal('hide');
                                    }
                                );
                            } else {
                                Utils.MessageBox(
                                    'Mantenimiento Pretensiones Salariales',
                                    'Pretensión Salarial',
                                    response.Mensaje,
                                    "Content/Images/IconoErrorGeneral.png",
                                    function () {
                                        $scope.LoadGrid();
                                        $scope.Limpiar();
                                        $('#popupLoading').modal('hide');
                                        this.modal('hide');
                                    }
                                );
                            }
                        }
                    );
                }

                $scope.Cargar = function (param) {
                    $('#popupArea').modal('show');
                    $scope.$apply(function () {
                        $scope.model.IdPretension = param.IdPretension;
                        $scope.model.Descripcion = param.Descripcion;
                        $scope.model.SalarioMinimo = param.SalarioMinimo;
                        $scope.model.SalarioMaximo = param.SalarioMaximo;
                        $scope.model.IdMoneda = param.IdMoneda;
                        $scope.model.Borrado = param.Borrado;
                        $scope.model.FechaCreacion = Date.now;
                    });
                }

                $scope.Limpiar = function (param) {
                    $scope.$apply(function () {
                        $scope.model.IdPretension = 0;
                        $scope.model.Descripcion = '';
                        $scope.model.SalarioMinimo = 0;
                        $scope.model.SalarioMaximo = 0;
                        $scope.model.IdMoneda = '';
                        $scope.model.Borrado = false;
                        $scope.model.FechaCreacion = Date.now;
                    });
                }

                $scope.Cancelar = function () {
                    $('#popupArea').modal('hide');
                    $scope.model.IdPretension = 0;
                    $scope.model.Descripcion = '';
                    $scope.model.SalarioMinimo = 0;
                    $scope.model.SalarioMaximo = 0;
                    $scope.model.IdMoneda = '';
                    $scope.model.Borrado = false;
                    $scope.model.FechaCreacion = Date.now;
                }

                $scope.SeguridadJS = function () {
                    var lista = JSON.parse(sessionStorage.getItem("role"));

                    if (lista != null) {
                        var listaJs = lista.where(function (x) { return x.TipoAccionId == 3 && x.ReferenciasAux == 'PretensionSalarialController'; });

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