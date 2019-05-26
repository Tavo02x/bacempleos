'use strict';

(function () {
    angular
        .module('BacApp.controllers.VerPerfilAnonimo', [])
        .controller('VerPerfilAnonimoController',
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
            $scope.obj.GradoAcademico = '';
            $scope.obj.Profesion = '';
            $scope.obj.PretensionSalarial = '';
            $scope.obj.TrabajoBAC = '';
            $scope.obj.CurriculumURL = '';
            $scope.obj.TitulosCertificaciones = {};
            $scope.obj.ExperienciaLaboral = {};
            $scope.obj.Habilidades = {}
            $scope.obj.Referencias = {}
            $scope.obj.Idiomas = {}
            $scope.obj.Areas = {}
            $scope.obj.Paises = {}
            $scope.obj.Discapacidades = {}

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
            $scope.StepTwo = true;
            $scope.StepThree = true;

            $scope.DescargarPerfil = function () {
                alert($('#ContenedorGeneral').html());
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
                        $scope.obj.TitulosCertificaciones = response.Objeto.TitulosCertificaciones;
                        $scope.obj.ExperienciaLaboral = response.Objeto.ExperienciaLaboral;
                        $scope.obj.Habilidades = response.Objeto.Habilidades;
                        $scope.obj.Referencias = response.Objeto.Referencias;
                        $scope.obj.Idiomas = response.Objeto.Idiomas;
                        $scope.obj.Areas = response.Objeto.Areas;
                        $scope.obj.Paises = response.Objeto.Paises;
                        $scope.obj.Discapacidades = response.Objeto.Discapacidades;
                        $('#FotoPerfil').attr('src', $scope.obj.ImagenURL);       
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
            
            $scope.AplicarSeguridadHTML = function () {
                Utils.SeguridadHTML();
            }

            $scope.SeguridadJS = function () {
                var lista = JSON.parse(sessionStorage.getItem("role"));

                if (lista != null) {
                    var listaJs = lista.where(function (x) { return x.TipoAccionId == 3 && x.ReferenciasAux == 'VerPerfilAnonimoController'; });

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

