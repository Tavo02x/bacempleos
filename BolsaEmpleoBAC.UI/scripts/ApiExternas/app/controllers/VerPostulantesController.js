'use strict';

(function () {
    angular
        .module('BacApp.controllers.VerPostulante', [])
        .controller('VerPostulantesController',
            function ($scope, $log, RESTService, __env) {

                $scope.model = {};  
                $scope.model.nombre ='';
                $scope.model.pais =0;

                var getWebApi = function (data, table, callback) {

                    //Utils.Show();
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

                var data =
                {
                    pagesize: { value: 10},
                    page: { value: 0 }
                }

                $scope.LoadGrid = function ()
                {
                    var paises = [];
                    var width = Utils.GetWidthWindow();

                    if ($scope.model.pais != '' && $scope.model.pais != null && $scope.model.pais != 0) {
                        paises.push($scope.model.pais);
                    }
                    else
                    {
                        var decode = Utils.decodeJWT();

                        paises = eval(decode.PaisesFiltro);
                    }

                    var data = {               
                        IdPais: { value: paises, cond: OConfig.condEquals, type: OTypes.default, comp: '||' }
                    };

                    if (width <= 764) {
                        Utils.getGrid(ApiService.PostulanteGrid, data, 'tablaPostulantes', ['', '', ''], 'ColumnMobile1,ColumnMobile2', $scope.Redirect, 5, 'totalGrid', 'IdUsuario,Email', 'IdUsuario', 'desc');
                    }
                    else {
                        Utils.getGrid(ApiService.PostulanteGrid, data, 'tablaPostulantes', ['Nombre', 'Pais', 'Area', 'Ver'], 'NombreCompleto,Pais,Area', $scope.Redirect, 5, 'totalGrid', 'IdUsuario,Email', 'IdUsuario', 'desc');
                    }
                }

                $scope.Redirect = function (param)
                {
                    window.location = __env.baseUrl + 'Postulante/VerPerfil?IdPostulante=' + param.Email;
                }

                $scope.Filter = function () {

                    var paises = [];
                    var width = Utils.GetWidthWindow();

                    if ($scope.model.pais != '' && $scope.model.pais != null && $scope.model.pais != 0) {
                        paises.push($scope.model.pais);
                    }
                    else {
                        var decode = Utils.decodeJWT();

                        paises = eval(decode.PaisesFiltro);
                    }
                    var data = {
                        NombreCompleto: { value: $scope.model.nombre, cond: OConfig.condLike, type: OTypes.string },
                        IdPais: { value: paises, cond: OConfig.condEquals, type: OTypes.default, comp: '||' }
                    };

                    if (width <= 764) {
                        Utils.getGrid(ApiService.PostulanteGrid, data, 'tablaPostulantes', ['', '', ''], 'ColumnMobile1,ColumnMobile2', $scope.Redirect, 5, 'totalGrid', 'IdUsuario,Email', 'IdUsuario', 'desc');
                    }
                    else {
                        Utils.getGrid(ApiService.PostulanteGrid, data, 'tablaPostulantes', ['Nombre', 'Pais', 'Area', 'Ver'], 'NombreCompleto,Pais,Area', $scope.Redirect, 5, 'totalGrid', 'IdUsuario,Email', 'IdUsuario', 'desc');
                    }
                }

                $scope.SeguridadJS = function () {
                    var lista = JSON.parse(sessionStorage.getItem("role"));

                    if (lista != null) {
                        var listaJs = lista.where(function (x) { return x.TipoAccionId == 3 && x.ReferenciasAux == 'VerPostulantesController'; });

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