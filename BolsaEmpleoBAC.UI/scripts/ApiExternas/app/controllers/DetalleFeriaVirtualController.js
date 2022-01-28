'use strict';

(function () {
    angular
        .module('BacApp.controllers.DetalleFeriaVirtual', [])
        .controller('DetalleFeriaVirtualController',
            function ($scope, $log, RESTService, __env) {

                $scope.IdFeriaEmpleo = Utils.getUrlParameter("IdFeriaEmpleo");
                $scope.IdUsuario = Utils.decodeJWT().UserId;
                $scope.IdEntrevistador = 0;
                $scope.NombreFeria = '';
                $scope.Paises = '';
                $scope.FechaInicial = '';
                $scope.FechaFinal = '';
                $scope.AgendadasCant = 0;
                $scope.SolicitadasCant = 0;
                $scope.RealizadasCant = 0;
                $scope.Nombre = '';
                $scope.StepOne = true;
                $scope.StepTwo = false;
                $scope.Entrevistadores = {};

                $scope.step1Class = 'tapSelect';
                $scope.step2Class = 'taps';

                $scope.Return = function () {
                    window.location = __env.baseUrl + 'FeriaVirtual/VerFeriaVirtual'
                }

                $scope.ChangeStepOne = function () {
                    $scope.StepOne = true;
                    $scope.StepTwo = false;
                    $scope.step1Class = 'tapSelect';
                    $scope.step2Class = 'taps';
                }

                $scope.ChangeStepTwo = function () {
                    $scope.StepOne = false;
                    $scope.StepTwo = true;
                    $scope.step1Class = 'taps';
                    $scope.step2Class = 'tapSelect';
                }

                $scope.GetDetalleFeriaVirtual = function () {
                    var data = { IdFeriaEmpleo: { value: $scope.IdFeriaEmpleo } };

                    if ($scope.IdEntrevistador != 0 && $scope.IdEntrevistador != "" && $scope.IdEntrevistador != null) {
                        data.IdUsuario = { value: $scope.IdEntrevistador };
                    }
                    else {
                        data.IdUsuario = { value: $scope.IdUsuario };
                    }

                    getWebApi(data, ApiService.GetFeriaDetalles, function (response) {
                        var obj = response.Objeto;

                        $scope.NombreFeria = obj.NombreFeria;
                        $scope.Paises = obj.Paises.join();
                        $scope.FechaInicial = obj.FechaInicioFormat;
                        $scope.FechaFinal = obj.FechaFinFormat;
                        $scope.AgendadasCant = obj.Agendadas;
                        $scope.SolicitadasCant = obj.Solicitadas;
                        $scope.RealizadasCant = obj.Realizadas;
                    })
                }

                $scope.GetEntrevistadores = function () {
                    var data = {
                        IdFeriaEmpleo: { value: $scope.IdFeriaEmpleo }
                    }
                    getWebApi(data, ApiService.GetEntrevistadoresFeria, function (response) {
                        $scope.Entrevistadores = response.Objeto;
                    })
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
                        Id: 0
                    }

                    RESTService.doPost(table, entity)
                        .then(callback);
                }

                $scope.AceptarEntrevista = function (IdEntrevista) {

                    //var data = {
                    //    IdEntrevista: { value: IdEntrevista }
                    //}
                    //Utils.ConfirmBox("Aceptar entrevista", "¿Desea aceptar esta entrevista?",
                    //    function (result) {
                    //        $('#popupLoading').modal('show');
                    //        if (result) {

                    //            getWebApi(data, ApiService.AceptarEntrevista,
                    //                function (response) {
                    //                    Utils.MessageBox(
                    //                        'Aceptar entrevista',
                    //                        'Aceptar entrevista',
                    //                        "Entrevista aceptada exitosamente",
                    //                        "Content/Images/IconoConfimacion1.png",
                    //                        function () {
                    //                            this.modal('hide');
                    //                            $('#popupLoading').modal('hide');

                    //                        }
                    //                    );

                    //                });
                    //        } else {
                    //            getWebApi(data, ApiService.RechazarEntrevista,
                    //                function (response) {
                    //                    Utils.MessageBox(
                    //                        'Rechazar entrevista',
                    //                        'Rechazar entrevista',
                    //                        "Entrevista rechazada exitosamente",
                    //                        "Content/Images/IconoConfimacion1.png",
                    //                        function () {
                    //                            this.modal('hide');
                    //                            $('#popupLoading').modal('hide');
                    //                        }
                    //                    );
                    //                });
                    //        }
                    //        $scope.LoadGridAgendadas();
                    //        $scope.LoadGridSolicitadas();
                    //        $scope.LoadGridRechazadas();
                    //        $scope.LoadGridRealizadas();
                    //    });
                }

                $scope.LoadGridPuestos = function () {

                    var data = {
                        IdFeriaEmpleo: { value: $scope.IdFeriaEmpleo, cond: OConfig.condEquals, type: OTypes.default }
                    }

                    var width = Utils.GetWidthWindow();

                    if (width <= 764) {
                        Utils.getGrid(ApiService.PuestosFeriaVirtualGrid, data, 'divPuestos', ['', ''], 'MobileColumn', $scope.Redirect, 5, 'totalGrid', 'IdFeriaEmpleo,IdPuesto', 'FechaCreacion', 'desc');
                    }
                    else {
                        Utils.getGrid(ApiService.PuestosFeriaVirtualGrid, data, 'divPuestos', ['Título del puesto', 'País', 'Postulantes', 'Ver'], 'Puesto,Pais,Cantidad', $scope.Redirect, 5, 'totalGrid', 'IdFeriaEmpleo,IdPuesto', 'FechaCreacion', 'desc');
                    }
                }

                $scope.Redirect = function (param) {
                    sessionStorage.setItem("volver", __env.baseUrl + "FeriaVirtual/DetalleFeriaVirtual?IdFeriaEmpleo=" + $scope.IdFeriaEmpleo);
                    window.location = __env.baseUrl + 'Puesto/PostulantesPuestoFeria?IdPuesto=' + param.IdPuesto + '&IdFeriaEmpleo=' + $scope.IdFeriaEmpleo;
                }

                $scope.LoadGridPuestosPostulante = function () {

                    var data = {
                        IdFeriaEmpleo: { value: $scope.IdFeriaEmpleo, cond: OConfig.condEquals, type: OTypes.default }
                    }
                    var width = Utils.GetWidthWindow();

                    if (width <= 764) {
                        Utils.getGrid(ApiService.PuestosFeriaVirtualGrid, data, 'divPuestos', ['', ''], 'MobileColumn', $scope.RedirectPostulante, 5, 'totalGrid', 'IdFeriaEmpleo,IdPuesto', 'FechaCreacion', 'desc');
                    }
                    else {
                        Utils.getGrid(ApiService.PuestosFeriaVirtualGrid, data, 'divPuestos', ['Título del puesto', 'País', 'Ver'], 'Puesto,Pais', $scope.RedirectPostulante, 5, 'totalGrid', 'IdFeriaEmpleo,IdPuesto', 'FechaCreacion', 'desc');
                    }
                }

                $scope.RedirectPostulante = function (param) {
                    sessionStorage.setItem("volver", __env.baseUrl + "FeriaVirtual/DetalleFeriaVirtualPostulante?IdFeriaEmpleo=" + $scope.IdFeriaEmpleo);
                    window.location = __env.baseUrl + 'Puesto/VerPuestoFeria?IdPuesto=' + param.IdPuesto + '&IdFeriaEmpleo=' + $scope.IdFeriaEmpleo;
                }

                $scope.LoadGridAgendadas = function () {

                    var data = {};
                    if ($scope.IdEntrevistador != 0 && $scope.IdEntrevistador != "" && $scope.IdEntrevistador != null) {
                        data = {
                            NombreCompleto: { value: $scope.Nombre, cond: OConfig.condLike, type: OTypes.string, comp: '||' },
                            IdFeriaEmpleo: { value: $scope.IdFeriaEmpleo, cond: OConfig.condEquals, type: OTypes.default },
                            IdUsuario: { value: $scope.IdEntrevistador, cond: OConfig.condEquals, type: OTypes.default },
                        }
                    }
                    else {
                        data = {
                            NombreCompleto: { value: $scope.Nombre, cond: OConfig.condLike, type: OTypes.string, comp: '||' },
                            IdFeriaEmpleo: { value: $scope.IdFeriaEmpleo, cond: OConfig.condEquals, type: OTypes.default },
                            IdUsuario: { value: $scope.IdUsuario, cond: OConfig.condEquals, type: OTypes.default },
                        }
                    }

                    var width = Utils.GetWidthWindow();

                    if (width <= 764) {
                        Utils.getGrid1(ApiService.EntrevistasAgendadasGrid, data, 'divAgendadas', ['', '', ''], 'ColumnMobile1,ColumnMobile2', $scope.Agendadas, 5, 'totalGrid', 'IdEntrevista,IdPostulante,Email,NombreCompleto,JoinUrl', 'IdEntrevista', 'desc');
                    }
                    else {
                        Utils.getGrid1(ApiService.EntrevistasAgendadasGrid, data, 'divAgendadas', ['Nombre', 'País', 'Entrevista', 'Ver'], 'NombreCompleto,Pais,EntrevistaFechaTipo', $scope.Agendadas, 5, 'totalGrid', 'IdEntrevista,IdPostulante,Email,JoinUrl', 'IdEntrevista', 'desc');
                    }
                }

                $scope.LoadGridSolicitadas = function () {

                    var data = {};
                    if ($scope.IdEntrevistador != 0 && $scope.IdEntrevistador != "" && $scope.IdEntrevistador != null) {
                        data = {
                            NombreCompleto: { value: $scope.Nombre, cond: OConfig.condLike, type: OTypes.string, comp: '||' },
                            IdFeriaEmpleo: { value: $scope.IdFeriaEmpleo, cond: OConfig.condEquals, type: OTypes.default },
                            IdUsuario: { value: $scope.IdEntrevistador, cond: OConfig.condEquals, type: OTypes.default },
                        }
                    }
                    else {
                        data = {
                            NombreCompleto: { value: $scope.Nombre, cond: OConfig.condLike, type: OTypes.string, comp: '||' },
                            IdFeriaEmpleo: { value: $scope.IdFeriaEmpleo, cond: OConfig.condEquals, type: OTypes.default },
                            IdUsuario: { value: $scope.IdUsuario, cond: OConfig.condEquals, type: OTypes.default },
                        }
                    }

                    var width = Utils.GetWidthWindow();

                    if (width <= 764) {
                        Utils.getGrid2(ApiService.EntrevistasSolicitadasGrid, data, 'divSolicitadas', ['', '', ''], 'ColumnMobile1,ColumnMobile2', $scope.Solicitadas, 5, 'totalGrid', 'IdEntrevista,IdPostulante,Email,NombreCompleto', 'IdEntrevista', 'desc');
                    }
                    else {
                        Utils.getGrid2(ApiService.EntrevistasSolicitadasGrid, data, 'divSolicitadas', ['Nombre', 'País', 'Entrevista', 'Ver'], 'NombreCompleto,Pais,EntrevistaFechaTipo', $scope.Solicitadas, 5, 'totalGrid', 'IdEntrevista,IdPostulante,Email', 'IdEntrevista', 'desc');
                    }
                }

                $scope.LoadGridRechazadas = function () {

                    var data = {};
                    if ($scope.IdEntrevistador != 0 && $scope.IdEntrevistador != "" && $scope.IdEntrevistador != null) {
                        data = {
                            NombreCompleto: { value: $scope.Nombre, cond: OConfig.condLike, type: OTypes.string, comp: '||' },
                            IdFeriaEmpleo: { value: $scope.IdFeriaEmpleo, cond: OConfig.condEquals, type: OTypes.default },
                            IdUsuario: { value: $scope.IdEntrevistador, cond: OConfig.condEquals, type: OTypes.default },
                        }
                    }
                    else {
                        data = {
                            NombreCompleto: { value: $scope.Nombre, cond: OConfig.condLike, type: OTypes.string, comp: '||' },
                            IdFeriaEmpleo: { value: $scope.IdFeriaEmpleo, cond: OConfig.condEquals, type: OTypes.default },
                            IdUsuario: { value: $scope.IdUsuario, cond: OConfig.condEquals, type: OTypes.default },
                        }
                    }

                    var width = Utils.GetWidthWindow();

                    if (width <= 764) {
                        Utils.getGrid3(ApiService.EntrevistasRechazadasGrid, data, 'divRechazadas', ['', '', ''], 'ColumnMobile1,ColumnMobile2', $scope.Rechazadas, 5, 'totalGrid', 'IdEntrevista,IdPostulante,Email,NombreCompleto', 'IdEntrevista', 'desc');
                    }
                    else {
                        Utils.getGrid3(ApiService.EntrevistasRechazadasGrid, data, 'divRechazadas', ['Nombre', 'País', 'Entrevista', 'Ver'], 'NombreCompleto,Pais,EntrevistaFechaTipo', $scope.Rechazadas, 5, 'totalGrid', 'IdEntrevista,IdPostulante,Email', 'IdEntrevista', 'desc');
                    }
                }

                $scope.LoadGridRealizadas = function () {

                    var data = {};
                    if ($scope.IdEntrevistador != 0 && $scope.IdEntrevistador != "" && $scope.IdEntrevistador != null) {
                        data = {
                            NombreCompleto: { value: $scope.Nombre, cond: OConfig.condLike, type: OTypes.string, comp: '||' },
                            IdFeriaEmpleo: { value: $scope.IdFeriaEmpleo, cond: OConfig.condEquals, type: OTypes.default },
                            IdUsuario: { value: $scope.IdEntrevistador, cond: OConfig.condEquals, type: OTypes.default },
                        }
                    }
                    else {
                        data = {
                            NombreCompleto: { value: $scope.Nombre, cond: OConfig.condLike, type: OTypes.string, comp: '||' },
                            IdFeriaEmpleo: { value: $scope.IdFeriaEmpleo, cond: OConfig.condEquals, type: OTypes.default },
                            IdUsuario: { value: $scope.IdUsuario, cond: OConfig.condEquals, type: OTypes.default },
                        }
                    }

                    var width = Utils.GetWidthWindow();

                    if (width <= 764) {
                        Utils.getGrid3(ApiService.EntrevistasRealizadasGrid, data, 'divRealizadas', ['', '', ''], 'ColumnMobile1,ColumnMobile2', $scope.Rechazadas, 5, 'totalGrid', 'IdEntrevista,IdPostulante,Email,NombreCompleto', 'IdEntrevista', 'desc');
                    }
                    else {
                        Utils.getGrid3(ApiService.EntrevistasRealizadasGrid, data, 'divRealizadas', ['Nombre', 'País', 'Entrevista', 'Ver'], 'NombreCompleto,Pais,EntrevistaFechaTipo', $scope.Rechazadas, 5, 'totalGrid', 'IdEntrevista,IdPostulante,Email', 'IdEntrevista', 'desc');
                    }
                }

                $scope.FilterAll = function () {
                    $scope.LoadGridAgendadas();
                    $scope.LoadGridSolicitadas();
                    $scope.LoadGridRechazadas();
                    $scope.LoadGridRealizadas();
                }

                $scope.Agendadas = function (param) {
                    $scope.$apply(function () {
                        console.log(param.JoinUrl);
                        window.open(param.JoinUrl, '_blank');
                    });
                }

                $scope.Solicitadas = function (param) {
                    $scope.$apply(function () {
                        //$scope.AceptarEntrevista(param.IdEntrevista);
                        window.location = __env.baseUrl + 'Entrevistas/ReagendarEntrevistasFeria?IdFeriaEmpleo=' + $scope.IdFeriaEmpleo + '&IdEntrevista=' + param.IdEntrevista;
                    });
                }

                $scope.Rechazadas = function (param) {
                    $scope.$apply(function () {
                        $scope.IdPuesto = param.IdPuesto;
                        window.location = __env.baseUrl + 'Postulante/VerPerfil?IdPostulante=' + param.Email;
                    });
                }

                $scope.Realizadas = function (param) {
                    $scope.$apply(function () {
                        $scope.IdPuesto = param.IdPuesto;
                        window.location = __env.baseUrl + 'Postulante/VerPerfil?IdPostulante=' + param.Email;
                    });
                }

                $scope.AplicarSeguridadHTML = function () {
                    Utils.SeguridadHTML();
                }

                $scope.Volver = function () {
                    window.location = __env.baseUrl + 'FeriaVirtual/VerFeriaVirtual';
                }

                $scope.SeguridadJS = function () {
                    var lista = JSON.parse(sessionStorage.getItem("role"));

                    if (lista != null) {
                        var listaJs = lista.where(function (x) { return x.TipoAccionId == 3 && x.ReferenciasAux == 'DetalleFeriaVirtualController'; });

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