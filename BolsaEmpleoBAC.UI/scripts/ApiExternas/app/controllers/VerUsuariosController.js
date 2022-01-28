'use strict';

(function () {
    angular
        .module('BacApp.controllers.VerUsuarios', [])
        .controller('VerUsuariosController',
            function ($scope, $log, RESTService, __env) {

                $scope.model = {};
                $scope.model.IdDescapacidad = 0;
                $scope.model.NombreCompleto = '';
                $scope.model.Borrado = 0;
                $scope.model.FechaCreacion = Date.now;
                $scope.model.pais = '';
                $scope.Paises = {};

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

                $scope.LoadGrid = function () {
                    var paises = [];
                    var width = Utils.GetWidthWindow();

                    if ($scope.model.pais != '' && $scope.model.pais != null && $scope.model.pais != 0) {
                        paises.push($scope.model.pais);
                    }
                    else {
                        var decode = Utils.decodeJWT();
                        paises = eval(decode.PaisesFiltro);
                    }

                    var roles = [];
                    var lista = JSON.parse(sessionStorage.getItem("role"));
                    var listaJs = lista.where(function (x) { return x.TipoAccionId == 6 });
                    if (listaJs.length > 0) {
                        roles = listaJs[0].ReferenciasAux.split(',');
                    }

                    var data = {
                        IdRol: { value: roles, cond: OConfig.condLike, type: OTypes.string, comp: '||' },
                        IdPais: { value: paises, cond: OConfig.condLike, type: OTypes.string, comp: '||' }
                    };

                    if (width <= 764) {
                        Utils.getGrid(ApiService.UsuarioGrid, data, 'table', ['', ''], 'ColumnMobile', $scope.Cargar, 5, 'totalGrid', 'IdUsuario,Borrado,IdPais', 'IdUsuario', 'desc');
                    }
                    else {
                        Utils.getGrid(ApiService.UsuarioGrid, data, 'table', ['Nombre', 'Email', 'Rol', 'País', 'Ver'], 'NombreCompleto,Usuario,NombreRol,NombrePais', $scope.Cargar, 5, 'totalGrid', 'IdUsuario,Borrado,IdPais', 'IdUsuario', 'desc');
                    }
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
                        NombreCompleto: { value: $scope.model.NombreCompleto, cond: OConfig.condLike, type: OTypes.string, comp: '||' },
                        IdPais: { value: paises.join(), cond: OConfig.condLike, type: OTypes.string, comp: '||' }
                    };

                    if (width <= 764) {
                        Utils.getGrid(ApiService.UsuarioGrid, data, 'table', ['', ''], 'ColumnMobile', $scope.Cargar, 5, 'totalGrid', 'IdUsuario,Borrado,IdPais', 'IdUsuario', 'desc');
                    }
                    else {
                        Utils.getGrid(ApiService.UsuarioGrid, data, 'table', ['Nombre', 'Email', 'Rol', 'País', 'Ver'], 'NombreCompleto,Usuario,NombreRol,NombrePais', $scope.Cargar, 5, 'totalGrid', 'IdUsuario,Borrado,IdPais', 'IdUsuario', 'desc');
                    }
                }

                $scope.New = function () {
                    window.location = __env.baseUrl + 'Usuario/Usuarios?IdUsuario=0';
                }

                $scope.Cargar = function (param) {
                    window.location = __env.baseUrl + 'Usuario/Usuarios?IdUsuario=' + param.IdUsuario;
                }

                $scope.Guardar = function () {
                    postWebApi(
                        $scope.model,
                        ApiService.DiscapacidadSave,
                        function (response) {
                            if (response.Resultado) {
                                Utils.MessageBox(
                                    'Mantenimiento de Usuario',
                                    'Usuario',
                                    response.Mensaje,
                                    "Content/Images/IconoConfimacion1.png",
                                    function () {
                                        return false;
                                    }
                                );
                            } else {
                                Utils.MessageBox(
                                    'Mantenimiento de Usuario',
                                    'Usuario',
                                    response.Mensaje,
                                    "Content/Images/IconoErrorGeneral.png",
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

                $scope.SeguridadJS = function () {
                    var lista = JSON.parse(sessionStorage.getItem("role"));

                    if (lista != null) {
                        var listaJs = lista.where(function (x) { return x.TipoAccionId == 3 && x.ReferenciasAux == 'VerUsuariosController'; });

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