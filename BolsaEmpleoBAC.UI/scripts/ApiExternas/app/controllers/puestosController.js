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