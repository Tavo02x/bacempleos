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
