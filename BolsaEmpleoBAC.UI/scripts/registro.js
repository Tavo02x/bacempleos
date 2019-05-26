let rangoSalarios;

let postulante = {
    IdPostulante: 0,
    OtraDiscapacidad: "",
    Profesion: "",
    DescripcionCualidades: "",
    DescripcionVentajaCompetitiva: "",
};
let credenciales = {
    IdUsuario: 0,
    Borrado: 0,
    IdTipoLogin: 1
}
let idiomas = [];
let informacionAcademica = [];
let paises = [];
let discapacidades = [];
let referenciasLaborales = [];
let areas = [];
let experiencia = [];
let habilidades = [];

function fnVerificarDatos(numPaso) {
    switch (numPaso - 1) {
        case 1:
            if ($("#txt-correo-electronico").val() == "") return false;

            fnValidarCorreoElectronico();
            return false;
        case 2:
            if ($("#txt-contrasena").val() == "") return false;
            credenciales["Password"] = md5($("#txt-contrasena").val());
            return true;
        case 3:
            if ($("#txt-identificacion").val() == "") return false;
            postulante["Identificacion"] = $("#txt-identificacion").val();
            return true;
        case 4:
            if ($("#txt-nombre").val() == "") return false;
            postulante["NombreCompleto"] = $("#txt-nombre").val();
            credenciales["NombreCompleto"] = $("#txt-nombre").val();
            return true;
        case 5:
            if ($(".btn-genero.activo").length == 0) return false;
            postulante["Genero"] = $(".btn-genero.activo").attr("data-value");
            return true;
        case 6:
            if ($(".btn-estado-civil.activo").length == 0) return false;
            postulante["IdEstadoCivil"] = $(".btn-estado-civil.activo").attr("id-estado-civil");
            return true;
        case 7:
            if ($("#txt-fecha-nacimiento-anno").val() == "" || $("#slt-fecha-nacimiento-mes").val() == "" || $("#txt-fecha-nacimiento-dia").val() == "") return false;
            let year = Number($("#txt-fecha-nacimiento-anno").val());
            let month = Number($("#slt-fecha-nacimiento-mes").val());
            let day = Number($("#txt-fecha-nacimiento-dia").val());
            postulante["FechaNacimiento"] = new Date(year, month-1, day).toISOString();
            return true;
        case 8:
            if ($("#slt-pais-nacimiento").val() == "") return false;
            postulante["Nacionalidad"] = $("#slt-pais-nacimiento").val();
            credenciales["IdPais"] = $("#slt-pais-nacimiento").val(); 
            return true;
        case 9:
            if ($("#txt-telefono").val() == "") return false;
            postulante["Telefono"] = $("#txt-telefono").val();
            return true;
        case 10:
            if ($(".btn-pais.activo").length == 0) return false;
            postulante["PaisRecidencia"] = $(".btn-pais.activo").attr("id-pais");
            fnObtenerZona1();
            return true;
        case 11:
            if ($("#slt-zona1").val() == "") return false;
            postulante["IdZona1"] = $("#slt-zona1").val();
            fnObtenerZona2();
            return true;
        case 12:
            if ($("#slt-zona2").val() == "") return false;
            postulante["IdZona2"] = $("#slt-zona2").val();
            fnObtenerZona3();
            return true;
        case 13:
            if ($("#slt-zona3").val() == "") return false;
            postulante["IdZona3"] = $("#slt-zona3").val();
            return true;
        case 14:
            if ($("#img-foto").length == 0) return false;
            postulante["ImagenURL"] = $("#img-foto").attr("src");
            return true;
        case 15:
            if ($(".btn-estudia.activo").length == 0) return false;
            postulante["EstudiaActualidad"] = $(".btn-estudia.activo").attr("data-value");
            return true;
        case 16:
            let pInformacionAcademica = [];
            $("#div-informacion-academica>section").each(function () {
                pInformacionAcademica.push({
                    "Descripcion": $(this).find(".descripcion").text(),
                    "Institucion": $(this).find(".institucion").text(),
                    "TipoCertificacion": $(this).find(".tipo-certificacion").attr("data-value")
                });
            });
            informacionAcademica = pInformacionAcademica;
            return true;
        case 17:
            if ($(".btn-exempleado.activo").length == 0) return false;
            postulante["TrabajoBAC"] = $(".btn-exempleado.activo").attr("data-value");
            return true;
        case 18:
            let pExperiencia = [];
            $("#div-informacion-experiencia>section").each(function () {
                pExperiencia.push({
                    "Puesto": $(this).find(".puesto").text(),
                    "Empresa": $(this).find(".empresa").text(),
                    "DescripcionPuesto": $(this).find(".descripcionExp").text()
                });
            });
            experiencia = pExperiencia;
            return true;
        case 19:
            let pIdiomas = [];
            $("#div-informacion-idioma>section").each(function () {
                pIdiomas.push({
                    "IdIdioma": $(this).find(".idioma").attr("data-value"),
                    "Porcentaje": $(this).find(".porcentaje").attr("data-value")
                });
            });
            idiomas = pIdiomas;
            return true;
        case 20:
            if ($(".chk-habilidad:checked").length == 0) return false;
            let pHabilidades = [];
            $(".chk-habilidad:checked").each(function () {
                pHabilidades.push({ "IdHabilidad": $(this).val() });
            });
            habilidades = pHabilidades;
            return true;
        case 21:
            let referencias = [];
            $("#div-informacion-referencia>section").each(function () {
                referencias.push({
                    "UrlReferencia": $(this).find(".referencia").text()
                });
            });
            referenciasLaborales = referencias;
            $("#modal-bac-contamos").modal();
            return true;
        case 22:
            if ($(".chk-area:checked").length == 0) return false;
            let pAreas = [];
            $(".chk-area:checked").each(function () {
                pAreas.push({ "IdArea": $(this).val() });
            });
            areas = pAreas;
            return true;
        case 23:
            if ($(".chk-pais-trabajar:checked").length == 0) return false;
            let pPaises = [];
            $(".chk-pais-trabajar:checked").each(function () {
                pPaises.push({ "IdPais": $(this).val() });
            });
            paises = pPaises;
            $("#modal-bac-reforzamos").modal();
            return true;
        case 24:
            postulante["IdPretensionSalarial"] = rangoSalarios[$("#range-pretension-salarial").val() - 1].IdPretension;
            $("#modal-bac-reforzamos").modal();
            return true;
        case 25:
            let pDiscapacidades = [];
            $(".chk-discapacidad:checked").each(function () {
                pDiscapacidades.push({ "IdDiscapacidad": $(this).val() });
            });
            discapacidades = pDiscapacidades;
            return true;
        case 26:
            if ($(".btn-vehiculo.activo").length == 0) return false;
            postulante["Vehiculo"] = $(".btn-vehiculo.activo").attr("data-value");
            return true;
        case 27:
            if ($(".chk-licencia:checked").length == 0) return false;
            /*let licencias = [];
            $(".chk-licencia:checked").each(function () {
                licencias.push({ "IdLicencia": $(this).val() });
            });*/
            postulante["IdTipoLicencia"] = $(".chk-licencia:checked").val();
            return true;      
        case 28:
            if ($("#i-cv").length == 0) return false;
            postulante["CurriculumURL"] = $("#i-cv").attr("data-url");
            postulante["OtraDiscapacidad"] = "";
            postulante["Profesion"] = "";
            postulante["DescripcionCualidades"] = "";
            postulante["DescripcionVentajaCompetitiva"] = "";
            fnRegistrar();
            return true;
    }
    return true;
}

