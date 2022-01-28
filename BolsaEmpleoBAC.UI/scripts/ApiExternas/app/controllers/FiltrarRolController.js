'use strict';

(function () {
    angular
        .module('BacApp.controllers.FiltrarRol', [])
        .controller('FiltrarRolController',
            function ($scope, $log, RESTService, __env) {

                $scope.model = {};
                $scope.model.IdArea = 0;
                $scope.model.Area = '';
                $scope.model.Borrado = 0;
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
                        Id: 0
                    }

                    RESTService.doPost(table, entity)
                        .then(callback);
                }

                $scope.LoadGrid = function () {
                    Utils.getGrid(ApiService.RolGrid, {}, 'table', ['Nombre', 'Ver'], 'Descripcion', $scope.Redirect, 5, 'totalGrid','IdRol,Borrado');
                }

                $scope.New = function () {
                    window.location = __env.baseUrl + 'Rol/Mantenimiento?IdRol=' + 0;
                }

                $scope.Redirect = function (param) {
                    window.location = __env.baseUrl + 'Rol/Mantenimiento?IdRol='+param.IdRol;
                }

                $scope.SeguridadJS = function () {
                    var lista = JSON.parse(sessionStorage.getItem("role"));

                    if (lista != null) {
                        var listaJs = lista.where(function (x) { return x.TipoAccionId == 3 && x.ReferenciasAux == 'FiltrarRolController'; });

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