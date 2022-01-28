'use strict';

(function () {
    angular
        .module('BacApp.controllers.registroPostulante', [])
        .controller('registroPostulanteController',
            function ($scope, $log, RESTService, __env) {

                var nombreCompleto = '';
                if (JsonNombreCompleto != 'undefined') {
                    nombreCompleto = JsonNombreCompleto;
                }

                $scope.model = {};
                $scope.model.PostulanteInfo = {};
                $scope.model.PostulanteInfo.NombreCompleto = nombreCompleto;
                $scope.model.PostulanteInfo.IdPostulante = 0;
                $scope.model.PostulanteInfo.Nacionalidad = "";
                $scope.model.PostulanteInfo.Identificacion = '';
                $scope.model.PostulanteInfo.FechaNacimiento = '';
                $scope.model.PostulanteInfo.Genero = "";
                $scope.model.PostulanteInfo.IdEstadoCivil = "";
                $scope.model.PostulanteInfo.Telefono = '';
                $scope.model.PostulanteInfo.ImagenURL = '';
                $scope.model.PostulanteInfo.OtraDiscapacidad = '';
                $scope.model.PostulanteInfo.PaisRecidencia = "";
                $scope.model.PostulanteInfo.Vehiculo = false;
                $scope.model.PostulanteInfo.Email = '';
                $scope.model.PostulanteInfo.IdZona1 = "";
                $scope.model.PostulanteInfo.IdZona2 = "";
                $scope.model.PostulanteInfo.IdZona3 = "";
                $scope.model.PostulanteInfo.EstudiaActualidad = false;
                $scope.model.PostulanteInfo.GradoAcademico = "";
                $scope.model.PostulanteInfo.Profesion = "";
                $scope.model.PostulanteInfo.IdPretensionSalarial = "";
                $scope.model.PostulanteInfo.DescripcionCualidades = '';
                $scope.model.PostulanteInfo.DescripcionVentajaCompetitiva = '';
                $scope.model.PostulanteInfo.TrabajoBAC = false;
                $scope.model.PostulanteInfo.CurriculumURL = '';
                $scope.model.PostulanteInfo.FechaCreacion = '';
                $scope.model.PostulanteInfo.IdUsuario = 0;
                $scope.model.PostulanteInfo.Borrado = false;
                $scope.model.PostulanteInfo.Vehiculo = false;
                $scope.model.PostulanteInfo.IdTipoLicencia = 0;

                $scope.model.Credenciales = {};
                $scope.model.Credenciales.Password = '';
                $scope.model.Credenciales.Email = $scope.model.PostulanteInfo.Email;
                $scope.model.Credenciales.IdPais = "";

                $scope.model.Idiomas = {};
                $scope.model.InformacionAcademica = {};
                $scope.model.Paises = {};
                $scope.model.Discapacidades = {};
                $scope.model.ReferenciasLaborales = {};

                $scope.IsCurriculoVisible = false;

                var d = new Date();
                $scope.MaxSizeImagen = __env.MaxSizeImagen;
                $scope.FormatosImagen = __env.FormatosImagen;
                $scope.MaxSizeDoc = __env.MaxSizeDoc;
                $scope.FormatosDoc = __env.FormatosDoc;
                $scope.DateNow = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();

                //catalogos
                $scope.Zona1 = {};
                $scope.Zona2 = {};
                $scope.Zona3 = {};
                $scope.Idiomas = {};
                $scope.Paises = {};
                $scope.Pretensiones = {};
                $scope.Areas = {};
                $scope.Discapacidades = {};

                //pasos
                $scope.StepOne = true;
                $scope.StepTwo = false;
                $scope.StepThree = false;
                $scope.StepFour = false;

                //validaciones paso 1
                $scope.StepOneComplete = false;
                $scope.IdInvalido = false;
                $scope.NombreInvalido = false;
                $scope.GeneroInvalido = false;
                $scope.CivilInvalido = false;
                $scope.NacionalidadInvalido = false;
                $scope.ResidenciaInvalido = false;
                $scope.Zona1Invalido = false;
                $scope.Zona2Invalido = false;
                $scope.Zona3Invalido = false;
                $scope.FotoInvalido = false;
                $scope.ClaveInvalido = false;
                $scope.NacimientoInvalido = false;
                $scope.EmailInvalido = false;
                $scope.EmailFormatInvalido = false;
                $scope.EmailExiste = false;
                $scope.TelefonoInvalido = false;
                $scope.PasswordLenInvalido = false;
                $scope.FotoInvalido = false;
                $scope.HasFoto = false;

                //validaciones paso 2
                $scope.StepTwoComplete = false;
                $scope.GradoRepetearInvalido = false;
                $scope.ExperenciaRepeaterInvalido = false;
                $scope.IdiomaRepeaterInvalido = false;
                $scope.HabilidadRepeaterInvalido = false;
                $scope.ReferenciaRepeaterInvalido = false;
                $scope.MaximoHabilidad = false;
                $scope.RepeticionHabilidad = false;

                //validaciones paso 3
                $scope.StepThreeComplete = false;
                $scope.AreaRepeaterInvalido = false;
                $scope.PaisRepeaterInvalido = false;
                $scope.PretensionRepeaterInvalido = false;

                //validaciones paso 4
                $scope.StepFourComplete = false;
                $scope.VehiculoInvalido = false;
                $scope.CurriculoInvalido = false;
                $scope.DiscapacidadRepetearInvalido = false;
                $scope.CurriculoInvalido = false;

                $scope.HiddenValidateStepTwo = function () {
                    $scope.GradoRepetearInvalido = false;
                    $scope.ExperenciaRepeaterInvalido = false;
                    $scope.IdiomaRepeaterInvalido = false;
                    $scope.HabilidadRepeaterInvalido = false;
                    $scope.ReferenciaRepeaterInvalido = false;
                }

                $scope.HiddenValidateStepThree = function () {
                    $scope.AreaRepeaterInvalido = false;
                    $scope.PaisRepeaterInvalido = false;
                    $scope.PretensionRepeaterInvalido = false;
                }

                $scope.HiddenValidateStepFour = function () {
                    $scope.VehiculoInvalido = false;
                    $scope.CurriculoInvalido = false;
                    $scope.DiscapacidadRepetearInvalido = false;
                }
                $scope.StepOneValidate = function () {
                    var result = true;
                    if ($scope.model.PostulanteInfo.Identificacion == "") {
                        $scope.IdInvalido = true;
                        result = false;
                    } else { $scope.IdInvalido = false; }

                    if ($scope.model.PostulanteInfo.NombreCompleto == "") {
                        $scope.NombreInvalido = true;
                        result = false;
                    } else { $scope.NombreInvalido = false; }

                    if ($scope.model.PostulanteInfo.Genero == undefined || $scope.model.PostulanteInfo.Genero == "") {
                        $scope.GeneroInvalido = true;
                        result = false;
                    } else { $scope.GeneroInvalido = false; }

                    if ($scope.model.PostulanteInfo.IdEstadoCivil == undefined || $scope.model.PostulanteInfo.IdEstadoCivil == "") {
                        $scope.CivilInvalido = true;
                        result = false;
                    } else { $scope.CivilInvalido = false; }

                    if ($scope.model.PostulanteInfo.FechaNacimiento == "") {
                        $scope.NacimientoInvalido = true;
                        result = false;
                    } else { $scope.NacimientoInvalido = false; }

                    if ($scope.model.PostulanteInfo.Nacionalidad == undefined || $scope.model.PostulanteInfo.Nacionalidad == "") {
                        $scope.NacionalidadInvalido = true;
                        result = false;
                    } else { $scope.NacionalidadInvalido = false; }

                    if ($scope.model.PostulanteInfo.Email == "") {
                        $scope.EmailInvalido = true;
                        result = false;
                    } else { $scope.EmailInvalido = false; }

                    if ($scope.model.Credenciales.Password == "") {
                        $scope.ClaveInvalido = true;
                        result = false;
                    } else { $scope.ClaveInvalido = false; }

                    if ($scope.model.Credenciales.Password.length < 8) {
                        $scope.PasswordLenInvalido = true;
                        result = false;
                    } else { $scope.PasswordLenInvalido = false; }

                    if ($scope.model.PostulanteInfo.Telefono == "") {
                        $scope.TelefonoInvalido = true;
                        result = false;
                    } else { $scope.TelefonoInvalido = false; }

                    if ($scope.model.PostulanteInfo.PaisRecidencia == undefined || $scope.model.PostulanteInfo.PaisRecidencia == "") {
                        $scope.ResidenciaInvalido = true;
                        result = false;
                    } else { $scope.ResidenciaInvalido = false; }

                    //if ($scope.model.PostulanteInfo.IdZona1 == undefined || $scope.model.PostulanteInfo.IdZona1 == "") {
                    //    $scope.Zona1Invalido = true;
                    //    result = false;
                    //} else { $scope.Zona1Invalido = false; }

                    //if ($scope.model.PostulanteInfo.IdZona2 == undefined || $scope.model.PostulanteInfo.IdZona2 == "") {
                    //    $scope.Zona2Invalido = true;
                    //    result = false;
                    //} else { $scope.Zona2Invalido = false; }

                    //if ($scope.model.PostulanteInfo.IdZona3 == undefined || $scope.model.PostulanteInfo.IdZona3 == "") {
                    //    $scope.Zona3Invalido = true;
                    //    result = false;
                    //} else { $scope.Zona3Invalido = false; }
                    if ($scope.HasFoto === false) {
                        $scope.FotoInvalido = true;
                        result = false;
                    }
                    if ($scope.EmailExiste) {
                        result = false;
                    }

                    if (!$scope.isValidEmail($scope.model.PostulanteInfo.Email)) {
                        $scope.EmailFormatInvalido = true;
                        result = false;
                    } else { $scope.EmailFormatInvalido = false;}
                    return result;
                }

                $scope.StepTwoValidate = function () {
                    var result = true;

                    if ($scope.model.PostulanteInfo.GradoAcademico == undefined || $scope.model.PostulanteInfo.GradoAcademico == "") {
                        $scope.GradoInvalido = true;
                        result = false;
                    } else { $scope.GradoInvalido = false; }

                    if ($scope.model.PostulanteInfo.TrabajoBAC == undefined || $scope.model.PostulanteInfo.TrabajoBAC == "") {
                        $scope.BacInvalido = true;
                        result = false;
                    } else { $scope.BacInvalido = false; }

                    var grado = Utils.getValRepetear('GradoAcademico', ['Descripcion', 'Institucion', 'TipoCertificacion']);
                    if (!$scope.chkDuplicates(grado, true)) {
                        if (grado.length == 0) {
                            $scope.GradoRepetearInvalido = true;
                            result = false;
                        } else {
                            $scope.GradoRepetearInvalido = false;
                        }
                        $scope.RepeticionGradoAcademico = false;
                    } else {
                        $scope.RepeticionGradoAcademico = true;
                        result = false;
                    }

                    var Idiomas = Utils.getValRepetear('NivelIdioma', ['IdIdioma', 'Porcentaje']);
                    if (!$scope.chkDuplicates(Idiomas, true)) {
                        if (Idiomas.length == 0) {
                            $scope.IdiomaRepeaterInvalido = true;
                            result = false;
                        } else {
                            $scope.IdiomaRepeaterInvalido = false;
                        }
                        $scope.RepeticionIdioma = false;
                    } else {
                        $scope.RepeticionIdioma = true;
                        result = false;
                    }

                    var ReferenciasLaborales = Utils.getValRepetear('divReferencias', ['UrlReferencia']);
                    if (!$scope.chkDuplicates(ReferenciasLaborales, true)) {
                        $scope.RepeticionReferencia = false;
                    } else {
                        result = false;
                        $scope.RepeticionReferencia = true;
                    }

                    var ExperienciaLaboral = Utils.getValRepetear('ExperienciaAcademica', ['Puesto', 'Empresa', 'DescripcionPuesto']);
                    if (!$scope.chkDuplicates(ExperienciaLaboral, true)) {
                        if (ExperienciaLaboral.length == 0) {
                            $scope.ExperenciaRepeaterInvalido = true;
                            result = false;
                        } else {
                            $scope.ExperenciaRepeaterInvalido = false;
                        }
                        $scope.RepeticionExperiencia = false;
                    } else {
                        $scope.RepeticionExperiencia = true;
                        result = false;
                    }

                    var Habilidades = Utils.getValRepetear('divHabilidad', ['IdHabilidad']);

                    if ($scope.chkDuplicates(Habilidades, true)) {
                        $scope.RepeticionHabilidad = true;
                        result = false;
                    } else {
                        $scope.RepeticionHabilidad = false;
                        if (Habilidades.length < 5) {
                            $scope.MaximoHabilidad = false;
                            if (Habilidades.length == 0) {
                                $scope.HabilidadRepeaterInvalido = true;
                                result = false;
                            } else {
                                $scope.HabilidadRepeaterInvalido = false;
                            }
                        } else {
                            $scope.MaximoHabilidad = true;
                            result = false;
                        }
                    }

                    return result;
                }

                $scope.StepThreeValidate = function () {

                    var result = true;
                    var Paises = Utils.getValCheck('pais', 'IdPais');

                    if (Paises.length == 0) {
                        $scope.PaisRepeaterInvalido = true;
                        result = false;
                    } else {
                        $scope.PaisRepeaterInvalido = false;
                    }

                    var Areas = Utils.getValCheck('areas', 'IdArea');

                    if (Areas.length == 0) {
                        $scope.AreaRepeaterInvalido = true;
                        result = false;
                    } else {
                        $scope.AreaRepeaterInvalido = false;
                    }

                    var Pretension = Utils.getValCheck('pretension', 'IdPretensionSalarial');

                    if (Pretension.length == 0) {
                        $scope.PretensionRepeaterInvalido = true;
                        result = false;
                    } else {
                        $scope.PretensionRepeaterInvalido = false;
                    }

                    return result;
                }

                $scope.StepFourValidate = function () {
                    var result = true;

                    var Discapacidades = Utils.getValRepetear('divDiscapacidad', ['IdDiscapacidad']);
                    if (!$scope.chkDuplicates(Discapacidades, true)) {
                        if (Discapacidades.length == 0) {
                            $scope.DiscapacidadRepetearInvalido = true;
                            result = false;
                        } else {
                            $scope.DiscapacidadRepetearInvalido = false;
                        }
                        $scope.RepeticionDiscapacidad = false;
                    } else {
                        $scope.RepeticionDiscapacidad = true;
                        result = false;
                    }

                    if ($scope.model.PostulanteInfo.Vehiculo == undefined || $scope.model.PostulanteInfo.Vehiculo == "") {
                        $scope.VehiculoInvalido = true;
                        result = false;
                    } else { $scope.VehiculoInvalido = false; }

                    if ($scope.model.PostulanteInfo.CurriculumURL == "") {
                        $scope.CurriculoInvalido = true;
                        result = false;
                    } else {
                        $scope.CurriculoInvalido = false;
                    }

                    return result;
                }


                $scope.ChangeStep = function () {

                    $scope.StepOneComplete = $scope.StepOneValidate();
                    $scope.StepTwoComplete = $scope.StepTwoValidate();
                    $scope.StepThreeComplete = $scope.StepThreeValidate();
                    $scope.StepFourComplete = $scope.StepFourValidate();

                    if ($scope.StepOne == true && $scope.StepTwo == false && $scope.StepThree == false && $scope.StepFour == false && $scope.StepOneComplete == true) {
                        $scope.StepOne = false;
                        $scope.StepTwo = true;
                        $scope.StepThree = false;
                        $scope.StepFour = false;
                        $('#divStepOne').removeClass('Primaria').addClass('Secundario');
                        $('#divStepTwo').removeClass('Secundario').addClass('Primaria');
                        $('#circuloStepOne').removeClass('CirculoPrimario').addClass('CirculoSecundario');
                        $('#circuloStepTwo').removeClass('CirculoSecundario').addClass('CirculoPrimario');
                        $('#textStepOne').removeClass('textoPrimario').addClass('textoSecundario');
                        $('#textStepTwo').removeClass('textoSecundario').addClass('textoPrimario');

                        $scope.HiddenValidateStepTwo();
                    } else if ($scope.StepOne == false && $scope.StepTwo == true && $scope.StepThree == false && $scope.StepFour == false && $scope.StepTwoComplete == true) {
                        $scope.StepOne = false;
                        $scope.StepTwo = false;
                        $scope.StepThree = true;
                        $scope.StepFour = false;
                        $('#divStepTwo').removeClass('Primaria').addClass('Secundario');
                        $('#divStepThree').removeClass('Secundario').addClass('Primaria');
                        $('#circuloStepTwo').removeClass('CirculoPrimario').addClass('CirculoSecundario');
                        $('#circuloStepThree').removeClass('CirculoSecundario').addClass('CirculoPrimario');
                        $('#textStepTwo').removeClass('textoPrimario').addClass('textoSecundario');
                        $('#textStepThree').removeClass('textoSecundario').addClass('textoPrimario');

                        $scope.HiddenValidateStepThree();
                    } else if ($scope.StepOne == false && $scope.StepTwo == false && $scope.StepThree == true && $scope.StepFour == false && $scope.StepThreeComplete == true) {
                        $scope.StepOne = false;
                        $scope.StepTwo = false;
                        $scope.StepThree = false;
                        $scope.StepFour = true;
                        $('#divStepThree').removeClass('Primaria').addClass('Secundario');
                        $('#divStepFour').removeClass('Secundario').addClass('Primaria');
                        $('#circuloStepThree').removeClass('CirculoPrimario').addClass('CirculoSecundario');
                        $('#circuloStepFour').removeClass('CirculoSecundario').addClass('CirculoPrimario');
                        $('#textStepThree').removeClass('textoPrimario').addClass('textoSecundario');
                        $('#textStepFour').removeClass('textoSecundario').addClass('textoPrimario');
                        $scope.HiddenValidateStepFour();
                        $('#btnContinuar').text('Guardar');
                    } else if ($scope.StepOne == false && $scope.StepTwo == false && $scope.StepThree == false && $scope.StepFour == true && $scope.StepFourComplete == true) {
                        $scope.SavePostulante();
                    }

                    $("html, body").animate({ scrollTop: 0 }, 600);
                };

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

                $scope.AgregareGradoAcademico = function () {
                    var InformacionAcademica = Utils.getValRepetear('GradoAcademico', ['Descripcion', 'Institucion', 'TipoCertificacion']);
                    if (!$scope.chkDuplicates(InformacionAcademica, true)) {
                        Utils.cloneElement('pnlRepeatGrado', 'agregarGradoAcademico');
                        $scope.RepeticionGradoAcademico = false;
                    } else {
                        $scope.RepeticionGradoAcademico = true;
                    }
                };
                $scope.AgregarAreaEspecializacion = function () {
                    Utils.cloneSelect('pnlRepeaterAreaEspecializacion', 'agregarAreaEspecializacion');
                };
                $scope.AgregarExperiencia = function () {
                    var ExperienciaLaboral = Utils.getValRepetear('ExperienciaAcademica', ['Puesto', 'Empresa', 'DescripcionPuesto']);
                    if (!$scope.chkDuplicates(ExperienciaLaboral, true)) {
                        Utils.cloneElement('pnlRepeaterExperienciaAcademica', 'agregarExperiencia');
                        $scope.RepeticionExperiencia = false;
                    } else {
                        $scope.RepeticionExperiencia = true;
                    }
                };
                $scope.AgregarIdioma = function () {
                    var Idiomas = Utils.getValRepetear('NivelIdioma', ['IdIdioma', 'Porcentaje']);
                    if (!$scope.chkDuplicates(Idiomas, true)) {
                        Utils.cloneSelect('pnlRepeatNivelIdioma', 'agregarIdioma');
                        $scope.RepeticionIdioma = false;
                    } else {
                        $scope.RepeticionIdioma = true;
                    }
                };

                $scope.AgregarOtraHabilidad = function () {
                    var Habilidades = Utils.getValRepetear('divHabilidad', ['IdHabilidad']);
                    if ($scope.chkDuplicates(Habilidades, true)) {
                        $scope.RepeticionHabilidad = true;
                    } else {
                        $scope.RepeticionHabilidad = false;
                        if (Habilidades.length < 5) {
                            $scope.MaximoHabilidad = false;
                            Utils.cloneSelect('pnlRepetearHabilidad', 'agregarHabilidadBlanda');
                        } else {
                            $scope.MaximoHabilidad = true;
                        }
                    }
                };
                $scope.AgregarOtraReferencia = function () {
                    var ReferenciasLaborales = Utils.getValRepetear('divReferencias', ['UrlReferencia']);
                    if (!$scope.chkDuplicates(ReferenciasLaborales, true)) {
                        Utils.cloneElement('pnlRepetearReferencias', 'agregarSitiosReferencia');
                        $scope.RepeticionReferencia = false;
                    } else {
                        $scope.RepeticionReferencia = true;
                    }
                };
                $scope.AgregarOtraDiscapacidad = function () {
                    var Discapacidades = Utils.getValRepetear('divDiscapacidad', ['IdDiscapacidad']);
                    if (!$scope.chkDuplicates(Discapacidades, true)) {
                        Utils.cloneSelect('pnlRepeaterDiscapacidad', 'agregarDiscapacidad');
                        $scope.RepeticionDiscapacidad = false;
                    } else {
                        $scope.RepeticionDiscapacidad = true;
                    }
                };

                var getWebApi = function (data, table, callback) {

                    var query = Utils.getFilterParameters(data);
                    RESTService.doGet(table, query)
                        .then(callback);
                }

                $scope.getHabilidad = function () {
                    getWebApi({}, ApiService.HabilidadGet,
                        function (response) {
                            $scope.habilidades = response.Lista;
                        })
                }

                $scope.getPaises = function () {
                    //var decode = Utils.decodeJWT();

                    //var data = {
                    //    id: { value: decode.UserId }
                    //}

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

                $scope.GetLicencias = function () {

                    getWebApi({}, ApiService.GetLicencias,
                        function (response) {
                            $scope.Licencias = response.Lista;
                        }
                    )
                }

                /*$scope.getPaisesBAC = function () {
                    var decode = Utils.decodeJWT();

                    var data = {
                        id: { value: decode.UserId }
                    }

                    getWebApi({}, ApiService.GetPaises,
                        function (response) {
                            $scope.Paises = response.Lista;
                        }
                    )
                }*/

                $scope.DiscapacidadGet = function () {

                    getWebApi({}, ApiService.DiscapacidadGet,
                        function (response) {
                            $scope.Discapacidades = response.Lista;
                        }
                    )
                }

                $scope.isValidEmail = function(mail) {
                    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(mail);
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
                //Sube la foto de postulante
                $scope.uploadFile = function () {
                    Utils.UploadFile('uploadfile', $scope.ResFoto, __env.MaxSizeImagen, __env.FormatosImagen);
                    $scope.FotoInvalido = false;
                }
                //Sube la foto de cv
                $scope.uploadFileCV = function () {
                    Utils.UploadFile('uploadCV', $scope.ResCurriculum, __env.MaxSizeDoc, __env.FormatosDoc);
                    $scope.CurriculoInvalido = false;
                }

                $scope.ResCurriculum = function (r) {
                    $scope.$apply(function () {
                        $scope.model.PostulanteInfo.CurriculumURL = r[0];
                        $('#DownloadCurriculo').attr('href', $scope.model.PostulanteInfo.CurriculumURL);
                        $scope.IsCurriculoVisible = true;
                        $scope.CurriculoInvalido = false;
                    });
                }

                $scope.ResFoto = function (r) {
                    $scope.model.PostulanteInfo.ImagenURL = r[0];
                    $('#fotoPersonal').attr('src', $scope.model.PostulanteInfo.ImagenURL);
                    $scope.FotoInvalido = false;
                    $scope.HasFoto = true;
                }

                $scope.SavePostulante = function () {

                    var Idiomas = Utils.getValRepetear('NivelIdioma', ['IdIdioma', 'Porcentaje']);
                    var InformacionAcademica = Utils.getValRepetear('GradoAcademico', ['Descripcion', 'Institucion', 'TipoCertificacion']);
                    var Discapacidades = Utils.getValRepetear('divDiscapacidad', ['IdDiscapacidad']);
                    var ReferenciasLaborales = Utils.getValRepetear('divReferencias', ['UrlReferencia']);
                    var ExperienciaLaboral = Utils.getValRepetear('ExperienciaAcademica', ['Puesto', 'Empresa', 'DescripcionPuesto']);
                    var Habilidades = Utils.getValRepetear('divHabilidad', ['IdHabilidad']);
                    var Paises = Utils.getValCheck('pais', 'IdPais');
                    var Areas = Utils.getValCheck('areas', 'IdArea');
                    var Pretension = Utils.getValCheck('pretension', 'IdPretensionSalarial');
                    var Licencia = Utils.getValCheck('licencia', 'IdTipoLicencia');

                    var data = {
                        PostulanteInfo:
                        {
                            NombreCompleto: $scope.model.PostulanteInfo.NombreCompleto,
                            IdPostulante: $scope.model.PostulanteInfo.IdPostulante,
                            Nacionalidad: $scope.model.PostulanteInfo.Nacionalidad,
                            Identificacion: $scope.model.PostulanteInfo.Identificacion,
                            FechaNacimiento: $scope.model.PostulanteInfo.FechaNacimiento,
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
                            IdPretensionSalarial: Pretension[0].IdPretensionSalarial,//$scope.model.PostulanteInfo.IdPretensionSalarial,
                            DescripcionCualidades: $scope.model.PostulanteInfo.DescripcionCualidades,
                            DescripcionVentajaCompetitiva: $scope.model.PostulanteInfo.DescripcionVentajaCompetitiva,
                            TrabajoBAC: $scope.model.PostulanteInfo.TrabajoBAC,
                            CurriculumURL: $scope.model.PostulanteInfo.CurriculumURL,
                            IdUsuario: $scope.model.PostulanteInfo.IdUsuario,
                            IdTipoLicencia: Licencia[0].IdTipoLicencia
                        },
                        Credenciales: {
                            IdUsuario: 0,
                            NombreCompleto: $scope.model.PostulanteInfo.NombreCompleto,
                            Usuario1: $scope.model.PostulanteInfo.Email,
                            Password: md5($scope.model.Credenciales.Password),
                            Email: $scope.model.PostulanteInfo.Email,
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
                        Habilidades: Habilidades
                    }

                    postWebApi(data, ApiService.SavePostulante, function (response) {
                        if (response.Resultado) {
                            Utils.MessageBox(
                                '¡Cuenta creada exitosamente!',
                                '¡Cuenta creada exitosamente!',
                                'Ya estás registrado en la plataforma.',
                                "Content/Images/IconoRegistro.png",
                                function () {
                                    window.location = __env.baseUrl + 'Principal/Login';
                                    return false;
                                }
                            );
                        } else {
                            Utils.MessageBox(
                                'Creación de cuenta',
                                'Creación de cuenta',
                                response.Mensaje,
                                "Content/Images/IconoErrorGeneral.png",
                                function () {
                                    return false;
                                }
                            );
                        }
                    });
                }

                $scope.Return = function () {
                    if ($scope.StepOne === false && $scope.StepTwo === false && $scope.StepThree === false && $scope.StepFour === true) {
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

                    $("html, body").animate({ scrollTop: 0 }, 600);
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
                    }

                }

                $scope.volver = function () {
                    window.location = __env.baseUrl + 'Principal/Login';
                }

                $scope.validateEmail = function () {
                    var data = {
                        email: { value: $scope.model.PostulanteInfo.Email }
                    }

                    getWebApi(data, ApiService.ValidateEmail,
                        function (response) {
                            $scope.EmailExiste = response.Objeto;
                        }
                    );
                }

                $scope.SeguridadJS = function () {
                    var lista = JSON.parse(sessionStorage.getItem("role"));

                    if (lista != null) {
                        var listaJs = lista.where(function (x) { return x.TipoAccionId == 3 && x.ReferenciasAux == 'registroPostulanteController'; });

                        $.each(listaJs, function (index, value) {
                            var funcion = eval('$scope.' + value.ReferenciaJS);
                            if (funcion != undefined && funcion != null && funcion != '') {
                                eval('$scope.' + value.ReferenciaJS + '= function () { }');
                            }
                        });
                    }
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
            });
})();

