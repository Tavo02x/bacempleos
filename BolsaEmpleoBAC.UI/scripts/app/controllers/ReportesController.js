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