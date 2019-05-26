'use strict';

(function () {
    angular
        .module('BacApp.controllers.miPerfil', [])
        .controller('miPerfilController',
            function ($scope, $log, RESTService, __env) {

                $scope.model = {};
                $scope.model.PostulanteInfo = {};
                $scope.model.PostulanteInfo.NombreCompleto = '';//nombreCompleto;
                $scope.model.PostulanteInfo.IdPostulante = 0;
                $scope.model.PostulanteInfo.Nacionalidad = '';
                $scope.model.PostulanteInfo.Identificacion = '';
                $scope.model.PostulanteInfo.FechaNacimiento = '';
                $scope.model.PostulanteInfo.Genero = '';
                $scope.model.PostulanteInfo.IdEstadoCivil = 0;
                $scope.model.PostulanteInfo.Telefono = '';
                $scope.model.PostulanteInfo.ImagenURL = '';
                $scope.model.PostulanteInfo.OtraDiscapacidad = '';
                $scope.model.PostulanteInfo.PaisRecidencia = 0;
                $scope.model.PostulanteInfo.Vehiculo = false;
                $scope.model.PostulanteInfo.Email = '';
                $scope.model.PostulanteInfo.IdZona1 = 0;
                $scope.model.PostulanteInfo.IdZona2 = 0;
                $scope.model.PostulanteInfo.IdZona3 = 0;
                $scope.model.PostulanteInfo.EstudiaActualidad = false;
                $scope.model.PostulanteInfo.GradoAcademico = '';
                $scope.model.PostulanteInfo.Profesion = '';
                $scope.model.PostulanteInfo.IdPretensionSalarial = '';
                $scope.model.PostulanteInfo.DescripcionCualidades = '';
                $scope.model.PostulanteInfo.DescripcionVentajaCompetitiva = '';
                $scope.model.PostulanteInfo.TrabajoBAC = false;
                $scope.model.PostulanteInfo.CurriculumURL = '';
                $scope.model.PostulanteInfo.FechaCreacion = '';
                $scope.model.PostulanteInfo.IdUsuario = 0;
                $scope.model.PostulanteInfo.Borrado = false;
                $scope.model.PostulanteInfo.IdTipoLicencia = 0;

                $scope.model.Credenciales = {};
                $scope.model.Credenciales.IdUsuario = '';
                $scope.model.Credenciales.Password = '';
                $scope.model.Credenciales.Email = '';
                $scope.model.Credenciales.IdPais = 0;
                $scope.model.Idiomas = {};
                $scope.model.InformacionAcademica = {};
                $scope.model.Paises = {};
                $scope.model.Discapacidades = {};
                $scope.model.ReferenciasLaborales = {};

                //catalogos
                $scope.Zona1 = {};
                $scope.Zona2 = {};
                $scope.Zona3 = {};
                $scope.Idiomas = {};
                $scope.Paises = {};
                $scope.Pretensiones = {};
                $scope.Areas = {};
                $scope.Discapacidades = {};

                $scope.StepOne = true;
                $scope.StepTwo = false;
                $scope.StepThree = false;

                $scope.show1 = false;
                $scope.show2 = false;
                $scope.show3 = false;
                $scope.show4 = false;
                $scope.show5 = false;
                $scope.show6 = false;
                $scope.show7 = false;
                $scope.show8 = false;
                $scope.show9 = false;
                $scope.show10 = false;
                $scope.show11 = false;
                $scope.show12 = false;
                $scope.show13 = false;
                $scope.show14 = false;
                $scope.show15 = false;
                $scope.show16 = false;
                $scope.show17 = false;
                $scope.show18 = false;
                $scope.show19 = false;

                $scope.IsCurriculoVisible = false;
                $scope.CurriculoInvalido = false;

                $scope.ChangeStep1 = function () {
                    $scope.StepOne = true;
                    $scope.StepTwo = false;
                    $scope.StepThree = false;
                    $('#StepOne').removeClass('taps').addClass('tapSelect');
                    $('#StepTwo').removeClass('tapSelect').addClass('taps');
                    $('#StepThree').removeClass('tapSelect').addClass('taps');
                }

                $scope.ChangeStep2 = function () {
                    $scope.StepOne = false;
                    $scope.StepTwo = true;
                    $scope.StepThree = false;
                    $('#StepOne').removeClass('tapSelect').addClass('taps');
                    $('#StepTwo').removeClass('taps').addClass('tapSelect');
                    $('#StepThree').removeClass('tapSelect').addClass('taps');
                }

                $scope.ChangeStep3 = function () {
                    $scope.StepOne = false;
                    $scope.StepTwo = false;
                    $scope.StepThree = true;
                    $('#StepOne').removeClass('tapSelect').addClass('taps');
                    $('#StepTwo').removeClass('tapSelect').addClass('taps');
                    $('#StepThree').removeClass('taps').addClass('tapSelect');
                }

                var getWebApi = function (data, table, callback) {

                    var query = Utils.getFilterParameters(data);
                    RESTService.doGet(table, query)
                        .then(callback);
                }

                $scope.getPaises = function () {
                    var decode = Utils.decodeJWT();

                    var data = {
                        id: { value: decode.UserId }
                    }

                    getWebApi({}, ApiService.GetPaises,
                        function (response) {
                            $scope.Paises = response.Lista;
                        })
                }

                $scope.getZona = function () {
                    var data = {
                        id: { value: $scope.model.PostulanteInfo.PaisRecidencia }
                    }

                    getWebApi(data, ApiService.Zona1Get,
                        function (response) {
                            $scope.Zona1 = response.Lista;
                        }
                    )
                }

                $scope.Zona2Get = function () {

                    var data = {
                        id: { value: $scope.model.PostulanteInfo.IdZona1 }
                    }

                    getWebApi(data, ApiService.Zona2Get,
                        function (response) {
                            $scope.Zona2 = response.Lista;
                        }
                    )
                }

                $scope.Zona3Get = function () {

                    var data = {
                        id: { value: $scope.model.PostulanteInfo.IdZona2 }
                    }

                    getWebApi(data, ApiService.Zona3Get,
                        function (response) {
                            $scope.Zona3 = response.Lista;
                        }
                    )
                }

                $scope.getHabilidad = function () {
                    getWebApi({}, ApiService.HabilidadGet,
                        function (response) {
                            $scope.habilidades = response.Lista;

                        })
                }

                $scope.getIdiomas = function () {

                    getWebApi({}, ApiService.getIdioma,
                        function (response) {
                            $scope.Idiomas = response.Lista;
                        }
                    )
                }

                $scope.AreaLaboralGet = function () {

                    getWebApi({}, ApiService.AreaLaboralGet,
                        function (response) {
                            $scope.Areas = response.Lista;
                        }
                    )
                }

                $scope.PretensionSalarialGet = function () {

                    getWebApi({}, ApiService.PretensionSalarialGet,
                        function (response) {
                            $scope.Pretensiones = response.Lista;
                        }
                    )
                }

                $scope.getPaisesBAC = function () {
                    var decode = Utils.decodeJWT();

                    var data = {
                        id: { value: decode.UserId }
                    }

                    getWebApi({}, ApiService.GetPaises,
                        function (response) {
                            $scope.Paises = response.Lista;
                        }
                    )
                }

                $scope.DiscapacidadGet = function () {

                    getWebApi({}, ApiService.DiscapacidadGet,
                        function (response) {
                            $scope.Discapacidades = response.Lista;
                        }
                    )
                }

                $scope.GetLicencias = function () {

                    getWebApi({}, ApiService.GetLicencias,
                        function (response) {
                            $scope.Licencias = response.Lista;
                        }
                    )
                }

                $scope.getPerfil = function () {

                    var id = Utils.getUrlParameter('idPostulante');
                    //$scope.modal.IdPuesto = id;
                    var data = {
                        id: { value: id }
                    };

                    getWebApi(data, ApiService.GetPostulante,
                        function (response) {
                            var obj = response.Objeto;

                            $scope.model.PostulanteInfo.IdPostulante = obj.PostulanteInfo.IdPostulante;
                            $scope.model.PostulanteInfo.NombreCompleto = obj.PostulanteInfo.NombreCompleto;
                            $scope.model.PostulanteInfo.Nacionalidad = obj.PostulanteInfo.Nacionalidad;
                            $scope.model.PostulanteInfo.Identificacion = obj.PostulanteInfo.Identificacion;
                            var d = new Date(obj.PostulanteInfo.FechaNacimiento);
                            $scope.model.PostulanteInfo.FechaNacimiento = d;
                            $scope.model.PostulanteInfo.Genero = (obj.PostulanteInfo.Genero === 'true' ? "1" : "0");
                            $scope.model.PostulanteInfo.IdEstadoCivil = obj.PostulanteInfo.IdEstadoCivil.toString();
                            $scope.model.PostulanteInfo.Telefono = obj.PostulanteInfo.Telefono;
                            $scope.model.PostulanteInfo.ImagenURL = obj.PostulanteInfo.ImagenURL;
                            $scope.model.PostulanteInfo.PaisRecidencia = +obj.PostulanteInfo.PaisRecidencia;
                            $scope.getZona();
                            $scope.model.PostulanteInfo.IdZona1 = +obj.PostulanteInfo.IdZona1;//.toString();
                            $scope.Zona2Get();
                            $scope.model.PostulanteInfo.IdZona2 = +obj.PostulanteInfo.IdZona2;//.toString();
                            $scope.Zona3Get();
                            $scope.model.PostulanteInfo.IdZona3 = +obj.PostulanteInfo.IdZona3;//.toString();
                            $scope.model.PostulanteInfo.Vehiculo = obj.PostulanteInfo.Vehiculo;
                            $scope.model.PostulanteInfo.Email = obj.PostulanteInfo.Email;
                            $scope.model.PostulanteInfo.GradoAcademico = obj.PostulanteInfo.GradoAcademico;
                            $scope.model.PostulanteInfo.Profesion = obj.PostulanteInfo.Profesion;
                            $scope.model.PostulanteInfo.IdPretensionSalarial = obj.PostulanteInfo.IdPretensionSalarial;
                            $scope.model.PostulanteInfo.TrabajoBAC = (obj.PostulanteInfo.TrabajoBAC ? "1" : "0");
                            $scope.model.PostulanteInfo.CurriculumURL = obj.PostulanteInfo.CurriculumURL;
                            $scope.model.PostulanteInfo.DescripcionVentajaCompetitiva = obj.PostulanteInfo.DescripcionVentajaCompetitiva;
                            $scope.model.PostulanteInfo.IdTipoLicencia = obj.PostulanteInfo.IdTipoLicencia;
                            $scope.model.PostulanteInfo.Vehiculo = obj.PostulanteInfo.Vehiculo ? 'true' : 'false';

                            $('#FotoPerfil').attr('src', $scope.model.PostulanteInfo.ImagenURL);
                            $("input[name=areas]").each(function () {
                                var value = $(this).val();
                                var result = obj.Areas.any(function (x) {
                                    return x.IdArea == value
                                });
                                $(this).prop('checked', result);
                                $(this).prop('value', result);
                            });

                            $("input[name=pais]").each(function () {
                                var value = $(this).val();
                                var result = obj.Paises.any(function (x) {
                                    return x.IdPais == value
                                });
                                $(this).prop('checked', result);
                                $(this).prop('value', result);

                            });
                            $("input[name=pretension]").each(function () {
                                var value = $(this).val();
                                var result = +$scope.model.PostulanteInfo.IdPretensionSalarial == +value; /*obj.Paises.any(function (x) {
                                    return x.IdPais == value
                                });*/
                                $(this).prop('checked', result);
                                $(this).prop('value', result);

                            });
                            $("input[name=licencia]").each(function () {
                                var value = $(this).val();
                                var result = +$scope.model.PostulanteInfo.IdTipoLicencia == +value; /*obj.Paises.any(function (x) {
                                    return x.IdPais == value
                                });*/
                                $(this).prop('checked', result);
                                $(this).prop('value', result);

                            });
                            $scope.model.Credenciales = {};
                            $scope.model.Credenciales.IdUsuario = obj.Credenciales.IdUsuario;
                            $scope.model.Credenciales.Password = obj.Credenciales.Password;
                            $scope.model.Credenciales.Email = obj.Credenciales.Email;
                            $scope.model.Credenciales.IdPais = obj.Credenciales.IdPais;
                            $scope.model.Idiomas = {};
                            $scope.model.InformacionAcademica = {};
                            $scope.model.Paises = {};
                            $scope.model.Discapacidades = {};
                            $scope.model.ReferenciasLaborales = {};

                            $scope.CargarReapeter(obj.Idiomas);
                            $scope.CargarReapeterDiscapacidad(obj.Discapacidades);
                            $scope.CargarReapeterExperiencia(obj.Experiencia);
                            $scope.CargarReapeterHabilidad(obj.Habilidades);
                            $scope.CargarReapeterReferencia(obj.ReferenciasLaborales);
                            $scope.CargarReapeterGrado(obj.InformacionAcademica);
                        }
                    )
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

                $scope.login = function () {
                    Session.Login($scope.model.password, $scope.model.usuario);
                };

                $scope.registrar = function () {
                    window.location = __env.baseUrl + "Postulante/RegistroPostulante/";
                }

                $scope.cancelar = function () {
                    window.location = __env.baseUrl + "Postulante/VerPerfil";
                }

                $scope.SavePostulante = function () {


                    var Idiomas = $scope.GetValues('NivelIdioma', ['IdIdioma', 'Porcentaje']); //Utils.getValRepetear('NivelIdioma', ['IdIdioma', 'Porcentaje']);
                    var InformacionAcademica = $scope.GetValues('GradoAcademico', ['Descripcion', 'Institucion', 'TipoCertificacion']);
                    var ExperienciaLaboral = $scope.GetValues('ExperienciaAcademica', ['Puesto', 'Empresa', 'DescripcionPuesto']);
                    var Discapacidades = $scope.GetValues('divDiscapacidad', ['IdDiscapacidad']);// Utils.getValRepetear('divDiscapacidad', ['IdDiscapacidad']);
                    var ReferenciasLaborales = $scope.GetValues('divReferencias', ['UrlReferencia']);
                    var Habilidades = $scope.GetValues('divHabilidad', ['IdHabilidad']);
                    var Paises = Utils.getValCheckEdit('pais', 'IdPais');
                    var Areas = Utils.getValCheckEdit('areas', 'IdArea');

                    var Pretension = Utils.getValCheckEdit('pretension', 'IdPretensionSalarial');
                    var Licencia = Utils.getValCheckEdit('licencia', 'IdTipoLicencia');

                    var bandera = true;

                    if (!$scope.chkDuplicates(Discapacidades, true)) {
                        if (Discapacidades.length == 0) {
                            $scope.show1 = true;
                            bandera = false;
                        } else {
                            $scope.show1 = false;
                        }
                        $scope.RepeticionDiscapacidad = false;
                    } else {
                        $scope.RepeticionDiscapacidad = true;
                        bandera = false;
                    }

                    if (!$scope.chkDuplicates(InformacionAcademica, true)) {
                        if (InformacionAcademica.length == 0) {
                            $scope.show2 = true;
                            bandera = false;
                        } else {
                            $scope.show2 = false;
                        }
                        $scope.RepeticionGradoAcademico = false;
                    } else {
                        $scope.RepeticionGradoAcademico = true;
                        bandera = false;
                    }

                    if (!$scope.chkDuplicates(ExperienciaLaboral, true)) {
                        if (ExperienciaLaboral.length == 0) {
                            $scope.show3 = true;
                            bandera = false;
                        } else {
                            $scope.show3 = false;
                        }
                        $scope.RepeticionExperiencia = false;
                    } else {
                        $scope.RepeticionExperiencia = true;
                        bandera = false;
                    }

                    if ($scope.chkDuplicates(Habilidades, true)) {
                        $scope.RepeticionHabilidad = true;
                        bandera = false;
                    } else {
                        $scope.RepeticionHabilidad = false;
                        if (Habilidades.length <= 5) {
                            $scope.MaximoHabilidad = false;
                            if (Habilidades.length == 0) {
                                $scope.show4 = true;
                                bandera = false;
                            } else {
                                $scope.show4 = false;
                            }
                        } else {
                            $scope.MaximoHabilidad = true;
                            bandera = false;
                        }
                    }

                    if (!$scope.chkDuplicates(ReferenciasLaborales, true)) {
                        $scope.RepeticionReferencia = false;
                    } else {
                        bandera = false;
                        $scope.RepeticionReferencia = true;
                    }
                    //if (ReferenciasLaborales.length == 0) {
                    //    $scope.show5 = true;
                    //    bandera = false;
                    //} else {
                    //    $scope.show5 = false;
                    //}
                    if (!$scope.chkDuplicates(Idiomas, true)) {
                        if (Idiomas.length == 0) {
                            $scope.show6 = true;
                            bandera = false;
                        } else {
                            $scope.show6 = false;
                        }
                        $scope.RepeticionIdioma = false;
                    } else {
                        $scope.RepeticionIdioma = true;
                        bandera = false;
                    }

                    if ($scope.model.PostulanteInfo.NombreCompleto == '') {
                        $scope.show7 = true;
                        bandera = false;
                    } else {
                        $scope.show7 = false;
                    }
                    if ($scope.model.PostulanteInfo.Email == '') {
                        $scope.show8 = true;
                        bandera = false;
                    } else {
                        $scope.show8 = false;
                    }
                    if ($scope.model.PostulanteInfo.Telefono == '') {
                        $scope.show9 = true;
                        bandera = false;
                    } else {
                        $scope.show9 = false;
                    }
                    if ($scope.model.PostulanteInfo.PaisRecidencia == '') {
                        $scope.show10 = true;
                        bandera = false;
                    } else {
                        $scope.show10 = false;
                    }
                    if ($scope.model.PostulanteInfo.Identificacion == '') {
                        $scope.show11 = true;
                        bandera = false;
                    } else {
                        $scope.show11 = false;
                    }
                    if ($scope.model.PostulanteInfo.Genero == '') {
                        $scope.show12 = true;
                        bandera = false;
                    } else {
                        $scope.show12 = false;
                    }
                    if ($scope.model.PostulanteInfo.IdEstadoCivil == '') {
                        $scope.show13 = true;
                        bandera = false;
                    } else {
                        $scope.show13 = false;
                    }
                    if ($scope.model.PostulanteInfo.FechaNacimiento == '' || $scope.model.PostulanteInfo.FechaNacimiento == null) {
                        $scope.show14 = true;
                        bandera = false;
                    } else {
                        $scope.show14 = false;
                    }
                    if ($scope.model.PostulanteInfo.Nacionalidad == '') {
                        $scope.show15 = true;
                        bandera = false;
                    } else {
                        $scope.show15 = false;
                    }
                    if ($scope.model.PostulanteInfo.TrabajoBAC == '') {
                        $scope.show16 = true;
                        bandera = false;
                    } else {
                        $scope.show16 = false;
                    }
                    if (Areas.length == 0) {
                        $scope.show17 = true;
                        bandera = false;
                    } else {
                        $scope.show17 = false;
                    }
                    if (Paises.length == 0) {
                        $scope.show18 = true;
                        bandera = false;
                    } else {
                        $scope.show18 = false;
                    }
                    console.log('bandera:'+ bandera);
                    if (bandera) {
                        var d = new Date($scope.model.PostulanteInfo.FechaNacimiento);
                        var data = {
                            PostulanteInfo:
                            {
                                NombreCompleto: $scope.model.PostulanteInfo.NombreCompleto,
                                IdPostulante: $scope.model.PostulanteInfo.IdPostulante,
                                Nacionalidad: $scope.model.PostulanteInfo.Nacionalidad,
                                Identificacion: $scope.model.PostulanteInfo.Identificacion,
                                FechaNacimiento: d,
                                Genero: (+$scope.model.PostulanteInfo.Genero == 1 ? true : false),
                                IdEstadoCivil: $scope.model.PostulanteInfo.IdEstadoCivil,
                                Telefono: $scope.model.PostulanteInfo.Telefono,
                                ImagenURL: $scope.model.PostulanteInfo.ImagenURL,
                                OtraDiscapacidad: $scope.model.PostulanteInfo.OtraDiscapacidad,
                                PaisRecidencia: $scope.model.PostulanteInfo.PaisRecidencia,
                                Vehiculo: $scope.model.PostulanteInfo.Vehiculo,
                                Email: $scope.model.PostulanteInfo.Email,
                                IdZona1: $scope.model.PostulanteInfo.IdZona1,
                                IdZona2: $scope.model.PostulanteInfo.IdZona2,
                                IdZona3: $scope.model.PostulanteInfo.IdZona3,
                                EstudiaActualidad: $scope.model.PostulanteInfo.EstudiaActualidad,
                                GradoAcademico: $scope.model.PostulanteInfo.GradoAcademico,
                                Profesion: $scope.model.PostulanteInfo.Profesion,
                                IdPretensionSalarial: Pretension[0].IdPretensionSalarial,//Pretension[0].IdPretensionSalarial,//$scope.model.PostulanteInfo.IdPretensionSalarial,
                                DescripcionCualidades: $scope.model.PostulanteInfo.DescripcionCualidades,
                                DescripcionVentajaCompetitiva: $scope.model.PostulanteInfo.DescripcionVentajaCompetitiva,
                                TrabajoBAC: $scope.model.PostulanteInfo.TrabajoBAC,
                                CurriculumURL: $scope.model.PostulanteInfo.CurriculumURL,
                                IdUsuario: $scope.model.PostulanteInfo.IdUsuario,
                                IdTipoLicencia: Licencia[0].IdTipoLicencia
                            },
                            Credenciales: {
                                IdUsuario: $scope.model.Credenciales.IdUsuario,
                                NombreCompleto: $scope.model.PostulanteInfo.NombreCompleto,
                                Usuario1: $scope.model.PostulanteInfo.Email,
                                Password: $scope.model.Credenciales.Password,
                                Email: $scope.model.Credenciales.Email,
                                Borrado: 0,
                                IdPais: $scope.model.PostulanteInfo.PaisRecidencia,
                                IdTipoLogin: 1
                            },
                            Idiomas: Idiomas,
                            InformacionAcademica: InformacionAcademica,
                            Paises: Paises,
                            Discapacidades: Discapacidades,
                            ReferenciasLaborales: ReferenciasLaborales,
                            Areas: Areas,
                            Experiencia: ExperienciaLaboral,
                            Habilidades: Habilidades,
                        }
                        console.log('Data');
                        console.log(data);
                        postWebApi(data, ApiService.SavePostulante, function (response) {
                            if (response.Resultado) {
                                Utils.MessageBox(
                                    'Has actualizado tu perfil correctamente',
                                    'Has actualizado tu perfil correctamente',
                                    'Muchas gracias, tus datos ya se actualizaron en nuestra base de datos.',
                                    "Content/Images/IconoActualizacionPerfil.png",
                                    function () {
                                        window.location = __env.baseUrl + 'Postulante/VerPerfil';
                                        //$('#popupLoading').modal('hide');
                                        this.modal('hide');
                                    }
                                );
                            } else {
                                Utils.MessageBox(
                                    'Actualización de perfil',
                                    'Actualización de perfil',
                                    response.Mensaje,
                                    "Content/Images/IconoErrorGeneral.png",
                                    function () {
                                        $('#popupLoading').modal('hide');
                                        this.modal('hide');
                                    }
                                );
                            }
                        });
                    }
                }

                $scope.Return = function () {
                    if ($scope.StepOne == false && $scope.StepTwo == false && $scope.StepThree == false && $scope.StepFour == true) {
                        $scope.StepOne = false;
                        $scope.StepTwo = false;
                        $scope.StepThree = true;
                        $scope.StepFour = false;
                        $('#divStepFour').removeClass('Primaria').addClass('Secundario');
                        $('#divStepThree').removeClass('Secundario').addClass('Primaria');
                        $('#circuloStepFour').removeClass('CirculoPrimario').addClass('CirculoSecundario');
                        $('#circuloStepThree').removeClass('CirculoSecundario').addClass('CirculoPrimario');
                        $('#textStepFour').removeClass('textoPrimario').addClass('textoSecundario');
                        $('#textStepThree').removeClass('textoSecundario').addClass('textoPrimario');
                    } else if ($scope.StepOne == false && $scope.StepTwo == false && $scope.StepThree == true && $scope.StepFour == false) {
                        $scope.StepOne = false;
                        $scope.StepTwo = true;
                        $scope.StepThree = false;
                        $scope.StepFour = false;
                        $('#divStepThree').removeClass('Primaria').addClass('Secundario');
                        $('#divStepTwo').removeClass('Secundario').addClass('Primaria');
                        $('#circuloStepThree').removeClass('CirculoPrimario').addClass('CirculoSecundario');
                        $('#circuloStepTwo').removeClass('CirculoSecundario').addClass('CirculoPrimario');
                        $('#textStepThree').removeClass('textoPrimario').addClass('textoSecundario');
                        $('#textStepTwo').removeClass('textoSecundario').addClass('textoPrimario');
                    } else if ($scope.StepOne == false && $scope.StepTwo == true && $scope.StepThree == false && $scope.StepFour == false) {
                        $scope.StepOne = true;
                        $scope.StepTwo = false;
                        $scope.StepThree = false;
                        $scope.StepFour = false;
                        $('#divStepTwo').removeClass('Primaria').addClass('Secundario');
                        $('#divStepOne').removeClass('Secundario').addClass('Primaria');
                        $('#circuloStepTwo').removeClass('CirculoPrimario').addClass('CirculoSecundario');
                        $('#circuloStepOne').removeClass('CirculoSecundario').addClass('CirculoPrimario');
                        $('#textStepTwo').removeClass('textoPrimario').addClass('textoSecundario');
                        $('#textStepOne').removeClass('textoSecundario').addClass('textoPrimario');
                    } else if ($scope.StepOne == true && $scope.StepTwo == false && $scope.StepThree == false && $scope.StepFour == false) {
                        window.location = __env.baseUrl + "principal/login/";
                    }
                }

                $scope.RemoveElement = function (order) {
                    switch (order) {
                        case 1:

                            var ids = $('#GradoAcademico > div').map(function () {
                                return this.id
                            }).toArray();

                            if (ids.length > 1) {
                                $("#" + ids[ids.length - 1]).remove();
                            }
                            break;
                        case 2:
                            var ids = $('#AreaEspecializacion > div').map(function () {
                                return this.id
                            }).toArray();

                            if (ids.length > 1) {
                                $("#" + ids[ids.length - 1]).remove();
                            }
                            break;
                        case 3:
                            var ids = $('#ExperienciaAcademica > div').map(function () {
                                return this.id
                            }).toArray();

                            if (ids.length > 1) {
                                $("#" + ids[ids.length - 1]).remove();
                            }
                            break;
                        case 4:
                            var ids = $('#NivelIdioma > div').map(function () {
                                return this.id
                            }).toArray();

                            if (ids.length > 1) {
                                $("#" + ids[ids.length - 1]).remove();
                            }
                            break;
                        case 5:
                            var ids = $('#divHabilidad > div').map(function () {
                                return this.id
                            }).toArray();

                            if (ids.length > 1) {
                                $("#" + ids[ids.length - 1]).remove();
                            }
                            break;
                        case 6:
                            var ids = $('#divReferencias > div').map(function () {
                                return this.id
                            }).toArray();

                            if (ids.length > 1) {
                                $("#" + ids[ids.length - 1]).remove();
                            }
                            break;
                        case 7:
                            var ids = $('#divDiscapacidad > div').map(function () {
                                return this.id
                            }).toArray();

                            if (ids.length > 1) {
                                $("#" + ids[ids.length - 1]).remove();
                            }
                            break;
                            break;
                    }

                }

                $scope.contadorIdioma = 0;

                $scope.AgregarIdioma = function () {
                    var Idiomas = $scope.GetValues('NivelIdioma', ['IdIdioma', 'Porcentaje']);
                    if (!$scope.chkDuplicates(Idiomas, true)) {
                        $scope.AgregarNodo('NivelIdioma', $scope.contadorIdioma);
                        $scope.RepeticionIdioma = false;
                    } else {
                        $scope.RepeticionIdioma = true;
                    }
                }

                $scope.CargarReapeter = function (list) {
                    $.each(list, function (index, value) {
                        $scope.AgregarNodoWithValue('NivelIdioma', index, value);
                    });
                }

                $scope.AgregarNodoWithValue = function (id, i, value) {
                    $scope.AgregarNodo(id, i);
                    console.log(value);
                    $('#txtIdioma' + i).val(value.IdIdioma).change();
                    var value = Number(value.Porcentaje);
                    var porcentaje = value >= 0 && value <= 49 ? "0" : (value >= 50 && value <= 75 ? "50" : (value >= 76 && value <= 99 ? "90" : "100"));

                    $('#selNivel' + i).val(porcentaje).change();
                }

                $scope.AgregarNodo = function (id, i) {
                    var html = '<div id="pnlRepeatNivelIdioma' + i + '">';
                    html += '       <div  class="row">';
                    html += '           <div id="div_' + i + '" class="row col-10 pnlRepeatNivelIdioma' + i + '">';
                    html += '               <select class="col-5 mr-3" id="txtIdioma' + i + '">';
                    html += '                   <option disabled selected value="">Idioma</option>';
                    $.each($scope.Idiomas, function (index, idioma) {
                        html += '               <option value="' + idioma.IdIdioma + '" ng-value="' + idioma.IdIdioma + '">' + idioma.Descripcion + '</option>';
                    });
                    html += '               </select>';
                    html += '               <select id ="selNivel' + i + '" class="col-6">';
                    html += '                   <option value="">Nivel</option>';
                    html += '                   <option value="0">Bajo</option>';
                    html += '                   <option value="50">Intermedio</option>';
                    html += '                   <option value="90">Avanzado</option>';
                    html += '                   <option value="100">Nativo</option>';
                    html += '               </select >';
                    html += '           </div>';
                    if(i > 0) {
                        html += '           <div class="col-sm-2 col-2"> ';
                        html += '               <img id="borradorIdioma' + i + '" src = "' + __env.baseUrl + 'Content/Images/Basurero.png" class="imgLetraContenido punteroSelector mt-3" /> ';
                        html += '           </div>';
                    }
                    html += '       </div>';
                    html += ' </div> ';

                    $('#' + id).append(html);

                    $('#borradorIdioma' + i).on('click', function () {
                        $('#pnlRepeatNivelIdioma' + i).remove();
                    });

                    $scope.contadorIdioma = $scope.contadorIdioma + 1;
                }

                $scope.RemoveElement = function (param) {
                    $("#" + param).remove();
                }

                // Aqui termina tavito que esta cansado. :s
                $scope.GetValues = function (container, mapper) {
                    var arrObj = [];
                    var arrIds = $('#' + container + ' > div').map(function () {
                        return this.id;
                    }).toArray();

                    var variable = '[';

                    arrIds.forEach(function (element, i) {

                        var map = '#' + element + ' .' + element;
                        var valuesArr = $(map).each(function (e, i) {
                            return this.childNodes;
                        }).toArray();

                        
                        variable += '{';
                        var j = 0;
                        valuesArr[0].childNodes.forEach(function (e, i) {
                            if (e.tagName != undefined) {
                                if (e.value != '' && e.value != undefined) {
                                    variable += mapper[j] + ":'" + e.value + "',";
                                    if (mapper.length - 1 == j) {
                                        j = 0;
                                    } else {
                                        j = j + 1;
                                    }
                                }
                            }
                        });
                        variable = variable.substring(0, variable.length - 1) + "},";
                        //if (variable != '{}') {
                        //    arrObj.push(eval(variable));
                        //}

                    });

                    variable = variable.substring(0, variable.length - 1) + ']';
                    variable = (variable == ']' ? '[]' : variable);
                    arrObj = eval(variable);
                    return arrObj;
                }

                /*Referencia */
                $scope.contadorReferencia = 0;

                $scope.AgregarReferencia = function () {
                    var ReferenciasLaborales = $scope.GetValues('divReferencias', ['UrlReferencia']);
                    if (!$scope.chkDuplicates(ReferenciasLaborales, true)) {
                        $scope.AgregarNodoReferencia('divReferencias', $scope.contadorReferencia);
                        $scope.RepeticionReferencia = false;
                    } else {
                        $scope.RepeticionReferencia = true;
                    }
                }

                $scope.CargarReapeterReferencia = function (list) {
                    $.each(list, function (index, value) {
                        $scope.AgregarNodoWithValueReferencia('divReferencias', index, value);
                    });
                }

                $scope.AgregarNodoWithValueReferencia = function (id, i, value) {
                    $scope.AgregarNodoReferencia(id, i);
                    console.log(value);
                    $('#txtSitiosReferencia' + i).val(value.UrlReferencia);
                }

                $scope.AgregarNodoReferencia = function (id, i) {
                    var html = '<div id="pnlRepetearReferencias' + i + '">';
                    html += '       <div  class="row align-items-center">';
                    html += '           <div id="divref_' + i + '" class="col-sm-10 col-10 pnlRepetearReferencias' + i + '">';
                    html += '               <input id="txtSitiosReferencia' + i + '" type="text" placeholder="Sitios de referencia" />';
                    html += '           </div>';
                    if(i > 0) {
                        html += '           <div class="col-sm-2 col-2"> ';
                        html += '               <img id="borradorRef' + i + '" src = "' + __env.baseUrl + 'Content/Images/Basurero.png" class="imgLetraContenido punteroSelector" /> ';
                        html += '           </div>';
                    }
                    html += '       </div>';
                    html += ' </div> ';

                    $('#' + id).append(html);

                    $('#borradorRef' + i).on('click', function () {
                        $('#pnlRepetearReferencias' + i).remove();
                    });

                    $scope.contadorReferencia = $scope.contadorReferencia + 1;
                }

                $scope.RemoveElementReferencia = function (param) {
                    $("#" + param).remove();
                }

                // Aqui termina tavito que esta cansado. :s
                $scope.GetValuesReferencia = function (container, mapper) {
                    var arrObj = [];
                    var arrIds = $('#' + container + ' > div').map(function () {
                        return this.id;
                    }).toArray();

                    var variable = '['

                    arrIds.forEach(function (element, i) {

                        var map = '#' + element + ' .' + element;
                        var valuesArr = $(map).each(function (e, i) {
                            return this.childNodes;
                        }).toArray();

                        variable += '{';
                        valuesArr[0].childNodes.forEach(function (e, i) {
                            if (e.tagName != undefined) {
                                if (e.value != '' && e.value != undefined && e.value != 0) {
                                    variable += mapper[i - 1] + ":'" + e.value + "',";
                                }
                            }
                        });
                        variable = variable.substring(0, variable.length - 1) + "},"
                        //if (variable != '{}') {
                        //    arrObj.push(eval(variable));
                        //}

                    });

                    variable = variable.substring(0, variable.length - 1) + ']';
                    console.log(variable);
                    arrObj = eval(variable);
                    return arrObj;
                }

                /*Habilidades*/

                $scope.contadorHabilidad = 0;

                $scope.AgregarHabilidad = function () {
                    var Habilidades = $scope.GetValues('divHabilidad', ['IdHabilidad']);
                    if ($scope.chkDuplicates(Habilidades, true)) {
                        $scope.RepeticionHabilidad = true;
                    } else {
                        $scope.RepeticionHabilidad = false;
                        if (Habilidades.length < 5) {
                            $scope.MaximoHabilidad = false;
                            $scope.AgregarNodoHabilidad('divHabilidad', $scope.contadorHabilidad);
                        } else {
                            $scope.MaximoHabilidad = true;
                        }
                    }
                }

                $scope.CargarReapeterHabilidad = function (list) {
                    $.each(list, function (index, value) {
                        $scope.AgregarNodoWithValueHabilidad('divHabilidad', index, value);
                    });
                }

                $scope.AgregarNodoWithValueHabilidad = function (id, i, value) {
                    $scope.AgregarNodoHabilidad(id, i);
                    console.log(value);
                    $('#txtHabilidadBlanda' + i).val(value.IdHabilidad).change();
                }

                $scope.AgregarNodoHabilidad = function (id, i) {
                    var html = '<div id="pnlRepetearHabilidad' + i + '">';
                    html += '       <div  class="row align-items-center">';
                    html += '           <div id="div_' + i + '" class="col-sm-10 col-10 pnlRepetearHabilidad' + i + '">';
                    html += '               <select id="txtHabilidadBlanda' + i + '">';
                    html += '                   <option disabled selected value="">Habilidades blandas</option>';
                    $.each($scope.habilidades, function (index, idioma) {
                        html += '               <option value="' + idioma.IdHabilidad + '" ng-value="' + idioma.IdHabilidad + '">' + idioma.Descripcion + '</option>';
                    });
                    html += '               </select>';
                    html += '           </div>';
                    if(i > 0) {
                        html += '           <div class="col-sm-2 col-2"> ';
                        html += '               <img id="borradorHab' + i + '" src = "' + __env.baseUrl + 'Content/Images/Basurero.png" class="imgLetraContenido punteroSelector" /> ';
                        html += '           </div>';
                    }
                    html += '       </div>';
                    html += ' </div> ';

                    $('#' + id).append(html);

                    $('#borradorHab' + i).on('click', function () {
                        $('#pnlRepetearHabilidad' + i).remove();
                    });

                    $scope.contadorHabilidad = $scope.contadorHabilidad + 1;
                }

                $scope.RemoveElementHabilidad = function (param) {
                    $("#" + param).remove();
                }

                // Aqui termina tavito que esta cansado. :s
                $scope.GetValuesHabilidad = function (container, mapper) {
                    var arrObj = [];
                    var arrIds = $('#' + container + ' > div').map(function () {
                        return this.id;
                    }).toArray();

                    var variable = '['

                    arrIds.forEach(function (element, i) {

                        var map = '#' + element + ' .' + element;
                        var valuesArr = $(map).each(function (e, i) {
                            return this.childNodes;
                        }).toArray();

                        variable += '{';
                        valuesArr[0].childNodes.forEach(function (e, i) {
                            if (e.tagName != undefined) {
                                if (e.value != '' && e.value != undefined && e.value != 0) {
                                    variable += mapper[i - 1] + ":'" + e.value + "',";
                                }
                            }
                        });
                        variable = variable.substring(0, variable.length - 1) + "},"
                        //if (variable != '{}') {
                        //    arrObj.push(eval(variable));
                        //}

                    });

                    variable = variable.substring(0, variable.length - 1) + ']';
                    arrObj = eval(variable);
                    return arrObj;
                }


                /*Experienca*/
                $scope.contadorExperiencia = 0;

                $scope.AgregarExperiencia = function() {
                    var ExperienciaLaboral =
                        $scope.GetValues('ExperienciaAcademica', ['Puesto', 'Empresa', 'DescripcionPuesto']);
                    if (!$scope.chkDuplicates(ExperienciaLaboral, true)) {
                        $scope.AgregarNodoExperiencia('ExperienciaAcademica', $scope.contadorExperiencia);
                        $scope.RepeticionExperiencia = false;
                    } else {
                        $scope.RepeticionExperiencia = true;
                    }
                };

                $scope.CargarReapeterExperiencia = function(list) {
                    $.each(list,
                        function(index, value) {
                            $scope.AgregarNodoWithValueExperiencia('ExperienciaAcademica', index, value);
                        });
                };

                $scope.AgregarNodoWithValueExperiencia = function(id, i, value) {
                    $scope.AgregarNodoExperiencia(id, i);
                    console.log(value);
                    $('#txtPuesto' + i).val(value.Puesto);
                    $('#txtEmpresa' + i).val(value.Empresa);
                    $('#txtDescripcion' + i).val(value.DescripcionPuesto);
                };

                $scope.AgregarNodoExperiencia = function(id, i) {
                    var html = '<div id="pnlRepeaterExperienciaAcademica' + i + '" class="mb-4">';
                    html += '<p class="LetrasContenido textoNegrita">Puesto ' + (i + 1) + '</p>';
                    html += '       <div  class="row">';
                    html += '           <div id="divExp_' +
                        i +
                        '" class="col-sm-10 col-10 pnlRepeaterExperienciaAcademica' +
                        i +
                        '">';
                    html += '               <input id="txtPuesto' + i + '" type="text" placeholder="Puesto" />';
                    html += '               <input id = "txtEmpresa' + i + '" type = "text" placeholder = "Empresa" />';
                    html += '               <input id="txtDescripcion' +
                        i +
                        '" type="text" placeholder="Descripción" />';
                    html += '           </div>';
                    if(i > 0) {
                        html += '           <div class="col-sm-2 col-2"> ';
                        html += '               <img id="borradorExp' +
                            i +
                            '" src = "' +
                            __env.baseUrl +
                            'Content/Images/Basurero.png" class="imgLetraContenido punteroSelector mt-3" /> ';
                        html += '           </div>';
                    }
                    html += '       </div>';
                    html += ' </div> ';

                    $('#' + id).append(html);

                    $('#borradorExp' + i).on('click',
                        function() {
                            $('#pnlRepeaterExperienciaAcademica' + i).remove();
                        });

                    $scope.contadorExperiencia = $scope.contadorExperiencia + 1;
                };

                $scope.RemoveElementExperiencia = function(param) {
                    $("#" + param).remove();
                };

                // Aqui termina tavito que esta cansado. :s
                $scope.GetValuesExperiencia = function(container, mapper) {
                    var arrObj = [];
                    var arrIds = $('#' + container + ' > div').map(function() {
                        return this.id;
                    }).toArray();

                    var variable = '['

                    arrIds.forEach(function(element, i) {

                        var map = '#' + element + ' .' + element;
                        var valuesArr = $(map).each(function(e, i) {
                            return this.childNodes;
                        }).toArray();

                        variable += '{';
                        valuesArr[0].childNodes.forEach(function(e, i) {
                            if (e.tagName != undefined) {
                                if (e.value != '' && e.value != undefined && e.value != 0) {
                                    variable += mapper[i - 1] + ":'" + e.value + "',";
                                }
                            }
                        });
                        variable = variable.substring(0, variable.length - 1) + "},"
                        //if (variable != '{}') {
                        //    arrObj.push(eval(variable));
                        //}

                    });

                    variable = variable.substring(0, variable.length - 1) + ']';
                    console.log(variable);
                    arrObj = eval(variable);
                    return arrObj;
                };


                /*grado Academico*/
                $scope.contadorGrado = 0;

                $scope.AgregarGrado = function() {
                    var InformacionAcademica = $scope.GetValues('GradoAcademico',
                        ['Descripcion', 'Institucion', 'TipoCertificacion']);
                    if (!$scope.chkDuplicates(InformacionAcademica, true)) {
                        $scope.AgregarNodoGrado('GradoAcademico', $scope.contadorGrado);
                        $scope.RepeticionGradoAcademico = false;
                    } else {
                        $scope.RepeticionGradoAcademico = true;
                    }
                };

                $scope.CargarReapeterGrado = function(list) {
                    $.each(list,
                        function(index, value) {
                            $scope.AgregarNodoWithValueGrado('GradoAcademico', index, value);
                        });
                };

                $scope.AgregarNodoWithValueGrado = function(id, i, value) {
                    $scope.AgregarNodoGrado(id, i);
                    console.log(value);
                    $('#txtTitulo' + i).val(value.Descripcion).change();
                    $('#txtCentroEducativo' + i).val(value.Institucion).change();
                    $('#selGrado' + i).val(value.TipoCertificacion).change();
                };

                $scope.AgregarNodoGrado = function(id, i) {
                    var html = '<div id="pnlRepeatGrado' + i + '" class="mb-4">';
                    html += '       <div  class="row">';
                    html += '           <div id="divGrado_' + i + '" class="col-sm-10 col-10 pnlRepeatGrado' + i + '">';
                    html += '               <input id="txtTitulo' +
                        i +
                        '" type="text" placeholder="Titulo o certificado" />';
                    html += '               <input id = "txtCentroEducativo' +
                        i +
                        '" type = "text" placeholder = "Centro educativo" />';
                    html += '               <select id="selGrado' + i + '">';
                    html += '                   <option selected disabled value="">Grado Académico</option>';
                    html += '                   <option value="1">Educación Básica Primaria</option>';
                    html += '                   <option value="2">Educación Básica Secundaria</option>';
                    html += '                   <option value="3">Bachillerato / Educación Media</option>';
                    html += '                   <option value="4">Educación Técnico/Profesional</option>';
                    html += '                   <option value="5">Bachillerato Universitario</option>';
                    html += '                   <option value="6">Licenciatura</option>';
                    html += '                   <option value="7">Maestría</option>';
                    html += '                 <option value="8">Doctorado</option>';
                    html += '               </select>';
                    html += '           </div>';
                    if(i > 0) {
                        html += '           <div class="col-sm-2 col-2"> ';
                        html += '               <img id="borradorGRado' +
                            i +
                            '" src = "' +
                            __env.baseUrl +
                            'Content/Images/Basurero.png" class="imgLetraContenido punteroSelector mt-3" /> ';
                        html += '           </div>';
                    }
                    html += '       </div>';
                    html += ' </div> ';

                    $('#' + id).append(html);

                    $('#borradorGRado' + i).on('click',
                        function() {
                            $('#pnlRepeatGrado' + i).remove();
                        });

                    $scope.contadorGrado = $scope.contadorGrado + 1;
                };

                $scope.RemoveElementGrado = function(param) {
                    $("#" + param).remove();
                };

                // Aqui termina tavito que esta cansado. :s
                $scope.GetValuesGrado = function(container, mapper) {
                    var arrObj = [];
                    var arrIds = $('#' + container + ' > div').map(function() {
                        return this.id;
                    }).toArray();

                    var variable = '[';

                    arrIds.forEach(function(element, i) {

                        var map = '#' + element + ' .' + element;
                        var valuesArr = $(map).each(function(e, i) {
                            return this.childNodes;
                        }).toArray();

                        variable += '{';
                        valuesArr[0].childNodes.forEach(function(e, i) {
                            if (e.tagName !== undefined) {
                                if (e.value !== '' && e.value !== undefined && e.value !== 0) {
                                    variable += mapper[i - 1] + ":'" + e.value + "',";
                                }
                            }
                        });
                        variable = variable.substring(0, variable.length - 1) + "},"
                        //if (variable != '{}') {
                        //    arrObj.push(eval(variable));
                        //}

                    });

                    variable = variable.substring(0, variable.length - 1) + ']';
                    console.log(variable);
                    arrObj = eval(variable);
                    return arrObj;
                };

                /*Discapacidad*/

                $scope.contadorDiscapacidad = 0;

                $scope.AgregarDiscapacidad = function () {
                    var Discapacidades = $scope.GetValues('divDiscapacidad', ['IdDiscapacidad']);
                    if (!$scope.chkDuplicates(Discapacidades, true)) {
                        $scope.AgregarNodoDiscapacidad('divDiscapacidad', $scope.contadorDiscapacidad);
                        $scope.RepeticionDiscapacidad = false;
                    } else {
                        $scope.RepeticionDiscapacidad = true;
                    }
                }

                $scope.CargarReapeterDiscapacidad = function (list) {
                    $.each(list, function (index, value) {
                        $scope.AgregarNodoWithValueDiscapacidad('divDiscapacidad', index, value);
                    });
                }

                $scope.AgregarNodoWithValueDiscapacidad = function (id, i, value) {
                    $scope.AgregarNodoDiscapacidad(id, i);
                    console.log(value);
                    $('#isDiscapacidad' + i).val(value.IdDiscapacidad).change();
                }

                $scope.AgregarNodoDiscapacidad = function (id, i) {
                    var html = '<div id="pnlRepeaterDiscapacidad' + i + '">';
                    html += '       <div  class="row align-items-center">';
                    html += '           <div id="divDis_' + i + '" class="col-sm-10 col-10 pnlRepeaterDiscapacidad' + i + '">';
                    html += '               <select id="isDiscapacidad' + i + '">';
                    html += '                   <option disabled selected value="">Discapacidad</option>';
                    $.each($scope.Discapacidades, function (index, idioma) {
                        html += '               <option value="' + idioma.IdDescapacidad + '" ng-value="' + idioma.IdDescapacidad + '">' + idioma.Descripcion + '</option>';
                    });
                    html += '               </select>';
                    html += '           </div>';
                    if(i > 0) {
                        html += '           <div class="col-sm-2 col-2"> ';
                        html += '               <img id="borradorDis' + i + '" src = "' + __env.baseUrl + 'Content/Images/Basurero.png" class="imgLetraContenido punteroSelector" /> ';
                        html += '           </div>';
                    }
                    html += '       </div>';
                    html += ' </div> ';

                    $('#' + id).append(html);

                    $('#borradorDis' + i).on('click', function () {
                        $('#pnlRepeaterDiscapacidad' + i).remove();
                    });

                    $scope.contadorDiscapacidad = $scope.contadorDiscapacidad + 1;
                }

                $scope.RemoveElementDiscapacidad = function (param) {
                    $("#" + param).remove();
                }

                // Aqui termina tavito que esta cansado. :s
                $scope.GetValuesDiscapacidad = function (container, mapper) {
                    var arrObj = [];
                    var arrIds = $('#' + container + ' > div').map(function () {
                        return this.id;
                    }).toArray();

                    var variable = '['

                    arrIds.forEach(function (element, i) {

                        var map = '#' + element + ' .' + element;
                        var valuesArr = $(map).each(function (e, i) {
                            return this.childNodes;
                        }).toArray();

                        variable += '{';
                        var j = 0;
                        valuesArr[0].childNodes.forEach(function (e, i) {
                            if (e.tagName != undefined) {
                                if (e.value != '' && e.value != undefined) {
                                    variable += mapper[j] + ":'" + e.value + "',";
                                    if (mapper.length - 1 == j) {
                                        j = 0;
                                    } else {
                                        j = j + 1;
                                    }
                                }
                            }
                        });
                        variable = variable.substring(0, variable.length - 1) + "},";
                        //if (variable != '{}') {
                        //    arrObj.push(eval(variable));
                        //}

                    });

                    variable = variable.substring(0, variable.length - 1) + ']';
                    arrObj = eval(variable);
                    return arrObj;
                }

                $scope.uploadFileCV = function () {
                    Utils.UploadFile('uploadCV', $scope.ResCurriculum, __env.MaxSizeDoc, __env.FormatosDoc);
                }

                $scope.ResCurriculum = function (r) {
                    $scope.model.PostulanteInfo.CurriculumURL = r[0];
                    $('#DownloadCurriculo').attr('href', $scope.model.PostulanteInfo.CurriculumURL);
                    $scope.IsCurriculoVisible = true;
                    $scope.CurriculoInvalido = false;
                }

                $scope.uploadFile = function () {
                    Utils.UploadFile('uploadfile', $scope.ResFoto, __env.MaxSizeImagen, __env.FormatosImagen);
                }

                $scope.ResFoto = function (r) {
                    $scope.model.PostulanteInfo.ImagenURL = r[0];
                    $('#FotoPerfil').attr('src', $scope.model.PostulanteInfo.ImagenURL);
                }

                $scope.SeguridadJS = function () {
                    var lista = JSON.parse(sessionStorage.getItem("role"));

                    if (lista != null) {
                        var listaJs = lista.where(function (x) { return x.TipoAccionId == 3 && x.ReferenciasAux == 'miPerfilController'; });

                        $.each(listaJs, function (index, value) {
                            var funcion = eval('$scope.' + value.ReferenciaJS);
                            if (funcion != undefined && funcion != null && funcion != '') {
                                eval('$scope.' + value.ReferenciaJS + '= function () { }');
                            }
                        });
                    }
                }

                $scope.chkDuplicates = function (arr, justCheck) {
                    var len = arr.length, tmp = {}, arrtmp = arr.slice(), dupes = [];
                    arrtmp.sort();
                    while (len--) {
                        var val = arrtmp[len];
                        if (/nul|nan|infini/i.test(String(val))) {
                            val = String(val);
                        }
                        if (tmp[JSON.stringify(val)]) {
                            if (justCheck) { return true; }
                            dupes.push(val);
                        }
                        tmp[JSON.stringify(val)] = true;
                    }
                    return justCheck ? false : dupes.length ? dupes : null;
                }

                $scope.OnlyNumbers = function (event) {
                    var keys = {
                        'up': 38, 'right': 39, 'down': 40, 'left': 37,
                        'escape': 27, 'backspace': 8, 'tab': 9, 'enter': 13, 'del': 46,
                        '0': 48, '1': 49, '2': 50, '3': 51, '4': 52, '5': 53, '6': 54, '7': 55, '8': 56, '9': 57, 'dash': 189, 'subtract': 109
                    };
                    for (var index in keys) {
                        if (!keys.hasOwnProperty(index)) continue;
                        if (event.charCode == keys[index] || event.keyCode == keys[index]) {
                            return; //default event
                        }
                    }
                    event.preventDefault();
                }

                //datepicker

                $scope.dateOptions = {
                    showWeeks: false,
                    maxDate: new Date(),
                    formatYear: 'yy',
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