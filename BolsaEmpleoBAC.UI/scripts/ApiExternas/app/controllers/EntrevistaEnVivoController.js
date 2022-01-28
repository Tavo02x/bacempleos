'use strict';

(function () {
    angular
        .module('BacApp.controllers.EntrevistaEnVivo', [])
        .controller('EntrevistaEnVivoController',
            function ($scope, $log, RESTService, __env) {

                $scope.model = {};
                $scope.IdPostulante = Utils.getUrlParameter('IdPostulante');
                $scope.Email = Utils.getUrlParameter('User');
                $scope.Date = new Date();
                $scope.Hour = "";
                $scope.DateInterview = $scope.Date + ' ' + $scope.Hour;

                $scope.AgendarEntrevista = function () {
                    var decode = Utils.decodeJWT();
                    $scope.DateInterview = $scope.Date;
                    var data =
                    {
                        Topic: "Entrevista en vivo",
                        Start_time: new Date($scope.DateInterview),
                        Hour: $scope.Hour,
                        IdPostulante: $scope.IdPostulante,
                        IdSolicitante: decode.UserId,
                        IdFeriaEmpleo: null,
                        IdPuesto: null,
                        Auto_recording: "cloud",
                        Duration: 15
                    };

                    postWebApi(data, ApiService.AgendarEntrevista, function (response) {
                        if (response.Resultado) {
                            Utils.MessageBox(
                                'Entrevista',
                                'Entrevista',
                                'Entrevista agendada exitosamente<br/> <a href="' + response.JoinUrl + '" target="_blank">Url de ingreso</a><br/><a href="' + response.StartUrl + '" target="_blank">Url de ingreso inmediato</a>',
                                "Content/Images/IconoConfirmacionFeriaVirtual.png",
                                function () {
                                    //$('#popupLoading').modal('hide');
                                    this.modal('hide');
                                    window.location = __env.baseUrl + "Postulante/VerPerfil?IdPostulante=" + $scope.Email
                                    //return false;
                                }
                            );

                        } else {
                            Utils.MessageBox(
                                'Entrevista',
                                'Entrevista',
                                response.Mensaje,
                                "Content/Images/IconoErrorGeneral.png",
                                function () {
                                    $('#popupLoading').modal('hide');
                                    this.modal('hide');
                                    //return false;
                                }
                            );
                        }
                    });
                }

                var getWebApi = function (data, table, callback) {

                    var query = Utils.getFilterParameters(data);
                    RESTService.doGet(table, query)
                        .then(callback);
                }

                $scope.Volver = function () {
                    window.location = __env.baseUrl + "Postulante/VerPerfil?IdPostulante=" + $scope.Email
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

                $scope.SeguridadJS = function () {
                    var lista = JSON.parse(sessionStorage.getItem("role"));
                    if (lista != null) {
                        var listaJs = lista.where(function (x) { return x.TipoAccionId == 3 && x.ReferenciasAux == 'EntrevistaEnVivoController'; });

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