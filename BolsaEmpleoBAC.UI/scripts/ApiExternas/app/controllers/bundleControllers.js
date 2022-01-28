'use strict';

(function () {

    if (typeof Object.assign != 'function') {
        Object.assign = function (target) {
            'use strict';
            if (target == null) {
                throw new TypeError('Cannot convert undefined or null to object');
            }

            target = Object(target);
            for (var index = 1; index < arguments.length; index++) {
                var source = arguments[index];
                if (source != null) {
                    for (var key in source) {
                        if (Object.prototype.hasOwnProperty.call(source, key)) {
                            target[key] = source[key];
                        }
                    }
                }
            }
            return target;
        };
    }

    var env = {};

    // Import variables if present (from env.js)
    if (window) {
        Object.assign(env, window.__env);
    }

    var ngModule = angular.module('BacApp', [
        'ui.bootstrap',
        'BacApp.controllers.main',
        'BacApp.controllers.login',
        'BacApp.controllers.principal',
        'BacApp.controllers.puestos',
        'BacApp.controllers.puestosEdit',
        'BacApp.services.rest',   
        'BacApp.controllers.registroPostulante',
        'BacApp.controllers.VerPostulante',
        'BacApp.controllers.miPerfil',
        'BacApp.controllers.VerPuestos',
        'BacApp.controllers.AreasLaborales',
        'BacApp.controllers.Discapacidad',
        'BacApp.controllers.Habilidad',
        'BacApp.controllers.Idiomas',
        'BacApp.controllers.JornadaLaboral',
        'BacApp.controllers.PretensionSalarial',
        'BacApp.controllers.Zona',
        'BacApp.controllers.Zona2',
        'BacApp.controllers.Zona3',
        'BacApp.controllers.feriavirtual',
        'BacApp.controllers.Accion',
        'BacApp.controllers.Rol',
        'BacApp.controllers.FiltrarRol',
        'BacApp.controllers.Menu',
        'BacApp.controllers.VerUsuarios',
        'BacApp.controllers.Usuarios',
        'BacApp.controllers.Reportes',
        'BacApp.controllers.VerFeriaVirtual',
        'BacApp.controllers.Lobby',
        'BacApp.controllers.EntrevistaEnVivo',
        'BacApp.controllers.EntrevistaEnVivoFeria',
        'BacApp.controllers.entrevistaPregrabada',
        'BacApp.controllers.VerPerfil',
        'BacApp.controllers.VerPerfilAnonimo',
        'BacApp.controllers.verAplicarPuestos',
        'BacApp.controllers.VerPuestosAplicados',
        'BacApp.controllers.VerPuestosDisponibles',
        'BacApp.controllers.VerPostulantesPuesto',
        'BacApp.controllers.DetalleFeriaVirtual',
        'BacApp.controllers.RealizarPregrabada',
        'BacApp.controllers.VerEntrevistaPregrabada',
        'BacApp.controllers.CambiarClave',
        'BacApp.controllers.CompartirPerfil'
    ]);

    // Register environment in AngularJS as constant
    ngModule.constant('__env', env);

    function disableLogging($logProvider, __env) {
        $logProvider.debugEnabled(true);
    }

    // Inject dependencies
    disableLogging.$inject = ['$logProvider', '__env'];

    ngModule.config(disableLogging);

})();
'use strict';

(function () {
    angular
        .module('BacApp.services.rest', [])
        .service('RESTService', function ($http, $q) {

            var RESTService = {};

            //This function will recieve a string and object to create a promise
            RESTService.doPost = function (url, data) {
                $('#popupLoading').modal('show');
                if (SessionStatus != undefined)
                {
                    if (SessionStatus.toLowerCase() == 'true') {
                        Session.Logout();
                    }
                }

                var config = {};
                if (sessionStorage.hasOwnProperty("token")) {
                    var token = sessionStorage.getItem("token");

                    var decode = Utils.decodeJWT();
                    config = {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + token,
                            'username': decode.unique_name
                        }
                    }
                }
                else {
                    config = {
                        headers: {}
                    }
                }

                var sendUrl = __env.apiUrl + url;
                var deferred = $q.defer();
                $http.post(sendUrl, data, config).then(
                    function (response) {
                        deferred.resolve(response.data);
                    },
                    function (response) {
                        deferred.reject(response);
                    }
                );

                return deferred.promise;
            };

            RESTService.doGet = function (url, query) {
                //$('#popupLoading').modal('show');
                var config = {};
                if (SessionStatus != undefined) {
                    if (SessionStatus.toLowerCase() == 'true') {
                        Session.Logout();
                    }
                }
                if (sessionStorage.hasOwnProperty("token")) {
                    var token = sessionStorage.getItem("token");

                    var decode = Utils.decodeJWT();
                    config = {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + token,
                            'username': decode.unique_name
                        }
                    }
                }
                else {
                    config = {
                        headers: {}
                    }
                }

                var sendUrl = __env.apiUrl + url;
                var deferred = $q.defer();
                $http.get(sendUrl + query, config).then(
                    function (response) {
                        //$('#popupLoading').modal('hide');
                        deferred.resolve(response.data);
                    },
                    function (response) {
                        //$('#popupLoading').modal('hide');
                        deferred.reject(response);
                    }
                );

                //$('#popupLoading').modal('hide');
                return deferred.promise;
            };

            return RESTService;
        });
})();
'use strict';

(function () {
    angular
        .module('BacApp.controllers.Accion', [])
        .controller('AccionController',
            function ($scope, $log, RESTService, __env) {

                $scope.model = {};
                $scope.model.AccionId = 0;
                $scope.model.Nombre = '';
                $scope.model.Descripcion = '';
                $scope.model.ReferenciaHTML = '';
                $scope.model.ReferenciaJS = '';
                $scope.model.ReferenciasWebAPI = '';
                $scope.model.ReferenciasAux = '';
                $scope.model.TipoAccionId = '';
                $scope.model.ParentId = '';
                $scope.model.Icono = '';
                $scope.model.URL = '';
                $scope.model.Borrado = false;

                var getWebApi = function (data, table, callback) {

                    //Utils.Show();
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
                        Id: $scope.model.AccionId
                    }

                    RESTService.doPost(table, entity)
                        .then(callback);
                }

                $scope.LoadGrid = function () {
                    Utils.getGrid(
                        ApiService.AccionGrid,
                        {},
                        'table',
                        ['Nombre', 'Descripción', 'Tipo', 'Padre', 'Ver'],
                        'Nombre,Descripcion,NombreTipoAccion,NombrePadre',
                        $scope.Cargar,
                        5,
                        'totalGrid',
                        'AccionId,ReferenciaHTML,ReferenciaJS,ReferenciasWebAPI,ReferenciasAux,TipoAccionId,ParentId,Icono,URL,Borrado');
                }

                $scope.GetTipo = function () {
                    RESTService.doGet(ApiService.AccionGetTipo, '')
                        .then(function (response) {
                            $scope.tipos = response.Lista;
                        })
                }

                $scope.GetAccion = function () {
                    RESTService.doGet(ApiService.AccionGet, '')
                        .then(function (response) {
                            $scope.acciones = response.Lista;
                        })
                }

                $scope.Guardar = function () {
                    $('#popupArea').modal('hide');
                    postWebApi(
                        $scope.model,
                        ApiService.AccionSave,
                        function (response) {
                            if (response.Resultado) {
                                Utils.MessageBox(
                                    'Mantenimiento Acciones',
                                    'Acción',
                                    response.Mensaje,
                                    "Content/Images/IconoConfimacion1.png",
                                    function () {
                                        $scope.LoadGrid();
                                        $scope.Limpiar();

                                        $('#popupLoading').modal('hide');
                                        this.modal('hide');
                                    }
                                );
                            } else {
                                Utils.MessageBox(
                                    'Mantenimiento Acciones',
                                    'Acción',
                                    response.Mensaje,
                                    "Content/Images/IconoErrorGeneral.png",
                                    function () {
                                        $scope.LoadGrid();

                                        $('#popupLoading').modal('hide');
                                        this.modal('hide');
                                    }
                                );
                            }
                        }
                    );
                }

                $scope.Limpiar = function () {
                    $scope.$apply(function () {
                        $scope.model.AccionId = 0;
                        $scope.model.Nombre = '';
                        $scope.model.Descripcion = '';
                        $scope.model.ReferenciaHTML = '';
                        $scope.model.ReferenciaJS = '';
                        $scope.model.ReferenciasWebAPI = '';
                        $scope.model.ReferenciasAux = '';
                        $scope.model.TipoAccionId = '';
                        $scope.model.ParentId = '';
                        $scope.model.Icono = '';
                        $scope.model.URL = '';
                        $scope.model.Borrado = false;
                    });
                }

                $scope.Cancelar = function () {
                    $('#popupArea').modal('hide');
                    $scope.Limpiar();
                }

                $scope.Cargar = function (param) {
                    $('#popupArea').modal('show');
                    $scope.$apply(function () {
                        $scope.model.AccionId = param.AccionId;
                        $scope.model.Nombre = param.Nombre;
                        $scope.model.Descripcion = param.Descripcion;
                        $scope.model.ReferenciaHTML = param.ReferenciaHTML;
                        $scope.model.ReferenciaJS = param.ReferenciaJS;
                        $scope.model.ReferenciasWebAPI = param.ReferenciasWebAPI;
                        $scope.model.ReferenciasAux = param.ReferenciasAux;
                        $scope.model.TipoAccionId = param.TipoAccionId;
                        $scope.model.ParentId = param.ParentId;
                        $scope.model.Icono = param.Icono;
                        $scope.model.URL = param.URL;
                        $scope.model.Borrado = param.Borrado;
                    });
                }

                $scope.SeguridadJS = function () {
                    var lista = JSON.parse(sessionStorage.getItem("role"));

                    if (lista != null)
                    {
                        var listaJs = lista.where(function (x) { return x.TipoAccionId === 3 && x.ReferenciasAux === 'AccionController'; });

                        $.each(listaJs, function (index, value) {
                            var funcion = eval('$scope.' + value.ReferenciaJS);
                            if (funcion !== undefined && funcion !== null && funcion !== '') {
                                eval('$scope.' + value.ReferenciaJS + '= function () { }');
                            }
                        });
                    }
                    
                }
            });
})();
'use strict';

