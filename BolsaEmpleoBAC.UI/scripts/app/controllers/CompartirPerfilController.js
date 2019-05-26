'use strict';

(function () {
    angular
        .module('BacApp.controllers.CompartirPerfil', ['jkAngularRatingStars'])
        .controller('CompartirPerfilController',
        function ($scope, $log, RESTService, __env) {
            $scope.IdEntrevista = Utils.getUrlParameter("IdEntrevista");
            $scope.IdUsuario = Utils.decodeJWT().UserId;

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

            //entrevistas
            $scope.Fecha = "";
            $scope.Nombre = "";
            $scope.Creador = "";
            $scope.Puesto = "";
            $scope.Estado = "";
            $scope.TipoEntrevista = 0;
            $scope.Url = "";
            $scope.CalificacionGeneral = 0;
            $scope.Preguntas = {};

            $scope.ShowEnVivo = false;
            $scope.ShowPregrabada = false;

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
                $scope.ChangeStepTwo();
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
                        
                        $scope.LoadEntrevistasAplicadas();
                    }
                )
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

            $scope.LoadEntrevistasAplicadas = function ()
            {
                var data = {
                    IdEntrevista: { value: $scope.IdEntrevista  }
                }
                getWebApi(data, ApiService.GetEntrevistaById,
                    function (response) {
                        var obj = response;
                        
                        if (obj.IdTipoEntrevista == 1) {
                            $scope.Fecha = obj.FechaEntrevista;
                            $scope.Creador = obj.Creada;
                            $scope.Puesto = obj.Puesto;
                            $scope.Estado = obj.Estado;
                            $scope.TipoEntrevista = obj.TipoEntrevista;
                            $scope.Url = obj.Url;
                            $scope.CalificacionGeneral = obj.CalificacionGeneral;
                            $scope.IdTipoEntrevista == obj.IdTipoEntrevista;

                            $scope.ShowEnVivo = true;
                            $scope.ShowPregrabada = false;
                        }
                        else
                        {
                            $scope.Fecha = obj.Fecha;
                            $scope.Nombre = obj.Nombre;
                            $scope.Creador = obj.Creador;
                            $scope.Puesto = obj.Puesto;
                            $scope.Preguntas = obj.Preguntas;
                            $scope.IdTipoEntrevista == obj.IdTipoEntrevista;

                            $scope.ShowEnVivo = false;
                            $scope.ShowPregrabada = true;
                        }
                    }                   
                )
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
            }

            $scope.SeguridadJS = function () {
                var lista = JSON.parse(sessionStorage.getItem("role"));

                if (lista != null) {
                    var listaJs = lista.where(function (x) { return x.TipoAccionId == 3 && x.ReferenciasAux == 'CompartirPerfilController'; });

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