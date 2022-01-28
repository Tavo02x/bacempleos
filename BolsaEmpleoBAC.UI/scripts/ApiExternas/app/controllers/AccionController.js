'use strict';

(function () {
    angular
        .module('BacApp.controllers.Accion', [])
        .controller('AccionController',
            function ($scope, $log, RESTService, __env) {

                $scope.model = {};
                $scope.model.AccionId = 0;
                $scope.model.Nombre = '';
                $scope.model.Descripcion = '';
                $scope.model.ReferenciaHTML = '';
                $scope.model.ReferenciaJS = '';
                $scope.model.ReferenciasWebAPI = '';
                $scope.model.ReferenciasAux = '';
                $scope.model.TipoAccionId = '';
                $scope.model.ParentId = '';
                $scope.model.Icono = '';
                $scope.model.URL = '';
                $scope.model.Borrado = false;

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
                        Id: $scope.model.AccionId
                    }

                    RESTService.doPost(table, entity)
                        .then(callback);
                }

                $scope.LoadGrid = function () {
                    Utils.getGrid(
                        ApiService.AccionGrid,
                        {},
                        'table',
                        ['Nombre', 'Descripción', 'Tipo', 'Padre', 'Ver'],
                        'Nombre,Descripcion,NombreTipoAccion,NombrePadre',
                        $scope.Cargar,
                        5,
                        'totalGrid',
                        'AccionId,ReferenciaHTML,ReferenciaJS,ReferenciasWebAPI,ReferenciasAux,TipoAccionId,ParentId,Icono,URL,Borrado');
                }

                $scope.GetTipo = function () {
                    RESTService.doGet(ApiService.AccionGetTipo, '')
                        .then(function (response) {
                            $scope.tipos = response.Lista;
                        })
                }

                $scope.GetAccion = function () {
                    RESTService.doGet(ApiService.AccionGet, '')
                        .then(function (response) {
                            $scope.acciones = response.Lista;
                        })
                }

                $scope.Guardar = function () {
                    $('#popupArea').modal('hide');
                    postWebApi(
                        $scope.model,
                        ApiService.AccionSave,
                        function (response) {
                            if (response.Resultado) {
                                Utils.MessageBox(
                                    'Mantenimiento Acciones',
                                    'Acción',
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
                                    'Mantenimiento Acciones',
                                    'Acción',
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

                $scope.Limpiar = function () {
                    $scope.$apply(function () {
                        $scope.model.AccionId = 0;
                        $scope.model.Nombre = '';
                        $scope.model.Descripcion = '';
                        $scope.model.ReferenciaHTML = '';
                        $scope.model.ReferenciaJS = '';
                        $scope.model.ReferenciasWebAPI = '';
                        $scope.model.ReferenciasAux = '';
                        $scope.model.TipoAccionId = '';
                        $scope.model.ParentId = '';
                        $scope.model.Icono = '';
                        $scope.model.URL = '';
                        $scope.model.Borrado = false;
                    });
                }

                $scope.Cancelar = function () {
                    $('#popupArea').modal('hide');
                    $scope.Limpiar();
                }

                $scope.Cargar = function (param) {
                    $('#popupArea').modal('show');
                    $scope.$apply(function () {
                        $scope.model.AccionId = param.AccionId;
                        $scope.model.Nombre = param.Nombre;
                        $scope.model.Descripcion = param.Descripcion;
                        $scope.model.ReferenciaHTML = param.ReferenciaHTML;
                        $scope.model.ReferenciaJS = param.ReferenciaJS;
                        $scope.model.ReferenciasWebAPI = param.ReferenciasWebAPI;
                        $scope.model.ReferenciasAux = param.ReferenciasAux;
                        $scope.model.TipoAccionId = param.TipoAccionId;
                        $scope.model.ParentId = param.ParentId;
                        $scope.model.Icono = param.Icono;
                        $scope.model.URL = param.URL;
                        $scope.model.Borrado = param.Borrado;
                    });
                }

                $scope.SeguridadJS = function () {
                    var lista = JSON.parse(sessionStorage.getItem("role"));

                    if (lista != null)
                    {
                        var listaJs = lista.where(function (x) { return x.TipoAccionId === 3 && x.ReferenciasAux === 'AccionController'; });

                        $.each(listaJs, function (index, value) {
                            var funcion = eval('$scope.' + value.ReferenciaJS);
                            if (funcion !== undefined && funcion !== null && funcion !== '') {
                                eval('$scope.' + value.ReferenciaJS + '= function () { }');
                            }
                        });
                    }
                    
                }
            });
})();