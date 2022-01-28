'use strict';

(function () {
    angular
        .module('BacApp.controllers.verAplicarPuestos', ["ngSanitize"])
        .controller('verAplicarPuestosController',
            function ($scope, $log, RESTService, __env) {

                $scope.model = {};
                $scope.model.IdPuesto = 0;
                $scope.model.IdPostulante = 0;

                $scope.model.Titulo = '';
                $scope.model.Descripcion = '';
                $scope.model.FechaCierre = '';
                $scope.model.Idiomas = '';
                $scope.model.Jornada = 0;
                $scope.model.Pais = '';
                $scope.model.IdArea = '';
                $scope.model.Area = '';
                $scope.model.NivelAcademico = '';
                $scope.model.ExperienciaRequerida = [];
                $scope.model.IsAplicado = false;

                $scope.baseUrl = __env.baseUrl;
                $scope.top = 0;
                $scope.PuestosRelacionados = {};

                $scope.AplicarPuesto = function () {
                    $('#popupLoading').modal('show');
                    var decode = Utils.decodeJWT();
                    var data = {
                        IdPuesto: { value: $scope.model.IdPuesto },
                        IdPostulante: { value: decode.UserId }
                    }

                    var titulo = '';
                    var mensaje = '';
                    var imagen = '';

                    if ($scope.model.IsAplicado) {
                        titulo = 'Has eliminado tu aplicación correctamente';
                        mensaje = 'Ya no apareceras en la lista de candidatos al puesto.';
                        imagen = 'Content/Images/IconoDesaplicarPuesto.png';
                    } else {
                        titulo = 'Has aplicado correctamente al empleo';
                        mensaje = 'Un encargado del departamente de selección revisará tu perfil para continuar con el debido proceso';
                        imagen = 'Content/Images/IconoAplicarPuesto.png';
                    }

                    getWebApi(data, ApiService.PuestoAplicar, function (response) {
                        if (response.Resultado) {
                            Utils.MessageBox(
                                titulo,//'Mantenimiento Puesto',
                                titulo,//'Puesto',
                                mensaje,//'Puesto aplicado exitosamente',
                                imagen,//"Content/Images/IconoConfimacion1.png",
                                function () {
                                    window.location = __env.baseUrl + 'Puesto/Puestosdisponibles'
                                    this.modal('hide');
                                    //$('#popupLoading').modal('hide');
                                }
                            );
                        } else {
                            Utils.MessageBox(
                                'Aplicar/Desaplicar a un puesto',//'Mantenimiento Puesto',
                                'Aplicar/Desaplicar a un puesto',//'Puesto',
                                response.Mensaje,
                                "Content/Images/IconoErrorGeneral.png",
                                function () {
                                    this.modal('hide');
                                    $('#popupLoading').modal('hide');
                                }
                            );
                        }
                    });
                }

                $scope.EditarPuesto = function () {
                    window.location = __env.baseUrl + "Puesto/MantenimientoPuestoEdit?IdPuesto=" + $scope.model.IdPuesto;
                }

                $scope.VerPostulantes = function () {
                    window.location = __env.baseUrl + "Puesto/PostulantesPuesto?IdPuesto=" + $scope.model.IdPuesto + "&Puesto=" + $scope.model.Titulo;
                }

                var getWebApi = function (data, table, callback) {

                    var query = Utils.getFilterParameters(data);
                    RESTService.doGet(table, query)
                        .then(callback);
                }

                var postWebApi = function (data, table, callback) {

                    var entity = {
                        Objeto: data,
                        Lista: [],
                        Token: '',
                        Id: data.PuestoInfo.IdPuesto
                    }

                    RESTService.doPost(table, entity)
                        .then(callback);
                }


                $scope.getPuesto = function () {

                    var id = Utils.getUrlParameter('IdPuesto');
                    var decode = Utils.decodeJWT();

                    var data = {
                        idPuesto: { value: id },
                        IdPostulante: { value: decode.UserId }
                    };

                    getWebApi(data, ApiService.PuestoVer,
                        function (response) {
                            if (response.Resultado) {
                                var data = response.Objeto;
                                $scope.model.IdPuesto = data.IdPuesto;
                                $scope.model.Titulo = data.Titulo;
                                $scope.model.Descripcion = data.Descripcion;
                                $scope.model.FechaCierre = data.FechaCierre;
                                $scope.model.Idiomas = data.Idiomas;
                                $scope.model.Jornada = data.Jornada[0];
                                $scope.model.Pais = data.Pais;
                                $scope.model.IdArea = data.IdArea;
                                $scope.model.Area = data.Area;
                                $scope.model.NivelAcademico = data.NivelAcademico;
                                $scope.model.IsAplicado = data.IsAplicado;
                                $scope.model.ExperienciaRequerida = data.Requisitos;

                                //$scope.DescripcionPais = '';

                                // $.each($scope.model.Pais, function (index, value) {
                                $scope.DescripcionPais = $scope.model.Pais;//+= value.Descripcion + ',';
                                //});

                                //$scope.DescripcionPais = $scope.DescripcionPais.substring(0, $scope.DescripcionPais.length - 1);

                                if (data.Requisitos.length == 0) {
                                    var requisitoDefault = {
                                        IdRequisito: 0,
                                        Descripcion: "N/A"
                                    };
                                    $scope.model.ExperienciaRequerida.push(requisitoDefault);
                                }

                                if ($scope.model.IsAplicado) {
                                    $('#btnAplicar').text('DESAPLICAR PUESTO');
                                }
                                else {
                                    $('#btnAplicar').text('APLICAR PUESTO');
                                }
                                //CantidadAplicantes
                                $('#btnPostulantes').text('Ver aplicantes (' + data.CantidadAplicantes + ')');

                                $scope.GetPuestosRelacionados($scope.model.IdArea);
                            } else {
                                Utils.MessageBox(
                                    'Ver Puesto',
                                    'Puesto',
                                    response.Mensaje,
                                    "Content/Images/IconoErrorGeneral.png",
                                    function () {
                                        this.modal('hide');
                                        $('#popupLoading').modal('hide');
                                    }
                                );
                            }
                        }
                    )
                }


                $scope.GetPuestosRelacionados = function (IdArea) {

                    $scope.top = $scope.top + 3;
                    var data = {
                        IdArea: { value: IdArea },
                        Top: { value: $scope.top }
                    };

                    getWebApi(data, ApiService.PuestosGetRelacionados,
                        function (response) {
                            $scope.PuestosRelacionados = response.Lista;
                        }
                    );
                }

                $scope.Volver = function () {
                    window.location = sessionStorage.getItem("volver");//__env.baseUrl + 'Puesto/FiltrarPuestos';
                }

                $scope.RealizarEntrevista = function () {
                    var IdFeriaEmpleo = Utils.getUrlParameter("IdFeriaEmpleo");
                    window.location = __env.baseUrl + "Entrevistas/SolicitarEntrevistasFeria?IdFeriaEmpleo=" + IdFeriaEmpleo + "&IdPuesto=" + $scope.model.IdPuesto;
                }

                $scope.AplicarSeguridadHTML = function () {
                    Utils.SeguridadHTML();
                }

                $scope.SeguridadJS = function () {
                    var lista = JSON.parse(sessionStorage.getItem("role"));

                    if (lista != null) {
                        var listaJs = lista.where(function (x) { return x.TipoAccionId == 3 && x.ReferenciasAux == 'verAplicarPuestosController'; });

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