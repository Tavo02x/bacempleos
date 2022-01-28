'use strict';

(function () {
    angular
        .module('BacApp.controllers.AreasLaborales', [])
        .controller('AreasLaboralesController',
            function ($scope, $log, RESTService, __env) {

                $scope.model = {};
                $scope.model.IdArea = 0;
                $scope.model.Area = '';
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
                        Id: data.IdArea
                    }

                    RESTService.doPost(table, entity)
                        .then(callback);
                }

                $scope.LoadGrid = function () {
                    Utils.getGrid(ApiService.AreaLaboralGrid, {}, 'table', ['Nombre', 'Ver'], 'Area', $scope.Cargar, 5, 'totalGrid', 'IdArea,Borrado');
                }

                $scope.Guardar = function () {
                    $('#popupArea').modal('hide');
                    postWebApi(
                        $scope.model,
                        ApiService.AreaLaboralSave,
                        function (response) {
                            if (response.Resultado) {
                                Utils.MessageBox(
                                    'Mantenimiento Áreas Laborales',
                                    'Áreas Laborales',
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
                                    'Mantenimiento Áreas Laborales',
                                    'Áreas Laborales',
                                    response.Mensaje,
                                    "Content/Images/IconoErrorGeneral.png",
                                    function () {
                                        $scope.LoadGrid();
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
                        $scope.model.IdArea = param.IdArea;
                        $scope.model.Area = param.Area;
                        $scope.model.Borrado = param.Borrado;
                    });
                }

                $scope.Limpiar = function (param) {
                    $('#popupArea').modal('hide');
                    $scope.$apply(function () {
                        $scope.model.IdArea = 0;
                        $scope.model.Area = '';
                        $scope.model.Borrado = false;
                    });
                }

                $scope.Cancelar = function () {
                    $scope.model.IdArea = 0;
                    $scope.model.Area = '';
                    $scope.model.Borrado = false;
                }

                $scope.SeguridadJS = function () {
                    var lista = JSON.parse(sessionStorage.getItem("role"));
                    if (lista != null) {
                        var listaJs = lista.where(function (x) { return x.TipoAccionId == 3 && x.ReferenciasAux == 'AreasLaboralesController'; });

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