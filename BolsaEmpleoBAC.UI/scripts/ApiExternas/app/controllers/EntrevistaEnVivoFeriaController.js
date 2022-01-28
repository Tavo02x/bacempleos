'use strict';

(function () {
    angular
        .module('BacApp.controllers.EntrevistaEnVivoFeria', [])
        .controller('EntrevistaEnVivoFeriaController',
            function ($scope, $log, RESTService, __env) {

                $scope.model = {};
                $scope.IdPostulante = 0;
                $scope.IdFeriaEmpleo = Utils.getUrlParameter('IdFeriaEmpleo');
                $scope.IdPuesto = Utils.getUrlParameter('IdPuesto');
                $scope.IdEntrevista = Utils.getUrlParameter('IdEntrevista');
                $scope.Date = new Date();
                $scope.Hour = "";
                $scope.HoraInicial = new Date();
                $scope.HoraFinal = new Date();
                $scope.DateInterview = new Date();
                $scope.FechaInicial = new Date();
                $scope.FechaFinal = new Date();
                $scope.FechaMax = "";
                $scope.FechaMin = "";
                $scope.Frecuencia = 0;
                $scope.Horas = {};

                $scope.GetDetalleFeriaVirtual = function () {
                    console.log($scope.IdEntrevista);
                    if ($scope.IdEntrevista == '') {
                        $scope.IdEntrevista = 0;
                    }              
                    var data = {
                        IdFeriaEmpleo: { value: $scope.IdFeriaEmpleo }
                    }
                    getWebApi(data, ApiService.GetFeriaDetalles, function (response) {
                        var obj = response.Objeto;

                        $scope.HoraInicial = obj.HoraInicial;
                        $scope.HoraFinal = obj.HoraFinal;
                        $scope.FechaInicial = new Date(obj.FechaInicio);
                        $scope.FechaFinal = new Date(obj.FechaFin);
                        $scope.FechaMax = obj.FechaMax;
                        $scope.FechaMin = obj.FechaMin;
                        $scope.Frecuencia = obj.Frecuencia;
                        $scope.Horas = $scope.GenerarArrayHoras(obj.Frecuencia, obj.HoraInicio, obj.HoraFinal);
                        if ($scope.IdEntrevista != 0)
                        {
                            $scope.GetDetalleEntrevista();
                        }
                        
                    })
                }

                $scope.GetDetalleEntrevista = function () {

                   
                    var data = {
                        IdEntrevista: { value: $scope.IdEntrevista }
                    }

                    getWebApi(data, ApiService.GetEntrevistaById, function (response) {
                        var obj = response;

                        $scope.Hour = obj.Hora;
                        $scope.Date = new Date(obj.FechaEntrevista);
                    })
                }


                $scope.AceptarEntrevista = function () {

                    var data = {
                        IdEntrevista: { value: $scope.IdEntrevista }
                    }
                    //Utils.ConfirmBox("Aceptar entrevista", "¿Desea aceptar esta entrevista?",
                    //    function (result) {
                    //        
                    //        if (result) {
                    $('#popupLoading').modal('show');
                                getWebApi(data, ApiService.AceptarEntrevista,
                                    function (response) {
                                        Utils.MessageBox(
                                            'Aceptar entrevista',
                                            'Aceptar entrevista',
                                            "Entrevista aceptada exitosamente",
                                            "Content/Images/IconoConfimacion1.png",
                                            function () {
                                                this.modal('hide');
                                                $('#popupLoading').modal('hide');
                                                window.location = __env.baseUrl + "FeriaVirtual/DetalleFeriaVirtual?IdFeriaEmpleo=" + $scope.IdFeriaEmpleo;
                                                //window.location = __env.baseUrl + "Puesto/VerPuestoFeria?IdPuesto=" + $scope.IdPuesto + "&IdFeriaEmpleo=" + $scope.IdFeriaEmpleo;
                                                return false;
                                            }
                                        );

                                    });
                            //}
                            //else {
                            //    getWebApi(data, ApiService.RechazarEntrevista,
                            //        function (response) {
                            //            Utils.MessageBox(
                            //                'Rechazar entrevista',
                            //                'Rechazar entrevista',
                            //                "Entrevista rechazada exitosamente",
                            //                "Content/Images/IconoConfimacion1.png",
                            //                function () {
                            //                    this.modal('hide');
                            //                    $('#popupLoading').modal('hide');
                            //                }
                            //            );
                            //        });
                            //}
                            //$scope.LoadGridAgendadas();
                            //$scope.LoadGridSolicitadas();
                            //$scope.LoadGridRechazadas();
                            //$scope.LoadGridRealizadas();
                        //});
                }
                $scope.AgendarEntrevista = function () {
                    var decode = Utils.decodeJWT();
                    var data =
                    {
                        topic: "Entrevista en vivo",
                        Start_time: new Date($scope.Date),
                        Hour: $scope.Hour,
                        IdPostulante: $scope.IdPostulante,
                        IdSolicitante: decode.UserId,
                        IdPuesto: $scope.IdPuesto,
                        IdEntrevista: $scope.IdEntrevista,
                        IdFeriaEmpleo: $scope.IdFeriaEmpleo,
                        Auto_recording: "cloud",
                        Duration: 15
                        };

                    postWebApi(data, ApiService.AgendarEntrevistaFeria, function (response) {

                        if (response.Resultado) {
                            Utils.MessageBox(
                                'Entrevista',
                                'Entrevista',
                                'Entrevista agendada exitosamente<br/> <a href="' + response.Objeto.JoinUrl + '" target="_blank">Url de ingreso</a><br/><a href="' + response.Objeto.StartUrl + '" target="_blank">Url de ingreso inmediato</a>',
                                "Content/Images/IconoConfirmacionFeriaVirtual.png",
                                function () {
                                    //$('#popupLoading').modal('hide');
                                    this.modal('hide');
                                    window.location = __env.baseUrl + "Puesto/VerPuestoFeria?IdPuesto=" + $scope.IdPuesto + "&IdFeriaEmpleo=" + $scope.IdFeriaEmpleo;
                                    return false;
                                }
                            );
                        }
                        else {
                            Utils.MessageBox(
                                'Entrevista',
                                'Entrevista',
                                response.Mensaje,
                                "Content/Images/IconoConfirmacionFeriaVirtual.png",
                                function () {
                                    $('#popupLoading').modal('hide');
                                    this.modal('hide');
                                    return false;
                                }
                            );

                        }

                    });
                }

                $scope.ReasignarEntrevista = function () {
                    $('#popupLoading').modal('show');
                    Utils.ConfirmBox(
                        "Reasignar entrevista",
                        "¿Está seguro que desea reasignar esta entrevista? Recuerde que solamente se reasignará, no se cambiarán las horas ni fechas dentro del sistema",
                        function (result) {
                            if (result) {
                                $scope.DateInterview = $scope.Date;
                                var decode = Utils.decodeJWT();
                                var data =
                                {
                                    topic: "Entrevista en vivo",
                                    Start_time: new Date($scope.Date),
                                    Hour: $scope.Hour,
                                    IdPostulante: $scope.IdPostulante,
                                    IdSolicitante: decode.UserId,
                                    IdPuesto: $scope.IdPuesto,
                                    IdEntrevista: $scope.IdEntrevista,
                                    IdFeriaEmpleo: $scope.IdFeriaEmpleo,
                                    Auto_recording: "cloud",
                                    Duration: 15
                                };

                                postWebApi(data, ApiService.ReasignarEntrevistaFeria, function (response) {

                                    if (response.Resultado) {
                                        var obj = response.Objeto;
                                        Utils.MessageBox(
                                            'Entrevista',
                                            'Entrevista',
                                            'Entrevista reasignada exitosamente <br/> Entrevistador: ' + obj.NombreCompleto + '<br/>Correo: ' + obj.Email +'<br/>',
                                            "Content/Images/IconoConfirmacionFeriaVirtual.png",
                                            function () {
                                                //$('#popupLoading').modal('hide');
                                                //this.modal('hide');
                                                window.location = __env.baseUrl + "FeriaVirtual/DetalleFeriaVirtual?IdFeriaEmpleo=" + $scope.IdFeriaEmpleo;
                                                return false;
                                            }
                                        );
                                    }
                                    else {
                                        Utils.MessageBox(
                                            'Entrevista',
                                            'Entrevista',
                                            response.Mensaje,
                                            "Content/Images/IconoConfirmacionFeriaVirtual.png",
                                            function () {
                                                $('#popupLoading').modal('hide');
                                                this.modal('hide');
                                                return false;
                                            }
                                        );

                                    }

                                });
                            } else {
                                $('#popupLoading').modal('hide');
                            }
                        });

                }

                $scope.ReagendarEntrevista = function () {
                    $('#popupLoading').modal('show');
                    Utils.ConfirmBox(
                        "Reagendar entrevista",
                        "¿Está seguro que desea reagendar esta entrevista?",
                        function (result) {
                            if (result) {
                                $scope.DateInterview = $scope.Date;
                                var decode = Utils.decodeJWT();
                                var data =
                                {
                                    topic: "Entrevista en vivo",
                                    Start_time: new Date($scope.Date),
                                    Hour: $scope.Hour,
                                    IdPostulante: $scope.IdPostulante,
                                    IdSolicitante: decode.UserId,
                                    IdPuesto: $scope.IdPuesto,
                                    IdEntrevista: $scope.IdEntrevista,
                                    IdFeriaEmpleo: $scope.IdFeriaEmpleo,
                                    Auto_recording: "cloud",
                                    Duration: 15
                                };

                                postWebApi(data, ApiService.ReagendarEntrevistaFeria, function (response) {

                                    if (response.Resultado) {
                                        Utils.MessageBox(
                                            'Entrevista',
                                            'Entrevista',
                                            'Entrevista reagendada exitosamente<br/>',
                                            "Content/Images/IconoConfirmacionFeriaVirtual.png",
                                            function () {
                                                //$('#popupLoading').modal('hide');
                                                //this.modal('hide');DetalleFeriaVirtualPostulante?IdFeriaEmpleo=
                                                window.location = __env.baseUrl + "FeriaVirtual/DetalleFeriaVirtual?IdFeriaEmpleo=" + $scope.IdFeriaEmpleo;
                                                return false;
                                            }
                                        );
                                    }
                                    else {
                                        Utils.MessageBox(
                                            'Entrevista',
                                            'Entrevista',
                                            response.Mensaje,
                                            "Content/Images/IconoConfirmacionFeriaVirtual.png",
                                            function () {
                                                $('#popupLoading').modal('hide');
                                                this.modal('hide');
                                                return false;
                                            }
                                        );

                                    }

                                });
                            } else {
                                $('#popupLoading').modal('hide');
                            }
                        });
                }

                var getWebApi = function (data, table, callback) {

                    var query = Utils.getFilterParameters(data);
                    RESTService.doGet(table, query)
                        .then(callback);
                }

                $scope.Volver = function () {
                    window.location = __env.baseUrl + "FeriaVirtual/DetalleFeriaVirtualPostulante?IdFeriaEmpleo=" + $scope.IdFeriaEmpleo;
                }

                $scope.Retonar = function () {
                    window.location = __env.baseUrl + "FeriaVirtual/DetalleFeriaVirtual?IdFeriaEmpleo=" + $scope.IdFeriaEmpleo;
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

                $scope.GenerarArrayHoras = function (separacion, start, end) {

                    var arrStart = start.split(':');
                    var arrEnd = end.split(':');

                    var arr = [];
                    var temp = '';
                    var hour = +arrStart[0];
                    var min = +arrStart[1];
                    while (temp != end) {
                        temp = (hour < 10 ? '0' + hour : hour) + ':' + (min < 10 ? '0' + min : min);
                        arr.push(temp);

                        min = +min + +separacion;
                        if ((+separacion > 30 ? (+min >= 60) : (+min % 60 == 0))) {
                            hour = +hour + 1;
                            min = (+separacion > 30 ? min % 60 : 0);
                        }

                        if (+arrEnd[0] == hour && +min > +arrEnd[1]) {
                            temp = end;
                        }
                    }
                    var res = arr;
                    return res;
                }

                $scope.SeguridadJS = function () {
                    var lista = JSON.parse(sessionStorage.getItem("role"));
                    if (lista != null) {
                        var listaJs = lista.where(function (x) { return x.TipoAccionId == 3 && x.ReferenciasAux == 'EntrevistaEnVivoFeriaController'; });

                        $.each(listaJs, function (index, value) {
                            var funcion = eval('$scope.' + value.ReferenciaJS);
                            if (funcion != undefined && funcion != null && funcion != '') {
                                eval('$scope.' + value.ReferenciaJS + '= function () { }');
                            }
                        });
                    }
                }

                //datepicker

                $scope.dateOptions = {
                    showWeeks: false,
                    formatYear: 'yy',
                    minDate: new Date(),
                    startingDay: 0,
                    placement: 'bottom'
                };
                
                $scope.openDatepicker = function() {
                    $scope.datepicker.opened = true;
                };
                
                $scope.format = 'dd/MM/yyyy';
                
                $scope.datepicker = {
                    opened: false
                };
            });
})();