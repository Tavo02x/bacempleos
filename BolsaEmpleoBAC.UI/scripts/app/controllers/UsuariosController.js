'use strict';

(function () {
    angular
        .module('BacApp.controllers.Usuarios', [])
        .controller('UsuariosController',
            function ($scope, $log, RESTService, __env) {

                $scope.model = {};
                $scope.model.Info = {};
                $scope.model.Info.IdUsuario = 0;
                $scope.model.Info.NombreCompleto = '';
                $scope.model.Info.Usuario1 = '';
                $scope.model.Info.Email = '';
                $scope.model.Info.Password = '';
                $scope.model.Info.Borrado = false;
                $scope.model.Info.IdPais = 1;
                $scope.model.Info.IdTipoLogin = 1;
                $scope.model.Info.FechaCreacion = new Date();
                $scope.model.Paises = [];
                $scope.model.Roles = [];

                $scope.show1 = false;
                $scope.show2 = false;
                $scope.show3 = false;
                $scope.EmailInvalido = false;
                $scope.EmailExiste = false;

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

                $scope.getRoles = function () {
                    getWebApi({}, ApiService.RolGet,
                        function (response) {

                            var lista = JSON.parse(sessionStorage.getItem("role"));

                            var listaJs = lista.where(function (x) { return x.AccionId == 98 });

                            if (listaJs.length == 0) {
                                $scope.Roles = response.Lista.where(function (x) { return !x.Borrado });
                            } else {
                                $scope.Roles = response.Lista.where(function (x) { return !x.Borrado && x.IdRol != +listaJs[0].ReferenciasAux });
                            }
                        })
                }

                $scope.validateEmail = function () {
                    var data = {
                        email: { value: $scope.model.PostulanteInfo.Email }
                    }

                    getWebApi(data, ApiService.ValidateEmail,
                        function (response) {
                            $scope.EmailExiste = response.Objeto;
                        }
                    );
                }

                $scope.Validate = function () {
                    var result = true;

                    if ($scope.model.Info.Email == "") {
                        $scope.EmailInvalido = true;
                        result = false;
                    } else { $scope.EmailInvalido = false; }

                    if ($scope.model.Info.NombreCompleto == "") {
                        $scope.show1 = true;
                        result = false;
                    } else { $scope.show1 = false; }

                    var paises = Utils.getValCheck('pais', 'IdPais');

                    if (paises.length == 0) {
                        $scope.show2 = true;
                        result = false;
                    } else { $scope.show2 = false; }

                    var roles = Utils.getValCheck('rol', 'IdRol');

                    if (roles.length == 0) {
                        $scope.show3 = true;
                        result = false;
                    } else { $scope.show3 = false; }

                    if ($scope.model.Info.Password == '' && $scope.model.Info.IdUsuario == 0) {
                        $scope.show4 = true;
                        result = false;
                    } else { $scope.show4 = false; }

                    return result;
                }

                $scope.getInfo = function () {

                    var id = Utils.getUrlParameter('IdUsuario');
                    if (id != 0)
                    {
                       
                        //$scope.modal.IdPuesto = id;
                        var data = {
                            id: { value: id }
                        };

                        getWebApi(data, ApiService.UsuarioGet,
                            function (response) {
                                var obj = response.Objeto;

                                $scope.model.Info.IdUsuario = obj.Info.IdUsuario;
                                $scope.model.Info.NombreCompleto = obj.Info.NombreCompleto;
                                $scope.model.Info.Usuario1 = obj.Info.Usuario1;
                                $scope.model.Info.Email = obj.Info.Email;
                                $scope.model.Info.Borrado = obj.Info.Borrado;
                                $("input[name=rol]").each(function () {
                                    var value = $(this).val();
                                    var result = obj.Roles.any(function (x) {
                                        return x.IdRol == value
                                    });
                                    $(this).prop('checked', result);
                                    $(this).prop('value', result);
                                });

                                $("input[name=pais]").each(function () {
                                    var value = $(this).val();
                                    var result = obj.Paises.any(function (x) {
                                        return x.IdPais == value
                                    });
                                    $(this).prop('checked', result);
                                    $(this).prop('value', result);

                                });
                            }
                        )
                    }                  
                }

                $scope.Guardar = function () {
                    if ($scope.Validate()) {
                        $scope.model.Paises = Utils.getValCheckEdit('pais', 'IdPais');
                        $scope.model.Roles = Utils.getValCheckEdit('rol', 'IdRol');
                        $scope.model.Info.Usuario1 = $scope.model.Info.Email;
                        if ($scope.model.Info.Password != "")
                        {
                            $scope.model.Info.Password = md5($scope.model.Info.Password);
                        }
                      
                        var titulo = '';
                        var mensaje = '';
                        var imagen = '';
                       
                        if ($scope.model.Info.IdUsuario == 0) {
                            titulo = 'Agregaste con éxito al nuevo usuario';
                            mensaje = 'El nuevo usuario ya puede hacer uso de la plataforma de empleos.';
                            imagen = 'Content/Images/IconoActualizacionUsuario.png';
                        }
                        else {
                            titulo = 'Actualizaste con éxito los datos del usuario';
                            mensaje = 'Muchas gracias, se actualizaron los datos en nuestra base de datos.';
                            imagen = 'Content/Images/IconoActualizacionUsuario.png';
                        }
                        
                        postWebApi(
                            $scope.model,
                            ApiService.UsuarioSave,
                            function (response) {
                                if (response.Resultado) {
                                    Utils.MessageBox(
                                        titulo,
                                        titulo,
                                        mensaje,
                                        imagen,
                                        function () {
                                            this.modal('hide');
                                            $('popupLoading').modal('hide');
                                            window.location = __env.baseUrl + 'Usuario/VerUsuarios';
                                        }
                                    );
                                } else {
                                    Utils.MessageBox(
                                        'Mantenimiento de Usuarios',
                                        'Mantenimiento de Usuarios',
                                        response.Mensaje,
                                        "Content/Images/IconoErrorGeneral.png",
                                        function () {
                                            this.modal('hide');
                                            $('popupLoading').modal('hide');
                                            return false;
                                        }
                                    );
                                }
                            }
                        );
                    }
                }

                $scope.Cancelar = function () {
                    window.location = __env.baseUrl + 'Usuario/VerUsuarios';
                }

                $scope.validateEmail = function () {
                    var data = {
                        email: { value: $scope.model.PostulanteInfo.Email }
                    }

                    getWebApi(data, ApiService.ValidateEmail,
                        function (response) {
                            $scope.EmailExiste = response.Objeto;
                        }
                    );
                }

                $scope.Volver = function () {
                    window.location = __env.baseUrl + 'Usuario/VerUsuarios';
                }

                $scope.SeguridadJS = function () {
                    var lista = JSON.parse(sessionStorage.getItem("role"));
                    if (lista != null) {
                        var listaJs = lista.where(function (x) { return x.TipoAccionId == 3 && x.ReferenciasAux == 'UsuariosController'; });

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