(function () {
    angular
        .module('BacApp.controllers.AreasLaborales', [])
        .controller('AreasLaboralesController',
            function ($scope, $log, RESTService, __env) {

                $scope.model = {};
                $scope.model.IdArea = 0;
                $scope.model.Area = '';
                $scope.model.Borrado = false;
                $scope.model.FechaCreacion = Date.now;

                var getWebApi = function (data, table, callback) {

                    //Utils.Show();
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
                        Id: data.IdArea
                    }

                    RESTService.doPost(table, entity)
                        .then(callback);
                }

                $scope.LoadGrid = function () {
                    Utils.getGrid(ApiService.AreaLaboralGrid, {}, 'table', ['Nombre', 'Ver'], 'Area', $scope.Cargar, 5, 'totalGrid', 'IdArea,Borrado');
                }

                $scope.Guardar = function () {
                    $('#popupArea').modal('hide');
                    postWebApi(
                        $scope.model,
                        ApiService.AreaLaboralSave,
                        function (response) {
                            if (response.Resultado) {
                                Utils.MessageBox(
                                    'Mantenimiento Áreas Laborales',
                                    'Áreas Laborales',
                                    response.Mensaje,
                                    "Content/Images/IconoConfimacion1.png",
                                    function () {
                                        $scope.LoadGrid();
                                        $scope.Limpiar();
                                        $('#popupLoading').modal('hide');
                                        this.modal('hide');
                                    }
                                );
                            } else {
                                Utils.MessageBox(
                                    'Mantenimiento Áreas Laborales',
                                    'Áreas Laborales',
                                    response.Mensaje,
                                    "Content/Images/IconoErrorGeneral.png",
                                    function () {
                                        $scope.LoadGrid();
                                        $('#popupLoading').modal('hide');
                                        this.modal('hide');
                                    }
                                );
                            }
                        }
                    );
                }

                $scope.Cargar = function (param) {
                    $('#popupArea').modal('show');
                    $scope.$apply(function () {
                        $scope.model.IdArea = param.IdArea;
                        $scope.model.Area = param.Area;
                        $scope.model.Borrado = param.Borrado;
                    });
                }

                $scope.Limpiar = function (param) {
                    $('#popupArea').modal('hide');
                    $scope.$apply(function () {
                        $scope.model.IdArea = 0;
                        $scope.model.Area = '';
                        $scope.model.Borrado = false;
                    });
                }

                $scope.Cancelar = function () {
                    $scope.model.IdArea = 0;
                    $scope.model.Area = '';
                    $scope.model.Borrado = false;
                }

                $scope.SeguridadJS = function () {
                    var lista = JSON.parse(sessionStorage.getItem("role"));
                    if (lista != null) {
                        var listaJs = lista.where(function (x) { return x.TipoAccionId == 3 && x.ReferenciasAux == 'AreasLaboralesController'; });

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
'use strict';

(function () {
    angular
        .module('BacApp.controllers.CambiarClave', [])
        .controller('CambiarClaveController',
            function ($scope, $log, RESTService, __env) {

                $scope.model = {};
                $scope.model.Usuario = '';
                $scope.model.ClaveAnterior = '';
                $scope.model.ClaveNueva = '';
                $scope.model.ClaveConfirmar = '';

                $scope.show1 = false;
                $scope.show2 = false;
                $scope.show3 = false;
                $scope.show4 = false;
                $scope.show5 = false;

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

                $scope.Cambiar = function () {
                    if ($scope.model.ClaveAnterior == '') {
                        $scope.show1 = true;
                    } else {
                        $scope.show1 = false;
                    }
                    if ($scope.model.ClaveNueva == '') {
                        $scope.show3 = true;
                    } else {
                        $scope.show3 = false;
                    }
                    if ($scope.model.ClaveConfirmar == '') {
                        $scope.show5 = true;
                    } else {
                        $scope.show5 = false;
                    }

                    if ($scope.model.ClaveAnterior == $scope.model.ClaveNueva) {
                        $scope.show2 = true;
                    } else {
                        $scope.show2 = false;
                    }

                    if ($scope.model.ClaveNueva != $scope.model.ClaveConfirmar) {
                        $scope.show4 = true;
                    } else {
                        $scope.show4 = false;
                    }

                    if (!$scope.show1 && !$scope.show2 && !$scope.show3 && !$scope.show4 && !$scope.show5) {
                        $scope.model.Usuario = Utils.getUrlParameter('username');
                        $scope.model.ClaveNueva = md5($scope.model.ClaveNueva);
                        postWebApi(
                            $scope.model,
                            ApiService.CambiarClave,
                            function (response) {
                                if (response.Resultado) {
                                    Utils.MessageBox(
                                        'Cambiar contraseña',
                                        'Cambiar contraseña',
                                        response.Mensaje,
                                        "Content/Images/IconoConfimacion1.png",
                                        function () {
                                            window.location = __env.baseUrl + 'Principal/Login';
                                        }
                                    );
                                } else {
                                    Utils.MessageBox(
                                        'Cambiar contraseña',
                                        'Cambiar contraseña',
                                        response.Mensaje,
                                        "Content/Images/IconoErrorGeneral.png",
                                        function () {
                                            $('#popupLoading').modal('hide');
                                            this.modal('hide');
                                        }
                                    );
                                }
                            }
                        );
                    }
                }

                $scope.SeguridadJS = function () {
                    var lista = JSON.parse(sessionStorage.getItem("role"));

                    if (lista != null) {
                        var listaJs = lista.where(function (x) { return x.TipoAccionId == 3 && x.ReferenciasAux == 'CambiarClaveController'; });

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
'use strict';

(function () {
    angular
        .module('BacApp.controllers.DetalleFeriaVirtual', [])
        .controller('DetalleFeriaVirtualController',
            function ($scope, $log, RESTService, __env) {

                $scope.IdFeriaEmpleo = Utils.getUrlParameter("IdFeriaEmpleo");
                $scope.IdUsuario = Utils.decodeJWT().UserId;
                $scope.IdEntrevistador = 0;
                $scope.NombreFeria = '';
                $scope.Paises = '';
                $scope.FechaInicial = '';
                $scope.FechaFinal = '';
                $scope.AgendadasCant = 0;
                $scope.SolicitadasCant = 0;
                $scope.RealizadasCant = 0;
                $scope.Nombre = '';
                $scope.StepOne = true;
                $scope.StepTwo = false;
                $scope.Entrevistadores = {};

                $scope.step1Class = 'tapSelect';
                $scope.step2Class = 'taps';

                $scope.Return = function () {
                    window.location = __env.baseUrl + 'FeriaVirtual/VerFeriaVirtual'
                }

                $scope.ChangeStepOne = function () {
                    $scope.StepOne = true;
                    $scope.StepTwo = false;
                    $scope.step1Class = 'tapSelect';
                    $scope.step2Class = 'taps';
                }

                $scope.ChangeStepTwo = function () {
                    $scope.StepOne = false;
                    $scope.StepTwo = true;
                    $scope.step1Class = 'taps';
                    $scope.step2Class = 'tapSelect';
                }

                $scope.GetDetalleFeriaVirtual = function () {
                    var data = { IdFeriaEmpleo: { value: $scope.IdFeriaEmpleo } };

                    if ($scope.IdEntrevistador != 0 && $scope.IdEntrevistador != "" && $scope.IdEntrevistador != null) {
                        data.IdUsuario = { value: $scope.IdEntrevistador };
                    }
                    else {
                        data.IdUsuario = { value: $scope.IdUsuario };
                    }

                    getWebApi(data, ApiService.GetFeriaDetalles, function (response) {
                        var obj = response.Objeto;

                        $scope.NombreFeria = obj.NombreFeria;
                        $scope.Paises = obj.Paises.join();
                        $scope.FechaInicial = obj.FechaInicioFormat;
                        $scope.FechaFinal = obj.FechaFinFormat;
                        $scope.AgendadasCant = obj.Agendadas;
                        $scope.SolicitadasCant = obj.Solicitadas;
                        $scope.RealizadasCant = obj.Realizadas;
                    })
                }

                $scope.GetEntrevistadores = function () {
                    var data = {
                        IdFeriaEmpleo: { value: $scope.IdFeriaEmpleo }
                    }
                    getWebApi(data, ApiService.GetEntrevistadoresFeria, function (response) {
                        $scope.Entrevistadores = response.Objeto;
                    })
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

                $scope.AceptarEntrevista = function (IdEntrevista) {

                    //var data = {
                    //    IdEntrevista: { value: IdEntrevista }
                    //}
                    //Utils.ConfirmBox("Aceptar entrevista", "¿Desea aceptar esta entrevista?",
                    //    function (result) {
                    //        $('#popupLoading').modal('show');
                    //        if (result) {

                    //            getWebApi(data, ApiService.AceptarEntrevista,
                    //                function (response) {
                    //                    Utils.MessageBox(
                    //                        'Aceptar entrevista',
                    //                        'Aceptar entrevista',
                    //                        "Entrevista aceptada exitosamente",
                    //                        "Content/Images/IconoConfimacion1.png",
                    //                        function () {
                    //                            this.modal('hide');
                    //                            $('#popupLoading').modal('hide');

                    //                        }
                    //                    );

                    //                });
                    //        } else {
                    //            getWebApi(data, ApiService.RechazarEntrevista,
                    //                function (response) {
                    //                    Utils.MessageBox(
                    //                        'Rechazar entrevista',
                    //                        'Rechazar entrevista',
                    //                        "Entrevista rechazada exitosamente",
                    //                        "Content/Images/IconoConfimacion1.png",
                    //                        function () {
                    //                            this.modal('hide');
                    //                            $('#popupLoading').modal('hide');
                    //                        }
                    //                    );
                    //                });
                    //        }
                    //        $scope.LoadGridAgendadas();
                    //        $scope.LoadGridSolicitadas();
                    //        $scope.LoadGridRechazadas();
                    //        $scope.LoadGridRealizadas();
                    //    });
                }

                $scope.LoadGridPuestos = function () {

                    var data = {
                        IdFeriaEmpleo: { value: $scope.IdFeriaEmpleo, cond: OConfig.condEquals, type: OTypes.default }
                    }

                    var width = Utils.GetWidthWindow();

                    if (width <= 764) {
                        Utils.getGrid(ApiService.PuestosFeriaVirtualGrid, data, 'divPuestos', ['', ''], 'MobileColumn', $scope.Redirect, 5, 'totalGrid', 'IdFeriaEmpleo,IdPuesto', 'FechaCreacion', 'desc');
                    }
                    else {
                        Utils.getGrid(ApiService.PuestosFeriaVirtualGrid, data, 'divPuestos', ['Título del puesto', 'País', 'Postulantes', 'Ver'], 'Puesto,Pais,Cantidad', $scope.Redirect, 5, 'totalGrid', 'IdFeriaEmpleo,IdPuesto', 'FechaCreacion', 'desc');
                    }
                }

                $scope.Redirect = function (param) {
                    sessionStorage.setItem("volver", __env.baseUrl + "FeriaVirtual/DetalleFeriaVirtual?IdFeriaEmpleo=" + $scope.IdFeriaEmpleo);
                    window.location = __env.baseUrl + 'Puesto/PostulantesPuestoFeria?IdPuesto=' + param.IdPuesto + '&IdFeriaEmpleo=' + $scope.IdFeriaEmpleo;
                }

                $scope.LoadGridPuestosPostulante = function () {

                    var data = {
                        IdFeriaEmpleo: { value: $scope.IdFeriaEmpleo, cond: OConfig.condEquals, type: OTypes.default }
                    }
                    var width = Utils.GetWidthWindow();

                    if (width <= 764) {
                        Utils.getGrid(ApiService.PuestosFeriaVirtualGrid, data, 'divPuestos', ['', ''], 'MobileColumn', $scope.RedirectPostulante, 5, 'totalGrid', 'IdFeriaEmpleo,IdPuesto', 'FechaCreacion', 'desc');
                    }
                    else {
                        Utils.getGrid(ApiService.PuestosFeriaVirtualGrid, data, 'divPuestos', ['Título del puesto', 'País', 'Ver'], 'Puesto,Pais', $scope.RedirectPostulante, 5, 'totalGrid', 'IdFeriaEmpleo,IdPuesto', 'FechaCreacion', 'desc');
                    }
                }

                $scope.RedirectPostulante = function (param) {
                    sessionStorage.setItem("volver", __env.baseUrl + "FeriaVirtual/DetalleFeriaVirtualPostulante?IdFeriaEmpleo=" + $scope.IdFeriaEmpleo);
                    window.location = __env.baseUrl + 'Puesto/VerPuestoFeria?IdPuesto=' + param.IdPuesto + '&IdFeriaEmpleo=' + $scope.IdFeriaEmpleo;
                }

                $scope.LoadGridAgendadas = function () {

                    var data = {};
                    if ($scope.IdEntrevistador != 0 && $scope.IdEntrevistador != "" && $scope.IdEntrevistador != null) {
                        data = {
                            NombreCompleto: { value: $scope.Nombre, cond: OConfig.condLike, type: OTypes.string, comp: '||' },
                            IdFeriaEmpleo: { value: $scope.IdFeriaEmpleo, cond: OConfig.condEquals, type: OTypes.default },
                            IdUsuario: { value: $scope.IdEntrevistador, cond: OConfig.condEquals, type: OTypes.default },
                        }
                    }
                    else {
                        data = {
                            NombreCompleto: { value: $scope.Nombre, cond: OConfig.condLike, type: OTypes.string, comp: '||' },
                            IdFeriaEmpleo: { value: $scope.IdFeriaEmpleo, cond: OConfig.condEquals, type: OTypes.default },
                            IdUsuario: { value: $scope.IdUsuario, cond: OConfig.condEquals, type: OTypes.default },
                        }
                    }

                    var width = Utils.GetWidthWindow();

                    if (width <= 764) {
                        Utils.getGrid1(ApiService.EntrevistasAgendadasGrid, data, 'divAgendadas', ['', '', ''], 'ColumnMobile1,ColumnMobile2', $scope.Agendadas, 5, 'totalGrid', 'IdEntrevista,IdPostulante,Email,NombreCompleto,JoinUrl', 'IdEntrevista', 'desc');
                    }
                    else {
                        Utils.getGrid1(ApiService.EntrevistasAgendadasGrid, data, 'divAgendadas', ['Nombre', 'País', 'Entrevista', 'Ver'], 'NombreCompleto,Pais,EntrevistaFechaTipo', $scope.Agendadas, 5, 'totalGrid', 'IdEntrevista,IdPostulante,Email,JoinUrl', 'IdEntrevista', 'desc');
                    }
                }

                $scope.LoadGridSolicitadas = function () {

                    var data = {};
                    if ($scope.IdEntrevistador != 0 && $scope.IdEntrevistador != "" && $scope.IdEntrevistador != null) {
                        data = {
                            NombreCompleto: { value: $scope.Nombre, cond: OConfig.condLike, type: OTypes.string, comp: '||' },
                            IdFeriaEmpleo: { value: $scope.IdFeriaEmpleo, cond: OConfig.condEquals, type: OTypes.default },
                            IdUsuario: { value: $scope.IdEntrevistador, cond: OConfig.condEquals, type: OTypes.default },
                        }
                    }
                    else {
                        data = {
                            NombreCompleto: { value: $scope.Nombre, cond: OConfig.condLike, type: OTypes.string, comp: '||' },
                            IdFeriaEmpleo: { value: $scope.IdFeriaEmpleo, cond: OConfig.condEquals, type: OTypes.default },
                            IdUsuario: { value: $scope.IdUsuario, cond: OConfig.condEquals, type: OTypes.default },
                        }
                    }

                    var width = Utils.GetWidthWindow();

                    if (width <= 764) {
                        Utils.getGrid2(ApiService.EntrevistasSolicitadasGrid, data, 'divSolicitadas', ['', '', ''], 'ColumnMobile1,ColumnMobile2', $scope.Solicitadas, 5, 'totalGrid', 'IdEntrevista,IdPostulante,Email,NombreCompleto', 'IdEntrevista', 'desc');
                    }
                    else {
                        Utils.getGrid2(ApiService.EntrevistasSolicitadasGrid, data, 'divSolicitadas', ['Nombre', 'País', 'Entrevista', 'Ver'], 'NombreCompleto,Pais,EntrevistaFechaTipo', $scope.Solicitadas, 5, 'totalGrid', 'IdEntrevista,IdPostulante,Email', 'IdEntrevista', 'desc');
                    }
                }

                $scope.LoadGridRechazadas = function () {

                    var data = {};
                    if ($scope.IdEntrevistador != 0 && $scope.IdEntrevistador != "" && $scope.IdEntrevistador != null) {
                        data = {
                            NombreCompleto: { value: $scope.Nombre, cond: OConfig.condLike, type: OTypes.string, comp: '||' },
                            IdFeriaEmpleo: { value: $scope.IdFeriaEmpleo, cond: OConfig.condEquals, type: OTypes.default },
                            IdUsuario: { value: $scope.IdEntrevistador, cond: OConfig.condEquals, type: OTypes.default },
                        }
                    }
                    else {
                        data = {
                            NombreCompleto: { value: $scope.Nombre, cond: OConfig.condLike, type: OTypes.string, comp: '||' },
                            IdFeriaEmpleo: { value: $scope.IdFeriaEmpleo, cond: OConfig.condEquals, type: OTypes.default },
                            IdUsuario: { value: $scope.IdUsuario, cond: OConfig.condEquals, type: OTypes.default },
                        }
                    }

                    var width = Utils.GetWidthWindow();

                    if (width <= 764) {
                        Utils.getGrid3(ApiService.EntrevistasRechazadasGrid, data, 'divRechazadas', ['', '', ''], 'ColumnMobile1,ColumnMobile2', $scope.Rechazadas, 5, 'totalGrid', 'IdEntrevista,IdPostulante,Email,NombreCompleto', 'IdEntrevista', 'desc');
                    }
                    else {
                        Utils.getGrid3(ApiService.EntrevistasRechazadasGrid, data, 'divRechazadas', ['Nombre', 'País', 'Entrevista', 'Ver'], 'NombreCompleto,Pais,EntrevistaFechaTipo', $scope.Rechazadas, 5, 'totalGrid', 'IdEntrevista,IdPostulante,Email', 'IdEntrevista', 'desc');
                    }
                }

                $scope.LoadGridRealizadas = function () {

                    var data = {};
                    if ($scope.IdEntrevistador != 0 && $scope.IdEntrevistador != "" && $scope.IdEntrevistador != null) {
                        data = {
                            NombreCompleto: { value: $scope.Nombre, cond: OConfig.condLike, type: OTypes.string, comp: '||' },
                            IdFeriaEmpleo: { value: $scope.IdFeriaEmpleo, cond: OConfig.condEquals, type: OTypes.default },
                            IdUsuario: { value: $scope.IdEntrevistador, cond: OConfig.condEquals, type: OTypes.default },
                        }
                    }
                    else {
                        data = {
                            NombreCompleto: { value: $scope.Nombre, cond: OConfig.condLike, type: OTypes.string, comp: '||' },
                            IdFeriaEmpleo: { value: $scope.IdFeriaEmpleo, cond: OConfig.condEquals, type: OTypes.default },
                            IdUsuario: { value: $scope.IdUsuario, cond: OConfig.condEquals, type: OTypes.default },
                        }
                    }

                    var width = Utils.GetWidthWindow();

                    if (width <= 764) {
                        Utils.getGrid3(ApiService.EntrevistasRealizadasGrid, data, 'divRealizadas', ['', '', ''], 'ColumnMobile1,ColumnMobile2', $scope.Rechazadas, 5, 'totalGrid', 'IdEntrevista,IdPostulante,Email,NombreCompleto', 'IdEntrevista', 'desc');
                    }
                    else {
                        Utils.getGrid3(ApiService.EntrevistasRealizadasGrid, data, 'divRealizadas', ['Nombre', 'País', 'Entrevista', 'Ver'], 'NombreCompleto,Pais,EntrevistaFechaTipo', $scope.Rechazadas, 5, 'totalGrid', 'IdEntrevista,IdPostulante,Email', 'IdEntrevista', 'desc');
                    }
                }

                $scope.FilterAll = function () {
                    $scope.LoadGridAgendadas();
                    $scope.LoadGridSolicitadas();
                    $scope.LoadGridRechazadas();
                    $scope.LoadGridRealizadas();
                }

                $scope.Agendadas = function (param) {
                    $scope.$apply(function () {
                        console.log(param.JoinUrl);
                        window.open(param.JoinUrl, '_blank');
                    });
                }

                $scope.Solicitadas = function (param) {
                    $scope.$apply(function () {
                        //$scope.AceptarEntrevista(param.IdEntrevista);
                        window.location = __env.baseUrl + 'Entrevistas/ReagendarEntrevistasFeria?IdFeriaEmpleo=' + $scope.IdFeriaEmpleo + '&IdEntrevista=' + param.IdEntrevista;
                    });
                }

                $scope.Rechazadas = function (param) {
                    $scope.$apply(function () {
                        $scope.IdPuesto = param.IdPuesto;
                        window.location = __env.baseUrl + 'Postulante/VerPerfil?IdPostulante=' + param.Email;
                    });
                }

                $scope.Realizadas = function (param) {
                    $scope.$apply(function () {
                        $scope.IdPuesto = param.IdPuesto;
                        window.location = __env.baseUrl + 'Postulante/VerPerfil?IdPostulante=' + param.Email;
                    });
                }

                $scope.AplicarSeguridadHTML = function () {
                    Utils.SeguridadHTML();
                }

                $scope.Volver = function () {
                    window.location = __env.baseUrl + 'FeriaVirtual/VerFeriaVirtual';
                }

                $scope.SeguridadJS = function () {
                    var lista = JSON.parse(sessionStorage.getItem("role"));

                    if (lista != null) {
                        var listaJs = lista.where(function (x) { return x.TipoAccionId == 3 && x.ReferenciasAux == 'DetalleFeriaVirtualController'; });

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
'use strict';

(function () {
    angular
        .module('BacApp.controllers.Discapacidad', [])
        .controller('DiscapacidadController',
            function ($scope, $log, RESTService, __env) {

                $scope.model = {};
                $scope.model.IdDescapacidad = 0;
                $scope.model.Descripcion = '';
                $scope.model.Borrado = false;
                $scope.model.FechaCreacion = Date.now;

                var getWebApi = function (data, table, callback) {

                    //Utils.Show();
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
                        Id: data.IdDescapacidad
                    }

                    RESTService.doPost(table, entity)
                        .then(callback);
                }
                $scope.LoadGrid = function () {
                    Utils.getGrid(ApiService.DiscapacidadGrid, {}, 'table', ['Nombre', 'Ver'], 'Descripcion', $scope.Cargar, 5, 'totalGrid', 'IdDescapacidad,Borrado');
                }

                $scope.Guardar = function () {
                    $('#popupArea').modal('hide');
                    postWebApi(
                        $scope.model,
                        ApiService.DiscapacidadSave,
                        function (response) {
                            if (response.Resultado) {
                                Utils.MessageBox(
                                    'Mantenimiento Discapacidades',
                                    'Discapacidades',
                                    response.Mensaje,
                                    "Content/Images/IconoConfimacion1.png",
                                    function () {
                                        $scope.LoadGrid();
                                        $scope.Limpiar();
                                        $('#popupLoading').modal('hide');
                                        this.modal('hide');
                                    }
                                );
                            } else {
                                Utils.MessageBox(
                                    'Mantenimiento Discapacidades',
                                    'Discapacidades',
                                    response.Mensaje,
                                    "Content/Images/IconoErrorGeneral.png",
                                    function () {
                                        $scope.LoadGrid();
                                        $scope.Limpiar();
                                        $('#popupLoading').modal('hide');
                                        this.modal('hide');
                                    }
                                );
                            }
                        }
                    );
                }

                $scope.Cargar = function (param) {
                    $('#popupArea').modal('show');
                    $scope.$apply(function () {
                        $scope.model.IdDescapacidad = param.IdDescapacidad;
                        $scope.model.Descripcion = param.Descripcion;
                        $scope.model.Borrado = param.Borrado;
                    });
                }

                $scope.Limpiar = function () {
                    $scope.$apply(function () {
                        $scope.model.IdDescapacidad = 0;
                        $scope.model.Descripcion = '';
                        $scope.model.Borrado = false;
                    });
                }

                $scope.Cancelar = function () {
                    $('#popupArea').modal('hide');
                    $scope.model.IdDescapacidad = 0;
                    $scope.model.Descripcion = '';
                    $scope.model.Borrado = false;
                }

                $scope.SeguridadJS = function () {
                    var lista = JSON.parse(sessionStorage.getItem("role"));

                    if (lista != null) {
                        var listaJs = lista.where(function (x) { return x.TipoAccionId == 3 && x.ReferenciasAux == 'DiscapacidadController'; });

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
'use strict';

(function () {
    angular
        .module('BacApp.controllers.feriavirtual', [])
        .controller('FeriaVirtualController',
        function ($scope, $log, RESTService, __env) {

            var d = new Date();
            $scope.model = {};
            $scope.model.nombre = "";
            $scope.model.fechainicio = "";
            $scope.model.fechacierre = "";
            $scope.model.horainicio = "";
            $scope.model.horafinal = "";
            $scope.model.frecuencia = "";

            $scope.dateNow = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();
            $scope.PaisId = 0;
            $scope.Puesto = "";
            $scope.Entrevistador = "";
            $scope.paisName = "";
            $scope.index = 0;
            $scope.index2 = 0;
            //Pasos
            $scope.StepOne = true;
            $scope.StepTwo = false;
            $scope.StepThree = false;
            $scope.StepFour = false;

            $scope.addPuesto = false;
            $scope.addEntrevistador = false;

            $scope.IsAdd = false;
            $scope.IsNext = true;
            //catalogos
            $scope.Paises = {};
            $scope.PaisesPuestos = {};
            $scope.PaisesEntrevistadores = {};
            $scope.Puestos = {};
            $scope.PuestosPaises = {};
            $scope.Reclutadores = {};
            $scope.ReclutadoresPaises = {};

            $scope.PuestosPaises = [];
            $scope.ReclutadoresPaises = [];

            //validaciones
            $scope.FrecuenciaInvalido = false;
            $scope.FeriaInvalido = false;
            $scope.FechaInicioInvalido = false;
            $scope.FechaCierreInvalido = false;
            $scope.HoraInicioInvalido = false;
            $scope.HoraFinalInvalido = false;
            $scope.PaisInvalido = false;
            $scope.EntrevistadorInvalido = false;
            $scope.PuestoInvalido = false;

            $scope.getPaisesBAC = function () {
                var decode = Utils.decodeJWT();

                var data = {
                    id: { value: decode.UserId }
                }

                getWebApi(data, ApiService.GetPais,
                    function (response) {
                        $scope.Paises = response.Lista;
                    }
                )
            }

            $scope.getPuestos = function () {

                var data = {
                    IdPais: { value: $scope.PaisId }
                }

                getWebApi(data, ApiService.PuestosByPaisGet,
                    function (response) {
                        $scope.Puestos = response.Lista;
                    }
                )
            }

            $scope.getEntrevistadores = function () {

                var data = {
                    IdPais: { value: $scope.PaisId }
                }

                getWebApi(data, ApiService.EntrevistadorByPaisGet,
                    function (response) {
                        $scope.Reclutadores = response.Lista;
                    }
                )
            }

            $scope.getPuestosbyNombre = function () {

                if ($scope.Puesto == "") {
                    $scope.getPuestos();
                }
                else {
                    var data = {
                        Nombre: { value: $scope.Puesto },
                        IdPais: {
                            value: $scope.PaisId
                        }
                    }

                    getWebApi(data, ApiService.PuestosByNombreGet,
                        function (response) {
                            $scope.Puestos = response.Lista;
                        }
                    )
                }
            }

            $scope.getEntrevistadoresbyNombre = function () {

                if ($scope.Entrevistador == "") {
                    $scope.getEntrevistadores();
                }
                else {
                    var data = {
                        Nombre: { value: $scope.Entrevistador },
                        IdPais: { value: $scope.PaisId }
                    }

                    getWebApi(data, ApiService.EntrevistadorByNombreGet,
                        function (response) {
                            $scope.Reclutadores = response.Lista;
                        }
                    )
                }
            }

            $scope.ValidarStepOne = function () {
                var result = true;
                if ($scope.model.nombre == '') {
                    $scope.FeriaInvalido = true;
                    result = false;
                } else { $scope.FeriaInvalido = false; }

                if ($scope.model.frecuencia == '' || $scope.model.frecuencia == undefined) {
                    $scope.FrecuenciaInvalido = true;
                    result = false;
                } else { $scope.FrecuenciaInvalido = false; }

                if ($scope.model.fechainicio == '') {
                    $scope.FechaInicioInvalido = true;
                    result = false;
                } else { $scope.FechaInicioInvalido = false; }

                if ($scope.model.fechacierre == '') {
                    $scope.FechaCierreInvalido = true;
                    result = false;
                } else { $scope.FechaCierreInvalido = false; }

                if ($scope.model.fechainicio > $scope.model.fechacierre) {
                    $scope.FechaValidacionInvalido = true;
                    result = false;
                } else { $scope.FechaValidacionInvalido = false; }

                if ($scope.model.horainicio == '' || $scope.model.horainicio == undefined) {
                    $scope.HoraInicioInvalido = true;
                    result = false;
                } else { $scope.HoraInicioInvalido = false; }

                if ($scope.model.horafinal == '' || $scope.model.horafinal == undefined) {
                    $scope.HoraFinalInvalido = true;
                    result = false;
                } else { $scope.HoraFinalInvalido = false; }

                var horaIni = $scope.model.horainicio.split(':');
                var horaFin = $scope.model.horafinal.split(':');

                var horaBegin = +horaIni[0];
                var horaEnd = +horaFin[0];

                if (horaBegin > horaEnd) {
                    $scope.HoraValidacionInvalido = true;
                    result = false;
                } else { $scope.HoraValidacionInvalido = false; }

                return result;
            }

            $scope.ValidarStepTwo = function () {

                var paises = Utils.getValCheck('pais', 'IdPais');

                var result = true;
                if (paises.length == 0) {
                    $scope.PaisInvalido = true;
                    result = false;
                } else { $scope.PaisInvalido = false; }

                return result;
            }


            $scope.ValidarStepThree = function () {
                var reclutadores = Utils.getValCheck('reclutadores', 'IdReclutador');

                var result = true;
                if (reclutadores.length == 0) {
                    $scope.EntrevistadorInvalido = true;
                    result = false;
                } else { $scope.EntrevistadorInvalido = false; }

                return result;
            }


            $scope.ValidarStepFour = function () {
                var puestos = Utils.getValCheck('puestos', 'IdPuesto');

                var result = true;
                if (puestos.length == 0) {
                    $scope.PuestoInvalido = true;
                    result = false;
                } else { $scope.PuestoInvalido = false; }

                return result;
            }

            $scope.saveFeriaVirtual = function () {

                var paises = [];
                var pais = Utils.getValCheck('pais', 'IdPais');

                for (var i = 0; i < pais.length; i++) {
                    var obj =
                        {
                            IdPais: pais[i].IdPais,
                            Borrado: false
                        }
                    paises.push(obj);
                }

                var data = {
                    Descripcion: $scope.model.nombre,
                    Borrado: false,
                    Titulo: $scope.model.nombre,
                    FechaInicio: $scope.model.fechainicio,
                    FechaFinal: $scope.model.fechacierre,
                    FrecuenciaHora: $scope.model.frecuencia,
                    HoraInicio: $scope.model.horainicio,
                    HoraFinal: $scope.model.horafinal,
                    FeriaEmpleo_Entrevistadores: $scope.ReclutadoresPaises,
                    FeriaEmpleo_Puestos: $scope.PuestosPaises,
                    Paises_Bac_FeriaEmpleo: paises,
                };

                postWebApi(data, ApiService.FeriavirtualSave,
                    function (response) {
                        if (response.Resultado) {
                            Utils.MessageBox(
                                '¡Feria virtual creada exitosamente!',
                                '¡Feria virtual creada exitosamente!',
                                'Ya puedes promover la feria virtual para atraer nuevos talentos a nuestra empresa.',
                                "Content/Images/IconoFeriaVirtualCreada.png",
                                function () {
                                    window.location = __env.baseUrl + "FeriaVirtual/VerFeriaVirtual"
                                    return false;
                                }
                            );
                        } else {
                            Utils.MessageBox(
                                'Creación de feria virtual',
                                'Creación de feria virtual',
                                response.Mensaje,
                                "Content/Images/IconoErrorGeneral.png",
                                function () {
                                    return false;
                                }
                            );
                        }
                    }
                )
            }

            $scope.ChangeStep = function () {
                if ($scope.StepOne == true && $scope.StepTwo == false && $scope.StepThree == false && $scope.StepFour == false) {
                    if ($scope.ValidarStepOne()) {
                        $scope.StepOne = false;
                        $scope.StepTwo = true;
                        $scope.StepThree = false;
                        $scope.StepFour = false;
                        $('#divStepTwo').removeClass('Secundario').addClass('Primaria');
                        $('#circuloStepTwo').removeClass('CirculoSecundario').addClass('CirculoPrimario');
                        $('#textStepTwo').removeClass('textoSecundario').addClass('textoPrimario');
                    }
                } else if (($scope.StepOne == false && $scope.StepTwo == true && $scope.StepThree == false && $scope.StepFour == false && $scope.addEntrevistador == false && $scope.addPuesto == false) ||
                    ($scope.StepOne == false && $scope.StepTwo == false && $scope.StepThree == true && $scope.StepFour == false && $scope.addEntrevistador == false && $scope.addPuesto == false)) {
                    if ($scope.ValidarStepTwo()) {
                        $scope.StepOne = false;
                        $scope.StepTwo = false;
                        $scope.StepThree = true;
                        $scope.StepFour = false;
                        $('#divStepThree').removeClass('Secundario').addClass('Primaria');
                        $('#circuloStepThree').removeClass('CirculoSecundario').addClass('CirculoPrimario');
                        $('#textStepThree').removeClass('textoSecundario').addClass('textoPrimario');

                        $scope.PaisesEntrevistadores = Utils.getValCheck('pais', 'IdPais');

                        if ($scope.PaisesEntrevistadores.length == 1) {
                            $scope.PaisId = $scope.PaisesEntrevistadores[0].IdPais;
                        }
                        else {
                            $scope.PaisId = $scope.PaisesEntrevistadores[$scope.index].IdPais;
                        }


                        $scope.paisName = $scope.Paises.where(function (x) { return x.IdPais == $scope.PaisId }).select(function (x) { return x.Descripcion }).first();

                        if ($scope.PaisesEntrevistadores.length == 1) {
                            if ($scope.PaisesEntrevistadores.length < ($scope.index + 1)) {
                                $scope.addEntrevistador = true;
                            }
                        }
                        else {
                            if ($scope.PaisesEntrevistadores.length <= ($scope.index + 1)) {
                                $scope.addEntrevistador = true;
                            }
                        }

                        $scope.index = $scope.index + 1;

                        $scope.IsNext = false;
                        $scope.IsAdd = true;

                        $scope.getEntrevistadores();
                    }
                } else if (($scope.StepOne == false && $scope.StepTwo == false && $scope.StepThree == true && $scope.StepFour == false && $scope.addEntrevistador == true && $scope.addPuesto == false) ||
                    ($scope.StepOne == false && $scope.StepTwo == false && $scope.StepThree == false && $scope.StepFour == true && $scope.addEntrevistador == true && $scope.addPuesto == false)) {
                    if ($scope.ValidarStepThree()) {
                        $scope.StepOne = false;
                        $scope.StepTwo = false;
                        $scope.StepThree = false;
                        $scope.StepFour = true;
                        $('#divStepFour').removeClass('Secundario').addClass('Primaria');
                        $('#circuloStepFour').removeClass('CirculoSecundario').addClass('CirculoPrimario');
                        $('#textStepFour').removeClass('textoSecundario').addClass('textoPrimario');

                        $scope.PaisesEntrevistadores = Utils.getValCheck('pais', 'IdPais');

                        if ($scope.PaisesEntrevistadores.length == 1) {
                            $scope.PaisId = $scope.PaisesEntrevistadores[0].IdPais;
                        }
                        else {
                            $scope.PaisId = $scope.PaisesEntrevistadores[$scope.index2].IdPais;
                        }

                        $scope.paisName = $scope.Paises.where(function (x) { return x.IdPais == $scope.PaisId }).select(function (x) { return x.Descripcion }).first();

                        //if ($scope.PaisesEntrevistadores.length <= ($scope.index2 + 1)) {

                        if ($scope.PaisesEntrevistadores.length == 1) {
                            if ($scope.PaisesEntrevistadores.length < ($scope.index2 + 1)) {
                                $scope.addPuesto = true;
                                $('#btnContinuar').val('Crear feria');
                            }
                        } else {
                            if ($scope.PaisesEntrevistadores.length <= ($scope.index2 + 1)) {
                                $scope.addPuesto = true;
                                $('#btnContinuar').val('Crear feria');
                            }
                        }



                        $scope.index2 = $scope.index2 + 1;

                        $scope.IsNext = false;
                        $scope.IsAdd = true;

                        $scope.getPuestos()

                    }

                } else if ($scope.StepOne == false && $scope.StepTwo == false && $scope.StepThree == false && $scope.StepFour == true && $scope.addPuesto == true && $scope.addEntrevistador == true) {
                    if ($scope.ValidarStepFour())
                    {
                        $scope.saveFeriaVirtual();
                    }                 
                }
            }

            $scope.ReturnStep = function () {
                window.location.reload(true);
            }

            $scope.Agregar = function () {
                if ($scope.addEntrevistador == false) {

                    var arrEntrevistador = Utils.getValCheck('reclutadores', 'IdUsuario');

                    for (var i = 0; i < arrEntrevistador.length; i++) {
                        var arrObj = {
                            IdPais: $scope.PaisId,
                            IdUsuario: arrEntrevistador[i].IdUsuario,
                            Borrado: false
                        }

                        $scope.ReclutadoresPaises.push(arrObj);
                        if ($scope.PaisesEntrevistadores.length == 1) {
                            $scope.addEntrevistador = true;
                        }
                    }


                    console.log($scope.ReclutadoresPaises);
                }
                if ($scope.addPuesto == false) {

                    var arrPuesto = Utils.getValCheck('puestos', 'IdPuesto');

                    for (var i = 0; i < arrPuesto.length; i++) {
                        var arrObj = {
                            IdPais: $scope.PaisId,
                            IdPuesto: arrPuesto[i].IdPuesto,
                            Borrado: false
                        }
                        $scope.PuestosPaises.push(arrObj);
                        if ($scope.PaisesEntrevistadores.length == 1) {
                            $scope.addPuesto = true;
                        }
                    }

                    console.log($scope.PuestosPaises);
                }
                $scope.IsAdd = false;
                $scope.IsNext = true;
            }

            $scope.ReturnLobby = function () {
                window.location = __env.baseUrl + "FeriaVirtual/VerFeriaVirtual"
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

            $scope.GenerarArrayHoras = function () {
                var start = "08:00";
                var end = "10:00";
                var separacion = 30;

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
                var res = arr.join();
            }

            $scope.SeguridadJS = function () {
                var lista = JSON.parse(sessionStorage.getItem("role"));

                if (lista != null) {
                    var listaJs = lista.where(function (x) { return x.TipoAccionId == 3 && x.ReferenciasAux == 'FeriaVirtualController'; });

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

            $scope.format = 'dd/MM/yyyy';
            
            $scope.openDateStart = function() {
                $scope.dateStart.opened = true;
            };
            
            $scope.dateStart = {
                opened: false
            };

            $scope.openDateEnd = function() {
                $scope.dateEnd.opened = true;
            };
            
            $scope.dateEnd = {
                opened: false
            };
        });
})();
'use strict';

(function () {
    angular
        .module('BacApp.controllers.FiltrarRol', [])
        .controller('FiltrarRolController',
            function ($scope, $log, RESTService, __env) {

                $scope.model = {};
                $scope.model.IdArea = 0;
                $scope.model.Area = '';
                $scope.model.Borrado = 0;
                $scope.model.FechaCreacion = Date.now;

                var getWebApi = function (data, table, callback) {

                    //Utils.Show();
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

                $scope.LoadGrid = function () {
                    Utils.getGrid(ApiService.RolGrid, {}, 'table', ['Nombre', 'Ver'], 'Descripcion', $scope.Redirect, 5, 'totalGrid','IdRol,Borrado');
                }

                $scope.New = function () {
                    window.location = __env.baseUrl + 'Rol/Mantenimiento?IdRol=' + 0;
                }

                $scope.Redirect = function (param) {
                    window.location = __env.baseUrl + 'Rol/Mantenimiento?IdRol='+param.IdRol;
                }

                $scope.SeguridadJS = function () {
                    var lista = JSON.parse(sessionStorage.getItem("role"));

                    if (lista != null) {
                        var listaJs = lista.where(function (x) { return x.TipoAccionId == 3 && x.ReferenciasAux == 'FiltrarRolController'; });

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
'use strict';

(function () {
    angular
        .module('BacApp.controllers.Habilidad', [])
        .controller('HabilidadController',
            function ($scope, $log, RESTService, __env) {

                $scope.model = {};
                $scope.model.IdHabilidad = 0;
                $scope.model.Descripcion = '';
                $scope.model.Borrado = false;
                $scope.model.FechaCreacion = Date.now;

                var getWebApi = function (data, table, callback) {

                    //Utils.Show();
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
                        Id: data.IdHabilidad
                    }

                    RESTService.doPost(table, entity)
                        .then(callback);
                }

                $scope.LoadGrid = function () {
                    Utils.getGrid(ApiService.HabilidadGrid, {}, 'table', ['Nombre', 'Ver'], 'Descripcion,Borrado', $scope.Cargar, 5, 'totalGrid','IdHabilidad,Borrado');
                }

                $scope.Guardar = function () {
                    $('#popupArea').modal('hide');
                    postWebApi(
                        $scope.model,
                        ApiService.HabilidadSave,
                        function (response) {
                            if (response.Resultado) {
                                Utils.MessageBox(
                                    'Mantenimiento Habilidades',
                                    'Habilidad',
                                    response.Mensaje,
                                    "Content/Images/IconoConfimacion1.png",
                                    function () {
                                        $scope.LoadGrid();
                                        $scope.Limpiar();
                                        $('#popupLoading').modal('hide');
                                        this.modal('hide');
                                    }
                                );
                            } else {
                                Utils.MessageBox(
                                    'Mantenimiento Habilidades',
                                    'Habilidad',
                                    response.Mensaje,
                                    "Content/Images/IconoErrorGeneral.png",
                                    function () {
                                        $scope.LoadGrid();
                                        $scope.Limpiar();
                                        $('#popupLoading').modal('hide');
                                        this.modal('hide');
                                    }
                                );
                            }
                        }
                    );
                }

                $scope.Cargar = function (param) {
                    $('#popupArea').modal('show');
                    $scope.$apply(function () {
                        $scope.model.IdHabilidad = param.IdHabilidad;
                        $scope.model.Descripcion = param.Descripcion;
                        $scope.model.Borrado = param.Borrado;
                    });
                }

                $scope.Limpiar = function (param) {
                    $scope.$apply(function () {
                        $scope.model.IdHabilidad = 0;
                        $scope.model.Descripcion = '';
                        $scope.model.Borrado = false;
                    });
                }

                $scope.Cancelar = function () {
                    $('#popupArea').modal('hide');
                    $scope.model.IdHabilidad = 0;
                    $scope.model.Descripcion = '';
                    $scope.model.Borrado = false;
                }

                $scope.SeguridadJS = function () {
                    var lista = JSON.parse(sessionStorage.getItem("role"));

                    if (lista != null) {
                        var listaJs = lista.where(function (x) { return x.TipoAccionId == 3 && x.ReferenciasAux == 'HabilidadController'; });

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
'use strict';

(function () {
    angular
        .module('BacApp.controllers.Idiomas', [])
        .controller('IdiomasController',
            function ($scope, $log, RESTService, __env) {

                $scope.model = {};
                $scope.model.IdIdioma = 0;
                $scope.model.Descripcion = '';
                $scope.model.Borrado = false;
                $scope.model.FechaCreacion = Date.now;

                var getWebApi = function (data, table, callback) {

                    //Utils.Show();
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
                        Id: data.IdIdioma
                    }

                    RESTService.doPost(table, entity)
                        .then(callback);
                }

                $scope.LoadGrid = function () {
                    Utils.getGrid(ApiService.IdiomaGrid, {}, 'table', ['Nombre', 'Ver'], 'Descripcion,Borrado', $scope.Cargar, 5, 'totalGrid','IdIdioma,Borrado');
                }

                $scope.Guardar = function () {
                    $('#popupArea').modal('hide');
                    postWebApi(
                        $scope.model,
                        ApiService.IdiomaSave,
                        function (response) {
                            if (response.Resultado) {
                                Utils.MessageBox(
                                    'Mantenimiento Idioma',
                                    'Idioma',
                                    response.Mensaje,
                                    "Content/Images/IconoConfimacion1.png",
                                    function () {
                                        $scope.LoadGrid();
                                        $scope.Limpiar();
                                        $('#popupLoading').modal('hide');
                                        this.modal('hide');
                                    }
                                );
                            } else {
                                Utils.MessageBox(
                                    'Mantenimiento Idioma',
                                    'Idioma',
                                    response.Mensaje,
                                    "Content/Images/IconoErrorGeneral.png",
                                    function () {
                                        $scope.LoadGrid();
                                        $scope.Limpiar();
                                        $('#popupLoading').modal('hide');
                                        this.modal('hide');
                                    }
                                );
                            }
                        }
                    );
                }

                $scope.Cargar = function (param) {
                    $('#popupArea').modal('show');
                    $scope.$apply(function () {
                        $scope.model.IdIdioma = param.IdIdioma;
                        $scope.model.Descripcion = param.Descripcion;
                        $scope.model.Borrado = param.Borrado;
                        $scope.model.FechaCreacion = Date.now;
                    });
                }

                $scope.Limpiar = function (param) {
                    $scope.$apply(function () {
                        $scope.model.IdIdioma = 0;
                        $scope.model.Descripcion = '';
                        $scope.model.Borrado = false;
                        $scope.model.FechaCreacion = Date.now;
                    });
                }

                $scope.Cancelar = function () {
                    $('#popupArea').modal('hide');
                    $scope.model.IdIdioma = 0;
                    $scope.model.Descripcion = '';
                    $scope.model.Borrado = false;
                    $scope.model.FechaCreacion = Date.now;
                }

                $scope.SeguridadJS = function () {
                    var lista = JSON.parse(sessionStorage.getItem("role"));
                    if (lista != null) {
                        var listaJs = lista.where(function (x) { return x.TipoAccionId == 3 && x.ReferenciasAux == 'IdiomasController'; });

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
'use strict';

(function () {
    angular
        .module('BacApp.controllers.JornadaLaboral', [])
        .controller('JornadaLaboralController',
            function ($scope, $log, RESTService, __env) {

                $scope.model = {};
                $scope.model.IdJornada = 0;
                $scope.model.Descripcion = '';
                $scope.model.Borrado = false;
                $scope.model.FechaCreacion = Date.now;

                var getWebApi = function (data, table, callback) {

                    //Utils.Show();
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
                        Id: data.IdJornada
                    }

                    RESTService.doPost(table, entity)
                        .then(callback);
                }

                $scope.LoadGrid = function () {
                    Utils.getGrid(ApiService.JornadaLaboralGrid, {}, 'table', ['Nombre', 'Ver'], 'Descripcion,Borrado', $scope.Cargar, 5, 'totalGrid','IdJornada,Borrado');
                }

                $scope.Guardar = function () {
                    $('#popupArea').modal('hide');
                    postWebApi(
                        $scope.model,
                        ApiService.JornadaLaboralSave,
                        function (response) {
                            if (response.Resultado) {
                                Utils.MessageBox(
                                    'Mantenimiento Jornada Laboral',
                                    'Jornada Laboral',
                                    response.Mensaje,
                                    "Content/Images/IconoConfimacion1.png",
                                    function () {
                                        $scope.LoadGrid();
                                        $scope.Limpiar();
                                        $('#popupLoading').modal('hide');
                                        this.modal('hide');
                                    }
                                );
                            } else {
                                Utils.MessageBox(
                                    'Mantenimiento Jornada Laboral',
                                    'Jornada Laboral',
                                    response.Mensaje,
                                    "Content/Images/IconoErrorGeneral.png",
                                    function () {
                                        $scope.LoadGrid();
                                        $scope.Limpiar();
                                        $('#popupLoading').modal('hide');
                                        this.modal('hide');
                                    }
                                );
                            }
                        }
                    );
                }

                $scope.Cargar = function (param) {
                    $('#popupArea').modal('show');
                    $scope.$apply(function () {
                        $scope.model.IdJornada = param.IdJornada;
                        $scope.model.Descripcion = param.Descripcion;
                        $scope.model.Borrado = param.Borrado;
                        $scope.model.FechaCreacion = Date.now;
                    });
                }

                $scope.Limpiar = function (param) {
                    $scope.$apply(function () {
                        $scope.model.IdJornada = 0;
                        $scope.model.Descripcion = '';
                        $scope.model.Borrado = false;
                        $scope.model.FechaCreacion = Date.now;
                    });
                }

                $scope.Cancelar = function () {
                    $('#popupArea').modal('hide');
                    $scope.model.IdJornada = 0;
                    $scope.model.Descripcion = '';
                    $scope.model.Borrado = false;
                    $scope.model.FechaCreacion = Date.now;
                }

                $scope.SeguridadJS = function () {
                    var lista = JSON.parse(sessionStorage.getItem("role"));
                    if (lista != null) {
                        var listaJs = lista.where(function (x) { return x.TipoAccionId == 3 && x.ReferenciasAux == 'JornadaLaboralController'; });

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
'use strict';

(function () {
    angular
        .module('BacApp.controllers.Lobby', [])
        .controller('LobbyController',
            function ($scope, $log, RESTService, __env) {

                $scope.model = {};
                $scope.model.pais = '';

                var getWebApi = function (data, table, callback) {

                    var query = Utils.getFilterParameters(data);
                    RESTService.doGet(table, query)
                        .then(callback);
                }

                var postWebApi = function (data, table, callback) {

                    var entity = {
                        Objeto: 0,
                        Lista: data,
                        Token: '',
                        Id: 0
                    }

                    RESTService.doPost(table, entity)
                        .then(callback);
                }

                $scope.reload = function () {
                    $scope.LoadGrid();
                    $scope.GetPuestos();
                    $scope.GetAplicantes();
                    $scope.GetUsuarios();
                    $scope.AdministradoresRegional();
                    $scope.AdministradoresPais();
                }

                $scope.getPaises = function () {
                    var decode = Utils.decodeJWT();

                    var data = {
                        id: { value: decode.UserId }
                    }

                    getWebApi(data, ApiService.GetPais,
                        function (response) {
                            $scope.Paises = response.Lista;
                        })
                }

                $scope.GetPuestos = function () {

                    if ($scope.model.pais != null) {
                        var decode = Utils.decodeJWT();
                        var arr = [];

                        if ($scope.model.pais == '') {
                            arr = eval(decode.PaisesFiltro);
                        } else {
                            arr.push($scope.model.pais);
                        }
                        var entity = arr;

                        postWebApi(entity, ApiService.LobbyGetPuestos,
                            function (response) {
                                $scope.puestos = response.Objeto;
                            });
                    }
                }

                $scope.GetAplicantes = function () {
                    if ($scope.model.pais != null) {
                        var decode = Utils.decodeJWT();
                        var arr = [];

                        if ($scope.model.pais == '') {
                            arr = eval(decode.PaisesFiltro);
                        } else {
                            arr.push($scope.model.pais);
                        }

                        var entity = arr;

                        postWebApi(entity, ApiService.LobbyGetAplicantes,
                            function (response) {
                                $scope.aplicantes = response.Objeto;
                            })
                    }
                }

                $scope.GetUsuarios = function () {
                    if ($scope.model.pais != null) {
                        var decode = Utils.decodeJWT();
                        var arr = [];

                        if ($scope.model.pais == '') {
                            arr = eval(decode.PaisesFiltro);
                        } else {
                            arr.push($scope.model.pais);
                        }

                        var entity = arr;

                        postWebApi(entity, ApiService.LobbyGetUsuarios,
                            function (response) {
                                $scope.usuarios = response.Objeto;
                            })
                    }
                }

                $scope.AdministradoresRegional = function () {
                    if ($scope.model.pais != null) {
                        var decode = Utils.decodeJWT();
                        var arr = [];

                        if ($scope.model.pais == '') {
                            arr = eval(decode.PaisesFiltro);
                        } else {
                            arr.push($scope.model.pais);
                        }

                        var entity = arr;

                        postWebApi(entity, ApiService.LobbyAdministradoresRegional,
                            function (response) {
                                $scope.administradoresR = response.Objeto;
                            })
                    }
                }

                $scope.AdministradoresPais = function () {
                    if ($scope.model.pais != null) {
                        var decode = Utils.decodeJWT();
                        var arr = [];

                        if ($scope.model.pais == '') {
                            arr = eval(decode.PaisesFiltro);
                        } else {
                            arr.push($scope.model.pais);
                        }

                        var entity = arr;

                        postWebApi(entity, ApiService.LobbyAdministradoresPais,
                            function (response) {
                                $scope.administradoresP = response.Objeto;
                            })
                    }
                }

                $scope.LoadGrid = function () {
                    var decode = Utils.decodeJWT();

                    var paises = [];
                    if ($scope.model.pais != '' && $scope.model.pais != null && $scope.model.pais != 0) {
                        paises.push($scope.model.pais);
                    } else
                    {
                        paises = eval(decode.PaisesFiltro);
                    }

                    var data =
                    {
                        IdPais: { value: paises, cond: OConfig.condEquals, type: OTypes.default, comp: '||' }
                    }

                    Utils.getGrid(ApiService.PuestoGrid, data, 'table', ['Título del puesto', 'Fecha de cierre', 'Ver'], 'Puesto,FechaCierreOferta', $scope.verificacion, 5, 'totalGrid', 'IdPuesto', 'IdPuesto', 'desc');
                }

                $scope.verificacion = function (param) {
                    sessionStorage.setItem("volver", __env.baseUrl + "Principal/Index");
                    window.location = __env.baseUrl + 'Puesto/VerPuesto?IdPuesto=' + param.IdPuesto;
                }

                $scope.VerificarSession = function () {

                    if (Utils.getUrlParameter("token") != '') {
                        if (sessionStorage.hasOwnProperty("token")) {
                            sessionStorage.removeItem('token');
                        }
                        var Token = Utils.getUrlParameter("token");
                        sessionStorage.setItem("token", Token);
                    }

                    if (!sessionStorage.hasOwnProperty("token")) {
                        var Token = Utils.getUrlParameter("token");
                        sessionStorage.setItem("token", Token);
                        console.log(Token);
                    }

                    if (!sessionStorage.hasOwnProperty("role")) {
                        var decode = Utils.decodeJWT();
                        var data = {
                            userid: { value: decode.UserId }
                        }

                        getWebApi(data, ApiService.GetMenu,
                            function (response) {
                                sessionStorage.setItem("role", response.Objeto);
                                $scope.SeguridadJS();
                            })
                    }
                    else { $scope.SeguridadJS(); }
                }
                
                //$scope.SeguridadJS = function () {



                //    var lista = JSON.parse(sessionStorage.getItem("role"));

                //    var listaJs = lista.where(function (x) { return x.TipoAccionId == 3 });

                //    $.each(listaJs, function (index, value) {
                //        var funcion = eval('$scope.' + value.ReferenciaJS);
                //        if (funcion != undefined && funcion != null && funcion != '') {
                //            eval('$scope.' + value.ReferenciaJS + '= function () { }');
                //        }
                //    });
                //}

                $scope.SeguridadJS = function () {

                    var lista = JSON.parse(sessionStorage.getItem("role"));
                    if (lista != null) {
                        var listaJs = lista.where(function (x) { return x.TipoAccionId == 3 && x.ReferenciasAux == 'LobbyController'; });

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
'use strict';

(function () {
    angular
        .module('BacApp.controllers.login', [])
        .controller('loginController',
            function ($scope, $log, RESTService, __env) {

                $scope.model = {};  
                $scope.model.usuario ='';
                $scope.model.password = '';
                $scope.model.Correo = '';

                //validaciones
                $scope.UserInvalido = false;
                $scope.PasswordInvalido = false;
                $scope.EmailInvalido= false;

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

                $scope.Enviar = function () {

                    if ($scope.model.Correo == '') {
                        $scope.EmailInvalido = true;

                        Utils.MessageBox(
                            'Recuperar contraseña',
                            'Recuperar contraseña',
                            "Debe ingresar un correo válido.",
                            "Content/Images/IconoErrorGeneral.png",
                            function () {
                                $scope.model.Correo = '';
                                this.modal('hide');
                            }
                        );
                    } else
                    {
                        $scope.EmailInvalido = false
                    }
                    if ($scope.EmailInvalido == false)
                    {
                        postWebApi(
                            $scope.model.Correo,
                            ApiService.RecuperarClave,
                            function (response) {
                                if (response.Resultado) {
                                    Utils.MessageBox(
                                        'Recuperar contraseña',
                                        'Recuperar contraseña',
                                        "Se ha enviado un correo con las instrucciones.",
                                        "Content/Images/IconoConfimacion1.png",
                                        function () {
                                            $scope.model.Correo = '';
                                            $('#popupLoading').modal('hide');
                                            this.modal('hide');
                                        }
                                    );
                                } else {
                                    Utils.MessageBox(
                                        'Recuperar contraseña',
                                        'Recuperar contraseña',
                                        response.Mensaje,
                                        "Content/Images/IconoErrorGeneral.png",
                                        function () {
                                            $scope.model.Correo = '';
                                            $('#popupLoading').modal('hide');
                                            this.modal('hide');
                                        }
                                    );
                                }
                            }
                        );
                    }
                }

                $scope.login = function () {

                    if ($scope.model.usuario != '' && $scope.model.password != '') {
                        Session.Login($scope.model.usuario, $scope.model.password);
                    }
                    else
                    {
                        $scope.UserInvalido = true;
                        $scope.PasswordInvalido = true;
                    }
                };

                $scope.SessionEnd = function () {
                    Session.Logout();
                };

                $scope.registrar = function () {
                    window.location = __env.baseUrl + "Postulante/RegistroPostulante/";
                    //window.location = __env.baseUrl + "Registro/Index/";
                }

                $scope.SeguridadJS = function () {
                    var lista = JSON.parse(sessionStorage.getItem("role"));

                    if (lista != null) {
                        var listaJs = lista.where(function (x) { return x.TipoAccionId == 3 && x.ReferenciasAux == 'loginController'; });

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
'use strict';

(function () {
    angular
        .module('BacApp.controllers.main', [])
        .controller('mainController',
            function ($scope, $log, RESTService, __env) {

                $scope.baseUrl = __env.baseUrl;
                $scope.Logout = function () {
                    Session.EndSession();
                }

                $scope.ValidateSession = function () {
                    var token = sessionStorage.getItem("token");
                    if (token == null || token == '' || token == undefined) {
                        window.location = __env.baseUrl + 'Principal/Login';
                    }
                }


                $scope.AplicarSeguridadHTML = function () {
                    Utils.SeguridadHTML();
                }

                $scope.VerificarSession = function () {

                    if (Utils.getUrlParameter("token") != '') {
                        if (sessionStorage.hasOwnProperty("token")) {
                            sessionStorage.removeItem('token');
                        }
                        var Token = Utils.getUrlParameter("token");
                        sessionStorage.setItem("token", Token);
                    }

                    if (!sessionStorage.hasOwnProperty("token")) {
                        var Token = Utils.getUrlParameter("token");
                        sessionStorage.setItem("token", Token);
                    }

                    if (!sessionStorage.hasOwnProperty("role")) {
                        var decode = Utils.decodeJWT();
                        var data = {
                            userid: { value: decode.UserId }
                        }

                        getWebApi(data, ApiService.GetMenu,
                            function (response) {
                                sessionStorage.setItem("role", response.Objeto);
                                $('#menu').empty();
                                $scope.CrearMenu();
                                $scope.SeguridadJS();
                                $scope.AplicarSeguridadHTML();
                            })
                    }
                    else
                    {
                        if (Utils.getUrlParameter("token") != '') {
                            console.log('Refrescado');
                            var decode = Utils.decodeJWT();
                            var data = {
                                userid: { value: decode.UserId }
                            }
                            sessionStorage.removeItem("role");
                            getWebApi(data, ApiService.GetMenu,
                                function (response) {
                                    sessionStorage.setItem("role", response.Objeto);
                                    $('#menu').empty();
                                    $scope.CrearMenu();
                                    $scope.SeguridadJS();
                                    $scope.AplicarSeguridadHTML();
                                })
                        }
                        else { $scope.CrearMenu(); }
                    }
                }
                var getWebApi = function (data, table, callback) {

                    var query = Utils.getFilterParameters(data);
                    RESTService.doGet(table, query)
                        .then(callback);
                }

                $scope.CrearMenu = function () {

                    console.log('mainController');
                    $('#menu').empty();
                    var html = '';

                    var lista = JSON.parse(sessionStorage.getItem("role"));

                    var opcionesPrincipales = lista.where(function (x) { return x.TipoAccionId == 1 });

                    var opcionesSecundarias = lista.where(function (x) { return x.TipoAccionId == 2 });

                    var opcionesTernarias = lista.where(function (x) { return x.TipoAccionId == 7 });

                    $.each(opcionesPrincipales, function (index, value) {
                        html = '';
                        html += '<a id="btn' + value.AccionId + '" ' + (value.URL == null ? ' >' : 'href="' + __env.baseUrl + value.URL + '">');
                        html += '   <div class="opcion">';
                        html += '       <div class="contenedorOpcion">';
                        html += '           <div class="Texto">' + value.Nombre + '</div>';
                        html += '           <img src="' + __env.baseUrl + '/Content/Images/' + value.Icono + '.png" class="Imagen" />'
                        html += '       </div>';
                        html += '   </div>';
                        html += '</a>';
                        html += '<div id="' + value.AccionId + '" class="collapse"></div>';

                        $('#menu').append(html);

                        if (value.URL == null) {
                            $('#btn' + value.AccionId).unbind();
                            $('#btn' + value.AccionId).on('click', function () {
                                if ($('#' + value.AccionId).hasClass('collapse')) {
                                    $('#' + value.AccionId).removeClass('collapse');
                                    $('#' + value.AccionId).addClass('Expand');
                                } else {
                                    $('#' + value.AccionId).removeClass('Expand');
                                    $('#' + value.AccionId).addClass('collapse');
                                }
                            });
                        }
                    });

                    $.each(opcionesSecundarias, function (index, value) {
                        html = '';
                        html += '<a id="btn' + value.AccionId + '" ' + (value.URL == null ? '>' : 'href="' + __env.baseUrl + value.URL + '">');
                        html += '   <div class="opcion subOpcion">';
                        html += '       <div class="contenedorOpcion">';
                        html += '           <div class="Texto">' + value.Nombre + '</div>';
                        html += '           <img src="' + __env.baseUrl + '/Content/Images/' + value.Icono + '.png" class="Imagen" />'
                        html += '       </div>';
                        html += '   </div>';
                        html += '</a>';
                        html += '<div id="' + value.AccionId + '" class="collapse"></div>';

                        $('#' + value.ParentId).append(html);

                        if (value.URL == null) {
                            $('#btn' + value.AccionId).unbind();
                            $('#btn' + value.AccionId).on('click', function () {
                                if ($('#' + value.AccionId).hasClass('collapse')) {
                                    $('#' + value.AccionId).removeClass('collapse');
                                    $('#' + value.AccionId).addClass('Expand');
                                } else {
                                    $('#' + value.AccionId).removeClass('Expand');
                                    $('#' + value.AccionId).addClass('collapse');
                                }
                            });
                        }
                    });

                    $.each(opcionesTernarias, function (index, value) {
                        html = '';
                        html += '<a id="btn' + value.AccionId + '" ' + (value.URL == null ? ' >' : 'href="' + __env.baseUrl + value.URL + '">');
                        html += '   <div class="opcion subSubOpcion">';
                        html += '       <div class="contenedorOpcion">';
                        html += '           <div class="Texto">' + value.Nombre + '</div>';
                        html += '           <img src="' + __env.baseUrl + '/Content/Images/' + value.Icono + '.png" class="Imagen" />'
                        html += '       </div>';
                        html += '   </div>';
                        html += '</a>';
                        html += '<div id="' + value.AccionId + '" class="collapse"></div>';

                        $('#' + value.ParentId).append(html);

                        if (value.URL == null) {
                            $('#btn' + value.AccionId).unbind();
                            $('#btn' + value.AccionId).on('click', function () {
                                if ($('#' + value.AccionId).hasClass('collapse')) {
                                    $('#' + value.AccionId).removeClass('collapse');
                                    $('#' + value.AccionId).addClass('Expand');
                                } else {
                                    $('#' + value.AccionId).removeClass('Expand');
                                    $('#' + value.AccionId).addClass('collapse');
                                }
                            });
                        }
                    });
                }

                $scope.SeguridadJS = function () {
                    var lista = JSON.parse(sessionStorage.getItem("role"));

                    if (lista != null) {
                        var listaJs = lista.where(function (x) { return x.TipoAccionId == 3 && x.ReferenciasAux == 'mainController'; });

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



'use strict';

(function () {
    angular
        .module('BacApp.controllers.Menu', [])
        .controller('MenuController',
            function ($scope, $log, RESTService, __env) {

                var getWebApi = function (data, table, callback) {

                    //Utils.Show();
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
                $scope.VerificarSession = function () {
                    if (Utils.getUrlParameter("token") != '') {
                        if (sessionStorage.hasOwnProperty("token")) {
                            sessionStorage.removeItem('token');                         
                        }
                        var Token = Utils.getUrlParameter("token");
                        sessionStorage.setItem("token", Token);
                    }
                    if (!sessionStorage.hasOwnProperty("token")) {
                        var Token = Utils.getUrlParameter("token");
                        sessionStorage.setItem("token", Token);
                        console.log(Token);
                    }

                    if (!sessionStorage.hasOwnProperty("role")) {
                        var decode = Utils.decodeJWT();
                        var data = {
                            userid: { value: decode.UserId }
                        }

                        getWebApi(data, ApiService.GetMenu,
                            function (response) {
                                sessionStorage.setItem("role", response.Objeto);
                                $('#menu').empty();
                                $scope.CrearMenu();
                            })
                    }
                    else {
                        if (Utils.getUrlParameter("token") != '') {
                            var decode = Utils.decodeJWT();
                            var data = {
                                userid: { value: decode.UserId }
                            }
                            sessionStorage.removeItem("role");
                            getWebApi(data, ApiService.GetMenu,
                                function (response) {
                                    sessionStorage.setItem("role", response.Objeto);
                                    $('#menu').empty();
                                    $scope.CrearMenu();
                                })
                        }
                        else { $scope.CrearMenu(); }
                    }
                }
                $scope.CrearMenu = function () {
                    console.log('MenuController');
                    $('#menu').empty();
                    var html = '';
                   
                    var lista = JSON.parse(sessionStorage.getItem("role"));
                    
                    var opcionesPrincipales = lista.where(function (x) { return x.TipoAccionId == 1 });

                    var opcionesSecundarias = lista.where(function (x) { return x.TipoAccionId == 2 });

                    var opcionesTernarias = lista.where(function (x) { return x.TipoAccionId == 7 });
                    console.log(opcionesPrincipales);
                    $.each(opcionesPrincipales, function (index, value) {
                        html = '';
                        html += '<a id="btn' + value.AccionId + '" ' + (value.URL == null ? ' >' : 'href="' + __env.baseUrl + value.URL + '">');
                        html += '   <div class="opcion">';
                        html += '       <div class="contenedorOpcion">';
                        html += '           <div class="Texto">' + value.Nombre + '</div>';
                        html += '           <img src="' + __env.baseUrl + '/Content/Images/' + value.Icono + '.png" class="Imagen" />'
                        html += '       </div>';
                        html += '   </div>';
                        html += '</a>';
                        html += '<div id="' + value.AccionId + '" class="collapse"></div>';

                        $('#menu').append(html);

                        if (value.URL == null) {
                            $('#btn' + value.AccionId).unbind();
                            $('#btn' + value.AccionId).on('click', function () {
                                if ($('#' + value.AccionId).hasClass('collapse')) {
                                    $('#' + value.AccionId).removeClass('collapse');
                                    $('#' + value.AccionId).addClass('Expand');
                                }else{
                                    $('#' + value.AccionId).removeClass('Expand');
                                    $('#' + value.AccionId).addClass('collapse');
                                }
                            });
                        }
                    });

                    $.each(opcionesSecundarias, function (index, value) {
                        html = '';
                        html += '<a id="btn' + value.AccionId + '" ' + (value.URL == null ? '>' : 'href="' + __env.baseUrl + value.URL + '">');
                        html += '   <div class="opcion subOpcion">';
                        html += '       <div class="contenedorOpcion">';
                        html += '           <div class="Texto">' + value.Nombre + '</div>';
                        html += '           <img src="' + __env.baseUrl + '/Content/Images/' + value.Icono + '.png" class="Imagen" />'
                        html += '       </div>';
                        html += '   </div>';
                        html += '</a>';
                        html += '<div id="' + value.AccionId + '" class="collapse"></div>';

                        $('#' + value.ParentId).append(html);

                        if (value.URL == null) {
                            $('#btn' + value.AccionId).unbind();
                            $('#btn' + value.AccionId).on('click', function () {
                                if ($('#' + value.AccionId).hasClass('collapse')) {
                                    $('#' + value.AccionId).removeClass('collapse');
                                    $('#' + value.AccionId).addClass('Expand');
                                } else {
                                    $('#' + value.AccionId).removeClass('Expand');
                                    $('#' + value.AccionId).addClass('collapse');
                                }
                            });
                        }
                    });

                    $.each(opcionesTernarias, function (index, value) {
                        html = '';
                        html += '<a id="btn' + value.AccionId + '" ' + (value.URL == null ? ' >' : 'href="' + __env.baseUrl + value.URL + '">');
                        html += '   <div class="opcion subSubOpcion">';
                        html += '       <div class="contenedorOpcion">';
                        html += '           <div class="Texto">' + value.Nombre + '</div>';
                        html += '           <img src="' + __env.baseUrl + '/Content/Images/' + value.Icono + '.png" class="Imagen" />'
                        html += '       </div>';
                        html += '   </div>';
                        html += '</a>';
                        html += '<div id="' + value.AccionId + '" class="collapse"></div>';

                        $('#' + value.ParentId).append(html);

                        if (value.URL == null) {
                            $('#btn' + value.AccionId).unbind();
                            $('#btn' + value.AccionId).on('click', function () {
                                if ($('#' + value.AccionId).hasClass('collapse')) {
                                    $('#' + value.AccionId).removeClass('collapse');
                                    $('#' + value.AccionId).addClass('Expand');
                                } else {
                                    $('#' + value.AccionId).removeClass('Expand');
                                    $('#' + value.AccionId).addClass('collapse');
                                }
                            });
                        }
                    });
                }

                $scope.SeguridadJS = function () {
                    var lista = JSON.parse(sessionStorage.getItem("role"));

                    if (lista != null) {
                        var listaJs = lista.where(function (x) { return x.TipoAccionId == 3 && x.ReferenciasAux == 'MenuController'; });

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
'use strict';

(function () {
    angular
        .module('BacApp.controllers.PretensionSalarial', [])
        .controller('PretensionSalarialController',
            function ($scope, $log, RESTService, __env) {

                $scope.model = {};
                $scope.model.IdPretension = 0;
                $scope.model.Descripcion = '';
                $scope.model.SalarioMinimo = 0;
                $scope.model.SalarioMaximo = 0;
                $scope.model.IdMoneda = '';
                $scope.model.Borrado = false;
                $scope.model.FechaCreacion = Date.now;

                var getWebApi = function (data, table, callback) {

                    //Utils.Show();
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
                        Id: data.IdPretension
                    }

                    RESTService.doPost(table, entity)
                        .then(callback);
                }

                $scope.GetMonedas = function () {
                    getWebApi({}, ApiService.MonedaGet,
                        function (response) {
                            $scope.monedas = response.Lista;
                        })
                }

                $scope.LoadGrid = function () {
                    Utils.getGrid(ApiService.PretensionSalarialGrid, {}, 'table', ['Nombre', 'Mínimo', 'Máximo', 'Ver'], 'Descripcion,SalarioMinimo,SalarioMaximo', $scope.Cargar, 5, 'totalGrid', 'IdPretension,Borrado,IdMoneda');
                }

                $scope.Guardar = function () {
                    $('#popupArea').modal('hide');
                    postWebApi(
                        $scope.model,
                        ApiService.PretensionSalarialSave,
                        function (response) {
                            if (response.Resultado) {
                                Utils.MessageBox(
                                    'Mantenimiento Pretensiones Salariales',
                                    'Pretensión Salarial',
                                    response.Mensaje,
                                    "Content/Images/IconoConfimacion1.png",
                                    function () {
                                        $scope.LoadGrid();
                                        $scope.Limpiar();
                                        $('#popupLoading').modal('hide');
                                        this.modal('hide');
                                    }
                                );
                            } else {
                                Utils.MessageBox(
                                    'Mantenimiento Pretensiones Salariales',
                                    'Pretensión Salarial',
                                    response.Mensaje,
                                    "Content/Images/IconoErrorGeneral.png",
                                    function () {
                                        $scope.LoadGrid();
                                        $scope.Limpiar();
                                        $('#popupLoading').modal('hide');
                                        this.modal('hide');
                                    }
                                );
                            }
                        }
                    );
                }

                $scope.Cargar = function (param) {
                    $('#popupArea').modal('show');
                    $scope.$apply(function () {
                        $scope.model.IdPretension = param.IdPretension;
                        $scope.model.Descripcion = param.Descripcion;
                        $scope.model.SalarioMinimo = param.SalarioMinimo;
                        $scope.model.SalarioMaximo = param.SalarioMaximo;
                        $scope.model.IdMoneda = param.IdMoneda;
                        $scope.model.Borrado = param.Borrado;
                        $scope.model.FechaCreacion = Date.now;
                    });
                }

                $scope.Limpiar = function (param) {
                    $scope.$apply(function () {
                        $scope.model.IdPretension = 0;
                        $scope.model.Descripcion = '';
                        $scope.model.SalarioMinimo = 0;
                        $scope.model.SalarioMaximo = 0;
                        $scope.model.IdMoneda = '';
                        $scope.model.Borrado = false;
                        $scope.model.FechaCreacion = Date.now;
                    });
                }

                $scope.Cancelar = function () {
                    $('#popupArea').modal('hide');
                    $scope.model.IdPretension = 0;
                    $scope.model.Descripcion = '';
                    $scope.model.SalarioMinimo = 0;
                    $scope.model.SalarioMaximo = 0;
                    $scope.model.IdMoneda = '';
                    $scope.model.Borrado = false;
                    $scope.model.FechaCreacion = Date.now;
                }

                $scope.SeguridadJS = function () {
                    var lista = JSON.parse(sessionStorage.getItem("role"));

                    if (lista != null) {
                        var listaJs = lista.where(function (x) { return x.TipoAccionId == 3 && x.ReferenciasAux == 'PretensionSalarialController'; });

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
'use strict';

(function () {
    angular
        .module('BacApp.controllers.principal', [])
        .controller('principalController',
        function ($scope, $log, RESTService, __env) {
        });
})();
'use strict';

(function () {
    angular
        .module('BacApp.controllers.puestos', ['ui.bootstrap'])
        .controller('puestosController',
            function ($scope, $log, RESTService, __env) {

                $scope.model = {};
                $scope.model.IdPuesto = 0;
                $scope.model.Titulo = '';
                $scope.model.Descripcion = '';
                $scope.model.ImagenURL = '';
                $scope.model.IdArea = '';
                $scope.model.IdNivelAcademico = 0;
                $scope.model.FechaCierreOferta = '';
                $scope.model.IdJornada = 0;
                $scope.model.Publicado = 0;
                $scope.model.IdIdioma = 0;
                $scope.model.IdPais = 0;
                $scope.model.IdZona1 = 0;

                $scope.idiomaLabel = '';
                $scope.areaLabel = '';
                $scope.paisLabel = '';
                //Catalogos
                $scope.Idiomas = {};
                $scope.Paises = {};
                $scope.JornadaLaboral = {};
                $scope.GradoAcademico = {};
                $scope.Areas = {};

                //paso1
                $scope.show1 = false;
                $scope.show2 = false;
                $scope.show3 = false;
                $scope.show4 = false;
                $scope.show5 = false;
                $scope.show6 = false;

                //Paso2
                $scope.show7 = false;

                //Paso3
                $scope.show8 = false;

                //Pasos
                $scope.StepOne = true;
                $scope.StepTwo = false;
                $scope.StepThree = false;
                $scope.StepFour = false;

                $('#txtFechaCierre').on('change', function(){
                    console.log($(this).val());
                })

                $scope.getGradoAcademico = function () {
                    getWebApi({}, ApiService.GradoAcademicoGet,
                        function (response) {
                            $scope.GradoAcademico = response.Lista;
                        })
                }

                $scope.getPaises = function () {
                    var decode = Utils.decodeJWT();

                    var data = {
                        id: { value: decode.UserId }
                    }

                    getWebApi(data, ApiService.GetPais,
                        function (response) {
                            $scope.Paises = response.Lista;
                        })
                }

                $scope.getIdiomas = function () {

                    getWebApi({}, ApiService.getIdioma,
                        function (response) {
                            $scope.Idiomas = response.Lista;
                        }
                    )
                }

                $scope.getJornadaLaboral = function () {

                    getWebApi({}, ApiService.JornadaLaboralGet,
                        function (response) {
                            $scope.JornadaLaboral = response.Lista;
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

                $scope.GetLabelFromGrado = function (value, model) {
                    if (!model) return;

                    for (var i = 0; i < model.length; i++) {
                        var _value = model[i].IdNivelAcademico;
                        if (_value === value) {
                            return model[i].Descripcion;
                        }
                    }
                };

                $scope.GetLabelFromPais = function (value, model) {
                    if (!model) return;

                    for (var i = 0; i < model.length; i++) {
                        var _value = model[i].IdPais;
                        if (_value === value) {
                            return model[i].Descripcion;
                        }
                    }
                };

                $scope.GetLabelFromJornada = function (value, model) {
                    if (!model) return;

                    for (var i = 0; i < model.length; i++) {
                        var _value = model[i].IdJornada;
                        if (_value === value) {
                            return model[i].Descripcion;
                        }
                    }
                };

                $scope.getZona = function () {
                    var data = {
                        id: { value: $scope.model.IdPais }
                    }

                    getWebApi(data, ApiService.Zona1Get,
                        function (response) {
                            $scope.Zona1 = response.Lista;
                        }
                    )

                }

                $scope.GetDate = function (value) {
                    var date = new Date(value);
                    return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
                };

                $scope.SavePuesto = function () {
                    var Idiomas = Utils.getValRepetear('NivelIdioma', ['IdIdioma', 'Porcentaje']);
                    var IdiomaObj = [];
                    var PaisesObj = [];
                    var TipoJornadas = [];
                    for (var i = 0; i < Idiomas.length; i++) {

                        var obj =
                        {
                            IdPuesto: 0,
                            IdIdioma: Idiomas[i].IdIdioma,
                            Porcentaje: Idiomas[i].Porcentaje,
                            Borrado: false
                        }
                        IdiomaObj.push(obj)
                    }

                    //var paises = Utils.getValCheck('pais', 'IdPais');

                    //for (var i = 0; i < paises.length; i++) {

                    var obj =
                    {
                        IdPuesto: 0,
                        IdPais: $scope.model.IdPais, //paises[i].IdPais,
                        Borrado: false
                    }
                    PaisesObj.push(obj);
                    //}

                    TipoJornadas.push({
                        IdPuesto: 0,
                        IdJornada: $scope.model.IdJornada,
                        Borrado: false
                    });
                    var Areas = Utils.getValCheck('areas', 'IdArea');
                    $scope.model.IdArea = Areas[0].IdArea;

                    var requisitos = Utils.getValRepetear('Puestorequisito', ['Descripcion']);

                    var data =
                    {
                        PuestoInfo:
                        {
                            IdPuesto: $scope.model.IdPuesto,
                            Titulo: $scope.model.Titulo,
                            Descripcion: $scope.model.Descripcion,
                            ImagenURL: '',
                            IdArea: $scope.model.IdArea,
                            IdNivelAcademico: $scope.model.IdNivelAcademico,
                            FechaCierreOferta: $scope.model.FechaCierreOferta,
                            Publicado: true,
                            IdZona1: $scope.model.IdZona1
                        },
                        Idiomas: IdiomaObj,
                        TipoJornadas: TipoJornadas,
                        Puestos_Paises_BAC: PaisesObj,
                        Postulantes: [],
                        Ferias: [],
                        Requisitos: requisitos
                    };

                    postWebApi(data, ApiService.PuestosSave, function (response) {
                        if (response.Resultado) {
                            Utils.MessageBox(
                                '¡Puesto creado exitosamente!',
                                '¡Puesto creado exitosamente!',
                                'Y puedes promocionar el puesto para atraer nuevos talentos.',
                                "Content/Images/IconoPuestoCreado.png",
                                function () {
                                    window.location = __env.baseUrl + 'Puesto/FiltrarPuestos'
                                    this.modal('hide');

                                    $('#popupLoading').modal('hide');
                                }
                            );
                        } else {
                            Utils.MessageBox(
                                'Creación de puesto',
                                'Creación de puesto',
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
                        Id: data.PuestoInfo.IdPuesto
                    }

                    RESTService.doPost(table, entity)
                        .then(callback);
                }

                $scope.RemoveElement = function (param) {
                    switch (param) {
                        case 4: {
                            var ids = $('#NivelIdioma > div').map(function () {
                                return this.id
                            }).toArray();

                            if (ids.length > 1) {
                                $("#" + ids[ids.length - 1]).remove();
                            }
                            break;
                        }
                        case 5: {
                            var ids = $('#Puestorequisito > div').map(function () {
                                return this.id
                            }).toArray();

                            if (ids.length > 1) {
                                $("#" + ids[ids.length - 1]).remove();
                            }
                            break;
                        }
                    }
                }

                $scope.AgregarIdioma = function () {
                    var Idiomas = Utils.getValRepetear('NivelIdioma', ['IdIdioma', 'Porcentaje']);

                    var duplicates = $scope.searchDuplicates(Idiomas, 'IdIdioma');
                    console.log(duplicates);
                    if (duplicates.length == 0) {
                        Utils.cloneSelect('pnlRepeatNivelIdioma', 'agregarIdioma');
                        $scope.RepeticionIdioma = false;
                    }
                    else
                    {
                         $scope.RepeticionIdioma = true;
                    }

                    //if (!$scope.chkDuplicates(Idiomas, true)) {
                    //    Utils.cloneSelect('pnlRepeatNivelIdioma', 'agregarIdioma');
                    //    $scope.RepeticionIdioma = false;
                    //} else {
                    //    $scope.RepeticionIdioma = true;
                    //}
                }

                $scope.AgregarRequisito = function () {
                    var requisitos = Utils.getValRepetear('Puestorequisito', ['Descripcion']);
                    if (!$scope.chkDuplicates(requisitos, true)) {
                        Utils.cloneElement('pnlRepeatRequisitos', 'agregarRequisito');
                        $scope.RepeticionRequisitos = false;
                    } else {
                        $scope.RepeticionRequisitos = true;
                    }
                }

                $scope.ValidateStepOne = function () {
                    var result = true;
                    if ($scope.model.Titulo == '') {
                        $scope.show1 = true;
                        result = false;
                    } else {
                        $scope.show1 = false;
                    }

                    if ($scope.model.Descripcion == '') {
                        $scope.show2 = true;
                        result = false;
                    } else {
                        $scope.show2 = false;
                    }

                    if ($scope.model.IdNivelAcademico == '' || $scope.model.IdNivelAcademico == null) {
                        $scope.show3 = true;
                        result = false;
                    } else {
                        $scope.show3=false;
                    }

                    if ($scope.model.IdJornada == '' || $scope.model.IdJornada == null) {
                        $scope.show4 = true;
                        result = false;
                    } else {
                        $scope.show4 = false;
                    }

                    if ($scope.model.FechaCierreOferta == '') {
                        $scope.show5 = true;
                        result = false;
                    } else {
                        $scope.show5 = false;
                    }

                    var Idiomas = Utils.getValRepetear('NivelIdioma', ['IdIdioma', 'Porcentaje']);
                    if (!$scope.chkDuplicates(Idiomas, true)) {
                        if (Idiomas.length <= 0) {
                            $scope.show6 = true;
                            result = false;
                        } else {
                            $scope.show6 = false;
                        }
                        $scope.RepeticionIdioma = false;
                    } else {
                        $scope.RepeticionIdioma = true;
                        result = false;
                    }

                    var requisitos = Utils.getValRepetear('Puestorequisito', ['Descripcion']);
                    if (!$scope.chkDuplicates(requisitos, true)) {
                        if (requisitos.length <= 0) {
                            $scope.show61 = true;
                            result = false;
                        } else {
                            $scope.show61 = false;
                        }
                        $scope.RepeticionRequisitos = false;
                    } else {
                        $scope.RepeticionRequisitos = true;
                        result = false;
                    }

                    if (result) {
                        $scope.LimpiarShowStep1();
                    }

                    return result;
                }

                $scope.LimpiarShowStep1 = function () {
                    $scope.show1 = false;
                    $scope.show2 = false;
                    $scope.show3 = false;
                    $scope.show4 = false;
                    $scope.show5 = false;
                    $scope.show6 = false;
                }

                $scope.ValidateStepTwo = function () {
                    var result = true;
                    var Areas = Utils.getValCheck('areas', 'IdArea');
                    if (Areas.length <= 0) {
                        $scope.show7 = true;
                        result = false;
                    } else {
                        $scope.show7 = false;
                    }

                    if (result) {
                        $scope.show7 = false;
                    }

                    return result;
                }

                $scope.ValidateStepThree = function () {
                    var result = true;

                    var paises = Utils.getValCheck('pais', 'IdPais');
                    if (paises.length <= 0) {
                        $scope.show8 = true;
                        result = false;
                    }

                    if (result) {
                        $scope.show8 = false;
                    }

                    return result;
                }

                $scope.ChangeStep = function () {
                    var completado = $scope.ValidateStepOne();
                    if ($scope.StepOne == true && $scope.StepTwo == false && $scope.StepThree == false && $scope.StepFour == false && completado) {
                        $scope.StepOne = false;
                        $scope.StepTwo = true;
                        $scope.StepThree = false;
                        $scope.StepFour = false;
                        $('#divStepTwo').removeClass('Secundario').addClass('Primaria');
                        $('#circuloStepTwo').removeClass('CirculoSecundario').addClass('CirculoPrimario');
                        $('#textStepTwo').removeClass('textoSecundario').addClass('textoPrimario');
                        completado = $scope.ValidateStepTwo();
                    } else if ($scope.StepOne == false && $scope.StepTwo == true && $scope.StepThree == false && $scope.StepFour == false && completado) {
                        $scope.StepOne = false;
                        $scope.StepTwo = false;
                        $scope.StepThree = true;
                        $scope.StepFour = false;
                        $('#divStepThree').removeClass('Secundario').addClass('Primaria');
                        $('#circuloStepThree').removeClass('CirculoSecundario').addClass('CirculoPrimario');
                        $('#textStepThree').removeClass('textoSecundario').addClass('textoPrimario');
                        completado = $scope.ValidateStepThree();
                    } else if ($scope.StepOne == false && $scope.StepTwo == false && $scope.StepThree == true && $scope.StepFour == false && completado) {
                        $scope.StepOne = false;
                        $scope.StepTwo = false;
                        $scope.StepThree = false;
                        $scope.StepFour = true;
                        $('#divStepFour').removeClass('Secundario').addClass('Primaria');
                        $('#circuloStepFour').removeClass('CirculoSecundario').addClass('CirculoPrimario');
                        $('#textStepFour').removeClass('textoSecundario').addClass('textoPrimario');

                        var Areas = Utils.getValCheck('areas', 'IdArea');
                        $scope.model.IdArea = Areas[0].IdArea;
                        $scope.areaLabel = $scope.Areas.where(function (x) { return x.IdArea == $scope.model.IdArea }).select(function (x) { return x.Area });
                        var Idiomas = Utils.getValRepetear('NivelIdioma', ['IdIdioma', 'Porcentaje']);

                        for (var i = 0; i < Idiomas.length; i++) {
                            $scope.idiomaLabel += $scope.Idiomas.where(function (x) { return x.IdIdioma == Idiomas[i].IdIdioma }).select(function (x) { return x.Descripcion }) + ',';
                        }

                        var paises = Utils.getValCheck('pais', 'IdPais');

                        for (var i = 0; i < paises.length; i++) {
                            $scope.paisLabel += $scope.Paises.where(function (x) { return x.IdPais == paises[i].IdPais }).select(function (x) { return x.Descripcion }) + ',';
                        }

                    } else if ($scope.StepOne == false && $scope.StepTwo == false && $scope.StepThree == false && $scope.StepFour == true) {
                        $scope.SavePuesto();
                    }
                    $("html, body").animate({ scrollTop: 0 }, 600);
                }

                $scope.ReturnStep = function () {
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
                        window.location = __env.baseUrl + 'Puesto/FiltrarPuestos';
                    }

                    $("html, body").animate({ scrollTop: 0 }, 600);
                }

                $scope.Volver = function () {
                    window.location = __env.baseUrl + 'Puesto/FiltrarPuestos';
                }

                $scope.SeguridadJS = function () {
                    var lista = JSON.parse(sessionStorage.getItem("role"));
                    if (lista != null) {
                        var listaJs = lista.where(function (x) { return x.TipoAccionId == 3 && x.ReferenciasAux == 'puestosController'; });

                        $.each(listaJs, function (index, value) {
                            var funcion = eval('$scope.' + value.ReferenciaJS);
                            if (funcion != undefined && funcion != null && funcion != '') {
                                eval('$scope.' + value.ReferenciaJS + '= function () { }');
                            }
                        });
                    }
                }

                $scope.searchDuplicates = function(originalArray, prop) {
                    var newArray = [];
                    var lookupObject = {};

                    for (var i in originalArray) {
                        lookupObject[originalArray[i][prop]] = originalArray[i];
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
'use strict';

(function () {
    angular
        .module('BacApp.controllers.puestosEdit', [])
        .controller('puestosEditController',
            function ($scope, $log, RESTService, __env) {

                //var id = Utils.getUrlParameter('IdPuesto');

                $scope.model = {};
                $scope.model.IdPuesto = 0;

                $scope.model.Titulo = '';
                $scope.model.Descripcion = '';
                $scope.model.ImagenURL = '';
                $scope.model.IdArea = '';
                $scope.model.IdNivelAcademico = 0;
                $scope.model.FechaCierreOferta = '';
                $scope.model.IdJornada = '';
                $scope.model.Publicado = true;
                $scope.model.Activo = true;
                $scope.model.IdIdioma = 0;
                $scope.model.IdPais = 0;
                $scope.model.IdZona1 = 0;

                $scope.idiomaLabel = '';
                $scope.areaLabel = '';
                $scope.paisLabel = '';

                //Catalogos
                $scope.Idiomas = {};
                $scope.Paises = {};
                $scope.JornadaLaboral = {};
                $scope.GradoAcademico = {};
                $scope.Areas = {};

                //paso1
                $scope.show1 = false;
                $scope.show2 = false;
                $scope.show3 = false;
                $scope.show4 = false;
                $scope.show5 = false;
                $scope.show6 = false;

                //Paso2
                $scope.show7 = false;

                //Paso3
                $scope.show8 = false;

                //Pasos
                $scope.StepOne = true;
                $scope.StepTwo = false;
                $scope.StepThree = false;
                $scope.StepFour = false;

                $scope.getZona = function () {
                    var data = {
                        id: { value: $scope.model.IdPais }
                    }

                    getWebApi(data, ApiService.Zona1Get,
                        function (response) {
                            $scope.Zona1 = response.Lista;
                        }
                    )

                }

                $scope.getGradoAcademico = function () {
                    getWebApi({}, ApiService.GradoAcademicoGet,
                        function (response) {
                            $scope.GradoAcademico = response.Lista;
                        })
                }

                $scope.getPaises = function () {
                    var decode = Utils.decodeJWT();

                    var data = {
                        id: { value: decode.UserId }
                    }

                    getWebApi(data, ApiService.GetPais,
                        function (response) {
                            $scope.Paises = response.Lista;
                        })
                }

                $scope.getIdiomas = function () {

                    getWebApi({}, ApiService.getIdioma,
                        function (response) {
                            $scope.Idiomas = response.Lista;
                        }
                    )
                }

                $scope.getJornadaLaboral = function () {

                    getWebApi({}, ApiService.JornadaLaboralGet,
                        function (response) {
                            $scope.JornadaLaboral = response.Lista;
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

                $scope.GetLabelFromGrado = function (value, model) {
                    if (!model) return;

                    for (var i = 0; i < model.length; i++) {
                        var _value = model[i].IdNivelAcademico;
                        if (_value === value) {
                            return model[i].Descripcion;
                        }
                    }
                };

                $scope.GetLabelFromJornada = function (value, model) {
                    if (!model) return;

                    for (var i = 0; i < model.length; i++) {
                        var _value = model[i].IdJornada;
                        if (_value === value) {
                            return model[i].Descripcion;
                        }
                    }
                };

                $scope.GetDate = function (value) {
                    var date = new Date(value);
                    return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
                };

                $scope.SavePuesto = function () {
                    var Idiomas = $scope.GetValues('NivelIdioma', ['IdIdioma', 'Porcentaje']);
                    var requisitos = $scope.GetValuesRequisitos('Puestorequisito', ['Descripcion']);
                    var IdiomaObj = [];
                    var PaisesObj = [];
                    var TipoJornadas = [];
                    for (var i = 0; i < Idiomas.length; i++) {

                        var obj =
                        {
                            IdPuesto: 0,
                            IdIdioma: Idiomas[i].IdIdioma,
                            Porcentaje: Idiomas[i].Porcentaje,
                            Borrado: false
                        }
                        IdiomaObj.push(obj)
                    }

                    //var paises = Utils.getValCheckEdit('pais', 'IdPais');

                    //for (var i = 0; i < paises.length; i++) {

                    var obj =
                    {
                        IdPuesto: 0,
                        IdPais: $scope.model.IdPais,//paises[i].IdPais,
                        Borrado: false
                    }
                    PaisesObj.push(obj);
                    //}

                    TipoJornadas.push({
                        IdPuesto: 0,
                        IdJornada: $scope.model.IdJornada,
                        Borrado: false
                    });
                    var Areas = Utils.getValCheckEdit('areas', 'IdArea');
                    $scope.model.IdArea = Areas[0].IdArea;

                    var data =
                    {
                        PuestoInfo:
                        {
                            IdPuesto: $scope.model.IdPuesto,
                            Titulo: $scope.model.Titulo,
                            Descripcion: $scope.model.Descripcion,
                            ImagenURL: '',
                            IdArea: $scope.model.IdArea,
                            IdNivelAcademico: $scope.model.IdNivelAcademico,
                            FechaCierreOferta: $scope.model.FechaCierreOferta,
                            Publicado: $scope.model.Publicado,
                            Activo: $scope.model.Activo,
                            IdZona1: $scope.model.IdZona1
                        },
                        Idiomas: IdiomaObj,
                        TipoJornadas: TipoJornadas,
                        Puestos_Paises_BAC: PaisesObj,
                        Postulantes: [],
                        Ferias: [],
                        Requisitos: requisitos
                    };

                    postWebApi(data, ApiService.PuestosSave, function (response) {
                        if (response.Resultado) {
                            Utils.MessageBox(
                                'Puesto actualizado correctamente',
                                'Puesto actualizado correctamente',
                                'La información del puesto ha sido actualizada en nuestra base de datos.',
                                "Content/Images/IconoConfimacion1.png",
                                function () {
                                    window.location = __env.baseUrl + 'Puesto/FiltrarPuestos'
                                    this.modal('hide');

                                    $('#popupLoading').modal('hide');
                                }
                            );
                        } else {
                            Utils.MessageBox(
                                'Actualización puesto',
                                'Actualización puesto',
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
                        Id: data.PuestoInfo.IdPuesto
                    }

                    RESTService.doPost(table, entity)
                        .then(callback);
                }


                $scope.getPuesto = function () {

                    var id = Utils.getUrlParameter('IdPuesto');
                    //$scope.modal.IdPuesto = id;
                    var data = {
                        id: { value: id }
                    };

                    getWebApi(data, ApiService.PuestosGet,
                        function (response) {

                            if (response.Resultado) {
                                $scope.dataCargada = response.Objeto;

                                //$scope.$apply(function () {
                                $scope.model.IdPuesto = $scope.dataCargada.PuestoInfo.IdPuesto;
                                $scope.model.Titulo = $scope.dataCargada.PuestoInfo.Titulo;
                                $scope.model.Descripcion = $scope.dataCargada.PuestoInfo.Descripcion;
                                $scope.model.ImagenURL = '';
                                $scope.model.IdArea = $scope.dataCargada.PuestoInfo.IdArea;
                                $scope.model.IdNivelAcademico = $scope.dataCargada.PuestoInfo.IdNivelAcademico;
                                var d = new Date($scope.dataCargada.PuestoInfo.FechaCierreOferta);
                                $scope.model.FechaCierreOferta = d;
                                $scope.model.IdJornada = $scope.dataCargada.TipoJornadas[0].IdJornada;
                                $scope.model.Publicado = $scope.dataCargada.PuestoInfo.Publicado;
                                $scope.model.Activo = $scope.dataCargada.PuestoInfo.Activo;

                                $scope.CargarReapeter($scope.dataCargada.Idiomas);

                                $scope.CargarReapeterRequisitos($scope.dataCargada.Requisitos);

                                $("input[name=areas]").each(function () {
                                    var value = $(this).val();
                                    var result = false;

                                    if (value == $scope.dataCargada.PuestoInfo.IdArea) {
                                        result = true;
                                    }
                                    $(this).prop('checked', result);
                                    $(this).prop('value', result);

                                });

                                $scope.model.IdPais = $scope.dataCargada.Puestos_Paises_BAC[0].IdPais;

                                $scope.getZona();

                                $scope.model.IdZona1 = $scope.dataCargada.PuestoInfo.IdZona1;

                                /*$("input[name=pais]").each(function () {
                                    var value = $(this).val();
                                    var result = $scope.dataCargada.Puestos_Paises_BAC.any(function (x) {
                                        return x.IdPais == value
                                    });
                                    $(this).prop('checked', result);
                                    $(this).prop('value', result);

                                });*/

                                // });
                            } else {
                                Utils.MessageBox(
                                    'Mantenimiento Puesto',
                                    'Puesto',
                                    response.Mensaje,
                                    "Content/Images/IconoErrorGeneral.png",
                                    function () {
                                        $('#popupLoading').modal('hide');
                                        this.modal('hide');
                                    }
                                );
                            }
                        }
                    )
                }

                $scope.contador = 0;

                $scope.AgregarIdioma = function () {
                    var Idiomas = $scope.GetValues('NivelIdioma', ['IdIdioma', 'Porcentaje']);
                    if (!$scope.chkDuplicates(Idiomas, true)) {
                        $scope.AgregarNodo('NivelIdioma', $scope.contador);
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
                    $('#txtIdioma' + i).val(value.IdIdioma).change();
                    $('#selNivel' + i).val(value.Porcentaje).change();
                }

                $scope.AgregarNodo = function (id, i) {
                    var html = '<div id="pnlRepeatNivelIdioma' + i + '">';
                    html += '       <div  class="row">';
                    html += '           <div id="div_' + i + '" class="col-sm-10 col-10 pnlRepeatNivelIdioma' + i + '">';
                    html += '               <select id="txtIdioma' + i + '">';
                    html += '                   <option disabled selected value="">Idioma</option>';
                    $.each($scope.Idiomas, function (index, idioma) {
                        html += '               <option value="' + idioma.IdIdioma + '" ng-value="' + idioma.IdIdioma + '">' + idioma.Descripcion + '</option>';
                    });
                    html += '               </select>';
                    html += '               <select id="selNivel' + i + '">';
                    html += '                   <option disabled selected value="">Nivel</option>';
                    html += '                   <option value="0">Bajo</option>';
                    html += '                   <option value="50">Intermedio</option>';
                    html += '                   <option value="100">Alto</option>';
                    html += '               </select>';
                    html += '           </div>';
                    html += '           <div class="col-sm-2 col-2"> ';
                    html += '               <img id="borrador' + i + '" src = "' + __env.baseUrl + 'Content/Images/Basurero.png" class="imgLetraContenido punteroSelector" /> ';
                    html += '           </div>';
                    html += '       </div>';
                    html += ' </div> ';

                    $('#' + id).append(html);

                    $('#borrador' + i).on('click', function () {
                        $('#pnlRepeatNivelIdioma' + i).remove();
                    });

                    $scope.contador = $scope.contador + 1;
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

                $scope.contadorRequisitos = 0;

                $scope.AgregarRequisitos = function () {
                    var requisitos = $scope.GetValuesRequisitos('Puestorequisito', ['Descripcion']);
                    if (!$scope.chkDuplicates(requisitos, true)) {
                        $scope.AgregarNodoRequisitos('Puestorequisito', $scope.contadorRequisitos);
                        $scope.RepeticionRequisitos = false;
                    } else {
                        $scope.RepeticionRequisitos = true;
                    }
                }

                $scope.CargarReapeterRequisitos = function (list) {
                    $.each(list, function (index, value) {
                        $scope.AgregarNodoRequisitosWithValue('Puestorequisito', index, value);
                    });
                }

                $scope.AgregarNodoRequisitosWithValue = function (id, i, value) {
                    $scope.AgregarNodoRequisitos(id, i);
                    $('#txtRequisito' + i).val(value.Descripcion);
                }

                $scope.AgregarNodoRequisitos = function (id, i) {
                    var html = '<div id="pnlRepeatRequisitos' + i + '">';
                    html += '       <div  class="row">';
                    html += '           <div id="divR_' + i + '" class="col-sm-10 col-10 pnlRepeatRequisitos' + i + '">';
                    html += '               <input id="txtRequisito' + i + '" type="text" placeholder="Requisito" class="LetrasContenido" />';
                    html += '           </div>';
                    html += '           <div class="col-sm-2 col-2"> ';
                    html += '               <img id="borradorR' + i + '" src = "' + __env.baseUrl + 'Content/Images/Basurero.png" class="imgLetraContenido punteroSelector" /> ';
                    html += '           </div>';
                    html += '       </div>';
                    html += ' </div> ';

                    $('#' + id).append(html);

                    $('#borradorR' + i).on('click', function () {
                        $('#pnlRepeatRequisitos' + i).remove();
                    });

                    $scope.contadorRequisitos = $scope.contadorRequisitos + 1;
                }

                $scope.RemoveElementRequisitos = function (param) {
                    $("#" + param).remove();
                }

                // Aqui termina tavito que esta cansado. :s
                $scope.GetValuesRequisitos = function (container, mapper) {
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
                                    variable += mapper[0] + ":'" + e.value + "'";
                                }
                            }
                        });
                        variable += "},"
                        //if (variable != '{}') {
                        //    arrObj.push(eval(variable));
                        //}

                    });

                    variable = variable.substring(0, variable.length - 1) + ']';
                    arrObj = eval(variable);
                    return arrObj;
                }

                //Soy Chonga
                $scope.ValidateStepOne = function () {
                    var result = true;
                    if ($scope.model.Titulo == '') {
                        $scope.show1 = true;
                        result = false;
                    }

                    if ($scope.model.Descripcion == '') {
                        $scope.show2 = true;
                        result = false;
                    }

                    if ($scope.model.IdNivelAcademico == '' || $scope.model.IdNivelAcademico == null) {
                        $scope.show3 = true;
                        result = false;
                    }

                    if ($scope.model.IdJornada == '' || $scope.model.IdJornada == null) {
                        $scope.show4 = true;
                        result = false;
                    }

                    if ($scope.model.FechaCierreOferta == '') {
                        $scope.show5 = true;
                        result = false;
                    }

                    var Idiomas = $scope.GetValues('NivelIdioma', ['IdIdioma', 'Porcentaje']);//$scope.GetValues('NivelIdioma', ['IdIdioma']);
                    if (!$scope.chkDuplicates(Idiomas, true)) {
                        if (Idiomas.length <= 0) {
                            $scope.show6 = true;
                            result = false;
                        }
                        $scope.RepeticionIdioma = false;
                    } else {
                        $scope.RepeticionIdioma = true;
                        result = false;
                    }

                    var requisitos = $scope.GetValuesRequisitos('Puestorequisito', ['Descripcion']);
                    if (!$scope.chkDuplicates(requisitos, true)) {
                        if (requisitos.length <= 0) {
                            $scope.show61 = true;
                            result = false;
                        }
                        $scope.RepeticionRequisitos = false;
                    } else {
                        $scope.RepeticionRequisitos = true;
                        result = false;
                    }

                    if (result) {
                        $scope.LimpiarShowStep1();
                    }

                    return result;
                }
                //Metodos Chonga
                $scope.LimpiarShowStep1 = function () {
                    $scope.show1 = false;
                    $scope.show2 = false;
                    $scope.show3 = false;
                    $scope.show4 = false;
                    $scope.show5 = false;
                    $scope.show6 = false;
                    $scope.show61 = false;
                }

                $scope.ValidateStepTwo = function () {
                    var result = true;
                    var Areas = Utils.getValCheckEdit('areas', 'IdArea');

                    if (Areas.length <= 0) {
                        $scope.show7 = true;
                        result = false;
                    }

                    if (result) {
                        $scope.show7 = false;
                    }

                    return result;
                }

                $scope.ValidateStepThree = function () {
                    var result = true;

                    var paises = Utils.getValCheckEdit('pais', 'IdPais');

                    if (paises.length <= 0) {
                        $scope.show8 = true;
                        result = false;
                    }

                    if (result) {
                        $scope.show8 = false;
                    }

                    return result;
                }

                $scope.ChangeStep = function () {
                    var completado = $scope.ValidateStepOne();
                    if ($scope.StepOne == true && $scope.StepTwo == false && $scope.StepThree == false && $scope.StepFour == false && completado) {
                        $scope.StepOne = false;
                        $scope.StepTwo = true;
                        $scope.StepThree = false;
                        $scope.StepFour = false;
                        $('#divStepTwo').removeClass('Secundario').addClass('Primaria');
                        $('#circuloStepTwo').removeClass('CirculoSecundario').addClass('CirculoPrimario');
                        $('#textStepTwo').removeClass('textoSecundario').addClass('textoPrimario');
                        completado = $scope.ValidateStepTwo();

                    } else if ($scope.StepOne == false && $scope.StepTwo == true && $scope.StepThree == false && $scope.StepFour == false && completado) {
                        $scope.StepOne = false;
                        $scope.StepTwo = false;
                        $scope.StepThree = true;
                        $scope.StepFour = false;
                        $('#divStepThree').removeClass('Secundario').addClass('Primaria');
                        $('#circuloStepThree').removeClass('CirculoSecundario').addClass('CirculoPrimario');
                        $('#textStepThree').removeClass('textoSecundario').addClass('textoPrimario');
                        completado = $scope.ValidateStepThree();

                    } else if ($scope.StepOne == false && $scope.StepTwo == false && $scope.StepThree == true && $scope.StepFour == false && completado) {
                        $scope.StepOne = false;
                        $scope.StepTwo = false;
                        $scope.StepThree = false;
                        $scope.StepFour = true;
                        $('#divStepFour').removeClass('Secundario').addClass('Primaria');
                        $('#circuloStepFour').removeClass('CirculoSecundario').addClass('CirculoPrimario');
                        $('#textStepFour').removeClass('textoSecundario').addClass('textoPrimario');

                        var Areas = Utils.getValCheckEdit('areas', 'IdArea');
                        $scope.model.IdArea = Areas[0].IdArea;
                        $scope.areaLabel = $scope.Areas.where(function (x) { return x.IdArea == $scope.model.IdArea }).select(function (x) { return x.Area });
                        var Idiomas = $scope.GetValues('NivelIdioma', ['IdIdioma', 'Porcentaje']);

                        for (var i = 0; i < Idiomas.length; i++) {
                            $scope.idiomaLabel += $scope.Idiomas.where(function (x) { return x.IdIdioma == Idiomas[i].IdIdioma }).select(function (x) { return x.Descripcion }) + ',';
                        }

                        var paises = Utils.getValCheckEdit('pais', 'IdPais');

                        for (var i = 0; i < paises.length; i++) {
                            $scope.paisLabel += $scope.Paises.where(function (x) { return x.IdPais == paises[i].IdPais }).select(function (x) { return x.Descripcion }) + ',';
                        }

                        $('#btnContinuar').val('Guardar');
                    } else if ($scope.StepOne == false && $scope.StepTwo == false && $scope.StepThree == false && $scope.StepFour == true) {
                        $scope.SavePuesto();
                    }
                    $("html, body").animate({ scrollTop: 0 }, 600);
                }

                $scope.ReturnStep = function () {
                    $('#btnContinuar').val('Siguiente');
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
                        window.location = __env.baseUrl + 'Puesto/FiltrarPuestos';
                    }
                    $("html, body").animate({ scrollTop: 0 }, 600);
                }

                $scope.Volver = function () {
                    window.location = __env.baseUrl + 'Puesto/VerPuesto?IdPuesto=' + $scope.model.IdPuesto;
                }

                $scope.SeguridadJS = function () {
                    var lista = JSON.parse(sessionStorage.getItem("role"));
                    if (lista != null) {
                        var listaJs = lista.where(function (x) { return x.TipoAccionId == 3 && x.ReferenciasAux == 'puestosEditController'; });

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


'use strict';

(function () {
    angular
        .module('BacApp.controllers.Reportes', [])
        .controller('ReportesController',
            function ($scope, $log, RESTService, __env) {
                $scope.model = {};
                $scope.model.Administrador = '';
                $scope.model.pais = '';
                $scope.model.Periodo = '';
                $scope.model.FechaInicio = '';
                $scope.model.FechaFinal = '';
                $scope.model.Genero = '';
                $scope.model.PaisRecidencia = '';
                $scope.model.Idiomas = [];
                $scope.model.porcentaje = '';
                $scope.model.Estado = [];
                $scope.model.Discapacidades = [];
                $scope.model.Paises = [];

                $scope.Paises = {};
                $scope.Estados = {};
                $scope.Idiomas = {};
                $scope.Discapacidades = {};

                $scope.show1 = true;
                $scope.show2 = false;
                $scope.show3 = true;
                $scope.show4 = false;

                $scope.step1Class = 'tapSelect';
                $scope.step2Class = 'taps';
                $scope.step3Class = 'tapSelect2';
                $scope.step4Class = 'taps2';

                var getWebApi = function (data, table, callback) {

                    //Utils.Show();
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

                $scope.changestep1 = function () {
                    $scope.show1 = true;
                    $scope.show2 = false;
                    $scope.step1Class = 'tapSelect';
                    $scope.step2Class = 'taps';
                }

                $scope.changestep2 = function () {
                    $scope.show1 = false;
                    $scope.show2 = true;
                    $scope.step1Class = 'taps';
                    $scope.step2Class = 'tapSelect';
                }

                $scope.changestep3 = function () {
                    $scope.show3 = true;
                    $scope.show4 = false;
                    $scope.step3Class = 'tapSelect2';
                    $scope.step4Class = 'taps2';
                    $('#imgEstadistica').attr('src', __env.baseUrl + 'Content/Images/IconoReportesEstadisticaRojo.png');
                    $('#imgAplicantes').attr('src', __env.baseUrl + 'Content/Images/IconoReportesAplicantes.png');
                }

                $scope.changestep4 = function () {
                    $scope.show3 = false;
                    $scope.show4 = true;
                    $scope.step3Class = 'taps2';
                    $scope.step4Class = 'tapSelect2';
                    $('#imgEstadistica').attr('src', __env.baseUrl + 'Content/Images/IconoReportesEstadistica.png');
                    $('#imgAplicantes').attr('src', __env.baseUrl + 'Content/Images/IconoReportesAplicantesRojo.png');
                }

                $scope.LoadGrid = function () {
                    var width = Utils.GetWidthWindow();
                    var decode = Utils.decodeJWT();

                    var paises = eval(decode.PaisesFiltro);

                    var data = {
                        IdPaisAplicacion: { value: paises, cond: OConfig.condLike, type: OTypes.string, comp: '||' }
                    };

                    if (width <= 764) {
                        Utils.getGrid(ApiService.ReportesListaPostulanteReporte, data, 'Lista', ['', '', ''], 'ColumnMobile1,ColumnMobile2', $scope.Redirect, 5, 'totalGrid', 'IdPostulante,email', 'IdPostulante', 'desc','IdPostulante');
                    }
                    else {
                        Utils.getGrid(ApiService.ReportesListaPostulanteReporte, data, 'Lista', ['Nombre', 'País', 'Edad', 'Aplicaciones', 'Ver'], 'NombreCompleto,Pais,Edad,Aplicaciones', $scope.Redirect, 5, 'totalGrid', 'IdPostulante,email', 'IdPostulante', 'desc','IdPostulante');
                    }

                }


                $scope.FilterGrid = function () {
                    var width = Utils.GetWidthWindow();
                    var decode = Utils.decodeJWT();

                    var paises = eval(decode.PaisesFiltro);

                    var data = {};
                    $scope.model.Idiomas = Utils.getValCheck('idioma');
                    $scope.model.Estado = Utils.getValCheck('estado');
                    $scope.model.Discapacidades = Utils.getValCheck('discapacidad');
                    $scope.model.Paises = Utils.getValCheck('pais');

                    if ($scope.model.Paises.length == 0)
                    {
                        $scope.model.Paises = paises;
                    }
                    if ($scope.model.Genero != '' && $scope.model.Genero != null )
                    {
                        var genero = true;

                        if ($scope.model.Genero == "0")
                        {
                            genero = false;
                        }

                        data.Genero = { value: genero, cond: OConfig.condEquals, type: OTypes.default, comp: '||' };
                    }

                    if ($scope.model.porcentaje != '' && $scope.model.porcentaje != null && $scope.model.porcentaje != 0) {
                        data.Porcentaje = { value: $scope.model.porcentaje, cond: OConfig.condLike, type: OTypes.string, comp: '||' };
                    }

                    if ($scope.model.PaisResidencia != '' && $scope.model.PaisResidencia != null && $scope.model.PaisResidencia != 0) {
                        data.PaisResidencia= { value: $scope.model.PaisRecidencia, cond: OConfig.condEquals, type: OTypes.default, comp: '||' };
                    }

                    if ($scope.model.Paises.length > 0)
                    {
                        data.IdPaisAplicacion = { value: $scope.model.Paises, cond: OConfig.condLike, type: OTypes.string, comp: '||' };
                    }
                    if ($scope.model.Estado.length > 0)
                    {
                        data.IdEstadoPerfil = { value: $scope.model.Estado, cond: OConfig.condLike, type: OTypes.string, comp: '||' };
                    }
                    if ($scope.model.Discapacidades.length > 0)
                    {
                        data.IdDiscapacidad = { value: $scope.model.Discapacidades, cond: OConfig.condLike, type: OTypes.string, comp: '||' };
                    }
                    if ($scope.model.Idiomas.length > 0)
                    {
                        data.IdIdioma = { value: $scope.model.Idiomas, cond: OConfig.condLike, type: OTypes.string, comp: '||' };
                    }
                      
                    if (width <= 764) {
                        Utils.getGrid(ApiService.ReportesListaPostulanteReporte, data, 'Lista', ['', '', ''], 'ColumnMobile1,ColumnMobile2', $scope.Redirect, 5, 'totalGrid', 'IdPostulante,email', 'IdPostulante', 'desc');
                    }
                    else {
                        Utils.getGrid(ApiService.ReportesListaPostulanteReporte, data, 'Lista', ['Nombre', 'País', 'Edad', 'Aplicaciones', 'Ver'], 'NombreCompleto,Pais,Edad,Aplicaciones', $scope.Redirect, 5, 'totalGrid', 'IdPostulante,email', 'IdPostulante', 'desc');
                    }

                }

                $scope.Redirect = function (param) {
                    window.location = __env.baseUrl + '/Postulante/VerPerfil?IdPostulante=' + param.email;
                }

                $scope.getPaises = function () {
                    var decode = Utils.decodeJWT();

                    var data = {
                        id: { value: decode.UserId }
                    }

                    getWebApi(data, ApiService.GetPais,
                        function (response) {
                            $scope.Paises = response.Lista;
                        })
                }

                $scope.getIdiomas = function () {

                    getWebApi({}, ApiService.getIdioma,
                        function (response) {
                            $scope.Idiomas = response.Lista;
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

                $scope.getEstados = function () {

                    getWebApi({}, ApiService.GetEstadoPerfil,
                        function (response) {
                            $scope.Estados = response.Lista;
                        }
                    )
                }
                
                $scope.getAdministradores = function () {

                    var data = {
                        idPais: { value: ($scope.model.pais == '' || $scope.model.pais == null) ? 0 : $scope.model.pais }
                    }

                    getWebApi(data, ApiService.ReportesUsuariosPorPais,
                        function (response) {
                            $scope.Administradores = response.Lista;
                        })
                }

                $scope.Cargar = function () {
                    $scope.Grafico1Aplicantes();
                    $scope.Grafico2Aplicantes();
                    $scope.Grafico3Aplicantes();
                    $scope.Grafico4Aplicantes();
                    $scope.Grafico5Aplicantes();
                    $scope.Grafico6Aplicantes();
                }

                $scope.DefinirFecha = function () {
                    switch (+$scope.model.Periodo) {
                        case 1: {
                            $('#divFechaInicial').addClass('hidden');
                            $('#divFechaFinal').addClass('hidden');
                            var fin = new Date();
                            var inicio = fin.setDate(fin.getDate() - 30);
                            $scope.model.FechaInicio = inicio;
                            $scope.model.FechaFinal = fin;
                            break;
                        }
                        case 2: {
                            $('#divFechaInicial').addClass('hidden');
                            $('#divFechaFinal').addClass('hidden');
                            var date = new Date();
                            var primerDia = new Date(date.getFullYear(), (date.getMonth() - 1), 1);
                            var ultimoDia = new Date(date.getFullYear(), (date.getMonth() - 1) + 1, 0);
                            $scope.model.FechaInicio = primerDia;
                            $scope.model.FechaFinal = ultimoDia;
                            break;
                        }
                        case 3: {
                            $('#divFechaInicial').removeClass('hidden');
                            $('#divFechaFinal').removeClass('hidden');
                            break;
                        }
                        default: {
                            var d = new Date();
                            $scope.model.FechaInicio = d;
                            $scope.model.FechaFinal = d;
                        }
                    }
                }

                $scope.AplicarFiltroAplicantes = function () {
                    $scope.model.Idiomas = Utils.getValCheck('idioma');
                    $scope.model.Estado = Utils.getValCheck('estado');
                    $scope.model.Discapacidades = Utils.getValCheck('discapacidad');
                    $scope.model.Paises = Utils.getValCheck('pais');
                    $scope.FilterGrid();
                    $scope.Cargar();
                }

                $scope.DehacerFiltroAplicante = function () {
                    $scope.model.Periodo = '';
                    $scope.model.FechaInicio = '';
                    $scope.model.FechaFinal = '';
                    $scope.model.Genero = '';
                    $scope.model.PaisRecidencia = '';
                    $scope.getPaises();
                    $scope.getIdiomas();
                    $scope.DiscapacidadGet();
                    $scope.getEstados();
                    $scope.LoadGrid();
                    $scope.Cargar();
                }

                $scope.Grafico1Aplicantes = function () {
                    var xfechaInicio = ($scope.model.FechaInicio == '' ? null : $scope.model.FechaInicio);
                    var xfechaFinal = ($scope.model.FechaFinal == '' ? null : $scope.model.FechaFinal);
                    var xpaises = ($scope.model.Paises.length == 0 ? null : $scope.model.Paises.join());
                    var xestados = ($scope.model.Estado.length == 0 ? null : $scope.model.Estado.join());
                    var xidiomas = ($scope.model.Idiomas.length == 0 ? null : $scope.model.Idiomas.join());
                    var xporcentajeIdioma = ($scope.model.porcentaje == '' ? null : $scope.model.porcentaje);
                    var xdiscapacidades = ($scope.model.Discapacidades.length == 0 ? null : $scope.model.Discapacidades.join());
                    var xsexo = ($scope.model.Genero == '' ? null : (+$scope.model.Genero == 0 ? false : true));
                    var xpaisRecidencia = ($scope.model.PaisRecidencia == '' ? null : $scope.model.PaisRecidencia);

                    var data = {
                        fechaInicio: { value: xfechaInicio },
                        fechaFinal: { value: xfechaFinal },
                        paises: { value: xpaises },
                        estados: { value: xestados },
                        idiomas: { value: xidiomas },
                        porcentajeIdioma: { value: xporcentajeIdioma },
                        discapacidades: { value: xdiscapacidades },
                        sexo: { value: xsexo },
                        paisRecidencia: { value: xpaisRecidencia }
                    }

                    getWebApi(data, ApiService.ReporteInteresadosPorPais,
                        function (response) {
                            //$scope.Administradores = response.Lista;
                            var datosChart = [];
                            var total = 0;
                            $.each(response.Lista, function (index, value) {
                                total += +value.Cantidad;
                                datosChart.push([value.Pais, +value.Cantidad]);
                            });

                            $('#totalGrafico1Aplicante').html(total);

                            google.charts.load("current", { packages: ['corechart'] });
                            google.charts.setOnLoadCallback(drawChart);
                            function drawChart() {
                                var data = new google.visualization.DataTable();
                                data.addColumn('string', 'Pais');
                                data.addColumn('number', 'Aplicantes');
                                data.addRows(datosChart);
                                var options = {
                                    title: '',
                                    legend: { position: "none" },
                                    displayExactValues: true,
                                    vAxis: {
                                        title: "Aplicantes"
                                    }
                                };

                                var chart_div = document.getElementById("Grafico1Aplicante");
                                var chart = new google.visualization.ColumnChart(chart_div);

                                google.visualization.events.addListener(chart, 'ready', function () {                                    
                                    $('#png_Grafico1Aplicante').attr('href', chart.getImageURI());
                                    $('#png_Grafico1Aplicante').addClass('link float-right');
                                    var href = $('#png_Grafico1Aplicante').html();
                                    if (href == '') {
                                        $('#png_Grafico1Aplicante').html('<span class="mdi mdi-download mdi-24px"></span>Descargar');
                                    }
                                });

                                chart.draw(data, options);
                            }
                        });
                }
                $scope.Grafico2Aplicantes = function () {
                    var xfechaInicio = ($scope.model.FechaInicio == '' ? null : $scope.model.FechaInicio);
                    var xfechaFinal = ($scope.model.FechaFinal == '' ? null : $scope.model.FechaFinal);
                    var xpaises = ($scope.model.Paises.length == 0 ? null : $scope.model.Paises.join());
                    var xestados = ($scope.model.Estado.length == 0 ? null : $scope.model.Estado.join());
                    var xidiomas = ($scope.model.Idiomas.length == 0 ? null : $scope.model.Idiomas.join());
                    var xporcentajeIdioma = ($scope.model.porcentaje == '' ? null : $scope.model.porcentaje);
                    var xdiscapacidades = ($scope.model.Discapacidades.length == 0 ? null : $scope.model.Discapacidades.join());
                    var xsexo = ($scope.model.Genero == '' ? null : (+$scope.model.Genero == 0 ? false : true));
                    var xpaisRecidencia = ($scope.model.PaisRecidencia == '' ? null : $scope.model.PaisRecidencia);

                    var data = {
                        fechaInicio: { value: xfechaInicio },
                        fechaFinal: { value: xfechaFinal },
                        paises: { value: xpaises },
                        estados: { value: xestados },
                        idiomas: { value: xidiomas },
                        porcentajeIdioma: { value: xporcentajeIdioma },
                        discapacidades: { value: xdiscapacidades },
                        sexo: { value: xsexo },
                        paisRecidencia: { value: xpaisRecidencia }
                    }

                    getWebApi(data, ApiService.ReporteAplicantesPorArea,
                        function (response) {
                            //$scope.Administradores = response.Lista;
                            var datosChart = [];
                            var total = 0;
                            $.each(response.Lista, function (index, value) {
                                total += +value.Cantidad;
                                datosChart.push([value.Area, +value.Cantidad]);
                            });

                            $('#totalGrafico2Aplicante').html(total);

                            google.charts.load("current", { packages: ['corechart'] });
                            google.charts.setOnLoadCallback(drawChart);
                            function drawChart() {
                                var data = new google.visualization.DataTable();
                                data.addColumn('string', 'Area');
                                data.addColumn('number', 'Aplicantes');
                                data.addRows(datosChart);
                                var options = {
                                    title: '',
                                    pieHole: 0.35
                                    //legend: { position: "bottom", maxLines: 8, alignment: 'center' }
                                };

                                var chart_div = document.getElementById("Grafico2Aplicante");
                                var chart = new google.visualization.PieChart(chart_div);

                                google.visualization.events.addListener(chart, 'ready', function () {
                                    $('#png_Grafico2Aplicante').attr('href', chart.getImageURI());
                                    $('#png_Grafico2Aplicante').addClass('link float-right');
                                    var href = $('#png_Grafico2Aplicante').html();
                                    if (href == '') {
                                        $('#png_Grafico2Aplicante').html('<span class="mdi mdi-download mdi-24px"></span>Descargar');
                                    }
                                });

                                chart.draw(data, options);
                            }
                        });
                }

                $scope.Grafico3Aplicantes = function () {
                    var xfechaInicio = ($scope.model.FechaInicio == '' ? null : $scope.model.FechaInicio);
                    var xfechaFinal = ($scope.model.FechaFinal == '' ? null : $scope.model.FechaFinal);
                    var xpaises = ($scope.model.Paises.length == 0 ? null : $scope.model.Paises.join());
                    var xestados = ($scope.model.Estado.length == 0 ? null : $scope.model.Estado.join());
                    var xidiomas = ($scope.model.Idiomas.length == 0 ? null : $scope.model.Idiomas.join());
                    var xporcentajeIdioma = ($scope.model.porcentaje == '' ? null : $scope.model.porcentaje);
                    var xdiscapacidades = ($scope.model.Discapacidades.length == 0 ? null : $scope.model.Discapacidades.join());
                    var xsexo = ($scope.model.Genero == '' ? null : (+$scope.model.Genero == 0 ? false : true));
                    var xpaisRecidencia = ($scope.model.PaisRecidencia == '' ? null : $scope.model.PaisRecidencia);

                    var data = {
                        fechaInicio: { value: xfechaInicio },
                        fechaFinal: { value: xfechaFinal },
                        paises: { value: xpaises },
                        estados: { value: xestados },
                        idiomas: { value: xidiomas },
                        porcentajeIdioma: { value: xporcentajeIdioma },
                        discapacidades: { value: xdiscapacidades },
                        sexo: { value: xsexo },
                        paisRecidencia: { value: xpaisRecidencia }
                    }

                    getWebApi(data, ApiService.ReporteAplicantesPorEstado,
                        function (response) {
                            //$scope.Administradores = response.Lista;
                            var datosChart = [];
                            var total = 0;
                            $.each(response.Lista, function (index, value) {
                                total += +value.Cantidad;
                                datosChart.push([value.Estado, +value.Cantidad]);
                            });

                            $('#totalGrafico3Aplicante').html(total);

                            google.charts.load("current", { packages: ['corechart'] });
                            google.charts.setOnLoadCallback(drawChart);
                            function drawChart() {
                                var data = new google.visualization.DataTable();
                                data.addColumn('string', 'Estado');
                                data.addColumn('number', 'Aplicantes');
                                data.addRows(datosChart);
                                var options = {
                                    title: '',
                                    pieHole: 0.35
                                };

                                var chart_div = document.getElementById("Grafico3Aplicante");
                                var chart = new google.visualization.PieChart(chart_div);

                                google.visualization.events.addListener(chart, 'ready', function () {
                                    $('#png_Grafico3Aplicante').attr('href', chart.getImageURI());
                                    $('#png_Grafico3Aplicante').addClass('link float-right');
                                    var href = $('#png_Grafico3Aplicante').html();
                                    if (href == '') {
                                        $('#png_Grafico3Aplicante').html('<span class="mdi mdi-download mdi-24px"></span>Descargar');
                                    }
                                });

                                chart.draw(data, options);
                            }
                        });
                }

                $scope.Grafico4Aplicantes = function () {
                    var xfechaInicio = ($scope.model.FechaInicio == '' ? null : $scope.model.FechaInicio);
                    var xfechaFinal = ($scope.model.FechaFinal == '' ? null : $scope.model.FechaFinal);
                    var xpaises = ($scope.model.Paises.length == 0 ? null : $scope.model.Paises.join());
                    var xestados = ($scope.model.Estado.length == 0 ? null : $scope.model.Estado.join());
                    var xidiomas = ($scope.model.Idiomas.length == 0 ? null : $scope.model.Idiomas.join());
                    var xporcentajeIdioma = ($scope.model.porcentaje == '' ? null : $scope.model.porcentaje);
                    var xdiscapacidades = ($scope.model.Discapacidades.length == 0 ? null : $scope.model.Discapacidades.join());
                    var xsexo = ($scope.model.Genero == '' ? null : (+$scope.model.Genero == 0 ? false : true));
                    var xpaisRecidencia = ($scope.model.PaisRecidencia == '' ? null : $scope.model.PaisRecidencia);

                    var data = {
                        fechaInicio: { value: xfechaInicio },
                        fechaFinal: { value: xfechaFinal },
                        paises: { value: xpaises },
                        estados: { value: xestados },
                        idiomas: { value: xidiomas },
                        porcentajeIdioma: { value: xporcentajeIdioma },
                        discapacidades: { value: xdiscapacidades },
                        sexo: { value: xsexo },
                        paisRecidencia: { value: xpaisRecidencia }
                    }

                    getWebApi(data, ApiService.ReporteAplicantesPorGenero,
                        function (response) {
                            //$scope.Administradores = response.Lista;
                            var datosChart = [];
                            var total = 0;
                            $.each(response.Lista, function (index, value) {
                                total += +value.Cantidad;
                                datosChart.push([value.Genero, +value.Cantidad]);
                            });

                            $('#totalGrafico4Aplicante').html(total);

                            google.charts.load("current", { packages: ['corechart'] });
                            google.charts.setOnLoadCallback(drawChart);
                            function drawChart() {
                                var data = new google.visualization.DataTable();
                                data.addColumn('string', 'Genero');
                                data.addColumn('number', 'Aplicantes');
                                data.addRows(datosChart);
                                var options = {
                                    title: '',
                                    pieHole: 0.35
                                };

                                var chart_div = document.getElementById("Grafico4Aplicante");
                                var chart = new google.visualization.PieChart(chart_div);

                                google.visualization.events.addListener(chart, 'ready', function () {
                                    $('#png_Grafico4Aplicante').attr('href', chart.getImageURI());
                                    $('#png_Grafico4Aplicante').addClass('link float-right');
                                    var href = $('#png_Grafico4Aplicante').html();
                                    if (href == '') {
                                        $('#png_Grafico4Aplicante').html('<span class="mdi mdi-download mdi-24px"></span>Descargar');
                                    }
                                });

                                chart.draw(data, options);
                            }
                        });
                }

                $scope.Grafico5Aplicantes = function () {
                    var xfechaInicio = ($scope.model.FechaInicio == '' ? null : $scope.model.FechaInicio);
                    var xfechaFinal = ($scope.model.FechaFinal == '' ? null : $scope.model.FechaFinal);
                    var xpaises = ($scope.model.Paises.length == 0 ? null : $scope.model.Paises.join());
                    var xestados = ($scope.model.Estado.length == 0 ? null : $scope.model.Estado.join());
                    var xidiomas = ($scope.model.Idiomas.length == 0 ? null : $scope.model.Idiomas.join());
                    var xporcentajeIdioma = ($scope.model.porcentaje == '' ? null : $scope.model.porcentaje);
                    var xdiscapacidades = ($scope.model.Discapacidades.length == 0 ? null : $scope.model.Discapacidades.join());
                    var xsexo = ($scope.model.Genero == '' ? null : (+$scope.model.Genero == 0 ? false : true));
                    var xpaisRecidencia = ($scope.model.PaisRecidencia == '' ? null : $scope.model.PaisRecidencia);

                    var data = {
                        fechaInicio: { value: xfechaInicio },
                        fechaFinal: { value: xfechaFinal },
                        paises: { value: xpaises },
                        estados: { value: xestados },
                        idiomas: { value: xidiomas },
                        porcentajeIdioma: { value: xporcentajeIdioma },
                        discapacidades: { value: xdiscapacidades },
                        sexo: { value: xsexo },
                        paisRecidencia: { value: xpaisRecidencia }
                    }

                    getWebApi(data, ApiService.ReporteAplicantesPorDiscapacidad,
                        function (response) {
                            //$scope.Administradores = response.Lista;
                            var datosChart = [];
                            var total = 0;
                            $.each(response.Lista, function (index, value) {
                                total += +value.Cantidad;
                                datosChart.push([value.Discapacidad, +value.Cantidad]);
                            });

                            $('#totalGrafico5Aplicante').html(total);

                            google.charts.load("current", { packages: ['corechart'] });
                            google.charts.setOnLoadCallback(drawChart);
                            function drawChart() {
                                var data = new google.visualization.DataTable();
                                data.addColumn('string', 'Discapacidad');
                                data.addColumn('number', 'Aplicantes');
                                data.addRows(datosChart);
                                var options = {
                                    title: '',
                                    pieHole: 0.35
                                };

                                var chart_div = document.getElementById("Grafico5Aplicante");
                                var chart = new google.visualization.PieChart(chart_div);

                                google.visualization.events.addListener(chart, 'ready', function () {
                                    $('#png_Grafico5Aplicante').attr('href', chart.getImageURI());
                                    $('#png_Grafico5Aplicante').addClass('link float-right');
                                    var href = $('#png_Grafico5Aplicante').html();
                                    if (href == '') {
                                        $('#png_Grafico5Aplicante').html('<span class="mdi mdi-download mdi-24px"></span>Descargar');
                                    }
                                });

                                chart.draw(data, options);
                            }
                        });
                }

                $scope.Grafico6Aplicantes = function () {
                    var xfechaInicio = ($scope.model.FechaInicio == '' ? null : $scope.model.FechaInicio);
                    var xfechaFinal = ($scope.model.FechaFinal == '' ? null : $scope.model.FechaFinal);
                    var xpaises = ($scope.model.Paises.length == 0 ? null : $scope.model.Paises.join());
                    var xestados = ($scope.model.Estado.length == 0 ? null : $scope.model.Estado.join());
                    var xidiomas = ($scope.model.Idiomas.length == 0 ? null : $scope.model.Idiomas.join());
                    var xporcentajeIdioma = ($scope.model.porcentaje == '' ? null : $scope.model.porcentaje);
                    var xdiscapacidades = ($scope.model.Discapacidades.length == 0 ? null : $scope.model.Discapacidades.join());
                    var xsexo = ($scope.model.Genero == '' ? null : (+$scope.model.Genero == 0 ? false : true));
                    var xpaisRecidencia = ($scope.model.PaisRecidencia == '' ? null : $scope.model.PaisRecidencia);

                    var data = {
                        fechaInicio: { value: xfechaInicio },
                        fechaFinal: { value: xfechaFinal },
                        paises: { value: xpaises },
                        estados: { value: xestados },
                        idiomas: { value: xidiomas },
                        porcentajeIdioma: { value: xporcentajeIdioma },
                        discapacidades: { value: xdiscapacidades },
                        sexo: { value: xsexo },
                        paisRecidencia: { value: xpaisRecidencia }
                    }

                    getWebApi(data, ApiService.ReporteAplicantesPorIdioma,
                        function (response) {
                            //$scope.Administradores = response.Lista;
                            var datosChart = [];
                            var total = 0;
                            $.each(response.Lista, function (index, value) {
                                total += +value.Cantidad;
                                //datosChart.push([value.Idioma, +value.Nivel, +value.Cantidad]);
                                datosChart.push([value.Idioma, +value.Cantidad]);
                            });

                            $('#totalGrafico6Aplicante').html(total);

                            google.charts.load("current", { packages: ['corechart'] });
                            google.charts.setOnLoadCallback(drawChart);
                            function drawChart() {
                                var data = new google.visualization.DataTable();
                                data.addColumn('string', 'Idioma');
                                //data.addColumn('number', 'Nivel');
                                data.addColumn('number', 'Aplicantes');
                                data.addRows(datosChart);
                                var options = {
                                    title: '',
                                    legend: { position: "none" },
                                    displayExactValues: true,
                                    hAxis: {
                                        title: "Aplicantes"
                                    }
                                };

                                var chart_div = document.getElementById("Grafico6Aplicante");
                                var chart = new google.visualization.BarChart(chart_div);

                                google.visualization.events.addListener(chart, 'ready', function () {
                                    $('#png_Grafico6Aplicante').attr('href', chart.getImageURI());
                                    $('#png_Grafico6Aplicante').addClass('link float-right');
                                    var href = $('#png_Grafico6Aplicante').html();
                                    if (href == '') {
                                        $('#png_Grafico6Aplicante').html('<span class="mdi mdi-download mdi-24px"></span>Descargar');
                                    }
                                });

                                chart.draw(data, options);
                            }
                        });
                }

                $scope.AplicarFiltrosPuesto = function () {
                    $('#popupLoading').modal('show');
                    setTimeout(function () { $('#popupLoading').modal('hide'); }, 5000);
                    $('#GraficoPuestoContenedor').removeClass('hidden');
                    //$scope.DeshacerFiltrosPuesto();
                    $scope.Grafico1Puesto();
                    $scope.Grafico2Puesto();
                }

                $scope.DeshacerFiltrosPuesto = function () {
                    $('#GraficoPuestoContenedor').addClass('hidden');
                }

                $scope.Grafico1Puesto = function () {
                    var data = {
                        idPais: { value: $scope.model.pais },
                        idUsuario: { value: $scope.model.Administrador }
                    }

                    getWebApi(data, ApiService.ReporteAplicantesPorPuesto,
                        function (response) {
                            //$scope.Administradores = response.Lista;
                            var datosChart = [];
                            var total = 0;
                            $.each(response.Lista, function (index, value) {
                                total += +value.Cantidad;
                                datosChart.push([value.Titulo, +value.Cantidad]);
                            });

                            $('#totalGrafico1Puesto').html(total);

                            google.charts.load("current", { packages: ['corechart'] });
                            google.charts.setOnLoadCallback(drawChart);
                            function drawChart() {
                                var data = new google.visualization.DataTable();
                                data.addColumn('string', 'Puestos');
                                data.addColumn('number', 'Aplicantes');
                                data.addRows(datosChart);
                                var options = {
                                    title: '',
                                    pieHole: 0.35
                                };

                                var chart_div = document.getElementById("Grafico1Puesto");
                                var chart = new google.visualization.PieChart(chart_div);

                                google.visualization.events.addListener(chart, 'ready', function () {
                                    $('#png_Grafico1Puesto').attr('href', chart.getImageURI());
                                    $('#png_Grafico1Puesto').addClass('link float-right');
                                    var href = $('#png_Grafico1Puesto').html();
                                    if (href == '') {
                                        $('#png_Grafico1Puesto').html('<span class="mdi mdi-download mdi-24px"></span>Descargar');
                                    }
                                });

                                chart.draw(data, options);
                            }
                        });
                }

                $scope.Grafico2Puesto = function () {
                    var data = {
                        idPais: { value: $scope.model.pais },
                        idUsuario: { value: $scope.model.Administrador }
                    }

                    getWebApi(data, ApiService.ReportePuestosActivos,
                        function (response) {
                            //$scope.Administradores = response.Lista;
                            var datosChart = [];
                            var total = 0;
                            $.each(response.Lista, function (index, value) {
                                total += +value.Cantidad;
                                datosChart.push([value.Estado, +value.Cantidad]);
                            });

                            $('#totalGrafico2Puesto').html(total);

                            google.charts.load("current", { packages: ['corechart'] });
                            google.charts.setOnLoadCallback(drawChart);
                            function drawChart() {
                                var data = new google.visualization.DataTable();
                                data.addColumn('string', 'Estado');
                                data.addColumn('number', 'Puestos');
                                data.addRows(datosChart);
                                var options = {
                                    title: '',
                                    pieHole: 0.35
                                };

                                var chart_div = document.getElementById("Grafico2Puesto");
                                var chart = new google.visualization.PieChart(chart_div);

                                google.visualization.events.addListener(chart, 'ready', function () {
                                    $('#png_Grafico2Puesto').attr('href', chart.getImageURI());
                                    $('#png_Grafico2Puesto').addClass('link float-right');
                                    var href = $('#png_Grafico2Puesto').html();
                                    if (href == '') {
                                        $('#png_Grafico2Puesto').html('<span class="mdi mdi-download mdi-24px"></span>Descargar');
                                    }
                                });

                                chart.draw(data, options);
                            }
                        });
                }

                $scope.SeguridadJS = function () {
                    var lista = JSON.parse(sessionStorage.getItem("role"));

                    if (lista != null) {
                        var listaJs = lista.where(function (x) { return x.TipoAccionId == 3 && x.ReferenciasAux == 'ReportesController'; });

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
'use strict';

(function () {
    angular
        .module('BacApp.controllers.Rol', [])
        .controller('RolController',
            function ($scope, $log, RESTService, __env) {

                $scope.model = {};
                $scope.model.IdRol = 0;
                $scope.model.Descripcion = '';
                $scope.model.Borrado = false;
                $scope.model.IsMultipais = false;
                $scope.model.FechaCreacion = new Date();
                $scope.model.Acciones = [];

                $scope.show1 = false;
                $scope.show2 = false;

                var getWebApi = function (data, table, callback) {

                    //Utils.Show();
                    var query = Utils.getFilterParameters(data);
                    RESTService.doGet(table, query)
                        .then(callback);
                }

                var postWebApi = function (data, table, callback) {

                    var entity = {
                        Objeto: data,
                        Lista: [],
                        Token: '',
                        Id: $scope.model.IdRol
                    }

                    RESTService.doPost(table, entity)
                        .then(callback);
                }

                $scope.CargarRol = function () {
                    var id = Utils.getUrlParameter('IdRol');

                    console.log(id);
                    if (id != 0) {
                        var data = {
                            id: { value: id }
                        };

                        getWebApi(data, ApiService.RolGetRolAccion,
                            function (response) {
                                console.log(response);
                                var data = response.Objeto;
                                $scope.model.IdRol = data.IdRol;
                                $scope.model.Descripcion = data.Descripcion;
                                $scope.model.Borrado = data.Borrado;
                                $scope.model.FechaCreacion = data.FechaCreacion;
                                $scope.model.Acciones = data.Rol_Acciones;

                                $.each($scope.model.Acciones, function (index, value) {
                                    $('#div' + value.AccionId).addClass('cuadroSeleccionado');
                                });
                            });
                    }
                }

                $scope.getAccion = function () {
                    getWebApi({}, ApiService.AccionGet,
                        function (response) {
                            $scope.acciones = response.Lista;
                            console.log(response);
                            var html = '';
                            $.each($scope.acciones, function (index, value) {
                                html = '';
                                html += '<a id="a' + value.AccionId + '"><div id="div' + value.AccionId + '" data-id="' + value.AccionId + '" class="cuadro cuadroSeparador">';
                                html += '   <span class="LetrasContenido textoNegrita">' + value.Nombre + '</span><br />';
                                html += '   <span class="LetrasContenido">' + value.Descripcion + '</span>';
                                html += '</div ></a>';

                                $('#divAccion').append(html);

                                $('#a' + value.AccionId).on('click', function () {
                                    if ($('#div' + value.AccionId).hasClass('cuadroSeleccionado')) {
                                        $('#div' + value.AccionId).removeClass('cuadroSeleccionado');
                                    } else {
                                        $('#div' + value.AccionId).addClass('cuadroSeleccionado');
                                    }
                                });
                            });

                            $scope.CargarRol();
                        }
                    )
                }

                $scope.Validate = function () {
                    $scope.show1 = false;
                    $scope.show2 = false;
                    var result = true;

                    if ($scope.model.Descripcion == '') {
                        $scope.show1 = true;
                        result = false;
                    }

                    var lista = $('.cuadroSeleccionado');

                    if (lista.length == 0) {
                        $scope.show2 = true;
                        result = false;
                    }

                    return result;
                }

                $scope.Guardar = function () {
                    if ($scope.Validate()) {
                        $scope.model.Acciones = [];
                        $.each($('.cuadroSeleccionado'), function (index, value) {
                            var id = $('#' + value.id).attr('data-id');
                            var accion = $scope.acciones.where(function (x) { return x.AccionId == +id });
                            $scope.model.Acciones.push(accion[0].AccionId);
                        });

                        var data = {
                            IdRol: $scope.model.IdRol,
                            Descripcion: $scope.model.Descripcion,
                            Acciones: $scope.model.Acciones.join(),
                            Borrado: $scope.model.Borrado,
                            IsMultipais: $scope.model.IsMultipais
                        }

                        postWebApi(
                            data,
                            ApiService.RolSave,
                            function (response) {
                                if (response.Resultado) {
                                    Utils.MessageBox(
                                        'Mantenimiento de Roles',
                                        'Roles',
                                        response.Mensaje,
                                        "Content/Images/IconoConfimacion1.png",
                                        function () {
                                            window.location = __env.baseUrl + 'Rol/Index'
                                            this.modal('hide');
                                            $('#popupLoading').modal('hide');
                                        }
                                    );
                                } else {
                                    Utils.MessageBox(
                                        'Mantenimiento de Roles',
                                        'Roles',
                                        response.Mensaje,
                                        "Content/Images/IconoErrorGeneral.png",
                                        function () {
                                            $scope.Cancelar();
                                            this.modal('hide');
                                            $('#popupLoading').modal('hide');
                                        }
                                    );
                                }
                            }
                        );
                    }
                }

                $scope.Cancelar = function () {
                    $scope.model.IdRol = 0;
                    $scope.model.Descripcion = '';
                    $scope.model.Borrado = false;
                    $scope.model.IsMultipais = false;
                    $scope.model.FechaCreacion = Date.now;
                    $scope.model.Acciones = [];
                    $.each($('.cuadroSeleccionado'), function (index, value) {
                        $('#' + value.id).removeClass('cuadroSeleccionado');
                    });
                }

                $scope.SeguridadJS = function () {
                    var lista = JSON.parse(sessionStorage.getItem("role"));
                    if (lista != null) {
                        var listaJs = lista.where(function (x) { return x.TipoAccionId == 3 && x.ReferenciasAux == 'RolController'; });

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
'use strict';

(function () {
    angular
        .module('BacApp.controllers.Usuarios', [])
        .controller('UsuariosController',
            function ($scope, $log, RESTService, __env) {

                $scope.model = {};
                $scope.model.Info = {};
                $scope.model.Info.IdUsuario = 0;
                $scope.model.Info.NombreCompleto = '';
                $scope.model.Info.Usuario1 = '';
                $scope.model.Info.Email = '';
                $scope.model.Info.Password = '';
                $scope.model.Info.Borrado = false;
                $scope.model.Info.IdPais = 1;
                $scope.model.Info.IdTipoLogin = 1;
                $scope.model.Info.FechaCreacion = new Date();
                $scope.model.Paises = [];
                $scope.model.Roles = [];

                $scope.show1 = false;
                $scope.show2 = false;
                $scope.show3 = false;
                $scope.EmailInvalido = false;
                $scope.EmailExiste = false;

                var getWebApi = function (data, table, callback) {

                    //Utils.Show();
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

                $scope.getPaises = function () {
                    var decode = Utils.decodeJWT();

                    var data = {
                        id: { value: decode.UserId }
                    }

                    getWebApi(data, ApiService.GetPais,
                        function (response) {
                            $scope.Paises = response.Lista;
                        })
                }

                $scope.getRoles = function () {
                    getWebApi({}, ApiService.RolGet,
                        function (response) {

                            var lista = JSON.parse(sessionStorage.getItem("role"));

                            var listaJs = lista.where(function (x) { return x.AccionId == 98 });

                            if (listaJs.length == 0) {
                                $scope.Roles = response.Lista.where(function (x) { return !x.Borrado });
                            } else {
                                $scope.Roles = response.Lista.where(function (x) { return !x.Borrado && x.IdRol != +listaJs[0].ReferenciasAux });
                            }
                        })
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

                $scope.Validate = function () {
                    var result = true;

                    if ($scope.model.Info.Email == "") {
                        $scope.EmailInvalido = true;
                        result = false;
                    } else { $scope.EmailInvalido = false; }

                    if ($scope.model.Info.NombreCompleto == "") {
                        $scope.show1 = true;
                        result = false;
                    } else { $scope.show1 = false; }

                    var paises = Utils.getValCheck('pais', 'IdPais');

                    if (paises.length == 0) {
                        $scope.show2 = true;
                        result = false;
                    } else { $scope.show2 = false; }

                    var roles = Utils.getValCheck('rol', 'IdRol');

                    if (roles.length == 0) {
                        $scope.show3 = true;
                        result = false;
                    } else { $scope.show3 = false; }

                    if ($scope.model.Info.Password == '' && $scope.model.Info.IdUsuario == 0) {
                        $scope.show4 = true;
                        result = false;
                    } else { $scope.show4 = false; }

                    return result;
                }

                $scope.getInfo = function () {

                    var id = Utils.getUrlParameter('IdUsuario');
                    if (id != 0)
                    {
                       
                        //$scope.modal.IdPuesto = id;
                        var data = {
                            id: { value: id }
                        };

                        getWebApi(data, ApiService.UsuarioGet,
                            function (response) {
                                var obj = response.Objeto;

                                $scope.model.Info.IdUsuario = obj.Info.IdUsuario;
                                $scope.model.Info.NombreCompleto = obj.Info.NombreCompleto;
                                $scope.model.Info.Usuario1 = obj.Info.Usuario1;
                                $scope.model.Info.Email = obj.Info.Email;
                                $scope.model.Info.Borrado = obj.Info.Borrado;
                                $("input[name=rol]").each(function () {
                                    var value = $(this).val();
                                    var result = obj.Roles.any(function (x) {
                                        return x.IdRol == value
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
                            }
                        )
                    }                  
                }

                $scope.Guardar = function () {
                    if ($scope.Validate()) {
                        $scope.model.Paises = Utils.getValCheckEdit('pais', 'IdPais');
                        $scope.model.Roles = Utils.getValCheckEdit('rol', 'IdRol');
                        $scope.model.Info.Usuario1 = $scope.model.Info.Email;
                        if ($scope.model.Info.Password != "")
                        {
                            $scope.model.Info.Password = md5($scope.model.Info.Password);
                        }
                      
                        var titulo = '';
                        var mensaje = '';
                        var imagen = '';
                       
                        if ($scope.model.Info.IdUsuario == 0) {
                            titulo = 'Agregaste con éxito al nuevo usuario';
                            mensaje = 'El nuevo usuario ya puede hacer uso de la plataforma de empleos.';
                            imagen = 'Content/Images/IconoActualizacionUsuario.png';
                        }
                        else {
                            titulo = 'Actualizaste con éxito los datos del usuario';
                            mensaje = 'Muchas gracias, se actualizaron los datos en nuestra base de datos.';
                            imagen = 'Content/Images/IconoActualizacionUsuario.png';
                        }
                        
                        postWebApi(
                            $scope.model,
                            ApiService.UsuarioSave,
                            function (response) {
                                if (response.Resultado) {
                                    Utils.MessageBox(
                                        titulo,
                                        titulo,
                                        mensaje,
                                        imagen,
                                        function () {
                                            this.modal('hide');
                                            $('popupLoading').modal('hide');
                                            window.location = __env.baseUrl + 'Usuario/VerUsuarios';
                                        }
                                    );
                                } else {
                                    Utils.MessageBox(
                                        'Mantenimiento de Usuarios',
                                        'Mantenimiento de Usuarios',
                                        response.Mensaje,
                                        "Content/Images/IconoErrorGeneral.png",
                                        function () {
                                            this.modal('hide');
                                            $('popupLoading').modal('hide');
                                            return false;
                                        }
                                    );
                                }
                            }
                        );
                    }
                }

                $scope.Cancelar = function () {
                    window.location = __env.baseUrl + 'Usuario/VerUsuarios';
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

                $scope.Volver = function () {
                    window.location = __env.baseUrl + 'Usuario/VerUsuarios';
                }

                $scope.SeguridadJS = function () {
                    var lista = JSON.parse(sessionStorage.getItem("role"));
                    if (lista != null) {
                        var listaJs = lista.where(function (x) { return x.TipoAccionId == 3 && x.ReferenciasAux == 'UsuariosController'; });

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
'use strict';

(function () {
    angular
        .module('BacApp.controllers.verAplicarPuestos', ["ngSanitize"])
        .controller('verAplicarPuestosController',
            function ($scope, $log, RESTService, __env) {

                $scope.model = {};
                $scope.model.IdPuesto = 0;
                $scope.model.IdPostulante = 0;

                $scope.model.Titulo = '';
                $scope.model.Descripcion = '';
                $scope.model.FechaCierre = '';
                $scope.model.Idiomas = '';
                $scope.model.Jornada = 0;
                $scope.model.Pais = '';
                $scope.model.IdArea = '';
                $scope.model.Area = '';
                $scope.model.NivelAcademico = '';
                $scope.model.ExperienciaRequerida = [];
                $scope.model.IsAplicado = false;

                $scope.baseUrl = __env.baseUrl;
                $scope.top = 0;
                $scope.PuestosRelacionados = {};

                $scope.AplicarPuesto = function () {
                    $('#popupLoading').modal('show');
                    var decode = Utils.decodeJWT();
                    var data = {
                        IdPuesto: { value: $scope.model.IdPuesto },
                        IdPostulante: { value: decode.UserId }
                    }

                    var titulo = '';
                    var mensaje = '';
                    var imagen = '';

                    if ($scope.model.IsAplicado) {
                        titulo = 'Has eliminado tu aplicación correctamente';
                        mensaje = 'Ya no apareceras en la lista de candidatos al puesto.';
                        imagen = 'Content/Images/IconoDesaplicarPuesto.png';
                    } else {
                        titulo = 'Has aplicado correctamente al empleo';
                        mensaje = 'Un encargado del departamente de selección revisará tu perfil para continuar con el debido proceso';
                        imagen = 'Content/Images/IconoAplicarPuesto.png';
                    }

                    getWebApi(data, ApiService.PuestoAplicar, function (response) {
                        if (response.Resultado) {
                            Utils.MessageBox(
                                titulo,//'Mantenimiento Puesto',
                                titulo,//'Puesto',
                                mensaje,//'Puesto aplicado exitosamente',
                                imagen,//"Content/Images/IconoConfimacion1.png",
                                function () {
                                    window.location = __env.baseUrl + 'Puesto/Puestosdisponibles'
                                    this.modal('hide');
                                    //$('#popupLoading').modal('hide');
                                }
                            );
                        } else {
                            Utils.MessageBox(
                                'Aplicar/Desaplicar a un puesto',//'Mantenimiento Puesto',
                                'Aplicar/Desaplicar a un puesto',//'Puesto',
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

                $scope.EditarPuesto = function () {
                    window.location = __env.baseUrl + "Puesto/MantenimientoPuestoEdit?IdPuesto=" + $scope.model.IdPuesto;
                }

                $scope.VerPostulantes = function () {
                    window.location = __env.baseUrl + "Puesto/PostulantesPuesto?IdPuesto=" + $scope.model.IdPuesto + "&Puesto=" + $scope.model.Titulo;
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
                        Id: data.PuestoInfo.IdPuesto
                    }

                    RESTService.doPost(table, entity)
                        .then(callback);
                }


                $scope.getPuesto = function () {

                    var id = Utils.getUrlParameter('IdPuesto');
                    var decode = Utils.decodeJWT();

                    var data = {
                        idPuesto: { value: id },
                        IdPostulante: { value: decode.UserId }
                    };

                    getWebApi(data, ApiService.PuestoVer,
                        function (response) {
                            if (response.Resultado) {
                                var data = response.Objeto;
                                $scope.model.IdPuesto = data.IdPuesto;
                                $scope.model.Titulo = data.Titulo;
                                $scope.model.Descripcion = data.Descripcion;
                                $scope.model.FechaCierre = data.FechaCierre;
                                $scope.model.Idiomas = data.Idiomas;
                                $scope.model.Jornada = data.Jornada[0];
                                $scope.model.Pais = data.Pais;
                                $scope.model.IdArea = data.IdArea;
                                $scope.model.Area = data.Area;
                                $scope.model.NivelAcademico = data.NivelAcademico;
                                $scope.model.IsAplicado = data.IsAplicado;
                                $scope.model.ExperienciaRequerida = data.Requisitos;

                                //$scope.DescripcionPais = '';

                                // $.each($scope.model.Pais, function (index, value) {
                                $scope.DescripcionPais = $scope.model.Pais;//+= value.Descripcion + ',';
                                //});

                                //$scope.DescripcionPais = $scope.DescripcionPais.substring(0, $scope.DescripcionPais.length - 1);

                                if (data.Requisitos.length == 0) {
                                    var requisitoDefault = {
                                        IdRequisito: 0,
                                        Descripcion: "N/A"
                                    };
                                    $scope.model.ExperienciaRequerida.push(requisitoDefault);
                                }

                                if ($scope.model.IsAplicado) {
                                    $('#btnAplicar').text('DESAPLICAR PUESTO');
                                }
                                else {
                                    $('#btnAplicar').text('APLICAR PUESTO');
                                }
                                //CantidadAplicantes
                                $('#btnPostulantes').text('Ver aplicantes (' + data.CantidadAplicantes + ')');

                                $scope.GetPuestosRelacionados($scope.model.IdArea);
                            } else {
                                Utils.MessageBox(
                                    'Ver Puesto',
                                    'Puesto',
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
                }


                $scope.GetPuestosRelacionados = function (IdArea) {

                    $scope.top = $scope.top + 3;
                    var data = {
                        IdArea: { value: IdArea },
                        Top: { value: $scope.top }
                    };

                    getWebApi(data, ApiService.PuestosGetRelacionados,
                        function (response) {
                            $scope.PuestosRelacionados = response.Lista;
                        }
                    );
                }

                $scope.Volver = function () {
                    window.location = sessionStorage.getItem("volver");//__env.baseUrl + 'Puesto/FiltrarPuestos';
                }

                $scope.RealizarEntrevista = function () {
                    var IdFeriaEmpleo = Utils.getUrlParameter("IdFeriaEmpleo");
                    window.location = __env.baseUrl + "Entrevistas/SolicitarEntrevistasFeria?IdFeriaEmpleo=" + IdFeriaEmpleo + "&IdPuesto=" + $scope.model.IdPuesto;
                }

                $scope.AplicarSeguridadHTML = function () {
                    Utils.SeguridadHTML();
                }

                $scope.SeguridadJS = function () {
                    var lista = JSON.parse(sessionStorage.getItem("role"));

                    if (lista != null) {
                        var listaJs = lista.where(function (x) { return x.TipoAccionId == 3 && x.ReferenciasAux == 'verAplicarPuestosController'; });

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
'use strict';

(function () {
    angular
        .module('BacApp.controllers.VerFeriaVirtual', [])
        .controller('VerFeriaVirtualController',
            function ($scope, $log, RESTService, __env) {

                $scope.model = {};
                $scope.model.IdArea = 0;
                $scope.model.Area = '';
                $scope.model.Borrado = 0;
                $scope.model.FechaCreacion = Date.now;
                $scope.model.nombre = '';

                $scope.Create = function ()
                {
                    window.location = __env.baseUrl +'FeriaVirtual/MantenimientoFeriaVirtual'
                }

                var getWebApi = function (data, table, callback) {

                    //Utils.Show();
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

                $scope.LoadGrid = function () {
                    var lista = JSON.parse(sessionStorage.getItem("role"));

                    var value = lista.where(function (x) { return x.AccionId == 39 });

                    var decode = Utils.decodeJWT();

                    var paises = eval(decode.PaisesFiltro);

                    var data = {
                        IdPais: { value: paises, cond: OConfig.condLike, type: OTypes.string, comp: '||' }
                    };

                    var width = Utils.GetWidthWindow();

                    if (width <= 764) {
                        Utils.getGrid((value.length == 0 ? ApiService.FeriaGridTodas : ApiService.FeriaGrid), data, 'divFeriaVirtual', (value.length == 0 ? ['', ''] : ['', '']), (value.length == 0 ? 'MobileColumn' : 'MobileColumn1'), $scope.Redirect, 5, 'totalGrid', 'IdFeriaEmpleo', 'IdFeriaEmpleo', 'desc');
                    }
                    else {
                        Utils.getGrid((value.length == 0 ? ApiService.FeriaGridTodas : ApiService.FeriaGrid) , data, 'divFeriaVirtual', (value.length == 0 ? ['Título de la feria', 'País', 'Fecha de cierre', 'Postulante', 'Ver'] : ['Título de la feria', 'País', 'Fecha de cierre', 'Ver']), (value.length == 0 ? 'Descripcion,NombrePais,FechaFinal,Aplicantes' : 'Descripcion,NombrePais,FechaFinal'), $scope.Redirect, 5, 'totalGrid', 'IdFeriaEmpleo', 'IdFeriaEmpleo', 'desc');
                    }
                }

                $scope.FilterGrid = function () {

                    var paises = $scope.model.pais;

                    var lista = JSON.parse(sessionStorage.getItem("role"));

                    var value = lista.where(function (x) { return x.AccionId == 39 });

                    var decode = Utils.decodeJWT();
                  
                    var data = {};

                    if (paises == '' || paises == undefined) {
                        paises = eval(decode.PaisesFiltro);
                    }

                    data = {
                        Descripcion: { value: $scope.model.nombre, cond: OConfig.condLike, type: OTypes.string, comp: '&&'},
                        IdPais: { value: $scope.model.pais, cond: OConfig.condLike, type: OTypes.string, comp: '||' }
                    };
                    var width = Utils.GetWidthWindow();

                    if (width <= 764) {
                        Utils.getGrid((value.length == 0 ? ApiService.FeriaGridTodas : ApiService.FeriaGrid), data, 'divFeriaVirtual', (value.length == 0 ? ['', ''] : ['', '']), (value.length == 0 ? 'MobileColumn' : 'MobileColumn1'), $scope.Redirect, 5, 'totalGrid', 'IdFeriaEmpleo', 'IdFeriaEmpleo', 'desc');
                    }
                    else {
                        Utils.getGrid((value.length == 0 ? ApiService.FeriaGridTodas : ApiService.FeriaGrid), data, 'divFeriaVirtual', (value.length == 0 ? ['Título de la feria', 'País', 'Fecha de cierre', 'Postulante', 'Ver'] : ['Título de la feria', 'País', 'Fecha de cierre', 'Ver']), (value.length == 0 ? 'Descripcion,NombrePais,FechaFinal,Aplicantes' : 'Descripcion,NombrePais,FechaFinal'), $scope.Redirect, 5, 'totalGrid', 'IdFeriaEmpleo', 'IdFeriaEmpleo', 'desc');
                    }
                }

                $scope.Redirect = function (param) {
                    $scope.$apply(function () {
                        $scope.model.IdArea = param.IdArea;
                        $scope.model.Area = param.Area;
                        $scope.model.Borrado = param.Borrado;


                        var lista = JSON.parse(sessionStorage.getItem("role"));

                        var value = lista.where(function (x) { return x.AccionId == 39 });

                        window.location = __env.baseUrl + (value.length == 0 ? 'FeriaVirtual/DetalleFeriaVirtual?IdFeriaEmpleo=' + param.IdFeriaEmpleo : 'FeriaVirtual/DetalleFeriaVirtualPostulante?IdFeriaEmpleo=' + param.IdFeriaEmpleo);
                    });
                }

                $scope.Guardar = function () {
                    postWebApi(
                        $scope.model,
                        ApiService.AreaLaboralSave,
                        function (response) {
                            if (response.Resultado) {
                                Utils.MessageBox(
                                    'Mantenimiento Areas Laborales',
                                    'Areás Laborales',
                                    response.Mensaje,
                                    "~/Content/Images/IconoConfimacion1.png",
                                    function () {
                                        return false;
                                    }
                                );
                            } else {
                                Utils.MessageBox(
                                    'Mantenimiento Areas Laborales',
                                    'Areas Laborales',
                                    response.Mensaje,
                                    "~/Content/Images/IconoErrorGeneral.png",
                                    function () {
                                        return false;
                                    }
                                );
                            }
                        }
                    );
                }

                $scope.Cancelar = function () {
                    $scope.model.Descripcion = '';
                }

                $scope.AreaLaboralGet = function () {

                    getWebApi({}, ApiService.AreaLaboralGet,
                        function (response) {
                            $scope.Areas = response.Lista;
                        }
                    )
                }

                $scope.getPaises = function () {
                    var decode = Utils.decodeJWT();

                    var data = {
                        id: { value: decode.UserId }
                    }

                    getWebApi(data, ApiService.GetPais,
                        function (response) {
                            $scope.Paises = response.Lista;
                        })
                }

                $scope.VerificarSession = function () {
                    if (Utils.getUrlParameter("token") != '') {
                        if (sessionStorage.hasOwnProperty("token")) {
                            sessionStorage.removeItem('token');
                        }
                        var Token = Utils.getUrlParameter("token");
                        sessionStorage.setItem("token", Token);
                    }

                    if (!sessionStorage.hasOwnProperty("token")) {
                        var Token = Utils.getUrlParameter("token");
                        sessionStorage.setItem("token", Token);
                        console.log(Token);
                    }

                    if (!sessionStorage.hasOwnProperty("role")) {
                        var decode = Utils.decodeJWT();
                        var data = {
                            userid: { value: decode.UserId }
                        }

                        getWebApi(data, ApiService.GetMenu,
                            function (response) {
                                sessionStorage.setItem("role", response.Objeto);
                                $scope.LoadGrid();
                            })

                    }
                    else { $scope.LoadGrid(); }
                }

                $scope.SeguridadJS = function () {
                    var lista = JSON.parse(sessionStorage.getItem("role"));

                    if (lista != null) {
                        var listaJs = lista.where(function (x) { return x.TipoAccionId == 3 && x.ReferenciasAux == 'VerFeriaVirtualController'; });

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
'use strict';

(function () {
    angular
        .module('BacApp.controllers.VerPostulante', [])
        .controller('VerPostulantesController',
            function ($scope, $log, RESTService, __env) {

                $scope.model = {};  
                $scope.model.nombre ='';
                $scope.model.pais =0;

                var getWebApi = function (data, table, callback) {

                    //Utils.Show();
                    var query = Utils.getFilterParameters(data);
                    RESTService.doGet(table, query)
                        .then(callback);
                }

                var postWebApi = function (data, table, callback) {

                    var query = Utils.getFilterObject(data);
                    var entity = {
                        Objeto: query,
                        Lista: [],
                        Token: '',
                        Id: 0
                    }

                    RESTService.doPost(table, query)
                        .then(callback);
                }

                $scope.getPaises = function () {
                    var decode = Utils.decodeJWT();

                    var data = {
                        id: { value: decode.UserId }
                    }

                    getWebApi(data, ApiService.GetPais,
                        function (response) {
                            $scope.Paises = response.Lista;
                        })
                }

                var data =
                {
                    pagesize: { value: 10},
                    page: { value: 0 }
                }

                $scope.LoadGrid = function ()
                {
                    var paises = [];
                    var width = Utils.GetWidthWindow();

                    if ($scope.model.pais != '' && $scope.model.pais != null && $scope.model.pais != 0) {
                        paises.push($scope.model.pais);
                    }
                    else
                    {
                        var decode = Utils.decodeJWT();

                        paises = eval(decode.PaisesFiltro);
                    }

                    var data = {               
                        IdPais: { value: paises, cond: OConfig.condEquals, type: OTypes.default, comp: '||' }
                    };

                    if (width <= 764) {
                        Utils.getGrid(ApiService.PostulanteGrid, data, 'tablaPostulantes', ['', '', ''], 'ColumnMobile1,ColumnMobile2', $scope.Redirect, 5, 'totalGrid', 'IdUsuario,Email', 'IdUsuario', 'desc');
                    }
                    else {
                        Utils.getGrid(ApiService.PostulanteGrid, data, 'tablaPostulantes', ['Nombre', 'Pais', 'Area', 'Ver'], 'NombreCompleto,Pais,Area', $scope.Redirect, 5, 'totalGrid', 'IdUsuario,Email', 'IdUsuario', 'desc');
                    }
                }

                $scope.Redirect = function (param)
                {
                    window.location = __env.baseUrl + 'Postulante/VerPerfil?IdPostulante=' + param.Email;
                }

                $scope.Filter = function () {

                    var paises = [];
                    var width = Utils.GetWidthWindow();

                    if ($scope.model.pais != '' && $scope.model.pais != null && $scope.model.pais != 0) {
                        paises.push($scope.model.pais);
                    }
                    else {
                        var decode = Utils.decodeJWT();

                        paises = eval(decode.PaisesFiltro);
                    }
                    var data = {
                        NombreCompleto: { value: $scope.model.nombre, cond: OConfig.condLike, type: OTypes.string },
                        IdPais: { value: paises, cond: OConfig.condEquals, type: OTypes.default, comp: '||' }
                    };

                    if (width <= 764) {
                        Utils.getGrid(ApiService.PostulanteGrid, data, 'tablaPostulantes', ['', '', ''], 'ColumnMobile1,ColumnMobile2', $scope.Redirect, 5, 'totalGrid', 'IdUsuario,Email', 'IdUsuario', 'desc');
                    }
                    else {
                        Utils.getGrid(ApiService.PostulanteGrid, data, 'tablaPostulantes', ['Nombre', 'Pais', 'Area', 'Ver'], 'NombreCompleto,Pais,Area', $scope.Redirect, 5, 'totalGrid', 'IdUsuario,Email', 'IdUsuario', 'desc');
                    }
                }

                $scope.SeguridadJS = function () {
                    var lista = JSON.parse(sessionStorage.getItem("role"));

                    if (lista != null) {
                        var listaJs = lista.where(function (x) { return x.TipoAccionId == 3 && x.ReferenciasAux == 'VerPostulantesController'; });

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
'use strict';

(function () {
    angular
        .module('BacApp.controllers.VerPostulantesPuesto', [])
        .controller('VerPostulantesPuestoController',
        function ($scope, $log, RESTService, __env) {

            $scope.model = {};
            $scope.model.IdPuesto = Utils.getUrlParameter("IdPuesto");
            $scope.model.nombre = '';
            $scope.model.Titulo = Utils.getUrlParameter("Puesto");
            $scope.model.IdFeria = Utils.getUrlParameter("IdFeriaEmpleo");
            $scope.count = 0;

            //filtros
            $scope.Identificacion = '';
            $scope.Nacionalidad = '';
            $scope.PaisResidencia = '';
            $scope.Genero = '';
            $scope.IdEstadoCivil = '';
            $scope.Vehiculo = '';
            $scope.IdDiscapacidad = '';
            $scope.Favorito = '';
            $scope.GradoAcademico = '';
            $scope.EstudiaActualmente = '';
            $scope.EstadoAplicante = '';
            $scope.IdPuestosPublicacionTrack = '';

            var getWebApi = function (data, table, callback) {

                var query = Utils.getFilterParameters(data);
                RESTService.doGet(table, query)
                    .then(callback);
            }

            var postWebApi = function (data, table, callback) {

                var query = Utils.getFilterObject(data);
                var entity = {
                    Objeto: query,
                    Lista: [],
                    Token: '',
                    Id: 0
                }

                RESTService.doPost(table, query)
                    .then(callback);
            }

            $scope.AreaLaboralGet = function () {

                getWebApi({}, ApiService.AreaLaboralGet,
                    function (response) {
                        $scope.Areas = response.Lista;
                    }
                )
            }

            $scope.getPaises = function () {
                var decode = Utils.decodeJWT();

                var data = {
                    id: { value: decode.UserId }
                }

                getWebApi(data, ApiService.GetPais,
                    function (response) {
                        $scope.Paises = response.Lista;
                    })
            }

            $scope.LoadGrid = function () {
                var idsPuesto = [];
                idsPuesto.push($scope.model.IdPuesto);
                var data =
                    {
                        IdPuesto: { value: idsPuesto, cond: OConfig.condEquals, type: OTypes.default, comp: '||' }//{ value: $scope.model.IdPuesto, cond: OConfig.condEquals, type: OTypes.default },
                    }

                var width = Utils.GetWidthWindow();

                if (width <= 764) {
                    Utils.getGrid(ApiService.PostulanteXPuestoGrid, data, 'tablaPostulantes', ['', '', ''], 'ColumnMobile1,ColumnMobile2', $scope.redirect, 5, 'totalGrid', 'IdPostulante,Email,IdPuesto', 'FechaCreacion', 'desc');
                }
                else {
                    Utils.getGrid(ApiService.PostulanteXPuestoGrid, data, 'tablaPostulantes', ['Nombre', 'País', 'Edad', 'Puesto aplicados', 'Ver'], 'NombreCompleto,Pais,Edad,Cantidad', $scope.redirect, 5, 'totalGrid', 'IdPostulante,Email', 'FechaCreacion', 'desc');
                }
            }

            $scope.LoadGridFeria = function () {
                var idsPuesto = [];
                idsPuesto.push($scope.model.IdPuesto);
                var data =
                    {
                        IdPuesto: { value: $scope.model.IdPuesto, cond: OConfig.condEquals, type: OTypes.default, comp: '||' },
                        IdFeriaEmpleo: { value: $scope.model.IdFeria, cond: OConfig.condEquals, type: OTypes.default, comp: '||' }
                    }

                var width = Utils.GetWidthWindow();

                if (width <= 764) {
                    Utils.getGrid(ApiService.PostulanteXPuestoFeriaGrid, data, 'tablaPostulantes', ['', '', ''], 'ColumnMobile1,ColumnMobile2', $scope.redirect, 5, 'totalGrid', 'IdPostulante,IdEntrevista,Email,IdPuesto', 'IdEntrevista', 'desc');
                }
                else {
                    Utils.getGrid(ApiService.PostulanteXPuestoFeriaGrid, data, 'tablaPostulantes', ['Nombre', 'País', 'Entrevista', 'Ver'], 'NombreCompleto,Pais,EntrevistaFechaTipo', $scope.redirect, 5, 'totalGrid', 'IdPostulante,IdEntrevista,Email,IdPuesto', 'IdEntrevista', 'desc');
                }
            }

            $scope.redirect = function (param) {
                var url = __env.baseUrl + 'Postulante/VerPerfil?IdPostulante=' + (param == undefined ? 0 : param.Email);

                var data =
                    {
                        IdPostulante: { value: param.IdPostulante },
                        IdPuesto: { value: (param.IdPuesto == undefined ? $scope.model.IdPuesto : param.IdPuesto) }
                    };

                getWebApi(data, ApiService.CambiarEstadoPerfilLeido, function (response) {
                    window.location = url;
                });

                //window.location = __env.baseUrl + 'Postulante/VerPerfil?IdPostulante=' + (param == undefined ? 0 : param.Email);
            }



            $scope.Filter = function () {

                //var data = ['NombreCompleto'];
                //Utils.searchGrid(ApiService.PostulanteGrid, data, word, 'tablaPostulantes', ['Nombre', 'Pais', 'Area', 'Ver'], 'NombreCompleto,Pais,Area', $scope.redirect, 5, 'totalGrid')

                var areas = Utils.getValCheck('areas');
                var paises = Utils.getValCheck('pais');
                var pretension = Utils.getValCheck('pretension');

                $scope.model.nombre = '';

                var data = { IdPuesto: { value: $scope.model.IdPuesto, cond: OConfig.condEquals, type: OTypes.default } }

                if ($scope.Identificacion != '' && $scope.Identificacion != undefined && $scope.Identificacion != null) {
                    data.Identificacion = { value: $scope.Identificacion, cond: OConfig.condEquals, type: OTypes.string };
                }

                if ($scope.Nacionalidad != '' && $scope.Nacionalidad != undefined && $scope.Nacionalidad != null) {
                    data.Nacionalidad = { value: $scope.Nacionalidad, cond: OConfig.condEquals, type: OTypes.string };
                }

                if ($scope.PaisRecidencia != '' && $scope.PaisRecidencia != undefined && $scope.PaisRecidencia != null) {
                    data.PaisRecidencia = { value: $scope.PaisRecidencia, cond: OConfig.condEquals, type: OTypes.default };
                }

                if ($scope.Genero != '' && $scope.Genero != undefined && $scope.Genero != null) {
                    data.Genero = { value: $scope.Genero, cond: OConfig.condEquals, type: OTypes.default };
                }

                if ($scope.IdEstadoCivil != '' && $scope.IdEstadoCivil != undefined && $scope.IdEstadoCivil != null) {
                    data.IdEstadoCivil = { value: $scope.IdEstadoCivil, cond: OConfig.condEquals, type: OTypes.default };
                }

                if ($scope.Vehiculo != '' && $scope.Vehiculo != undefined && $scope.Vehiculo != null) {
                    data.Vehiculo = { value: $scope.Vehiculo, cond: OConfig.condEquals, type: OTypes.default };
                }

                if ($scope.EstudiaActualmente != '' && $scope.EstudiaActualmente != undefined && $scope.EstudiaActualmente != null) {
                    data.EstudiaActualidad = { value: $scope.EstudiaActualmente, cond: OConfig.condEquals, type: OTypes.default };
                }

                if ($scope.EstadoAplicante != '' && $scope.EstadoAplicante != undefined && $scope.EstadoAplicante != null) {
                    data.IdEstadoPerfil = { value: $scope.EstadoAplicante, cond: OConfig.condEquals, type: OTypes.default };
                }

                if ($scope.GradoAcademico != '' && $scope.GradoAcademico != undefined && $scope.GradoAcademico != null) {
                    data.GradoAcademico = { value: $scope.GradoAcademico, cond: OConfig.condEquals, type: OTypes.default };
                }

                if ($scope.IdPuestosPublicacionTrack != '' && $scope.IdPuestosPublicacionTrack != undefined && $scope.IdPuestosPublicacionTrack != null) {
                    data.IdPuestosPublicacionTrack = { value: $scope.IdPuestosPublicacionTrack, cond: OConfig.condLike, type: OTypes.string, comp: '||' };
                }

                if (paises.length > 0) {
                    data.IdPais = { value: paises.join(), cond: OConfig.condLike, type: OTypes.string, comp: '||' };
                }

                if (areas.length > 0) {
                    data.IdArea = { value: areas.join(), cond: OConfig.condLike, type: OTypes.string, comp: '||' };
                }

                if ($scope.IdDiscapacidad != '' && $scope.IdDiscapacidad != undefined && $scope.IdDiscapacidad != null) {
                    data.IdDiscapacidad = { value: $scope.IdDiscapacidad, cond: OConfig.condEquals, type: OTypes.default };
                }

                if (pretension.length > 0) {
                    data.IdPretensionSalarial = { value: pretension, cond: OConfig.condEquals, type: OTypes.default, comp: '||' };
                }

                if ($scope.Favorito != '' && $scope.Favorito != undefined && $scope.Favorito != null) {
                    data.Favorito = { value: $scope.Favorito, cond: OConfig.condEquals, type: OTypes.default };
                }

                if ($scope.model.nombre != '' && $scope.model.nombre != undefined && $scope.model.nombre != null) {
                    data.NombreCompleto = { value: $scope.model.nombre, cond: OConfig.condLike, type: OTypes.default };
                }

                var width = Utils.GetWidthWindow();

                if (width <= 764) {
                    Utils.getGrid(ApiService.PostulanteXPuestoGrid, data, 'tablaPostulantes', ['', '', ''], 'ColumnMobile1,ColumnMobile2', $scope.redirect, 5, 'totalGrid', 'IdPostulante,Email,IdPuesto', 'FechaCreacion', 'desc');
                }
                else {
                    Utils.getGrid(ApiService.PostulanteXPuestoGrid, data, 'tablaPostulantes', ['Nombre', 'País', 'Edad', 'Puesto aplicados', 'Ver'], 'NombreCompleto,Pais,Edad,Cantidad', $scope.redirect, 5, 'totalGrid', 'IdPostulante,Email', 'FechaCreacion', 'desc');
                }
            }

            $scope.FilterFeria = function () {

                var areas = Utils.getValCheck('areas');
                var paises = Utils.getValCheck('pais');
                var pretension = Utils.getValCheck('pretension');

                var data = { IdPuesto: { value: $scope.model.IdPuesto, cond: OConfig.condEquals, type: OTypes.default } }

                if ($scope.model.nombre != '' && $scope.model.nombre != undefined && $scope.model.nombre != null) {
                    data.NombreCompleto = { value: $scope.model.nombre, cond: OConfig.condLike, type: OTypes.default };
                }

                var width = Utils.GetWidthWindow();

                if (width <= 764) {
                    Utils.getGrid(ApiService.PostulanteXPuestoFeriaGrid, data, 'tablaPostulantes', ['', '', ''], 'ColumnMobile1,ColumnMobile2', $scope.redirect, 5, 'totalGrid', 'IdPostulante,IdEntrevista,Email,IdPuesto', 'IdEntrevista', 'desc');
                }
                else {
                    Utils.getGrid(ApiService.PostulanteXPuestoFeriaGrid, data, 'tablaPostulantes', ['Nombre', 'País', 'Entrevista', 'Ver'], 'NombreCompleto,Pais,EntrevistaFechaTipo', $scope.redirect, 5, 'totalGrid', 'IdPostulante,IdEntrevista,Email,IdPuesto', 'IdEntrevista', 'desc');
                }
            }

            $scope.Clear = function () {
                $scope.Identificacion = '';
                $scope.Nacionalidad = '';
                $scope.PaisRecidencia = '';
                $scope.Genero = '';
                $scope.IdEstadoCivil = '';
                $scope.Vehiculo = '';
                $scope.IdDiscapacidad = '';
                $scope.Favorito = '';
                $scope.EstudiaActualmente = '';
                $scope.EstadoAplicante = '';
                $scope.IdPuestosPublicacionTrack = '';
                $scope.GradoAcademico = '';
                $scope.AreaLaboralGet();
                $scope.getPaises();
                $scope.DiscapacidadGet();
                $scope.PretensionSalarialGet();
                $scope.GetTracking();
                $scope.LoadGrid();

            }
            $scope.Volver = function () {

                //window.location = __env.baseUrl + 'Puesto/VerPuesto?IdPuesto=' + $scope.model.IdPuesto;
                window.location = __env.baseUrl + "FeriaVirtual/DetalleFeriaVirtual?IdFeriaEmpleo=" + $scope.model.IdFeria;
            }

            $scope.DiscapacidadGet = function () {

                getWebApi({}, ApiService.DiscapacidadGet,
                    function (response) {
                        $scope.Discapacidades = response.Lista;
                    }
                )
            }

            $scope.GetTracking = function () {

                var data = {
                    IdPuesto: { value: $scope.model.IdPuesto }
                 };

                getWebApi(data, ApiService.PuestosGetTracking,
                    function (response) {
                        $scope.Tracking = response.Lista;
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

            $scope.SeguridadJS = function () {
                var lista = JSON.parse(sessionStorage.getItem("role"));

                if (lista != null) {
                    var listaJs = lista.where(function (x) { return x.TipoAccionId == 3 && x.ReferenciasAux == 'VerPostulantesPuestoController'; });

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
'use strict';

(function () {
    angular
        .module('BacApp.controllers.VerPuestosAplicados', [])
        .controller('VerPuestosAplicadosController',
            function ($scope, $log, RESTService, __env) {

                var decode = Utils.decodeJWT();
                $scope.model = {};
                $scope.model.IdPostulante = decode.UserId;
                $scope.model.nombre = '';
                $scope.count = 0;
                var getWebApi = function (data, table, callback) {

                    var query = Utils.getFilterParameters(data);
                    RESTService.doGet(table, query)
                        .then(callback);
                }

                var postWebApi = function (data, table, callback) {

                    var query = Utils.getFilterObject(data);
                    var entity = {
                        Objeto: query,
                        Lista: [],
                        Token: '',
                        Id: 0
                    }

                    RESTService.doPost(table, query)
                        .then(callback);
                }

                $scope.AreaLaboralGet = function () {

                    getWebApi({}, ApiService.AreaLaboralGet,
                        function (response) {
                            $scope.Areas = response.Lista;
                        }
                    )
                }

                $scope.getPaises = function () {
                    var decode = Utils.decodeJWT();

                    var data = {
                        id: { value: decode.UserId }
                    }

                    getWebApi(data, ApiService.GetPais,
                        function (response) {
                            $scope.Paises = response.Lista;
                        })
                }

                $scope.CleanFilter = function ()
                {
                    $scope.getPaises();
                    $scope.LoadGrid();
                }

                $scope.LoadGrid = function () {
                    var decode = Utils.decodeJWT();

                    var idsPostulante = [];
                    idsPostulante.push(decode.UserId);                    

                    var data = {
                        IdUsuario: { value: decode.UserId, cond: OConfig.condEquals, type: OTypes.default, comp: '||' },
                    }

                    var width = Utils.GetWidthWindow();

                    if (width <= 764) {
                        Utils.getGrid(ApiService.PuestosAplicadosGrid, data, 'tablaPostulantes', ['', ''], 'MobileColumn', $scope.redirect, 5, 'totalGrid', 'IdPuesto,IdPostulante', 'FechaRegistro', 'desc');
                    }
                    else {
                        Utils.getGrid(ApiService.PuestosAplicadosGrid, data, 'tablaPostulantes', ['Título del puesto', 'País', 'Fecha de cierre', 'Ver'], 'Descripcion,Pais,FechaCierreOferta', $scope.redirect, 5, 'totalGrid', 'IdPuesto,IdPostulante', 'FechaRegistro', 'desc');
                    }
                }

                $scope.redirect = function (param) {
                    sessionStorage.setItem("volver", __env.baseUrl + "Puesto/Puestosaplicados");
                    window.location = __env.baseUrl + 'Puesto/VerPuesto?IdPuesto=' + (param == undefined ? 0 : param.IdPuesto);
                }

                $scope.Filter = function () {
                    var paises = Utils.getValCheck('pais');
                    var decode = Utils.decodeJWT();

                    var data = {
                        Descripcion: { value: $scope.model.nombre, cond: OConfig.condLike, type: OTypes.string },
                        IdUsuario: { value: decode.UserId, cond: OConfig.condEquals, type: OTypes.default, comp: '||' },
                        IdPais: { value: paises, cond: OConfig.condEquals, type: OTypes.default, comp: '||' },
                    }

                    var width = Utils.GetWidthWindow();

                    if (width <= 764) {
                        Utils.getGrid(ApiService.PuestosAplicadosGrid, data, 'tablaPostulantes', ['', ''], 'MobileColumn', $scope.redirect, 5, 'totalGrid', 'IdPuesto,IdPostulante', 'FechaRegistro', 'desc');
                    }
                    else {
                        Utils.getGrid(ApiService.PuestosAplicadosGrid, data, 'tablaPostulantes', ['Título del puesto', 'País', 'Fecha de cierre', 'Ver'], 'Descripcion,Pais,FechaCierreOferta', $scope.redirect, 5, 'totalGrid', 'IdPuesto,IdPostulante', 'FechaRegistro', 'desc');
                    }
                }

                $scope.FilterWord = function () {

                    /*Utils.clearCheckboxes();

                    var data =
                    {
                        Descripcion: { value: $scope.model.nombre, cond: OConfig.condEquals, type: OTypes.string },
                        IdPostulante: { value: decode.UserId, cond: OConfig.condEquals, type: OTypes.default }
                    }*/
                    var idsPostulante = [];
                    idsPostulante.push(decode.UserId);

                    var data = {
                        Descripcion: { value: $scope.model.nombre, cond: OConfig.condEquals, type: OTypes.string },
                        /*IdPostulante: {
                            value: decode.UserId, cond: OConfig.condEquals, type: OTypes.default
                        }*/
                        IdUsuario: { value: idsPostulante, cond: OConfig.condEquals, type: OTypes.default, comp: '||' },
                    }

                    var width = Utils.GetWidthWindow();

                    if (width <= 764) {
                        Utils.getGrid(ApiService.PuestosAplicadosGrid, data, 'tablaPostulantes', ['', ''], 'MobileColumn', $scope.redirect, 5, 'totalGrid', 'IdPuesto,IdPostulante', 'FechaRegistro', 'desc');
                    }
                    else {
                        Utils.getGrid(ApiService.PuestosAplicadosGrid, data, 'tablaPostulantes', ['Título del puesto', 'País', 'Fecha de cierre', 'Ver'], 'Descripcion,Pais,FechaCierreOferta', $scope.redirect, 5, 'totalGrid', 'IdPuesto,IdPostulante', 'FechaRegistro', 'desc', ['Descripcion'], nombre);
                    }
                }

                $scope.SeguridadJS = function () {
                    var lista = JSON.parse(sessionStorage.getItem("role"));

                    if (lista != null) {
                        var listaJs = lista.where(function (x) { return x.TipoAccionId == 3 && x.ReferenciasAux == 'VerPuestosAplicadosController'; });

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
'use strict';

(function () {
    angular
        .module('BacApp.controllers.VerPuestos', [])
        .controller('VerPuestosController',
            function ($scope, $log, RESTService, __env) {
                
                $scope.model = {};
                $scope.model.nombre = '';
                $scope.count = 0;
                $scope.IsClean = false;

                var getWebApi = function (data, table, callback) {

                    var query = Utils.getFilterParameters(data);
                    RESTService.doGet(table, query)
                        .then(callback);
                }

                var postWebApi = function (data, table, callback) {

                    var query = Utils.getFilterObject(data);
                    var entity = {
                        Objeto: query,
                        Lista: [],
                        Token: '',
                        Id: 0
                    }

                    RESTService.doPost(table, query)
                        .then(callback);
                }

                $scope.AreaLaboralGet = function () {

                    getWebApi({}, ApiService.AreaLaboralGet,
                        function (response) {
                            $scope.Areas = response.Lista;
                        }
                    )
                }

                $scope.getPaises = function () {
                    var decode = Utils.decodeJWT();

                    var data = {
                        id: { value: decode.UserId }
                    }

                    getWebApi(data, ApiService.GetPais,
                        function (response) {
                            $scope.Paises = response.Lista;
                        })
                }

                $scope.LoadGrid = function () {
                    var decode = Utils.decodeJWT();

                    var paises = eval(decode.PaisesFiltro);

                    var data = {
                        IdPais: { value: paises, cond: OConfig.condEquals, type: OTypes.default, comp: '||' }
                    };
                    var width = Utils.GetWidthWindow();

                    if (width <= 764) {
                        Utils.getGrid(ApiService.PuestoGrid, data, 'tablaPostulantes', ['', ''], 'MobileColumn', $scope.redirect, 5, 'totalGrid', 'IdPuesto', 'IdPuesto', 'desc');
                    }
                    else {
                        Utils.getGrid(ApiService.PuestoGrid, data, 'tablaPostulantes', ['Título del puesto', 'País', 'Fecha de cierre', 'Ver'], 'Puesto,Pais,FechaCierreOferta', $scope.redirect, 5, 'totalGrid', 'IdPuesto', 'IdPuesto', 'desc');
                    }
                }

                $scope.redirect = function (param) {
                    sessionStorage.setItem("volver", __env.baseUrl + "Puesto/FiltrarPuestos");
                    window.location = __env.baseUrl + 'Puesto/VerPuesto?IdPuesto=' + (param == undefined ? 0 : param.IdPuesto + '&pais=' + param.Pais);
                }

                $scope.redirect1 = function (param) {
                    window.location = __env.baseUrl + 'Puesto/MantenimientoPuesto';
                }

                $scope.ClearFilter = function () {
                    $("input[name=areas]").each(function () {
                        var value = $(this).val();
                        var result = false;

                        $(this).prop('checked', result);
                        $(this).prop('value', result);

                    });

                    $("input[name=pais]").each(function () {
                        var value = $(this).val();
                        var result = false;

                        $(this).prop('checked', result);
                        $(this).prop('value', result);

                    });

                    $("input[name=publicado]").each(function () {
                        var value = $(this).val();
                        var result = false;

                        $(this).prop('checked', result);
                        $(this).prop('value', result);

                    });
                    $scope.IsClean = true;
                    $scope.LoadGrid();
                }

                $scope.Filter = function () {

                    var areas = [];
                    var paises = [];
                    var publicado = [];
                    if ($scope.IsClean) {
                        areas = Utils.getValCheckEdit('areas');
                        paises = Utils.getValCheckEdit('pais');
                        publicado = Utils.getValCheckEdit('publicado');
                    }
                    else {
                        areas = Utils.getValCheck('areas');
                        paises = Utils.getValCheck('pais');
                        publicado = Utils.getValCheck('publicado');
                    }

                    //$scope.model.nombre = '';

                    var width = Utils.GetWidthWindow();

                    var data =
                    {
                        Puesto: { value: $scope.model.nombre, cond: OConfig.condLike, type: OTypes.string, comp: '||' },
                        IdPais: { value: paises, cond: OConfig.condEquals, type: OTypes.default, comp: '||' },
                        IdArea: { value: areas, cond: OConfig.condEquals, type: OTypes.default, comp: '||' },
                        Publicado: { value: publicado, cond: OConfig.condEquals, type: OTypes.default, comp: '||' }
                    }

                    if (width <= 764) {
                        Utils.getGrid(ApiService.PuestoGrid, data, 'tablaPostulantes', ['', ''], 'MobileColumn', $scope.redirect, 5, 'totalGrid', 'IdPuesto', 'IdPuesto', 'desc');
                    }
                    else {
                        Utils.getGrid(ApiService.PuestoGrid, data, 'tablaPostulantes', ['Título del puesto', 'País', 'Fecha de cierre', 'Ver'], 'Puesto,Pais,FechaCierreOferta', $scope.redirect, 5, 'totalGrid', 'IdPuesto', 'IdPuesto', 'desc');
                    }
                }

                $scope.FilterWord = function () {

                    Utils.clearCheckboxes();
                    var nombre = $scope.model.nombre;

                    if (width <= 764) {
                        Utils.getGrid(ApiService.PuestoGrid, {}, 'tablaPostulantes', ['', ''], 'MobileColumn', $scope.redirect, 5, 'totalGrid', 'IdPuesto', 'IdPuesto', 'desc');
                    }
                    else {
                        Utils.getGrid(ApiService.PuestoGrid, {}, 'tablaPostulantes', ['Título del puesto', 'País', 'Fecha de cierre', 'Ver'], 'Puesto,Pais,FechaCierreOferta', $scope.redirect, 5, 'totalGrid', 'IdPuesto', 'IdPuesto', 'desc', ['Puesto'], nombre);
                    }
                }

                $scope.SeguridadJS = function () {
                    var lista = JSON.parse(sessionStorage.getItem("role"));

                    if (lista != null) {
                        var listaJs = lista.where(function (x) { return x.TipoAccionId == 3 && x.ReferenciasAux == 'VerPuestosController'; });

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
'use strict';

(function () {
    angular
        .module('BacApp.controllers.VerPuestosDisponibles', [])
        .controller('VerPuestosDisponiblesController',
            function ($scope, $log, RESTService, __env) {

                $scope.model = {};
                $scope.model.nombre = '';
                $scope.count = 0;
                var getWebApi = function (data, table, callback) {

                    var query = Utils.getFilterParameters(data);
                    RESTService.doGet(table, query)
                        .then(callback);
                }

                var postWebApi = function (data, table, callback) {

                    var query = Utils.getFilterObject(data);
                    var entity = {
                        Objeto: query,
                        Lista: [],
                        Token: '',
                        Id: 0
                    }

                    RESTService.doPost(table, query)
                        .then(callback);
                }

                $scope.AreaLaboralGet = function () {

                    getWebApi({}, ApiService.AreaLaboralGet,
                        function (response) {
                            $scope.Areas = response.Lista;
                        }
                    )
                }

                $scope.getPaises = function () {
                    var decode = Utils.decodeJWT();

                    var data = {
                        id: { value: decode.UserId }
                    }

                    getWebApi(data, ApiService.GetPais,
                        function (response) {
                            $scope.Paises = response.Lista;
                        })
                }

                $scope.getPreparacionAcademica = function () {

                    getWebApi({}, ApiService.GradoAcademicoGet,
                        function (response) {
                            $scope.PreparacionAcademica = response.Lista;
                        }
                    )
                }

                $scope.getJornadaLaboral = function () {

                    getWebApi({}, ApiService.JornadaLaboralGet,
                        function (response) {
                            $scope.JornadaLaboral = response.Lista;
                        }
                    )
                }

                $scope.CleanFilter = function ()
                {
                    $scope.AreaLaboralGet();
                    $scope.getPaises();
                    $scope.getJornadaLaboral();
                    $scope.getPreparacionAcademica();
                    $scope.LoadGrid();
                }

                $scope.LoadGrid = function () {
                    var width = Utils.GetWidthWindow();

                    var decode = Utils.decodeJWT();

                    var paises = eval(decode.PaisesFiltro);

                    var data = {
                        IdPais: { value: paises, cond: OConfig.condEquals, type: OTypes.default, comp: '||' }
                    };

                    if (width <= 764) {
                        Utils.getGrid(ApiService.PuestosDisponiblesGrid, data, 'tablaPostulantes', ['', ''], 'MobileColumn', $scope.redirect, 5, 'totalGrid', 'IdPuesto', 'IdPuesto', 'desc');
                    } else {
                        Utils.getGrid(ApiService.PuestosDisponiblesGrid, data, 'tablaPostulantes', ['Título del puesto', 'País', 'Fecha de cierre', 'Ver'], 'Puesto,Pais,FechaCierreOferta', $scope.redirect, 5, 'totalGrid', 'IdPuesto', 'IdPuesto', 'desc');
                    }
                }

                $scope.redirect = function (param) {
                    sessionStorage.setItem("volver", __env.baseUrl + "Puesto/Puestosdisponibles");
                    window.location = __env.baseUrl + 'Puesto/VerPuesto?IdPuesto=' + (param == undefined ? 0 : param.IdPuesto);
                }

                $scope.redirect1 = function (param) {
                    window.location = __env.baseUrl + 'Puesto/MantenimientoPuesto';
                }

                $scope.Filter = function () {
                    var decode = Utils.decodeJWT();
                    var areas = Utils.getValCheck('areas');
                    var paises = Utils.getValCheck('pais');
                    var academica = Utils.getValCheck('academica');
                    var jornada = Utils.getValCheck('jornada');

                    //$scope.model.nombre = '';

                    if (paises.length == 0)
                    {
                        paises = eval(decode.PaisesFiltro);
                    }

                    var data =
                    {
                        Puesto: { value: $scope.model.nombre, cond: OConfig.condLike, type: OTypes.string, comp: '||' },
                        IdPais: { value: paises, cond: OConfig.condEquals, type: OTypes.default, comp: '||' },
                        IdArea: { value: areas, cond: OConfig.condEquals, type: OTypes.default, comp: '||' },
                        IdJornada: { value: jornada, cond: OConfig.condEquals, type: OTypes.default, comp: '||' },
                        IdNivelAcademico: { value: academica, cond: OConfig.condEquals, type: OTypes.default, comp: '||' }
                    }

                    var width = Utils.GetWidthWindow();

                    if (width <= 764) {
                        Utils.getGrid(ApiService.PuestosDisponiblesGrid, data, 'tablaPostulantes', ['', ''], 'MobileColumn', $scope.redirect, 5, 'totalGrid', 'IdPuesto', 'IdPuesto', 'desc');
                    } else {
                        Utils.getGrid(ApiService.PuestosDisponiblesGrid, data, 'tablaPostulantes', ['Título del puesto', 'País', 'Fecha de cierre', 'Ver'], 'Puesto,Pais,FechaCierreOferta', $scope.redirect, 5, 'totalGrid', 'IdPuesto', 'IdPuesto', 'desc');
                    }
                }

                $scope.FilterWord = function () {

                    Utils.clearCheckboxes();
                    var nombre = $scope.model.nombre;

                    var width = Utils.GetWidthWindow();

                    if (width <= 764) {
                        Utils.getGrid(ApiService.PuestosDisponiblesGrid, {}, 'tablaPostulantes', ['', ''], 'MobileColumn', $scope.redirect, 5, 'totalGrid', 'IdPuesto', 'IdPuesto', 'desc');
                    } else {
                        Utils.getGrid(ApiService.PuestosDisponiblesGrid, {}, 'tablaPostulantes', ['Título del puesto', 'País', 'Fecha de cierre', 'Ver'], 'Puesto,Pais,FechaCierreOferta', $scope.redirect, 5, 'totalGrid', 'IdPuesto', 'IdPuesto', 'desc', ['Puesto'], nombre);
                    }
                }

                $scope.VerificarSession = function () {
                    if (Utils.getUrlParameter("token") != '') {
                        if (sessionStorage.hasOwnProperty("token")) {
                            sessionStorage.removeItem('token');
                        }
                        var Token = Utils.getUrlParameter("token");
                        sessionStorage.setItem("token", Token);
                    }
                    if (!sessionStorage.hasOwnProperty("token")) {
                        var Token = Utils.getUrlParameter("token");
                        sessionStorage.setItem("token", Token);
                        console.log(Token);
                    }

                    if (!sessionStorage.hasOwnProperty("role")) {
                        var decode = Utils.decodeJWT();
                        var data = {
                            userid: { value: decode.UserId }
                        }

                        getWebApi(data, ApiService.GetMenu,
                            function (response) {
                                sessionStorage.setItem("role", response.Objeto);
                                $scope.SeguridadJS();
                            })
                    }
                    else
                    {
                        $scope.SeguridadJS();
                    }
                }

                $scope.SeguridadJS = function () {

                    var lista = JSON.parse(sessionStorage.getItem("role"));
                
                    if (lista != null) {
                    var listaJs = lista.where(function (x) { return x.TipoAccionId == 3 && x.ReferenciasAux == 'VerPuestosDisponiblesController'; });
         
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
'use strict';

(function () {
    angular
        .module('BacApp.controllers.VerUsuarios', [])
        .controller('VerUsuariosController',
            function ($scope, $log, RESTService, __env) {

                $scope.model = {};
                $scope.model.IdDescapacidad = 0;
                $scope.model.NombreCompleto = '';
                $scope.model.Borrado = 0;
                $scope.model.FechaCreacion = Date.now;
                $scope.model.pais = '';
                $scope.Paises = {};

                var getWebApi = function (data, table, callback) {

                    //Utils.Show();
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

                $scope.getPaises = function () {
                    var decode = Utils.decodeJWT();

                    var data = {
                        id: { value: decode.UserId }
                    }

                    getWebApi(data, ApiService.GetPais,
                        function (response) {
                            $scope.Paises = response.Lista;
                        })
                }

                $scope.LoadGrid = function () {
                    var paises = [];
                    var width = Utils.GetWidthWindow();

                    if ($scope.model.pais != '' && $scope.model.pais != null && $scope.model.pais != 0) {
                        paises.push($scope.model.pais);
                    }
                    else {
                        var decode = Utils.decodeJWT();
                        paises = eval(decode.PaisesFiltro);
                    }

                    var roles = [];
                    var lista = JSON.parse(sessionStorage.getItem("role"));
                    var listaJs = lista.where(function (x) { return x.TipoAccionId == 6 });
                    if (listaJs.length > 0) {
                        roles = listaJs[0].ReferenciasAux.split(',');
                    }

                    var data = {
                        IdRol: { value: roles, cond: OConfig.condLike, type: OTypes.string, comp: '||' },
                        IdPais: { value: paises, cond: OConfig.condLike, type: OTypes.string, comp: '||' }
                    };

                    if (width <= 764) {
                        Utils.getGrid(ApiService.UsuarioGrid, data, 'table', ['', ''], 'ColumnMobile', $scope.Cargar, 5, 'totalGrid', 'IdUsuario,Borrado,IdPais', 'IdUsuario', 'desc');
                    }
                    else {
                        Utils.getGrid(ApiService.UsuarioGrid, data, 'table', ['Nombre', 'Email', 'Rol', 'País', 'Ver'], 'NombreCompleto,Usuario,NombreRol,NombrePais', $scope.Cargar, 5, 'totalGrid', 'IdUsuario,Borrado,IdPais', 'IdUsuario', 'desc');
                    }
                }

                $scope.Filter = function () {
                    var paises = [];
                    var width = Utils.GetWidthWindow();

                    if ($scope.model.pais != '' && $scope.model.pais != null && $scope.model.pais != 0) {
                        paises.push($scope.model.pais);
                    }
                    else {
                        var decode = Utils.decodeJWT();

                        paises = eval(decode.PaisesFiltro);
                    }
                    var data = {
                        NombreCompleto: { value: $scope.model.NombreCompleto, cond: OConfig.condLike, type: OTypes.string, comp: '||' },
                        IdPais: { value: paises.join(), cond: OConfig.condLike, type: OTypes.string, comp: '||' }
                    };

                    if (width <= 764) {
                        Utils.getGrid(ApiService.UsuarioGrid, data, 'table', ['', ''], 'ColumnMobile', $scope.Cargar, 5, 'totalGrid', 'IdUsuario,Borrado,IdPais', 'IdUsuario', 'desc');
                    }
                    else {
                        Utils.getGrid(ApiService.UsuarioGrid, data, 'table', ['Nombre', 'Email', 'Rol', 'País', 'Ver'], 'NombreCompleto,Usuario,NombreRol,NombrePais', $scope.Cargar, 5, 'totalGrid', 'IdUsuario,Borrado,IdPais', 'IdUsuario', 'desc');
                    }
                }

                $scope.New = function () {
                    window.location = __env.baseUrl + 'Usuario/Usuarios?IdUsuario=0';
                }

                $scope.Cargar = function (param) {
                    window.location = __env.baseUrl + 'Usuario/Usuarios?IdUsuario=' + param.IdUsuario;
                }

                $scope.Guardar = function () {
                    postWebApi(
                        $scope.model,
                        ApiService.DiscapacidadSave,
                        function (response) {
                            if (response.Resultado) {
                                Utils.MessageBox(
                                    'Mantenimiento de Usuario',
                                    'Usuario',
                                    response.Mensaje,
                                    "Content/Images/IconoConfimacion1.png",
                                    function () {
                                        return false;
                                    }
                                );
                            } else {
                                Utils.MessageBox(
                                    'Mantenimiento de Usuario',
                                    'Usuario',
                                    response.Mensaje,
                                    "Content/Images/IconoErrorGeneral.png",
                                    function () {
                                        return false;
                                    }
                                );
                            }
                        }
                    );
                }

                $scope.Cancelar = function () {
                    $scope.model.Descripcion = '';
                }

                $scope.SeguridadJS = function () {
                    var lista = JSON.parse(sessionStorage.getItem("role"));

                    if (lista != null) {
                        var listaJs = lista.where(function (x) { return x.TipoAccionId == 3 && x.ReferenciasAux == 'VerUsuariosController'; });

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
'use strict';

(function () {
    angular
        .module('BacApp.controllers.Zona2', [])
        .controller('Zona2Controller',
            function ($scope, $log, RESTService, __env) {

                $scope.model = {};
                
                $scope.Zona2 = {};
                $scope.Zona2.IdZona2 = 0;
                $scope.Zona2.Descripcion = '';
                $scope.Zona2.IdZona1 = '';
                $scope.Zona2.IdPais = '';
                $scope.Zona2.FechaCreacion = Date.now;
                $scope.Zona2.Borrado = false;

                var getWebApi = function (data, table, callback) {

                    //Utils.Show();
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
                        Id: data.IdZona2
                    }

                    RESTService.doPost(table, entity)
                        .then(callback);
                }

                $scope.loadGridZona2 = function () {
                    Utils.getGrid(ApiService.Zona2Grid, {}, 'tablezona2', ['Nombre', 'Zona 1', 'Ver'], 'nombreZona2,nombreZona1', $scope.Cargar2, 5, 'totalGrid', 'IdZona2,IdPais,IdZona1,Borrado');
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
                        id: { value: $scope.Zona2.IdPais }
                    }
                    
                    getWebApi(data, ApiService.Zona1Get,
                        function (response) {
                            $scope.Zona1 = response.Lista;
                        });
                }
                
                $scope.Guardar = function () {
                    $('#popupArea').modal('hide');
                    postWebApi(
                        $scope.Zona2,
                        ApiService.Zona2Save,
                        function (response) {
                            if (response.Resultado) {
                                Utils.MessageBox(
                                    'Mantenimiento Zonas',
                                    'Zona 2',
                                    response.Mensaje,
                                    "Content/Images/IconoConfimacion1.png",
                                    function () {
                                        $scope.loadGridZona2();
                                        $scope.LimpiarPaso2();
                                        this.modal('hide');
                                        $('#popupLoading').modal('hide');
                                    }
                                );
                            } else {
                                Utils.MessageBox(
                                    'Mantenimiento Zonas',
                                    'Zona 2',
                                    response.Mensaje,
                                    "Content/Images/IconoErrorGeneral.png",
                                    function () {
                                        $scope.loadGridZona2();
                                        $scope.LimpiarPaso2();
                                        this.modal('hide');
                                        $('#popupLoading').modal('hide');
                                    }
                                );
                            }
                        }
                    );
                }

                $scope.LimpiarPaso2 = function () {
                    $scope.$apply(function () {
                        $scope.model.pais = '';
                        $scope.Zona2.IdZona2 = 0;
                        $scope.Zona2.Descripcion = '';
                        $scope.Zona2.IdZona1 = '';
                        $scope.Zona2.IdPais = '';
                        $scope.Zona2.Borrado = false;
                    });
                }

                $scope.Cargar2 = function (param) {
                    $('#popupArea').modal('hide');
                    $scope.$apply(function () {
                        $scope.Zona2.IdZona2 = param.IdZona2;
                        $scope.Zona2.Descripcion = param.nombreZona2;
                        $scope.Zona2.IdPais = param.IdPais;
                        $scope.Zona2.IdZona1 = param.IdZona1;
                        $scope.getZona();
                        $scope.Zona2.FechaCreacion = Date.now;
                        $scope.Zona2.Borrado = param.Borrado;
                    });
                }

                $scope.Cancelar = function () {
                    $('#popupArea').modal('hide');
                    $scope.LimpiarPaso2();
                }

                $scope.SeguridadJS = function () {
                    var lista = JSON.parse(sessionStorage.getItem("role"));

                    if (lista != null) {
                        var listaJs = lista.where(function (x) { return x.TipoAccionId == 3 && x.ReferenciasAux == 'Zona2Controller'; });

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
'use strict';

(function () {
    angular
        .module('BacApp.controllers.Zona3', [])
        .controller('Zona3Controller',
            function ($scope, $log, RESTService, __env) {
                $scope.Zona3 = {};
                $scope.Zona3.IdZona3 = 0;
                $scope.Zona3.Descripcion = '';
                $scope.Zona3.IdPais = '';
                $scope.Zona3.IdZona1 = '';
                $scope.Zona3.IdZona2 = '';
                $scope.Zona3.Borrado = false;
                $scope.Zona3.FechaCreacion = Date.now;

                var getWebApi = function (data, table, callback) {

                    //Utils.Show();
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
                        Id: data.IdZona3
                    }

                    RESTService.doPost(table, entity)
                        .then(callback);
                }

                $scope.loadGridZona3 = function () {
                    Utils.getGrid(ApiService.Zona3Grid, {}, 'tablezona3', ['Nombre', 'Zona 2', 'Ver'], 'NombreZona3,NombreZona2', $scope.Cargar3, 5, 'totalGrid', 'IdZona3,IdPais,IdZona1,IdZona2,Borrado');
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
                        id: { value: $scope.Zona3.IdPais }
                    }

                    getWebApi(data, ApiService.Zona1Get,
                        function (response) {
                            $scope.Zona1 = response.Lista;
                        });
                }

                $scope.Zona2Get = function () {

                    var data = {
                        id: { value: $scope.Zona3.IdZona1 }
                    }
                    
                    getWebApi(data, ApiService.Zona2Get,
                        function (response) {
                            $scope.Zona2 = response.Lista;
                        }
                    );
                }

                $scope.Zona3Get = function () {
                    
                }

                $scope.Guardar = function () {
                    $('#popupArea').modal('hide');
                    postWebApi(
                        $scope.Zona3,
                        ApiService.Zona3Save,
                        function (response) {
                            if (response.Resultado) {
                                Utils.MessageBox(
                                    'Mantenimiento Zonas',
                                    'Zona 3',
                                    response.Mensaje,
                                    "Content/Images/IconoConfimacion1.png",
                                    function () {
                                        $scope.loadGridZona3();
                                        $scope.LimpiarPaso3();
                                        this.modal('hide');
                                        $('#popupLoading').modal('hide');
                                    }
                                );
                            } else {
                                Utils.MessageBox(
                                    'Mantenimiento Zonas',
                                    'Zona 3',
                                    response.Mensaje,
                                    "Content/Images/IconoErrorGeneral.png",
                                    function () {
                                        $scope.loadGridZona3();
                                        $scope.LimpiarPaso3();
                                        this.modal('hide');
                                        $('#popupLoading').modal('hide');
                                    }
                                );
                            }
                        }
                    );

                }

                $scope.LimpiarPaso3 = function () {
                    $scope.$apply(function () {
                        $scope.model.pais = '';
                        $scope.Zona3.IdZona3 = 0;
                        $scope.Zona3.Descripcion = '';
                        $scope.Zona3.IdZona1 = '';
                        $scope.Zona3.IdPais = '';
                        $scope.Zona3.IdZona2 = '';
                        $scope.Zona3.Borrado = false;
                    });
                }

                $scope.Cargar3 = function (param) {
                    $('#popupArea').modal('show');
                    $scope.$apply(function () {
                        $scope.Zona3.IdZona3 = param.IdZona3;
                        $scope.Zona3.Descripcion = param.NombreZona3;
                        $scope.Zona3.Borrado = param.Borrado;
                        $scope.Zona3.FechaCreacion = Date.now;
                        $scope.Zona3.IdPais = param.IdPais;
                        $scope.getZona();
                        $scope.Zona3.IdZona1 = param.IdZona1;
                        $scope.Zona2Get();
                        $scope.Zona3.IdZona2 = param.IdZona2;
                    });
                }

                $scope.Cancelar = function () {
                    $('#popupArea').modal('hide');
                    $scope.LimpiarPaso3();
                }

                $scope.SeguridadJS = function () {
                    var lista = JSON.parse(sessionStorage.getItem("role"));

                    if (lista != null) {
                        var listaJs = lista.where(function (x) { return x.TipoAccionId == 3 && x.ReferenciasAux == 'Zona3Controller'; });

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
'use strict';

(function () {
    angular
        .module('BacApp.controllers.Zona', [])
        .controller('ZonaController',
            function ($scope, $log, RESTService, __env) {

                $scope.Zona1 = {};
                $scope.Zona1.IdZona1 = 0;
                $scope.Zona1.Descripcion = '';
                $scope.Zona1.IdPais = '';
                $scope.Zona1.FechaCreacion = Date.now;
                $scope.Zona1.Borrado = false;

                var getWebApi = function (data, table, callback) {

                    //Utils.Show();
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
                        Id: data.IdZona1
                    }

                    RESTService.doPost(table, entity)
                        .then(callback);
                }

                $scope.loadGridZona1 = function () {
                    Utils.getGrid(ApiService.Zona1Grid, {}, 'tablezona1', ['Nombre', 'País', 'Ver'], 'nombreZona,nombrePais', $scope.Cargar1, 5, 'totalGrid', 'IdZona1,IdPais,Borrado');
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
                
                $scope.Guardar = function () {
                    $('#popupArea').modal('hide');
                    postWebApi(
                        $scope.Zona1,
                        ApiService.Zona1Save,
                        function (response) {
                            if (response.Resultado) {
                                Utils.MessageBox(
                                    'Mantenimiento Zonas',
                                    'Zona 1',
                                    response.Mensaje,
                                    "Content/Images/IconoConfimacion1.png",
                                    function () {
                                        $scope.loadGridZona1();
                                        $scope.LimpiarPaso1();
                                        this.modal('hide');
                                        $('#popupLoading').modal('hide');
                                    }
                                );
                            } else {
                                Utils.MessageBox(
                                    'Mantenimiento Zonas',
                                    'Zona 1',
                                    response.Mensaje,
                                    "Content/Images/IconoErrorGeneral.png",
                                    function () {
                                        $scope.loadGridZona1();
                                        $scope.LimpiarPaso1();
                                        this.modal('hide');
                                        $('#popupLoading').modal('hide');
                                    }
                                );
                            }
                        }
                    );
                }

                $scope.LimpiarPaso1 = function () {
                    $scope.$apply(function () {
                        $scope.Zona1.IdPais = '';
                        $scope.Zona1.IdZona1 = 0;
                        $scope.Zona1.Descripcion = '';
                        $scope.Zona1.Borrado = false;
                        $scope.Zona1.FechaCreacion = Date.now;
                    });
                }

                $scope.Cargar1 = function (param) {
                    $('#popupArea').modal('show');
                    $scope.$apply(function () {
                        $scope.Zona1.IdZona1 = param.IdZona1;
                        $scope.Zona1.Descripcion = param.nombreZona;
                        $scope.Zona1.IdPais = param.IdPais;
                        $scope.Zona1.FechaCreacion = Date.now;
                        $scope.Zona1.Borrado = param.Borrado;
                    });
                }

                $scope.Cancelar = function () {
                    $scope.LimpiarPaso1();
                }

                $scope.SeguridadJS = function () {
                    var lista = JSON.parse(sessionStorage.getItem("role"));

                    if (lista != null) {
                        var listaJs = lista.where(function (x) { return x.TipoAccionId == 3 && x.ReferenciasAux == 'ZonaController'; });

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
'use strict';
(function () {
    angular
        .module('BacApp.directives.modal', [])
        .directive('modal', Directive);

    function Directive(ModalServices) {
        return {
            link: function (scope, element, attrs) {
                // ensure id attribute exists
                if (!attrs.id) {
                    console.error('modal must have an id');
                    return;
                }

                // move element to bottom of page (just before </body>) so it can be displayed above everything else
                element.appendTo('body');

                // close modal on background click
                element.on('click', function (e) {
                    var target = $(e.target);
                    if (!target.closest('.modal-body').length) {
                        scope.$evalAsync(Close);
                    }
                });

                // add self (this modal instance) to the modal service so it's accessible from controllers
                var modal = {
                    id: attrs.id,
                    open: Open,
                    close: Close
                };
                ModalServices.Add(modal);

                // remove self from modal service when directive is destroyed
                scope.$on('$destroy', function () {
                    ModalServices.Remove(attrs.id);
                    element.remove();
                });

                // open modal
                function Open() {
                    element.show();
                    $('body').addClass('modal-open');
                }

                // close modal
                function Close() {
                    element.hide();
                    $('body').removeClass('modal-open');
                }
            }
        };
    }
})();