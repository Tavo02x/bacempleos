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