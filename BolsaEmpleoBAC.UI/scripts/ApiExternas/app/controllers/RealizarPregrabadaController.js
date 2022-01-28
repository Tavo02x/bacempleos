'use strict';

(function () {
    angular
        .module('BacApp.controllers.RealizarPregrabada', [])
        .controller('RealizarPregrabadaController',
        function ($scope, $log, RESTService, __env) {

            $scope.IdPostulante = Utils.getUrlParameter('IdPostulante');
            $scope.IdEntrevista = Utils.getUrlParameter('IdEntrevista');
            $scope.IdPregunta = Utils.getUrlParameter('IdPregunta');
            $scope.Nombre = "";
            $scope.Puesto = "";
            $scope.IdArea = 0;
            $scope.IdPuesto = 0;
            $scope.Preguntas = {};
            $scope.secuencia = 0;
            $scope.TotalPreguntas = {};
            $scope.segundos = 300;
            $scope.Pregunta = 0;

            $scope.ShowReview = false;
            $scope.MostrarEntrevista = true;

            $scope.GetPreguntas = function ()
            {
                var IdUsuario = Utils.decodeJWT().UserId;
                var data =
                    {
                        IdEntrevista: { value: $scope.IdEntrevista},
                        IdPostulante: { value: $scope.IdPostulante },
                        IdUser: { value: IdUsuario },
                    }
                getWebApi(data, ApiService.GetPreguntasByEntrevista,
                    function (response)
                    {
                        if (response.Resultado) {
                            var obj = response.Objeto;
                            $scope.Nombre = obj.nombre;
                            $scope.Puesto = obj.puesto;
                            $scope.Preguntas = obj.list;
                            sessionStorage.setItem("Preguntas", JSON.stringify($scope.Preguntas));
                            sessionStorage.setItem("Secuencia", 0);
                        }
                        else
                        {
                            $scope.MostrarEntrevista = false;
                            Utils.MessageBox(
                                'Entrevista Pregrabada',
                                'Entrevista Pregrabada',
                                response.Mensaje,
                                "Content/Images/IconoErrorGeneral.png",
                                function () {
                                    //Session.Logout();
                                    window.location = __env.baseUrl + "Postulante/Verperfil";
                                    return false;
                                }
                            );
                        }
                    }
                )
            }

            $scope.IniciarEntrevista = function ()
            {
                var pregunta = JSON.parse(sessionStorage.getItem("Preguntas"));
                var IdPregunta = pregunta[0].Preguntas.IdPregunta;                
                window.location = __env.baseUrl + "Entrevistas/AplicarEntrevista?IdPregunta=" + IdPregunta + "&IdEntrevista=" + $scope.IdEntrevista + "&IdPostulante=" + $scope.IdPostulante;
            }

            $scope.SiguientePregunta = function () {
                var pregunta = JSON.parse(sessionStorage.getItem("Preguntas"));                     
                var secuencia = sessionStorage.getItem("Secuencia");
                var secuenciaNext = Number(secuencia) + 1;
                sessionStorage.setItem("Secuencia", secuenciaNext);

                if (pregunta[secuencia] != undefined) {

                    if (pregunta[secuenciaNext] != undefined) {
                        var IdPregunta = pregunta[secuenciaNext].Preguntas.IdPregunta;
                        window.location = __env.baseUrl + "Entrevistas/AplicarEntrevista?IdPregunta=" + IdPregunta + "&IdEntrevista=" + $scope.IdEntrevista + "&IdPostulante=" + $scope.IdPostulante;
                    }
                    else
                    {
                        window.location = __env.baseUrl + "Entrevistas/FinalizarEntrevista?IdEntrevista=" + $scope.IdEntrevista + "&IdPostulante=" + $scope.IdPostulante;
                    }
                  
                }
                else
                {
                    window.location = __env.baseUrl + "Entrevistas/FinalizarEntrevista?IdEntrevista=" + $scope.IdEntrevista + "&IdPostulante=" + $scope.IdPostulante;
                }               
            }

            $scope.CargarPregunta = function () {

                var videos = {};
           
                var pregunta = JSON.parse(sessionStorage.getItem("Preguntas"));
                var secuencia = sessionStorage.getItem("Secuencia");
                $scope.secuencia = Number(secuencia)+1;
                $scope.TotalPreguntas = pregunta.length;
                $scope.segundos = pregunta[secuencia].Tiempo;
                $scope.Pregunta = pregunta[secuencia].Preguntas.Descripcion;

                if (sessionStorage.hasOwnProperty("videos")) {
                    videos = JSON.parse(sessionStorage.getItem("videos"));

                    var exists = videos.any(function (x) { return x.IdPregunta == $scope.IdPregunta });
                    if (!exists) {
                        $scope.ShowReview = false;                 
                    }
                    else
                    {
                        $scope.ShowReview = true; 
                        $("#divRecord").empty();
                        if ($("#btnSiguientePregunta").length != 0) {
                            $("#btnSiguientePregunta").removeClass("hidden")
                        }
                    }
                } else
                {
                    $scope.ShowReview = false;
                }
            }

            $scope.GuardarEntrevista = function () {
                var listPreguntas = JSON.parse(sessionStorage.getItem("videos"));

                var data =
                    {
                        IdEntrevista: $scope.IdEntrevista,
                        PreguntasVideo: listPreguntas,
                    }
                postWebApi(data, ApiService.SaveVideosPregrabada, function (response)
                {
                    if (!response.Resultado) {
                        Utils.MessageBox(
                            'Entrevista Pregrabada',
                            'Entrevista Pregrabada',
                            response.Mensaje,
                            "Content/Images/IconoErrorGeneral.png",
                            function () {
                                $('#popupLoading').modal('hide');
                                this.hide();
                                //Session.Logout();
                                return false;
                            }
                        );
                    }
                    else
                    {
                        $('#popupLoading').modal('hide');
                    }
                });
            }
            $scope.FinalizarEntrevista = function ()
            {
                $('#popupLoading').modal('show');
                Utils.MessageBox(
                    'Entrevista Pregrabada',
                    'Entrevista Pregrabada',
                    'Entrevista guardada con éxito',
                    "Content/Images/IconoEntrevistaAgendada.png",
                    function () {
                        $('#popupLoading').modal('hide');
                        this.hide();
                        window.location = __env.baseUrl + "Postulante/Verperfil";
                        //Session.Logout();
                        //window.close();
                        return false;
                    }
                );
            }
            var getWebApi = function (data, table,callback) {

                var query = Utils.getFilterParameters(data);
                RESTService.doGet( table, query)
                    .then(callback);
            }

            var postWebApi = function (data, table, callback) {

                var entity = {
                    Objeto: data,
                    Lista: [],
                    Token: '',
                    Id:0
                }
              
                RESTService.doPost(table, entity)
                    .then(callback);
            }

            $scope.SeguridadJS = function () {
                var lista = JSON.parse(sessionStorage.getItem("role"));

                if (lista != null) {
                    var listaJs = lista.where(function (x) { return x.TipoAccionId == 3 && x.ReferenciasAux == 'RealizarPregrabadaController'; });

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