function fnPasoAnterior(numPaso) {
    let duracion = 200;

    $("#paso" + numPaso).hide("slide", { direction: "right" }, duracion, function () {
        $("#paso" + (numPaso - 1)).show("slide", { direction: "left" }, duracion);
    });
}

function fnPasoSiguiente(numPaso) {
    let duracion = ((numPaso == 12 || numPaso == 13) && $(".btn-pais.activo").attr("id-pais") != 1) ? 50 : 200;

    if (fnVerificarDatos(numPaso)) {
        $("#paso" + (numPaso - 1)).hide("slide", { direction: "left" }, duracion, function () {
            $("#paso" + numPaso).show("slide", { direction: "right" }, duracion);
        });
    }
}

function fnLlmadaHttp(url, type, data, onSuccess, onError) {
    $.ajax({
        url: __env.apiUrl + url,
        type: type,
        data: data,
        success: function (response, textStatus, jqXHR) {

            if (onSuccess != null || onSuccess != undefined) {
                onSuccess(response);
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {

            if (jqXHR.responseJSON != null && jqXHR.responseJSON != undefined) {

            }
            else if (onError != null || onError != undefined) {
                onError(textStatus);
            }
        }
    });
}

function fnSeleccionarGenero(elemento) {
    $(".btn-genero.activo").removeClass("activo");
    $(elemento).addClass("activo");
}

function fnSeleccionarEstadoCivil(elemento) {
    $(".btn-estado-civil.activo").removeClass("activo");
    $(elemento).addClass("activo");
}

function fnSeleccionarPais(elemento) {
    $(".btn-pais.activo").removeClass("activo");
    $(elemento).addClass("activo");
}

function fnSeleccionarExempleado(elemento) {
    $(".btn-exempleado.activo").removeClass("activo");
    $(elemento).addClass("activo");
}

function fnSeleccionarVehiculo(elemento) {
    $(".btn-vehiculo.activo").removeClass("activo");
    $(elemento).addClass("activo");
}

function fnSeleccionarPaisTrabajar(elemento) {
    $(".btn-pais-a-trabajar.activo").removeClass("activo");
    $(elemento).addClass("activo");
}

function fnSeleccionarEstudia(elemento) {
    $(".btn-estudia.activo").removeClass("activo");
    $(elemento).addClass("activo");
}

function fnAgregarTitulo() {
    let titulo = $("#txt-titulo").val();
    let gradoAcademico = $("#slt-grado-academico option:selected").text();
    let gradoAcademicoId = $("#slt-grado-academico").val();
    let institucion = $("#txt-institucion").val() ;

    if (titulo == "" || gradoAcademico == "" || institucion == "") return;

    $("#div-informacion-academica").append(
        `<section>
            <div>
                <span class="descripcion">${titulo}</span>
                <button class="mdl-button mdl-js-button" onclick="fnRemoverItem(this)">x</button>
            </div>
            <div><span class="tipo-certificacion" data-value="${gradoAcademicoId}">${gradoAcademico}</span></div>
            <div><span class="institucion">${institucion}</span></div>
        </section>`);
    $("#header-info-agregada-academica").show();
}

function fnAgregarExperiencia() {
    let puesto = $("#txt-puesto").val();
    let empresa = $("#txt-puesto-empresa").val();
    let descripcion = $("#txt-puesto-descripcion").val();

    if (puesto == "" || empresa == "" || descripcion == "") return;

    $("#div-informacion-experiencia").append(
        `<section>
            <div>
                <span class="puesto">${puesto}</span>
                <button class="mdl-button mdl-js-button" onclick="fnRemoverItem(this)">x</button>
            </div>
            <div><span class="empresa">${empresa}</span></div>
            <div><span class="descripcionExp">${descripcion}</span></div>
        </section>`);
    $("#header-info-agregada-experiencia").show();
}

function fnAgregarIdioma() {
    let idioma = $("#slt-idioma option:selected").text();
    let idIdioma = $("#slt-idioma").val();
    let porcentaje = $("#slt-idioma-nivel option:selected").text();
    let numPorcentaje = $("#slt-idioma-nivel").val();

    if (idIdioma == "" || numPorcentaje == "") return;

    $("#div-informacion-idioma").append(
        `<section>
            <div>
                <span class="idioma" data-value="${idIdioma}">${idioma}</span>
                <button class="mdl-button mdl-js-button" onclick="fnRemoverItem(this)">x</button>
            </div>
            <div><span class="porcentaje" data-value="${numPorcentaje}">${porcentaje}</span></div>
        </section>`);
    $("#header-info-agregada-idioma").show();
}

function fnAgregarReferencia() {
    let referencia = $("#txt-referencia").val();

    if (referencia == "") return;

    $("#div-informacion-referencia").append(
        `<section>
            <div>
                <span class="referencia">${referencia}</span>
                <button class="mdl-button mdl-js-button" onclick="fnRemoverItem(this)">x</button>
            </div>
            <div><br></div>
            
        </section>`);
    $("#header-info-agregada-referencia").show();
}

function fnRemoverItem(element) {
    $(element).parent().parent().remove();
    if ($("#div-informacion-academica").html().trim() == "") $("#header-info-agregada-academica").hide();
    if ($("#div-informacion-experiencia").html().trim() == "") $("#header-info-agregada-experiencia").hide();
    if ($("#div-informacion-idioma").html().trim() == "") $("#header-info-agregada-idioma").hide();
    if ($("#div-informacion-referencia").html().trim() == "") $("#header-info-agregada-referencia").hide();
}

function fnObtenerZona1() {
    let idPais = $(".btn-pais.activo").attr("id-pais");
    let nombreZona1 = "";
    let $sltZona = $("#slt-zona1");
    let $lblZona = $("#lbl-zona1");
    if (idPais == 1 || idPais == 2) {
        nombreZona1 = "provincia";
    }
    else {
        nombreZona1 = "departamento"; 
    }
    $("#zona1-title").html(`¿En cuál ${nombreZona1} vives?`);
    
    $sltZona.html("");
    $lblZona.text("Cargando...");

    fnLlmadaHttp(ApiService.Zona1Get + "?Id=" + idPais, "GET", {},
        function (data) {
            let lista = data.Lista;
            strLista = `<option value="" disabled selected></option>`;
            lista.forEach(function (element) {
                strLista += `<option value="${element.IdZona1}">${element.Descripcion}</option>`;
            });
            $sltZona.html(strLista);
            $lblZona.text(capitalize(nombreZona1));
        },
        function (data) {
            console.log("Error:")
            console.log(data);
        }
    );
}

function fnObtenerZona2() {
    let idPais = $(".btn-pais.activo").attr("id-pais");
    let nombreZona2 = "";
    let idZona1 = $("#slt-zona1").val();
    let $sltZona = $("#slt-zona2");
    let $lblZona = $("#lbl-zona2");
    if (idPais == 1) {
        nombreZona2 = "cantón";
    } else {
        nombreZona2 = "municipio";
    }
    $("#zona2-title").html(`¿En cuál ${nombreZona2} vives?`);

    $sltZona.html("");
    $lblZona.text("Cargando...");

    fnLlmadaHttp(ApiService.Zona2Get + "?Id=" + idZona1, "GET", {},
        function (data) {
            let lista = data.Lista;
            strLista = `<option value="" disabled selected></option>`;
            lista.forEach(function (element) {
                strLista += `<option value="${element.IdZona2}">${element.Descripcion}</option>`;
            });
            $sltZona.html(strLista);
            $lblZona.text(capitalize(nombreZona2));
        },
        function (data) {
            console.log("Error:")
            console.log(data);
        }
    );
}

function fnObtenerZona3() {
    let idPais = $(".btn-pais.activo").attr("id-pais");
    let idZona2 = $("#slt-zona2").val();
    let $sltZona = $("#slt-zona3");
    let $lblZona = $("#lbl-zona3");
    if (idPais == 1) {
        $("#div-zona3").show();
        $("#zona3-title").html("¿En cuál distrito vives?");

        $sltZona.html("");
        $lblZona.text("Cargando...");
         
        fnLlmadaHttp(ApiService.Zona3Get + "?Id=" + idZona2, "GET", {},
            function (data) {
                let lista = data.Lista;
                strLista = `<option value="" disabled selected></option>`;
                lista.forEach(function (element) {
                    strLista += `<option value="${element.IdZona3}">${element.Descripcion}</option>`;
                });
                $sltZona.html(strLista);
                $lblZona.text(capitalize("distrito"));
            },
            function (data) {
                console.log("Error:")
                console.log(data);
            }
        );
    } else {
        $("#div-zona3").hide();
        $("#zona3-title").html("Este país no aplica la tercera zona.");
        console.log("fastfoward")
        setTimeout(function () {
            fnPasoSiguiente(14);
        }, 100);
    }

}

function capitalize(s) {
    if (typeof s !== 'string') return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
}

function fnObtenerExtencion(filename) {
    return filename.toLowerCase().slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
}

function fnEnviarArchivo(data, onSuccess, onError) {
    $.ajax({
        url: __env.apiUrl + ApiService.UploadFile,
        type: 'POST',
        data: data,
        contentType: false,
        processData: false,
        success: function (response, textStatus, jqXHR) {
            if (onSuccess != null || onSuccess != undefined) {
                onSuccess(response);
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.responseJSON != null && jqXHR.responseJSON != undefined) {

            }
            else if (onError != null || onError != undefined) {
                onError(textStatus);
            }
        }
    });
}

function fnSubirArchivo($inputFile, maxSize, formatos, tipo) {
    $("#mensaje-error-" + tipo).html("");
    $("#div-" + tipo).html(`<div class="loader" id="loader">Loading...</div>`);
    $(".btn-atras").attr("disabled", "disabled");
    $(".btn-continuar").attr("disabled", "disabled");
    var file = $inputFile[0].files[0];
    var size = file.size;
    var name = file.name;
    var comparador = Math.round(((size / 1024) / 1024) * 100) / 100;
    var ext = fnObtenerExtencion(name);
    var sizeValid = true;
    var formatValid = true;
    var msjSize = "";
    var msjFormato = "";

    if (+comparador > +maxSize) {
        sizeValid = false;
        msjSize = "El archivo tiene un tamaño de " + comparador + " MB y este es superior al permitido de " + maxSize + " MB.";
    }

    if (formatos.indexOf(ext) === -1) {
        formatValid = false;
        msjFormato = "El archivo tiene la extensión '" + ext + "' que no esta dentro de las permitidas, que son: " + formatos;
    }

    if (sizeValid && formatValid) {
        var formData = new FormData();
        formData.append('file', file);

        fnEnviarArchivo(formData,
            function (response) {
                if (tipo == "foto") {
                    $("#div-" + tipo).html(`<img src="${response}" id="img-foto" />`);
                } else {
                    $("#div-" + tipo).html(`<i class="fa fa-check fa-10x" id="i-cv" data-url="${response}"></i>`);
                }
                $inputFile.val(null);
                $(".btn-atras").removeAttr("disabled");
                $(".btn-continuar").removeAttr("disabled");
            },
            function (response) {
                console.log("error");
                console.log(response);
                $inputFile.val(null);
                if (tipo == "foto") {
                    $("#div-" + tipo).html(`<i class="fa fa-user fa-10x"></i>`);
                } else {
                    $("#div-" + tipo).html(`<i class="fa fa-file fa-10x"></i>`);
                }
                $("#mensaje-error-" + tipo).html(response);
                $(".btn-atras").removeAttr("disabled");
                $(".btn-continuar").removeAttr("disabled");
            }

        );
    } else {
        console.log("error");
        $inputFile.val(null);
        if (tipo == "foto") {
            $("#div-" + tipo).html(`<i class="fa fa-user fa-10x"></i>`);
        } else {
            $("#div-" + tipo).html(`<i class="fa fa-file fa-10x"></i>`);
        }
        $("#mensaje-error-" + tipo).html((sizeValid ? '' : msjSize) + (formatValid ? '' : msjFormato ));
        $(".btn-atras").removeAttr("disabled");
        $(".btn-continuar").removeAttr("disabled");
    }
}

$("#file-foto").change(function () {
    fnSubirArchivo($('#file-foto'), __env.MaxSizeImagen, __env.FormatosImagen, "foto");
});

$("#div-foto").click(function () {
    $("#file-foto").click()
});

$("#file-cv").change(function () {
    fnSubirArchivo($('#file-cv'), __env.MaxSizeDoc, __env.FormatosDoc, "cv");
});

$("#div-cv").click(function () {
    $("#file-cv").click()
});

function fnObtenerPaises() {
    $("#div-pais-residencia").html("Cargando...");
    $("#div-pais-a-trabajar").html("Cargando...");
    fnLlmadaHttp(ApiService.GetPaises, "GET", {},
        function (data) {
            let lista = data.Lista;
            strListaResidencia = "";
            strListaTrabajar = "";
            lista.forEach(function (element) {
                strListaResidencia += `
                    <div class="mdl-cell mdl-cell--6-col">
                        <button class="mdl-button mdl-js-button mdl-js-ripple-effect btn-seleccionar-uno btn-pais" id-pais="${element.IdPais}" onclick="fnSeleccionarPais(this)">
                            ${element.Descripcion}
                        </button>
                    </div>`;
                strListaTrabajar += `<div class="mdl-cell mdl-cell--6-col">
                                        <label class="lbl-checkbox">${element.Descripcion}
                                            <input type="checkbox" class="chk-pais-trabajar" name="chk-pais-trabajar" value="${element.IdPais}">
                                            <span class="checkmark"></span>
                                        </label>
                                    </div>`;
            });
            if (lista.length % 2 == 1) {
                strListaResidencia += `<div class="mdl-cell mdl-cell--6-col"></div>`;
            }
            $("#div-pais-residencia").html(strListaResidencia);
            $("#div-pais-a-trabajar").html(strListaTrabajar);
        },
        function (data) {
            console.log("Error:")
            console.log(data);
        }
    );
}

function fnObtenerGradoAcademico() {
    let $sltZona = $("#slt-grado-academico");
    let $lblZona = $("#lbl-grado-academico");
    $sltZona.html("");
    $lblZona.text("Cargando...");
    fnLlmadaHttp(ApiService.GradoAcademicoGet, "GET", {},
        function (data) {
            let lista = data.Lista;
            strLista = `<option value="" disabled selected></option>`;
            lista.forEach(function (element) {
                strLista += `<option value="${element.IdNivelAcademico}">${element.Descripcion}</option>`;
            });
            $sltZona.html(strLista);
            $lblZona.text("Grado Académico");
        },
        function (data) {
            console.log("Error:")
            console.log(data);
        }
    );
}

function fnObtenerNivelIdioma() {
    let $sltZona = $("#slt-idioma");
    let $lblZona = $("#lbl-idioma");
    $sltZona.html("");
    $lblZona.text("Cargando...");
    fnLlmadaHttp(ApiService.getIdioma, "GET", {},
        function (data) {
            let lista = data.Lista;
            strLista = `<option value="" disabled selected></option>`;
            lista.forEach(function (element) {
                strLista += `<option value="${element.IdIdioma}">${element.Descripcion}</option>`;
            });
            $sltZona.html(strLista);
            $lblZona.text("Idioma");
        },
        function (data) {
            console.log("Error:")
            console.log(data);
        }
    );
}

function fnObtenerHabilidades() {
    $("#div-habilidad").html("Cargando...");
    fnLlmadaHttp(ApiService.HabilidadGet, "GET", {},
        function (data) {
            let lista = data.Lista;
            strLista = "";
            lista.forEach(function (element) {
                strLista += `<div class="mdl-cell mdl-cell--6-col">
                                <label class="lbl-checkbox">${element.Descripcion}
                                  <input type="checkbox" class="chk-habilidad" name="chk-habilidad" value="${element.IdHabilidad}">
                                  <span class="checkmark"></span>
                                </label>
                            </div>`;
            });
            if (lista.length % 2 == 1) {
                strLista += `<div class="mdl-cell mdl-cell--6-col"></div>`;
            }
            $("#div-habilidad").html(strLista);
        },
        function (data) {
            console.log("Error:")
            console.log(data);
        }
    );
}

function fnObtenerAreas() {
    $("#div-area").html("Cargando...");
    fnLlmadaHttp(ApiService.AreaLaboralGet, "GET", {},
        function (data) {
            let lista = data.Lista;
            strLista = "";
            lista.forEach(function (element) {
                strLista += `<label class="lbl-checkbox">${element.Area}
                                <input type="checkbox" class="chk-area" name="chk-area" value="${element.IdArea}">
                                <span class="checkmark"></span>
                            </label>`;
            });
            if (lista.length % 2 == 1) {
            }
            $("#div-area").html(strLista);
        },
        function (data) {
            console.log("Error:")
            console.log(data);
        }
    );
}

function fnObtenerPretensionSalarial() {
    $("#lbl-pretension-salarial").html("Cargando...");
    fnLlmadaHttp(ApiService.PretensionSalarialGet, "GET", {},
        function (data) {
            rangoSalarios = data.Lista;
            $("#range-pretension-salarial").attr("max", rangoSalarios.length);
            $("#lbl-pretension-salarial").text(rangoSalarios[0].Descripcion);
            $("#lbl-pretension-salarial").attr("salario-id", rangoSalarios[0].IdPretension);
        },
        function (data) {
            console.log("Error:")
            console.log(data);
        }
    );
}

$("#range-pretension-salarial").on('input', function () {
    let index = $("#range-pretension-salarial").val()-1;
    $("#lbl-pretension-salarial").text(rangoSalarios[index].Descripcion);
    $("#lbl-pretension-salarial").attr("salario-id", rangoSalarios[index].IdPretension);
});

function fnObtenerDiscapacidades() {
    $("#div-discapacidad").html("Cargando...");
    fnLlmadaHttp(ApiService.DiscapacidadGet, "GET", {},
        function (data) {
            let lista = data.Lista;
            strLista = "";
            lista.forEach(function (element) {
                strLista += `<div class="mdl-cell mdl-cell--6-col">
                                <label class="lbl-checkbox">${element.Descripcion}
                                  <input type="checkbox" class="chk-discapacidad" name="chk-discapacidad" value="${element.IdDescapacidad}">
                                  <span class="checkmark"></span>
                                </label>
                            </div>`;
            });
            if (lista.length % 2 == 1) {
                strLista += `<div class="mdl-cell mdl-cell--6-col"></div>`;
            }
            $("#div-discapacidad").html(strLista);
        },
        function (data) {
            console.log("Error:")
            console.log(data);
        }
    );
}

function fnObtenerLicencias() {
    $("#div-licencia").html("Cargando...");
    fnLlmadaHttp(ApiService.GetLicencias, "GET", {},
        function (data) {
            let lista = data.Lista;
            strLista = "";
            lista.forEach(function (element) {
                strLista += `<div class="mdl-cell mdl-cell--12-col">
                                <label class="lbl-checkbox">${element.Descripcion}
                                  <input type="checkbox" id="chk-licencia-${element.IdTipoLicencia}" onclick="fnSeleccionarLicencias(this, ${element.IdTipoLicencia})" class="chk-licencia" name="chk-licencia" value="${element.IdTipoLicencia}">
                                  <span class="checkmark"></span>
                                </label>
                            </div>`;
            });
            $("#div-licencia").html(strLista);
        },
        function (data) {
            console.log("Error:")
            console.log(data);
        }
    );
}

function fnSeleccionarLicencias(element, id) {
    let checked = $(element).is(":checked");
    if (!checked) return false;
    if (id == 7) {
        $(".chk-licencia:checked").prop("checked", false);
        $("#chk-licencia-7").prop("checked", true);
    } else {
        $("#chk-licencia-7").prop("checked", false);
    }

}

function fnValidarCorreoElectronico() {
    $("#modal-comprobar-email").modal();
    $("#div-modal-comprobar").html(`<div class="loader" id="loader">Loading...</div>`);
    let email = $("#txt-correo-electronico").val();

    fnLlmadaHttp(`${ApiService.ValidateEmail}?email=${email}`, "GET", {},
        function (data) {
            console.log(data);
            if (data.Objeto != true) {
                $(".close-modal").click();
                postulante["Email"] = $("#txt-correo-electronico").val();
                credenciales["Email"] = $("#txt-correo-electronico").val();
                credenciales["Usuario1"] = $("#txt-correo-electronico").val();
                $("#paso1").hide("slide", { direction: "left" }, 200, function () {
                    $("#paso2").show("slide", { direction: "right" }, 200);
                });
            } else {
                $("#div-modal-comprobar").html(data.Mensaje);
            }
        },
        function (data) {
            console.log("Error:");
            console.log(data);
        }
    );
}

function fnRegistrar() {
    let params = {
        Objeto: {
            PostulanteInfo: postulante,
            Credenciales: credenciales,
            Idiomas: idiomas,
            InformacionAcademica: informacionAcademica,
            Paises: paises,
            Discapacidades: discapacidades, 
            ReferenciasLaborales: referenciasLaborales,
            Areas: areas,
            Experiencia: experiencia,
            Habilidades: habilidades
        },
        Lista: [],
        Token: "",
        Id: 0
    }

    console.log(params);
    fnLlmadaHttp(ApiService.SavePostulante, "POST", params,
        function (data) {
            if (data.Resultado) {
                $("#modal-finalizar").modal();
            }
            else
            {
                $("#modal-error").modal();
            }
            console.log(data);
        },
        function (data) {
            console.log("error:");
            console.log(data);
        });
}

$(function () {
    $("#paso0").show("slide", { direction: "right" }, 500);
    fnObtenerPaises();
    fnObtenerGradoAcademico();
    fnObtenerNivelIdioma();
    fnObtenerHabilidades();
    fnObtenerAreas();
    fnObtenerPretensionSalarial();
    fnObtenerLicencias();
    fnObtenerDiscapacidades();
    fnObtenerLicencias();
});