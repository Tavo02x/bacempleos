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