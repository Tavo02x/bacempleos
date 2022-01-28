'use strict';

(function () {
    angular
        .module('BacApp.controllers.entrevistaPregrabada', ['jkAngularRatingStars'])
        .controller('EntrevistaPregrabadaController',
        function ($scope, $log, RESTService, __env) {

            $scope.IdPostulante = Utils.getUrlParameter('IdPostulante');
            $scope.Email = Utils.getUrlParameter('User');
            $scope.Fecha = new Date();
            $scope.PreguntaBuscar = "";
            $scope.IdArea = 0;
            $scope.IdPuesto = 0;
            $scope.Puestos = {};
            $scope.Preguntas = {};
            $scope.Areas = {};

            $scope.AgregarPreguntas = true;
            $scope.PreguntasUsadas = false;
            $scope.PanelPreguntas = false;
            $scope.botonesAgregar = false;

            $scope.StepOne = true;
            $scope.StepTwo = false;

            $scope.ChangeStep = function () {
                if ($scope.StepOne == true && $scope.StepTwo == false) {

                    if ($scope.IdPuesto != "" && $scope.IdPuesto != 0 && $scope.IdPuesto != null) {
                        $scope.StepOne = false;
                        $scope.StepTwo = true;
                        $('#divStepTwo').removeClass('Secundario').addClass('Primaria');
                        $('#circuloStepTwo').removeClass('CirculoSecundario').addClass('CirculoPrimario');
                        $('#textStepTwo').removeClass('textoSecundario').addClass('textoPrimario');
                    }
                    else {
                        Utils.MessageBox(
                            'Entrevista Pregrabada',
                            'Entrevista Pregrabada',
                            'Debe seleccionar un puesto.',
                            "Content/Images/IconoErrorGeneral.png",
                            function () {
                                this.hide();
                                return false;
                            }
                        );
                    }
                  
                } else if ($scope.StepOne == false && $scope.StepTwo == true)
                {
                    $scope.GuardarEntrevista();
                }            
            }

            $scope.AgregarOtraPregunta = function () {
                Utils.cloneElement('pnlRepetearPreguntas', 'agregarPreguntas');
            };

            $scope.AgregarPreguntadaUsada = function () {
                $scope.AgregarPreguntas = false;
                $scope.PreguntasUsadas = true;
            };

            $scope.ReturnAgregarPreguntas = function () {
                $scope.AgregarPreguntas = true;
                $scope.PreguntasUsadas = false;
                $('#divListaPreguntas').empty();
                $scope.IdArea = '';
                $scope.PanelPreguntas = false;
                $scope.botonesAgregar = false;
                $scope.PreguntaBuscar = "";
            };

            $scope.AgregarPregunta = function () {

                var ids = $('#divPreguntas > div').map(function () {
                    return this.id
                }).toArray();

                $.each($('.cuadroSeleccionado'), function (index, value) {
                    var text = $('#' + value.id + " > span").text();
                    $("#" + ids[ids.length - 1] + " > div > div > input").val(text);
                });

                $scope.ReturnAgregarPreguntas();
            };

            $scope.AreaLaboralGet = function () {

                getWebApi({}, ApiService.AreaLaboralGet,
                    function (response) {
                        $scope.Areas = response.Lista;
                    }
                )
            }

            $scope.getPreguntas = function () {

                if ($scope.IdArea != "" && $scope.IdArea != 0 && $scope.IdArea != null) {
                    var data = {
                        Descripcion: { value: $scope.PreguntaBuscar },
                        IdArea: { value: $scope.IdArea }
                    }

                    getWebApi(data, ApiService.GetPreguntasByArea,
                        function (response) {
                            $scope.Preguntas = response.Lista;
                            $scope.PanelPreguntas = true;
                            if (response.Lista.length > 0) {
                                $('#divListaPreguntas').empty();
                                var html = '';
                                $.each($scope.Preguntas, function (index, value) {
                                    html = '';
                                    html += '<a id="a' + value.IdPregunta + '"><div id="div' + value.IdPregunta + '" data-id="' + value.IdPregunta + '" class="cuadro cuadroSeparador">';
                                    html += '   <span class="LetrasContenido">' + value.Descripcion + '</span>';
                                    html += '</div ></a>';

                                    $('#divListaPreguntas').append(html);
                                    $('#lblCount').text(response.Lista.length);
                                    $scope.botonesAgregar = true;

                                    $('#a' + value.IdPregunta).on('click', function () {
                                        $('.cuadroSeleccionado').removeClass('cuadroSeleccionado');
                                        $('#div' + value.IdPregunta).addClass('cuadroSeleccionado');
                                    });
                                });
                            } else
                            {
                                $('#divListaPreguntas').empty();
                                $('#lblCount').text(0);
                                $scope.botonesAgregar = false;
                            }
                        }
                    )
                }
                else
                {
                    Utils.MessageBox(
                        'Entrevista Pregrabada',
                        'Entrevista Pregrabada',
                        'Debe seleccionar un área.',
                        "Content/Images/IconoErrorGeneral.png",
                        function () {
                            this.hide();
                            return false;
                        }
                    );
                }
 
            }

            $scope.getPuestos = function () {

                var data = {
                    IdPostulante: { value: $scope.IdPostulante },
                }

                getWebApi(data, ApiService.PuestosByPostulanteGet,
                    function (response) {
                        $scope.Puestos = response.Lista;                   
                    }
                )
            }


            $scope.RemovePregunta = function () {
                var ids = $('#divPreguntas > div').map(function () {
                    return this.id
                }).toArray();

                if (ids.length > 1) {
                    $("#" + ids[ids.length - 1]).remove();
                }
            }

            $scope.GuardarEntrevista = function ()
            {
                var preguntas = [];
                var array = $scope.getValRepetear('divPreguntas', ['Descripcion', 'Tiempo']);

                for (var i = 0; i < array.length; i++)
                {
                    var obj =
                        {
                            IdPregunta: 0,
                            Descripcion: array[i].Descripcion,
                            Tiempo: array[i].Tiempo,
                            IdArea: ($scope.IdArea == null ? 0 : $scope.IdArea)
                        }
                    preguntas.push(obj)
                }

                var IdUsuario = Utils.decodeJWT().UserId;

                var data =
                    {
                        IdPostulante: $scope.IdPostulante,
                        IdEntrevista: 0,
                        IdUsuario: IdUsuario,
                        IdPuesto: $scope.IdPuesto,
                        FechaEntrevista: $scope.Fecha,
                        preguntas: preguntas                        
                    }
                postWebApi(data, ApiService.SaveEntrevista, function (response)
                {
                    if (response.Resultado) {
                        Utils.MessageBox(
                            'Entrevista Pregrabada',
                            'Entrevista Pregrabada',
                            'Entrevista guardada con éxito',
                            "Content/Images/IconoEntrevistaAgendada.png",
                            function () {
                                window.location = __env.baseUrl + 'Postulante/VerPerfil?IdPostulante=' + $scope.Email;
                                return false;
                            }
                        );
                    } else {
                        Utils.MessageBox(
                            'Entrevista Pregrabada',
                            'Entrevista Pregrabada',
                            response.Mensaje,
                            "Content/Images/IconoErrorGeneral.png",
                            function () {
                                this.modal('hide');
                                $('#popupLoading').modal('hide');
                                return false;
                            }
                        );
                    }

                });
            }

            $scope.Return = function ()
            {
                window.location = __env.baseUrl + 'Postulante/VerPerfil?IdPostulante=' + $scope.Email;
            }

            $scope.getValRepetear= function (container, mapper) {
                var arrObj = [];
                var Array = $('#' + container + ' > div').map(function () {
                    return this.id;
                }).toArray();

                Array.forEach(function (element, i) {

                    var valuesArr = $('#' + element + ' > div > div >').map(function (e, i) {
                        return this.value;
                    }).toArray();
                    var variable = '{';
                    valuesArr.forEach(function (e, i) {
                        if (e != '' && e != undefined && e != 0) {
                            variable += '"'+ mapper[i] + '":"' + e + '",';
                        }

                    });
                    variable = variable.substring(0, (variable.length - 1)) + '}';

                    if(variable != '{}') {
                        var obj = JSON.parse(variable);
                        arrObj.push(obj);
                    }

                });
                return arrObj;
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
                    var listaJs = lista.where(function (x) { return x.TipoAccionId == 3 && x.ReferenciasAux == 'EntrevistaPregrabadaController'; });

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