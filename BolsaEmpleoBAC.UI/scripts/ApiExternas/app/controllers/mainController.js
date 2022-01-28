'use strict';

(function () {
    angular
        .module('BacApp.controllers.main', [])
        .controller('mainController',
            function ($scope, $log, RESTService, __env) {

                $scope.baseUrl = __env.baseUrl;
                $scope.Logout = function () {
                    Session.EndSession();
                }

                $scope.ValidateSession = function () {
                    var token = sessionStorage.getItem("token");
                    if (token == null || token == '' || token == undefined) {
                        window.location = __env.baseUrl + 'Principal/Login';
                    }
                }


                $scope.AplicarSeguridadHTML = function () {
                    Utils.SeguridadHTML();
                }

                $scope.VerificarSession = function () {

                    if (Utils.getUrlParameter("token") != '') {
                        if (sessionStorage.hasOwnProperty("token")) {
                            sessionStorage.removeItem('token');
                        }
                        var Token = Utils.getUrlParameter("token");
                        sessionStorage.setItem("token", Token);
                    }

                    if (!sessionStorage.hasOwnProperty("token")) {
                        var Token = Utils.getUrlParameter("token");
                        sessionStorage.setItem("token", Token);
                    }

                    if (!sessionStorage.hasOwnProperty("role")) {
                        var decode = Utils.decodeJWT();
                        var data = {
                            userid: { value: decode.UserId }
                        }

                        getWebApi(data, ApiService.GetMenu,
                            function (response) {
                                sessionStorage.setItem("role", response.Objeto);
                                $('#menu').empty();
                                $scope.CrearMenu();
                                $scope.SeguridadJS();
                                $scope.AplicarSeguridadHTML();
                            })
                    }
                    else
                    {
                        if (Utils.getUrlParameter("token") != '') {
                            console.log('Refrescado');
                            var decode = Utils.decodeJWT();
                            var data = {
                                userid: { value: decode.UserId }
                            }
                            sessionStorage.removeItem("role");
                            getWebApi(data, ApiService.GetMenu,
                                function (response) {
                                    sessionStorage.setItem("role", response.Objeto);
                                    $('#menu').empty();
                                    $scope.CrearMenu();
                                    $scope.SeguridadJS();
                                    $scope.AplicarSeguridadHTML();
                                })
                        }
                        else { $scope.CrearMenu(); }
                    }
                }
                var getWebApi = function (data, table, callback) {

                    var query = Utils.getFilterParameters(data);
                    RESTService.doGet(table, query)
                        .then(callback);
                }

                $scope.CrearMenu = function () {

                    console.log('mainController');
                    $('#menu').empty();
                    var html = '';

                    var lista = JSON.parse(sessionStorage.getItem("role"));

                    var opcionesPrincipales = lista.where(function (x) { return x.TipoAccionId == 1 });

                    var opcionesSecundarias = lista.where(function (x) { return x.TipoAccionId == 2 });

                    var opcionesTernarias = lista.where(function (x) { return x.TipoAccionId == 7 });

                    $.each(opcionesPrincipales, function (index, value) {
                        html = '';
                        html += '<a id="btn' + value.AccionId + '" ' + (value.URL == null ? ' >' : 'href="' + __env.baseUrl + value.URL + '">');
                        html += '   <div class="opcion">';
                        html += '       <div class="contenedorOpcion">';
                        html += '           <div class="Texto">' + value.Nombre + '</div>';
                        html += '           <img src="' + __env.baseUrl + '/Content/Images/' + value.Icono + '.png" class="Imagen" />'
                        html += '       </div>';
                        html += '   </div>';
                        html += '</a>';
                        html += '<div id="' + value.AccionId + '" class="collapse"></div>';

                        $('#menu').append(html);

                        if (value.URL == null) {
                            $('#btn' + value.AccionId).unbind();
                            $('#btn' + value.AccionId).on('click', function () {
                                if ($('#' + value.AccionId).hasClass('collapse')) {
                                    $('#' + value.AccionId).removeClass('collapse');
                                    $('#' + value.AccionId).addClass('Expand');
                                } else {
                                    $('#' + value.AccionId).removeClass('Expand');
                                    $('#' + value.AccionId).addClass('collapse');
                                }
                            });
                        }
                    });

                    $.each(opcionesSecundarias, function (index, value) {
                        html = '';
                        html += '<a id="btn' + value.AccionId + '" ' + (value.URL == null ? '>' : 'href="' + __env.baseUrl + value.URL + '">');
                        html += '   <div class="opcion subOpcion">';
                        html += '       <div class="contenedorOpcion">';
                        html += '           <div class="Texto">' + value.Nombre + '</div>';
                        html += '           <img src="' + __env.baseUrl + '/Content/Images/' + value.Icono + '.png" class="Imagen" />'
                        html += '       </div>';
                        html += '   </div>';
                        html += '</a>';
                        html += '<div id="' + value.AccionId + '" class="collapse"></div>';

                        $('#' + value.ParentId).append(html);

                        if (value.URL == null) {
                            $('#btn' + value.AccionId).unbind();
                            $('#btn' + value.AccionId).on('click', function () {
                                if ($('#' + value.AccionId).hasClass('collapse')) {
                                    $('#' + value.AccionId).removeClass('collapse');
                                    $('#' + value.AccionId).addClass('Expand');
                                } else {
                                    $('#' + value.AccionId).removeClass('Expand');
                                    $('#' + value.AccionId).addClass('collapse');
                                }
                            });
                        }
                    });

                    $.each(opcionesTernarias, function (index, value) {
                        html = '';
                        html += '<a id="btn' + value.AccionId + '" ' + (value.URL == null ? ' >' : 'href="' + __env.baseUrl + value.URL + '">');
                        html += '   <div class="opcion subSubOpcion">';
                        html += '       <div class="contenedorOpcion">';
                        html += '           <div class="Texto">' + value.Nombre + '</div>';
                        html += '           <img src="' + __env.baseUrl + '/Content/Images/' + value.Icono + '.png" class="Imagen" />'
                        html += '       </div>';
                        html += '   </div>';
                        html += '</a>';
                        html += '<div id="' + value.AccionId + '" class="collapse"></div>';

                        $('#' + value.ParentId).append(html);

                        if (value.URL == null) {
                            $('#btn' + value.AccionId).unbind();
                            $('#btn' + value.AccionId).on('click', function () {
                                if ($('#' + value.AccionId).hasClass('collapse')) {
                                    $('#' + value.AccionId).removeClass('collapse');
                                    $('#' + value.AccionId).addClass('Expand');
                                } else {
                                    $('#' + value.AccionId).removeClass('Expand');
                                    $('#' + value.AccionId).addClass('collapse');
                                }
                            });
                        }
                    });
                }

                $scope.SeguridadJS = function () {
                    var lista = JSON.parse(sessionStorage.getItem("role"));

                    if (lista != null) {
                        var listaJs = lista.where(function (x) { return x.TipoAccionId == 3 && x.ReferenciasAux == 'mainController'; });

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


