'use strict';

(function () {
    angular
        .module('BacApp.controllers.VerPerfil', ['jkAngularRatingStars'])
        .controller('VerPerfilController',
        function ($scope, $log, RESTService, __env) {
            $scope.obj = {};
            $scope.obj.IdPostulante = '';
            $scope.obj.NombreCompleto = '';
            $scope.obj.Nacionalidad = '';
            $scope.obj.Identificacion = '';
            $scope.obj.FechaNacimiento = '';
            $scope.obj.Edad = '';
            $scope.obj.Genero = '';
            $scope.obj.EstadoCivil = '';
            $scope.obj.Telefono = '';
            $scope.obj.ImagenURL = '';
            $scope.obj.PaisRecidencia = '';
            $scope.obj.Vehiculo = '';
            $scope.obj.Email = '';
            $scope.obj.Zona1 = '';
            $scope.obj.Zona2 = '';
            $scope.obj.Zona3 = '';
            $scope.obj.EstudiaActualidad = '';
            $scope.obj.DescripcionVentajaCompetitiva = '';
            $scope.obj.GradoAcademico = '';
            $scope.obj.Profesion = '';
            $scope.obj.PretensionSalarial = '';
            $scope.obj.TrabajoBAC = '';
            $scope.obj.CurriculumURL = '';
            $scope.obj.Favorito = false;
            $scope.obj.IdTipoLicencia = '';
            $scope.obj.EstadoPerfil = '';
            $scope.obj.TitulosCertificaciones = {};
            $scope.obj.ExperienciaLaboral = {};
            $scope.obj.Habilidades = {}
            $scope.obj.Referencias = {}
            $scope.obj.Idiomas = {}
            $scope.obj.Areas = {}
            $scope.obj.Paises = {}
            $scope.obj.Discapacidades = {}
            $scope.obj.Calificacion = {}

            $scope.CambioEstado = {};
            $scope.CambioEstado.IdPostulante = '';
            $scope.CambioEstado.IdPuesto = '';
            $scope.CambioEstado.IdEstado = '';

            $scope.NombreCompartir = "";
            $scope.EmailCompartir = ""
            $scope.NombreInvalido = false;
            $scope.EmailInvalido = false;
            $scope.IdEntrevista = 0;

            //catalogos
            $scope.Zona1 = {};
            $scope.Zona2 = {};
            $scope.Zona3 = {};
            $scope.Idiomas = {};
            $scope.Paises = {};
            $scope.Pretensiones = {};
            $scope.Areas = {};
            $scope.Discapacidades = {};
            $scope.Entrevistas = {};
            $scope.Comentarios = {};
            
            $scope.Comentario = {};
            $scope.Comentario.IdComentarios = 0;
            $scope.Comentario.IdUSuario = '';
            $scope.Comentario.IdPostulante = '';
            $scope.Comentario.Descripcion = '';
            $scope.Comentario.Borrado = false;

            $scope.StepOne = true;
            $scope.StepTwo = false;
            $scope.StepThree = false;

            //Calificacion
            $scope.Rate = 3;
            $scope.IsAdmin = true;
            $scope.readOnly = true;
            $scope.onItemRating = function (rating) {
                alert('On Rating: ' + rating);
            };

            $scope.ChangeStepOne = function () {
                $scope.StepOne = true;
                $scope.StepTwo = false;
                $scope.StepThree = false;  
                $('#StepOne').removeClass('taps').addClass('tapSelect');
                $('#StepTwo').removeClass('tapSelect').addClass('taps');
                $('#StepThree').removeClass('tapSelect').addClass('taps');
            };

            $scope.ChangeStepTwo = function () {
                $scope.StepOne = false;
                $scope.StepTwo = true;
                $scope.StepThree = false;
                $('#StepOne').removeClass('tapSelect').addClass('taps');
                $('#StepTwo').removeClass('taps').addClass('tapSelect');
                $('#StepThree').removeClass('tapSelect').addClass('taps');
            };

            $scope.ChangeStepThree = function () {
                $scope.StepOne = false;
                $scope.StepTwo = false;
                $scope.StepThree = true;
                $('#StepOne').removeClass('tapSelect').addClass('taps');
                $('#StepTwo').removeClass('tapSelect').addClass('taps');
                $('#StepThree').removeClass('taps').addClass('tapSelect');
            };

            $scope.MarcarFavorito = function () {
                var data = {
                    id: {
                        value: $scope.obj.IdPostulante
                    }
                };

                getWebApi(data, ApiService.PostulanteMarcarfavorito,
                    function (response) {
                        if ($scope.obj.Favorito) {
                            $scope.obj.Favorito = false;
                            var imagen = __env.baseUrl + 'Content/Images/IconoNoFavorito.png';
                            $('#imgFavorito').attr('src', imagen);
                            $('#txtMarcarFavorito').html();
                            $('#txtMarcarFavorito').html('Marcar favorito');
                        }
                        else {
                            $scope.obj.Favorito = true;
                            var imagen = __env.baseUrl + 'Content/Images/IconoFavorito.png';
                            $('#imgFavorito').attr('src', imagen);
                            $('#txtMarcarFavorito').html();
                            $('#txtMarcarFavorito').html('Desmarcar favorito');
                        }
                    });
            }

            $scope.getInfo = function ()
            {

                var id = Utils.getUrlParameter('IdPostulante');

                var token = sessionStorage.getItem("token");

                var decode = Utils.decodeJWT();
                var data = {
                    username: {
                        value: (id == "" ? decode.unique_name : id)
                    }
                };

                getWebApi(data, ApiService.PostulanteGet,
                    function (response)
                    {
                        $scope.obj.IdPostulante = response.Objeto.IdPostulante;
                        $scope.obj.NombreCompleto = response.Objeto.NombreCompleto;
                        $scope.obj.Nacionalidad = response.Objeto.Nacionalidad;
                        $scope.obj.Identificacion = response.Objeto.Identificacion;
                        $scope.obj.FechaNacimiento = response.Objeto.FechaNacimiento;
                        $scope.obj.Edad = calcularEdad(response.Objeto.FechaNacimiento);
                        $scope.obj.Genero = response.Objeto.Genero;
                        $scope.obj.EstadoCivil = response.Objeto.EstadoCivil;
                        $scope.obj.Telefono = response.Objeto.Telefono;
                        $scope.obj.ImagenURL = response.Objeto.ImagenURL;
                        $scope.obj.PaisRecidencia = response.Objeto.PaisRecidencia;
                        $scope.obj.Vehiculo = response.Objeto.Vehiculo;
                        $scope.obj.Email = response.Objeto.Email;
                        $scope.obj.Zona1 = response.Objeto.Zona1;
                        $scope.obj.Zona2 = response.Objeto.Zona2;
                        $scope.obj.Zona3 = response.Objeto.Zona3;
                        $scope.obj.EstudiaActualidad = response.Objeto.EstudiaActualidad;
                        $scope.obj.GradoAcademico = response.Objeto.GradoAcademico;
                        $scope.obj.Profesion = response.Objeto.Profesion;
                        $scope.obj.PretensionSalarial = response.Objeto.PretensionSalarial;
                        $scope.obj.TrabajoBAC = response.Objeto.TrabajoBAC;
                        $scope.obj.CurriculumURL = response.Objeto.CurriculumURL;

                        if ($scope.obj.CurriculumURL == 'N/A')
                        {
                            $('#bttCurriculo').text('No contiene curriculum');
                        }

                        $scope.obj.TitulosCertificaciones = response.Objeto.TitulosCertificaciones;
                        $scope.obj.ExperienciaLaboral = response.Objeto.ExperienciaLaboral;
                        $scope.obj.Habilidades = response.Objeto.Habilidades;
                        $scope.obj.Referencias = response.Objeto.Referencias;
                        $scope.obj.Idiomas = response.Objeto.Idiomas;
                        $scope.obj.Areas = response.Objeto.Areas;
                        $scope.obj.Paises = response.Objeto.Paises;
                        $scope.obj.Discapacidades = response.Objeto.Discapacidades;
                        $scope.obj.Favorito = response.Objeto.Favorito;
                        $scope.obj.DescripcionVentajaCompetitiva = response.Objeto.DescripcionVentajaCompetitiva;
                        $scope.obj.IdTipoLicencia = response.Objeto.IdTipoLicencia;
                        $scope.obj.EstadoPerfil = response.Objeto.EstadoPostulante;
                        $scope.obj.AplicacionesPuesto = response.Objeto.AplicacionesPuesto;

                        $scope.Comentarios = response.Objeto.Comentarios;

                        if ($scope.obj.Favorito) {
                            var imagen = __env.baseUrl + 'Content/Images/IconoFavorito.png';
                            $('#imgFavorito').attr('src', imagen);
                            $('#txtMarcarFavorito').html('Desmarcar favorito');
                        } else {
                            var imagen = __env.baseUrl + 'Content/Images/IconoNoFavorito.png';
                            $('#imgFavorito').attr('src', imagen);
                            $('#txtMarcarFavorito').html('Marcar favorito');
                        }

                        $('#FotoPerfil').attr('src', $scope.obj.ImagenURL);
                        $.each(response.Objeto.AplicacionesPuesto, function (index, value) {
                            var html = '';

                            html += '<div class="col-lg-8 Division">' + value.Descripcion;
                            html += '   <input id="hiddenPuesto' + index + '" value="' + value.IdPuesto + '" type="hidden" />';
                            html += '   <input id="hiddenPostulante' + index + '" value="' + value.IdPostulante + '" type="hidden" />';
                            html += '</div>'
                            html += '<div class="col-lg-4">';
                            html += '   <select id="SelEstado' + index + '" data-id="' + index + '">';
                            //html += '       <option selected disabled value="">Estado</option>';
                            $.each(response.Objeto.EstadosPerfil, function (index2, value2) {
                                var isSelected = (value2.IdEstadoPerfil == value.IdEstadoPerfil ? "selected" : "");
                                html += '       <option value="' + value2.IdEstadoPerfil + '" ' + isSelected + ' >' + value2.EstadoPerfil1 + '</option>';
                            });
                            html += '   </select>';
                            html += '</div>';
                            html += '<div class="SubrayadoDivTotal saltoSeccion saltoSeccionBajo-4"></div>';


                            $('#Aplicaciones').append(html);

                            $('#SelEstado' + index).on('change', function () {
                                $('#popupLoading').modal('show');
                                $scope.CambioEstado.IdPostulante = $('#hiddenPostulante' + index).val();
                                $scope.CambioEstado.IdPuesto = $('#hiddenPuesto' + index).val();
                                $scope.CambioEstado.IdEstado = +$('#SelEstado' + index).val();
                                //
                                switch ($scope.CambioEstado.IdEstado) {
                                    case 1: {//Leido
                                        $scope.CambiarEstadoPerfil();
                                        break;
                                    }
                                    case 2: {//No leido
                                        $scope.CambiarEstadoPerfil();
                                        break;
                                    }
                                    case 3: {// archivado
                                        Utils.ConfirmBox(
                                            "Cambio estado de aplicante",
                                            "¿Está seguro que desea a archivar a este aplicante?<br /> Notesé que el mismo se desactivara en el sistema.",
                                            function (result) {
                                                if (result) {
                                                    $scope.CambiarEstadoPerfil();
                                                } else {
                                                    $('#popupLoading').modal('hide');
                                                }
                                            });
                                        break;
                                    }
                                    case 4: {//pre-seleccionado
                                        Utils.ConfirmBox(
                                            "Cambio estado de aplicante",
                                            "¿Está seguro que desea pre-seleccionar a este aplicante?",
                                            function (result) {
                                                if (result) {
                                                    $scope.CambiarEstadoPerfil();
                                                } else {
                                                    $('#popupLoading').modal('hide');
                                                }
                                            });
                                        break;
                                    }
                                    case 5: {//contratado
                                        Utils.ConfirmBox(
                                            "Cambio estado de aplicante",
                                            "¿Está seguro que desea contratar a este aplicante?",
                                            function (result) {
                                                if (result) {
                                                    $scope.CambiarEstadoPerfil();
                                                } else {
                                                    $('#popupLoading').modal('hide');
                                                }
                                            });
                                        break;
                                    }
                                }
                            });
                        });

                        $scope.LoadEntrevistasAplicadas($scope.obj.IdPostulante);
                    }
                )
            }

            $scope.CambiarEstadoPerfil = function () {
                var decode = Utils.decodeJWT();

                var data =
                {
                    IdPostulante: { value: $scope.CambioEstado.IdPostulante },
                    IdPuesto: { value: $scope.CambioEstado.IdPuesto },
                    IdEstado: { value: $scope.CambioEstado.IdEstado },
                    IdUsuario: { value: decode.UserId }
                };

                getWebApi(data, ApiService.CambiarEstadoPerfil,
                    function (response) {
                        if (response.Resultado) {
                            Utils.MessageBox(
                                'Cambio estado aplicación',
                                'Cambio estado aplicación',
                                response.Mensaje,
                                "Content/Images/IconoConfimacion1.png",
                                function () {
                                    switch ($scope.CambioEstado.IdEstado) {
                                        case 3: {
                                            window.location = __env.baseUrl + 'Postulante/VerPostulantes';
                                            break;
                                        }
                                        default: {
                                            //$('#popupLoading').modal('hide');
                                            location.reload();
                                            this.modal('hide');
                                            break;
                                        }
                                    }
                                }
                            );
                        } else {
                            Utils.MessageBox(
                                'Cambio estado aplicación',
                                'Cambio estado aplicación',
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

            $scope.DescargarPerfil = function ()
            {
                var id = Utils.getUrlParameter('IdPostulante');
                //window.location = __env.baseUrl + 'postulante/DescargarPerfil/?email=' + id;

                window.open(__env.baseUrl + 'Postulante/PerfilDescargar?email=' + id, '_blank');
            }

            var calcularEdad = function(fecha) {
                var hoy = new Date();
                var cumpleanos = new Date(fecha);
                var edad = hoy.getFullYear() - cumpleanos.getFullYear();
                var m = hoy.getMonth() - cumpleanos.getMonth();

                if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
                    edad--;
                }

                return edad;
            }

            var getWebApi = function (data, table, callback) {

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

            $scope.EditarPerfil = function ()
            {
                window.location = __env.baseUrl + 'postulante/miperfil?idPostulante=' + $scope.obj.IdPostulante;
            }

            $scope.EntrevistaPregabada = function () {
                window.location = __env.baseUrl + 'Entrevistas/SolicitarEntrevistas';
            }

            $scope.EnVivo = function () {
                window.location = __env.baseUrl + 'Entrevistas/SolicitarEntrevistas?IdPostulante=' + $scope.obj.IdPostulante + "&User=" + $scope.obj.Email;
            }

            $scope.Pregrabada = function () {
                window.location = __env.baseUrl + 'Preguntas/MantenimientoPreguntas?IdPostulante=' + $scope.obj.IdPostulante + "&User=" + $scope.obj.Email;
            }

            $scope.AplicarSeguridadHTML = function () {
                Utils.SeguridadHTML();
            }

            $scope.Qualification = function (id,rating) {
                Utils.Qualification(id, rating);
            }

            $scope.LoadEntrevistasAplicadas = function (IdPostulante)
            {
                var data = {
                    userId: { value: IdPostulante }
                }
                getWebApi(data, ApiService.GetEntrevistas,
                    function (response) {

                        $scope.Entrevistas = response;

                        var lista = JSON.parse(sessionStorage.getItem("role"));

                        var value = lista.where(function (x) { return x.AccionId == 78 });

                        if (value.length == 0) {
                            $scope.IsAdmin = false;
                        }
                    }                   
                )
            }

            $scope.AceptarEntrevista = function(IdEntrevista)
            {
                $('#popupLoading').modal('show');
                var data = {
                    IdEntrevista: { value: IdEntrevista }
                }
                Utils.ConfirmBox("Aceptar entrevista", "¿Desea aceptar esta entrevista?",
                    function (result) {
                        if (result) {
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
                                            $scope.LoadEntrevistasAplicadas($scope.obj.IdPostulante);
                                        }
                                    );

                                });
                        } else {
                            $('#popupLoading').modal('show');
                            getWebApi(data, ApiService.RechazarEntrevista,
                                function (response) {
                                    Utils.MessageBox(
                                        'Rechazar entrevista',
                                        'Rechazar entrevista',
                                        "Entrevista rechazada exitosamente",
                                        "Content/Images/IconoConfimacion1.png",
                                        function () {
                                            this.modal('hide');
                                            $('#popupLoading').modal('hide');
                                            $scope.LoadEntrevistasAplicadas($scope.obj.IdPostulante);
                                        }
                                    );
                                });
                         }
                     });
              } 

            $scope.OpenModal = function (IdEntrevista) {
                $('#popupArea').modal('show');
                $scope.IdEntrevista = IdEntrevista;

                $scope.NombreCompartir = '';
                $scope.EmailCompartir = '';
                $scope.NombreInvalido = false;
                $scope.EmailInvalido = false;
            }

            $scope.CompartirPerfil = function () {

                //var NombreCompartir = $("#txtNombre").val();
                //var EmailCompartir = $("#txtEmail").val();

                if ($scope.NombreCompartir == '') {
                    $scope.NombreInvalido = true;
                }
                else
                {
                    $scope.NombreInvalido = false;
                }

                if ($scope.EmailCompartir == '')
                {
                    $scope.EmailInvalido = true;
                }
                else
                {
                    $scope.EmailInvalido = false;
                }

                if ($scope.NombreInvalido == false && $scope.EmailInvalido == false)
                {
                    var data = {
                        IdEntrevista: { value: $scope.IdEntrevista },
                        Email: { value: $scope.EmailCompartir },
                        Nombre: { value: $scope.NombreCompartir },
                        IdPostulante: { value: $scope.obj.IdPostulante }
                    }
                    $('#popupLoading').modal('show');
                    getWebApi(data, ApiService.CompartirPerfil,
                        function (response) {
                            if (response.Resultado) {
                                Utils.MessageBox(
                                    'Compartir Entrevista',
                                    'Compartir Entrevista',
                                    "La entrevista ha sido compartida exitosamente",
                                    "Content/Images/IconoConfimacion1.png",
                                    function () {
                                        this.modal('hide');
                                        $('#popupLoading').modal('hide');
                                    }
                                );

                            } else
                            {
                                Utils.MessageBox(
                                    'Compartir Entrevista',
                                    'Compartir Entrevista',
                                    response.Mensaje,
                                    "Content/Images/IconoErrorGeneral.png",
                                    function () {
                                        this.modal('hide');
                                        $('#popupLoading').modal('hide');
                                    }
                                );
                            }

                            $scope.NombreCompartir = '';
                            $scope.EmailCompartir = '';
                            $scope.NombreInvalido = false;
                            $scope.EmailInvalido = false;
                        });
                }
            }

            $scope.LimpiarComentarios = function () {
                $scope.Comentario.IdComentarios = 0;
                $scope.Comentario.IdUsuario = '';
                $scope.Comentario.IdPostulante = '';
                $scope.Comentario.Descripcion = '';
                $scope.Comentario.Borrado = false;
            }

            $scope.ReturnComment = function () {
                $scope.$apply(function () {
                    $scope.LimpiarComentarios();
                    $scope.getInfo();
                });
            }

            $scope.Guardar = function () {
                var decode = Utils.decodeJWT();
                $scope.Comentario.IdUsuario = decode.UserId;
                $scope.Comentario.IdPostulacion = $scope.obj.IdPostulante;

                var bandera = true;

                if ($scope.Comentario.Descripcion == '') {
                    bandera = false;
                } else {
                    $scope.show500 = false;
                }

                if (bandera) {
                    postWebApi(
                        $scope.Comentario,
                        ApiService.ComentarioSave,
                        function (response) {
                            if (response.Resultado) {
                                Utils.MessageBox(
                                    'Comentarios',
                                    'Comentarios',
                                    response.Mensaje,
                                    "Content/Images/IconoConfimacion1.png",
                                    function () {
                                        //$scope.ReturnComment();
                                        location.reload();
                                        this.modal('hide');
                                        //$('#popupLoading').modal('hide');
                                    }
                                );
                            } else {
                                Utils.MessageBox(
                                    'Comentarios',
                                    'Comentarios',
                                    response.Mensaje,
                                    "Content/Images/IconoErrorGeneral.png",
                                    function () {
                                        this.modal('hide');
                                        $('#popupLoading').modal('hide');
                                    }
                                );
                            }
                        }
                    );
                } else {
                    $scope.show500 = true;
                }
            }

            $scope.SeguridadJS = function () {
                var lista = JSON.parse(sessionStorage.getItem("role"));

                if (lista != null) {
                    var listaJs = lista.where(function (x) { return x.TipoAccionId == 3 && x.ReferenciasAux == 'VerPerfilController'; });

                    $.each(listaJs, function (index, value) {
                        var funcion = eval('$scope.' + value.ReferenciaJS);
                        if (funcion != undefined && funcion != null && funcion != '') {
                            eval('$scope.' + value.ReferenciaJS + '= function () { }');
                        }
                    });
                }
            }

            $scope.ReturnLobby = function () {
                window.location = __env.baseUrl + "Postulante/VerPostulantes"
            }
        });
})();