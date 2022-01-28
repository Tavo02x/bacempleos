'use strict';

(function () {
    angular
        .module('BacApp.controllers.Rol', [])
        .controller('RolController',
            function ($scope, $log, RESTService, __env) {

                $scope.model = {};
                $scope.model.IdRol = 0;
                $scope.model.Descripcion = '';
                $scope.model.Borrado = false;
                $scope.model.IsMultipais = false;
                $scope.model.FechaCreacion = new Date();
                $scope.model.Acciones = [];

                $scope.show1 = false;
                $scope.show2 = false;

                var getWebApi = function (data, table, callback) {

                    //Utils.Show();
                    var query = Utils.getFilterParameters(data);
                    RESTService.doGet(table, query)
                        .then(callback);
                }

                var postWebApi = function (data, table, callback) {

                    var entity = {
                        Objeto: data,
                        Lista: [],
                        Token: '',
                        Id: $scope.model.IdRol
                    }

                    RESTService.doPost(table, entity)
                        .then(callback);
                }

                $scope.CargarRol = function () {
                    var id = Utils.getUrlParameter('IdRol');

                    console.log(id);
                    if (id != 0) {
                        var data = {
                            id: { value: id }
                        };

                        getWebApi(data, ApiService.RolGetRolAccion,
                            function (response) {
                                console.log(response);
                                var data = response.Objeto;
                                $scope.model.IdRol = data.IdRol;
                                $scope.model.Descripcion = data.Descripcion;
                                $scope.model.Borrado = data.Borrado;
                                $scope.model.FechaCreacion = data.FechaCreacion;
                                $scope.model.Acciones = data.Rol_Acciones;

                                $.each($scope.model.Acciones, function (index, value) {
                                    $('#div' + value.AccionId).addClass('cuadroSeleccionado');
                                });
                            });
                    }
                }

                $scope.getAccion = function () {
                    getWebApi({}, ApiService.AccionGet,
                        function (response) {
                            $scope.acciones = response.Lista;
                            console.log(response);
                            var html = '';
                            $.each($scope.acciones, function (index, value) {
                                html = '';
                                html += '<a id="a' + value.AccionId + '"><div id="div' + value.AccionId + '" data-id="' + value.AccionId + '" class="cuadro cuadroSeparador">';
                                html += '   <span class="LetrasContenido textoNegrita">' + value.Nombre + '</span><br />';
                                html += '   <span class="LetrasContenido">' + value.Descripcion + '</span>';
                                html += '</div ></a>';

                                $('#divAccion').append(html);

                                $('#a' + value.AccionId).on('click', function () {
                                    if ($('#div' + value.AccionId).hasClass('cuadroSeleccionado')) {
                                        $('#div' + value.AccionId).removeClass('cuadroSeleccionado');
                                    } else {
                                        $('#div' + value.AccionId).addClass('cuadroSeleccionado');
                                    }
                                });
                            });

                            $scope.CargarRol();
                        }
                    )
                }

                $scope.Validate = function () {
                    $scope.show1 = false;
                    $scope.show2 = false;
                    var result = true;

                    if ($scope.model.Descripcion == '') {
                        $scope.show1 = true;
                        result = false;
                    }

                    var lista = $('.cuadroSeleccionado');

                    if (lista.length == 0) {
                        $scope.show2 = true;
                        result = false;
                    }

                    return result;
                }

                $scope.Guardar = function () {
                    if ($scope.Validate()) {
                        $scope.model.Acciones = [];
                        $.each($('.cuadroSeleccionado'), function (index, value) {
                            var id = $('#' + value.id).attr('data-id');
                            var accion = $scope.acciones.where(function (x) { return x.AccionId == +id });
                            $scope.model.Acciones.push(accion[0].AccionId);
                        });

                        var data = {
                            IdRol: $scope.model.IdRol,
                            Descripcion: $scope.model.Descripcion,
                            Acciones: $scope.model.Acciones.join(),
                            Borrado: $scope.model.Borrado,
                            IsMultipais: $scope.model.IsMultipais
                        }

                        postWebApi(
                            data,
                            ApiService.RolSave,
                            function (response) {
                                if (response.Resultado) {
                                    Utils.MessageBox(
                                        'Mantenimiento de Roles',
                                        'Roles',
                                        response.Mensaje,
                                        "Content/Images/IconoConfimacion1.png",
                                        function () {
                                            window.location = __env.baseUrl + 'Rol/Index'
                                            this.modal('hide');
                                            $('#popupLoading').modal('hide');
                                        }
                                    );
                                } else {
                                    Utils.MessageBox(
                                        'Mantenimiento de Roles',
                                        'Roles',
                                        response.Mensaje,
                                        "Content/Images/IconoErrorGeneral.png",
                                        function () {
                                            $scope.Cancelar();
                                            this.modal('hide');
                                            $('#popupLoading').modal('hide');
                                        }
                                    );
                                }
                            }
                        );
                    }
                }

                $scope.Cancelar = function () {
                    $scope.model.IdRol = 0;
                    $scope.model.Descripcion = '';
                    $scope.model.Borrado = false;
                    $scope.model.IsMultipais = false;
                    $scope.model.FechaCreacion = Date.now;
                    $scope.model.Acciones = [];
                    $.each($('.cuadroSeleccionado'), function (index, value) {
                        $('#' + value.id).removeClass('cuadroSeleccionado');
                    });
                }

                $scope.SeguridadJS = function () {
                    var lista = JSON.parse(sessionStorage.getItem("role"));
                    if (lista != null) {
                        var listaJs = lista.where(function (x) { return x.TipoAccionId == 3 && x.ReferenciasAux == 'RolController'; });

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