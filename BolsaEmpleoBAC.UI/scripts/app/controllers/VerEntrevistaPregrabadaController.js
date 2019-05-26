'use strict';

(function () {
    angular
        .module('BacApp.controllers.VerEntrevistaPregrabada', [])
        .controller('VerEntrevistaPregrabadaController',
        function ($scope, $log, RESTService, __env) {

            $scope.IdEntrevista = Utils.getUrlParameter('IdEntrevista');
            $scope.Fecha = "";
            $scope.Creador = "";
            $scope.Nombre = "";
            $scope.Puesto = "";

            $scope.Preguntas = {};

            $scope.GetVideos = function () {

                var data = {
                    IdEntrevista: { value: $scope.IdEntrevista },
                }

                getWebApi(data, ApiService.GetVideosPregrabados,
                    function (response) {
                        var obj = response.Objeto;

                        $scope.Fecha = obj.Fecha;
                        $scope.Creador = obj.Creador;
                        $scope.Nombre = obj.Nombre;
                        $scope.Puesto = obj.Puesto;
                        $scope.Preguntas = obj.Preguntas;

                    }
                )
            }

            $scope.onItemRating = function (IdEntrevista_Video,rating) {
                //alert('On Rating: ' + rating);

                var data = {
                    IdEntrevista: { value: $scope.IdEntrevista },
                    IdEntrevistaVideo: { value: IdEntrevista_Video },
                    Calificacion: { value: rating },
                }

                getWebApi(data, ApiService.CalificarVideoPregrabado,
                    function (response) {
                        if (!response.Resultado)
                        {
                            Utils.MessageBox(
                                'Entrevista pregrabada',
                                'Entrevista pregrabada',
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
            };

            $scope.Return = function () {
                var id = Utils.getUrlParameter('User');
                window.location = __env.baseUrl + 'Postulante/VerPerfil?IdPostulante=' + id;
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

            $scope.SeguridadJS = function () {
                var lista = JSON.parse(sessionStorage.getItem("role"));

                if (lista != null) {
                    var listaJs = lista.where(function (x) { return x.TipoAccionId == 3 && x.ReferenciasAux == 'VerEntrevistaPregrabadaController'; });

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