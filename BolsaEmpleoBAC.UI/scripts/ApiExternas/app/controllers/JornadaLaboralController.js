'use strict';

(function () {
    angular
        .module('BacApp.controllers.JornadaLaboral', [])
        .controller('JornadaLaboralController',
            function ($scope, $log, RESTService, __env) {

                $scope.model = {};
                $scope.model.IdJornada = 0;
                $scope.model.Descripcion = '';
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
                        Id: data.IdJornada
                    }

                    RESTService.doPost(table, entity)
                        .then(callback);
                }

                $scope.LoadGrid = function () {
                    Utils.getGrid(ApiService.JornadaLaboralGrid, {}, 'table', ['Nombre', 'Ver'], 'Descripcion,Borrado', $scope.Cargar, 5, 'totalGrid','IdJornada,Borrado');
                }

                $scope.Guardar = function () {
                    $('#popupArea').modal('hide');
                    postWebApi(
                        $scope.model,
                        ApiService.JornadaLaboralSave,
                        function (response) {
                            if (response.Resultado) {
                                Utils.MessageBox(
                                    'Mantenimiento Jornada Laboral',
                                    'Jornada Laboral',
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
                                    'Mantenimiento Jornada Laboral',
                                    'Jornada Laboral',
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
                        $scope.model.IdJornada = param.IdJornada;
                        $scope.model.Descripcion = param.Descripcion;
                        $scope.model.Borrado = param.Borrado;
                        $scope.model.FechaCreacion = Date.now;
                    });
                }

                $scope.Limpiar = function (param) {
                    $scope.$apply(function () {
                        $scope.model.IdJornada = 0;
                        $scope.model.Descripcion = '';
                        $scope.model.Borrado = false;
                        $scope.model.FechaCreacion = Date.now;
                    });
                }

                $scope.Cancelar = function () {
                    $('#popupArea').modal('hide');
                    $scope.model.IdJornada = 0;
                    $scope.model.Descripcion = '';
                    $scope.model.Borrado = false;
                    $scope.model.FechaCreacion = Date.now;
                }

                $scope.SeguridadJS = function () {
                    var lista = JSON.parse(sessionStorage.getItem("role"));
                    if (lista != null) {
                        var listaJs = lista.where(function (x) { return x.TipoAccionId == 3 && x.ReferenciasAux == 'JornadaLaboralController'; });

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