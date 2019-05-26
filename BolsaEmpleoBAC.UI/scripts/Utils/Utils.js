$('.modal').on('shown.bs.modal', function() {
  //Make sure the modal and backdrop are siblings (changes the DOM)
    $(this).before($('.modal-backdrop'));

    $('.modal-backdrop').css("z-index",1050);

  //Make sure the z-index is higher than the backdrop
    $(this).css("z-index", parseInt($('.modal-backdrop').css('z-index')) + 1075);
    $("html, body").animate({ scrollTop: 0 }, 600);
});


var Utils =
{
    countGrid: 0,
    current_id: 0,
    objParams: {},
    isEmpty: function (obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    },
    clearCheckboxes: function () {
        $('input:checkbox').each(function () {
            $(this).attr('checked', false);
        });
    },
    getFilterQuery: function (data) {
        var query = "";
        var hasArray = false;
        //obtiene el nombre de las variables en un Array de String
        var properties = Object.keys(data);
        //recorre el Array
        for (var i = 0; i < properties.length; i++) {
            //obtiene el string del array
            var nameFilter = properties[i];

            //obtiene el valor de la variable del objecto
            var obj = data[properties[i]];
            if ($.isArray(obj.value)) {
                hasArray = true;
                if (obj.value.length > 0) {
                    query = query + "(";
                }
                for (var j = 0; j < obj.value.length; j++) {
                    if (j === (obj.value.length - 1)) {

                        if (obj.type === "string") {

                            if (obj.cond === 'like') {
                                query = query + "substringof('" + obj.value[j] + "'," + nameFilter + ")) && ";
                            }
                            else {
                                query = query + nameFilter + obj.cond + "'" + obj.value[j] + "') && ";
                            }

                            //query = query + nameFilter + obj.cond + "'" + obj.value[j] + "'";
                        }
                        else if (obj.type === "between") {
                            query = query + nameFilter + obj.condFrom + obj.valueFrom + " && " + nameFilter + obj.condEnd + obj.valueEnd;
                        }
                        else {
                            query = query + nameFilter + obj.cond + obj.value[j] + ") && ";
                        }
                    }
                    else {
                        if (obj.type === "string") {

                            if (obj.cond === 'like') {
                                query = query + "substringof('" + obj.value[j] + "'," + nameFilter + ")" + obj.comp;
                            }
                            else {
                                query = query + nameFilter + obj.cond + "'" + obj.value[j] + "'" + obj.comp;
                            }

                            //query = query + nameFilter + obj.cond + "'" + obj.value[j] + "'" + obj.comp;
                        }
                        else if (obj.type === "between") {
                            query = query + nameFilter + obj.condFrom + obj.valueFrom + " && " + nameFilter + obj.condEnd + obj.valueEnd + obj.comp;
                        }
                        else {
                            query = query + nameFilter + obj.cond + obj.value[j] + obj.comp;
                        }
                    }
                }

            } else {

                //concatena el nombre de la variable del objecto y su valor en un string    
                if (i === (properties.length - 1)) {

                    if (obj.type === "string") {
                        if (obj.cond === 'like') {
                            query = query + "substringof('" + obj.value + "'," + nameFilter + ")";
                        }
                        else {
                            query = query + nameFilter + obj.cond + "'" + obj.value + "'";
                        }
                    }
                    else if (obj.type === "between") {
                        query = query + nameFilter + obj.condFrom + obj.valueFrom + " && " + nameFilter + obj.condEnd + obj.valueEnd;
                    }
                    else {
                        query = query + nameFilter + obj.cond + obj.value;
                    }
                }
                else {
                    if (obj.type === "string") {
                        if (obj.cond === 'like') {
                            query = query + "substringof('" + obj.value + "'," + nameFilter + ") &&";
                        }
                        else {
                            query = query + nameFilter + obj.cond + "'" + obj.value + "'" + " && ";
                        }
                    }
                    else if (obj.type === "between") {
                        query = query + nameFilter + obj.condFrom + obj.valueFrom + " && " + nameFilter + obj.condEnd + obj.valueEnd + " && ";
                    }
                    else {
                        query = query + nameFilter + obj.cond + obj.value + " && ";
                    }
                }
            }
        }
        if (hasArray) {
            //query = query.substring(0, query.length - 4);
            query = query.substring(0, query.length - 3);
        }
        return query;
    },
    getFilterParameters: function (data) {
        var query = "?";
        //obtiene el nombre de las variables en un Array de String
        var properties = Object.keys(data);
        //recorre el Array
        for (var i = 0; i < properties.length; i++) {
            //obtiene el string del array
            var nameFilter = properties[i];

            //obtiene el valor de la variable del objecto
            var obj = data[properties[i]];

            //concatena el nombre de la variable del objecto y su valor en un string    
            if (i === (properties.length - 1)) {
                query = query + nameFilter + "=" + obj.value;
            }
            else {
                query = query + nameFilter + "=" + obj.value + "&";
            }
        }
        return query;
    },
    getFilterObject: function (data) {
        var query = "obj=";
        //obtiene el nombre de las variables en un Array de String
        var properties = Object.keys(data);
        //recorre el Array
        query += "{"
        for (var i = 0; i < properties.length; i++) {
            //obtiene el string del array
            var nameFilter = properties[i];

            //obtiene el valor de la variable del objecto
            var obj = data[properties[i]];

            //concatena el nombre de la variable del objecto y su valor en un string    
            if (i === (properties.length - 1)) {
                query = query + nameFilter + ":" + obj.value;
            }
            else {
                query = query + nameFilter + ":" + obj.value + ",";
            }
        }
        query += "};"
        var obj = eval(query);
        return obj;
    },
    getUrlParameter: function (name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    },
    //Genera JWT para la firma
    generateJWS: function (head, payload, secretKey) {
        var sHead = newline_toDos(head);
        var head = KJUR.jws.JWS.readSafeJSONString(sHead);
        var sPayload = newline_toDos(payload);
        var sPemPrvKey = secretKey;

        var jws = new KJUR.jws.JWS();
        var sResult = null;
        try {
            prv = KEYUTIL.getKey(sPemPrvKey);

            sResult = KJUR.jws.JWS.sign(head.alg, sHead, sPayload, prv);
            return sResult;
        } catch (ex) {
            alert("Error: " + ex);
        }
    },
    decodeJWT: function () {
        var token = sessionStorage.getItem("token");
        var decoded = jwt_decode(token);
        return decoded;
    },
    //Componentes
    cloneElement: function (id, prependTo) {
        var element = $("#" + id);
        var newElement = element.clone();
        var id = Utils.current_id + 1;
        Utils.current_id = id;
        if (id < 10) id = "0" + id;
        newElement.val('');
        newElement.attr("id", element.attr("id").split("_")[0] + "_" + id);
        var field = $('input', newElement).attr("id");
        $('input', newElement).attr("id", field.split("_")[0] + "_" + id);
        newElement.insertBefore($("#" + prependTo));

        var div = "#"+newElement.attr("id");

        $(':input', div).each(function () {
            var type = this.type;
            var tag = this.tagName.toLowerCase();
            if (type === 'text' || type === 'password' || tag === 'textarea') {
                this.value = '';
            }              
          });
    },
    cloneSelect: function (id, prependTo) {
        var element = $("#" + id);
        var newElement = element.clone();
        var id = Utils.current_id + 1;
        Utils.current_id = id;
        if (id < 10) id = "0" + id;
        newElement.attr("id", element.attr("id").split("_")[0] + "_" + id);
        var field = $('select', newElement).attr("id");
        $('select', newElement).attr("id", field.split("_")[0] + "_" + id);
        newElement.insertBefore($("#" + prependTo));

        $('#' + field.split("_")[0] + "_" + id).val('').change();
    },
    getValRepetear: function (container, mapper) {
        var arrObj = [];
        var Array = $('#' + container + ' > div').map(function () {
            return this.id;
        }).toArray();

        Array.forEach(function (element, i) {

            var valuesArr = $('#' + element + ' >').map(function (e, i) {
                return this.value;
            }).toArray();
            var variable = 'obj={';
            valuesArr.forEach(function (e, i) {
                if (e != '' && e != undefined && e != 0) {
                    variable += mapper[i] + ":'" + e + "',";
                }

            });
            variable += "}"
            if (variable != 'obj={}') {
                arrObj.push(eval(variable));
            }

        });
        return arrObj;
    },
    getValRepetearEdit: function (container, mapper) {
        var arrObj = [];
        var Idiomas = $('#' + container + ' > div').map(function () {
            return this.id;
        }).toArray();

        Idiomas.forEach(function (element, i) {

            var valuesArr = $('#' + element + ' > div').map(function (e, i) {
                return this.value;
            }).toArray();
            var variable = 'obj={';
            valuesArr.forEach(function (e, i) {
                if (e != '' && e != undefined && e != 0) {
                    variable += mapper[i] + ":'" + e + "',";
                }
            });
            variable += "}"
            if (variable != 'obj={}') {
                arrObj.push(eval(variable));
            }

        });
        return arrObj;
    },
    getValCheck: function (group, mapper) {

        var checked = []
        if (mapper != undefined) {
            $("input[name=" + group + "]:checked").each(function () {
                checked.push(eval("obj={" + mapper + ":" + $(this).val() + "}"));
            });
        } else {
            $("input[name=" + group + "]:checked").each(function () {
                checked.push($(this).val());
            });
        }


        return checked;
    },
    getValCheckEdit: function (group, mapper) {

        var checked = []
        if (mapper != undefined) {
            $("input[name=" + group + "]:checked").each(function () {
                checked.push(eval("obj={" + mapper + ":" + this.id + "}"));
            });
        } else {
            $("input[name=" + group + "]:checked").each(function () {
                checked.push(this.id);
            });
        }


        return checked;
    },
    filterGrid: function (table, data, container, columns, select, url, top, totalGrid, hiddenColumns) {
        var query = Utils.getFilterQuery(data);
        var selection = select;

        if (hiddenColumns != undefined) {
            selection += ',' + hiddenColumns
        }

        if (top === undefined) {
            top = 6
        }

        o(table).inlineCount('allpages').select(selection).filter(query).take(top)
            .get(
                function (response) {
                    Utils.buildGrid(response, container, columns, url, totalGrid, hiddenColumns)
                });
    },
    getGrid: function (table, data, container, columns, select, url, top, totalGrid, hiddenColumns, orderby, direction, id = '') {
        var query = Utils.getFilterQuery(data);
        var selection = select;
        if (hiddenColumns != undefined) {
            selection += ',' + hiddenColumns
        }
        if (top === undefined) {
            top = 6
        }
        if (orderby === undefined) {
            var firstcol = select.split(',');
            orderby = firstcol[0];
        }
        if (direction === undefined) {
            direction = 'asc';
        }
        Utils.objParams =
            {
                table: table,
                data: data,
                container: container,
                columns: columns,
                select: select,
                url: url,
                top: top,
                totalGrid: totalGrid,
                hiddenColumns: hiddenColumns,
                orderby: orderby,
                direction: direction,
                id: id
            };
        o(table).select(selection).filter(query).take(top).orderBy(orderby, direction)
            .get(
                function (response) {
                    Utils.buildGrid(response, container, columns, url, totalGrid, hiddenColumns, select, id)
                    $('#popupLoading').modal('hide');
                });
    },
    reloadGrid: function (orderby) {
        var obj = Utils.objParams;

        if (obj.orderby === orderby) {
            if (obj.direction === 'asc') {
                obj.direction = 'desc'
            }
            else {
                obj.direction = 'asc'
            }
        }
        if (orderby === undefined) {
            obj.top = obj.top + obj.top;
        }
        Utils.getGrid(obj.table, obj.data, obj.container, obj.columns, obj.select, obj.url, obj.top, obj.totalGrid, obj.hiddenColumns, orderby, obj.direction, obj.id);
    },
    buildGrid: function (response, container, columns, url, totalGrid, hiddenColumns, select, id = '') {
        var htmlTable = '';
        var hiddenSplit = [];
        var selectCol = [];
        if (hiddenColumns != undefined) {
            hiddenSplit = hiddenColumns.split(',');
        }
        if (select != undefined) {
            selectCol = select.split(',');
        }

        htmlTable = htmlTable + '<div class="table-responsive"><table class="table" id="1">';

        var isEmpty = columns.length === 2 && columns[0] === '' && columns[1] === '';
        if (!isEmpty) {
            htmlTable = htmlTable + '<thead>';
            htmlTable = htmlTable + '<tr>';

            $.each(columns,
                function(index, value) {
                    var functionCol = "Utils.reloadGrid('" + selectCol[index] + "')";
                    htmlTable = htmlTable + '<th ' + (columns.length === index ? 'class="ultimaColumna"' : '') + '>';
                    htmlTable = htmlTable + '<div>';
                    htmlTable = htmlTable +
                        '<a href="#"' +
                        (columns.length != index ? ' onclick="' + functionCol + '">' : '>') +
                        value +
                        '</a>';
                    htmlTable = htmlTable + '<div class="SeparadorTabla"></div>';
                    htmlTable = htmlTable + '</div>';
                    htmlTable = htmlTable + '</th>';
                });

            htmlTable = htmlTable + '</tr>';
            htmlTable = htmlTable + '</thead>';
        }
       
        
        htmlTable = htmlTable + '<tbody>';

        var properties = Object.keys(response);

        for (var i = 0; i < properties.length; i++) {

            //obtiene el valor de la variable del objecto
            var values = response[properties[i]];


            var subproperties = Object.keys(values);
            htmlTable = htmlTable + '<tr>';
            for (var j = 0; j < subproperties.length; j++) {
                var value = values[subproperties[j]];
                //concatena el nombre de la variable del objecto y su valor en un string    
                if (!hiddenSplit.includes(subproperties[j])) {
                    htmlTable = htmlTable + '<td class="OtrasColumnas">';
                    htmlTable = htmlTable + '<div  ng-click="verificacion()">';
                    htmlTable = htmlTable + value;
                    htmlTable = htmlTable + '<div class="SeparadorTabla"></div>';
                    htmlTable = htmlTable + '</div>';
                    htmlTable = htmlTable + '</td>';
                }
            }
            htmlTable = htmlTable + '<td class="ultimaColumna">';
            htmlTable = htmlTable + '<div>';
            //htmlTable = htmlTable + '<a href="' + __env.baseUrl + url + '"><img id="img' + i + '" class="flecha" src="' + __env.baseUrl + '/Content/Images/flechaRoja.png" /></a></div>';
            htmlTable = htmlTable + '<a id="img' + i + '" ng-click="verificacion()"><span class="mdi mdi-chevron-right-circle-outline mdi-24px text-red"></span></a>';
            htmlTable = htmlTable + '<div class="SeparadorTabla"></div>';
            htmlTable = htmlTable + '</div>';
            htmlTable = htmlTable + '</td>';
            htmlTable = htmlTable + '</tr>';

        }

        if (Utils.countGrid > Utils.objParams.top)
        {
            htmlTable = htmlTable + '</table></div>';
            htmlTable = htmlTable + '<div class="footerTabla"><a href="#' + container + '" class="LetrasContenido textoNegrita ColorLetraAzul centrarTexto" onclick="Utils.reloadGrid()">Ver más</a></div>';
            }
        if(response.length === 0) {
            htmlTable = '<img src="/Content/Images/IconoCactus.png" alt="Sin resultados" class="no-results" /><p class="text-center">Vuelve a intentar ingresando otras palabras claves o aplicando nuevos filtros</p>'
        }
        $("#" + container).empty();
        $("#" + container).html(htmlTable);
        if (totalGrid != undefined) {
            $("#" + totalGrid).empty();
            $("#" + totalGrid).html('(' + Utils.countGrid + ')');
        }

        $.each(response, function (index, value) {
            $('#img' + index).on('click', function () {
                var param = value;
                //alert(index);
                //alert(param);
                url(param);
            });
        });
    },
    searchGrid: function (table, data, search, container, columns, select, url, top, totalGrid) {
        if (top === undefined) {
            top = 6
        }
        o(table).select(select).search(data, search).take(top)
            .get(
                function (response) {
                    Utils.buildGrid(response, container, columns, url, totalGrid)
                });
    },
    ConfirmBox: function (title, message, callback) {
        bootbox.confirm({
            titel: title,
            message: message,
            buttons: {
                confirm: {
                    label: 'Si',
                    className: 'btn-success'
                },
                cancel: {
                    label: 'No',
                    className: 'btn-danger'
                }
            },
            callback: callback
        });
    },
    MessageBox: function (title, moduleName, message, image, callback) {
        bootbox.dialog({
            message:
                '<div class="container">' +
                '    <div class="row">' +
                '        <div class="col-lg-6 border-lg-right">' +
                '            <img id="iconoConfimacion" class="icono-10 mx-auto d-block" src="' + __env.baseUrl + image + '" />' +
                '        </div>' +
                '        <div class="col-lg-6 text-center">' +
                '           <span class="LetrasSubTitulo textoNegrita">' + moduleName + '</span><br />' +
                '           <span class="LetrasContenido ColorLetraGris">' + message + '</span>' +
                '        </div>' +
                '    </div>' +
                '</div>',
            buttons: {
                close: {
                    label: "Cerrar",
                    className: 'btnPrincipal',
                    callback: callback
                }
            }
        });
    },
    LoadingBox: function () {
        bootbox.dialog({ message: '<div class="text-center"><i class="fa fa-spin fa-spinner"></i> Cargando...</div>' })
    },
    getFileExtension: function (filename) {
        return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
    },
    UploadFile: function (uploadfile, returnFunction, maxSize, formatos) {
        $('#' + uploadfile).unbind();
        $('#' + uploadfile).on('change', function () {
            var file = $('#' + uploadfile)[0];
            var size = file.files[0].size;
            var comparador = Math.round(((size / 1024) / 1024) * 100) / 100;
            var name = file.files[0].name;
            var ext = Utils.getFileExtension(name);
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
                formData.append('file', file.files[0]);

                Ajax.sendFile(formData,
                    function (response) {
                        returnFunction(response);
                        $('#' + uploadfile).val(null);
                        Utils.MessageBox(
                            'Subida de archivo',
                            'Subida de archivo',
                            'Archivo cargado exitosamente',
                            "Content/Images/IconoConfimacion1.png",
                            function () {
                                this.modal('hide');
                                $('#popupLoading').modal('hide');
                                return false;
                            });
                    },
                    function (response) {
                        $('#' + uploadfile).val(null);
                        Utils.MessageBox(
                            'Subida de archivo',
                            'Subida de archivo',
                            'No fue posible cargar el archivo',
                            "Content/Images/IconoErrorGeneral.png",
                            function () {
                                this.modal('hide');
                                $('#popupLoading').modal('hide');
                                return false;
                            });
                    }
                );
            } else {
                Utils.MessageBox(
                    'Subida de archivo',
                    'Subida de archivo',
                    'El archivo tiene los siguientes inconvenientes:<ul>' + (sizeValid ? '' : '<li>' + msjSize + '</li>') + (formatValid ? '' : '<li>' + msjFormato + '</li>') + '</ul>',
                    "Content/Images/IconoErrorGeneral.png",
                    function () {
                        this.modal('hide');
                        $('#popupLoading').modal('hide');
                        return false;
                    });
            }
        });
    },
    GetWidthWindow: function () {
        return $(window).width();
    },
    //---------------------Grids para entrevistas agendadas-----------------------------------------------------------------------
    objParams1: {},
    filterGrid1: function (table, data, container, columns, select, url, top, totalGrid, hiddenColumns) {
        var query = Utils.getFilterQuery(data);
        var selection = select;

        if (hiddenColumns != undefined) {
            selection += ',' + hiddenColumns
        }

        if (top === undefined) {
            top = 6
        }

        o(table).inlineCount('allpages').select(selection).filter(query).take(top)
            .get(
                function (response) {
                    Utils.buildGrid1(response, container, columns, url, totalGrid, hiddenColumns)
                });
    },
    getGrid1: function (table, data, container, columns, select, url, top, totalGrid, hiddenColumns, orderby, direction, searchColumns = '', seachWord = '') {
        var query = Utils.getFilterQuery(data);
        var selection = select;
        if (hiddenColumns != undefined) {
            selection += ',' + hiddenColumns
        }
        if (top === undefined) {
            top = 6
        }
        if (orderby === undefined) {
            var firstcol = select.split(',');
            orderby = firstcol[0];
        }
        if (direction === undefined) {
            direction = 'asc';
        }
        Utils.objParams1 =
            {
                table: table,
                data: data,
                container: container,
                columns: columns,
                select: select,
                url: url,
                top: top,
                totalGrid: totalGrid,
                hiddenColumns: hiddenColumns,
                orderby: orderby,
                direction: direction
            };
        o(table).select(selection).filter(query).search(searchColumns, seachWord).take(top).orderBy(orderby, direction)
            .get(
                function (response) {
                    Utils.buildGrid1(response, container, columns, url, totalGrid, hiddenColumns, select)
                    $('#popupLoading').modal('hide');
                });
    },
    reloadGrid1: function (orderby) {
        var obj = Utils.objParams1;

        if (obj.orderby === orderby) {
            if (obj.direction === 'asc') {
                obj.direction = 'desc'
            }
            else {
                obj.direction = 'asc'
            }
        }
        if (orderby === undefined) {
            obj.top = obj.top + obj.top;
        }
        Utils.getGrid1(obj.table, obj.data, obj.container, obj.columns, obj.select, obj.url, obj.top, obj.totalGrid, obj.hiddenColumns, orderby, obj.direction);
    },
    buildGrid1: function (response, container, columns, url, totalGrid, hiddenColumns, select) {
        var htmlTable = '';
        var hiddenSplit = [];
        var selectCol = [];
        if (hiddenColumns != undefined) {
            hiddenSplit = hiddenColumns.split(',');
        }
        if (select != undefined) {
            selectCol = select.split(',');
        }

        htmlTable = htmlTable + '<div class="table-responsive"><table class="table" id="2">';
        var isEmpty = columns.length === 2 && columns[0] === '' && columns[1] === '';
        if (!isEmpty) {
            htmlTable = htmlTable + '<thead>';
            htmlTable = htmlTable + '<tr>';

            $.each(columns,
                function(index, value) {
                    var functionCol = "Utils.reloadGrid('" + selectCol[index] + "')";
                    htmlTable = htmlTable + '<th ' + (columns.length === index ? 'class="ultimaColumna"' : '') + '>';
                    htmlTable = htmlTable + '<div>';
                    htmlTable = htmlTable +
                        '<a href="#"' +
                        (columns.length != index ? ' onclick="' + functionCol + '">' : '>') +
                        value +
                        '</a>';
                    htmlTable = htmlTable + '<div class="SeparadorTabla"></div>';
                    htmlTable = htmlTable + '</div>';
                    htmlTable = htmlTable + '</th>';
                });

            htmlTable = htmlTable + '</tr>';
            htmlTable = htmlTable + '</thead>';
        }
        htmlTable = htmlTable + '<tbody>';

        var properties = Object.keys(response);

        for (var i = 0; i < properties.length; i++) {

            //obtiene el valor de la variable del objecto
            var values = response[properties[i]];


            var subproperties = Object.keys(values);
            htmlTable = htmlTable + '<tr>';
            for (var j = 0; j < subproperties.length; j++) {
                var value = values[subproperties[j]];
                //concatena el nombre de la variable del objecto y su valor en un string    
                if (!hiddenSplit.includes(subproperties[j])) {
                    htmlTable = htmlTable + '<td class="OtrasColumnas">';
                    htmlTable = htmlTable + '<div>';
                    htmlTable = htmlTable + value;
                    htmlTable = htmlTable + '<div class="SeparadorTabla"></div>';
                    htmlTable = htmlTable + '</div>';
                    htmlTable = htmlTable + '</td>';
                }
            }
            htmlTable = htmlTable + '<td class="ultimaColumna">';
            htmlTable = htmlTable + '<div>';
            //htmlTable = htmlTable + '<a href="' + __env.baseUrl + url + '"><img id="img' + i + '" class="flecha" src="' + __env.baseUrl + '/Content/Images/flechaRoja.png" /></a></div>';
            htmlTable = htmlTable + '<a id="img1' + i + '" ng-click="verificacion()"><span class="mdi mdi-chevron-right-circle-outline mdi-24px text-red"></span></a>';
            htmlTable = htmlTable + '<div class="SeparadorTabla"></div>';
            htmlTable = htmlTable + '</div>';
            htmlTable = htmlTable + '</td>';
            htmlTable = htmlTable + '</tr>';

        }

        htmlTable = htmlTable + '</table></div>';
        htmlTable = htmlTable + '<div class="footerTabla"><a href="#' + container + '" class="LetrasContenido textoNegrita ColorLetraAzul centrarTexto" onclick="Utils.reloadGrid1()">Ver más</a></div>';
        if(response.length === 0) {
            htmlTable = '<p class="text-center py-4">No hay datos disponibles</p>'
        }
        $("#" + container).empty();
        $("#" + container).html(htmlTable);

        if (totalGrid != undefined) {
            $("#" + totalGrid).empty();
            $("#" + totalGrid).html('(' + Utils.countGrid + ')');
        }

        $.each(response, function (index, value) {
            $('#img1' + index).on('click', function () {
                var param = value;
                //alert(index);
                //alert(param);
                url(param);
            });
        });
    },
    searchGrid1: function (table, data, search, container, columns, select, url, top, totalGrid) {
        if (top === undefined) {
            top = 6
        }
        o(table).select(select).search(data, search).take(top)
            .get(
                function (response) {
                    Utils.buildGrid(response, container, columns, url, totalGrid)
                });
    },
    //---------------------Grids para entrevistas-----------------------------------------------------------------------
    //---------------------Grids para entrevistas solicitadas-----------------------------------------------------------------------
    objParams2: {},
    filterGrid2: function (table, data, container, columns, select, url, top, totalGrid, hiddenColumns) {
        var query = Utils.getFilterQuery(data);
        var selection = select;

        if (hiddenColumns != undefined) {
            selection += ',' + hiddenColumns
        }

        if (top === undefined) {
            top = 6
        }

        o(table).inlineCount('allpages').select(selection).filter(query).take(top)
            .get(
                function (response) {
                    Utils.buildGrid2(response, container, columns, url, totalGrid, hiddenColumns)
                });
    },
    getGrid2: function (table, data, container, columns, select, url, top, totalGrid, hiddenColumns, orderby, direction, searchColumns = '', seachWord = '') {
        var query = Utils.getFilterQuery(data);
        var selection = select;
        if (hiddenColumns != undefined) {
            selection += ',' + hiddenColumns
        }
        if (top === undefined) {
            top = 6
        }
        if (orderby === undefined) {
            var firstcol = select.split(',');
            orderby = firstcol[0];
        }
        if (direction === undefined) {
            direction = 'asc';
        }
        Utils.objParams2 =
            {
                table: table,
                data: data,
                container: container,
                columns: columns,
                select: select,
                url: url,
                top: top,
                totalGrid: totalGrid,
                hiddenColumns: hiddenColumns,
                orderby: orderby,
                direction: direction
            };
        o(table).select(selection).filter(query).search(searchColumns, seachWord).take(top).orderBy(orderby, direction)
            .get(
                function (response) {
                    Utils.buildGrid2(response, container, columns, url, totalGrid, hiddenColumns, select)
                    $('#popupLoading').modal('hide');
                });
    },
    reloadGrid2: function (orderby) {
        var obj = Utils.objParams2;

        if (obj.orderby === orderby) {
            if (obj.direction === 'asc') {
                obj.direction = 'desc'
            }
            else {
                obj.direction = 'asc'
            }
        }
        if (orderby === undefined) {
            obj.top = obj.top + obj.top;
        }
        Utils.getGrid2(obj.table, obj.data, obj.container, obj.columns, obj.select, obj.url, obj.top, obj.totalGrid, obj.hiddenColumns, orderby, obj.direction);
    },
    buildGrid2: function(response, container, columns, url, totalGrid, hiddenColumns, select) {
        var htmlTable = '';
        var hiddenSplit = [];
        var selectCol = [];
        if (hiddenColumns != undefined) {
            hiddenSplit = hiddenColumns.split(',');
        }
        if (select != undefined) {
            selectCol = select.split(',');
        }

        htmlTable = htmlTable + '<div class="table-responsive"><table class="table" id="3">';
        var isEmpty = columns.length === 2 && columns[0] === '' && columns[1] === '';
        if (!isEmpty) {
            htmlTable = htmlTable + '<thead>';
            htmlTable = htmlTable + '<tr>';

            $.each(columns,
                function(index, value) {
                    var functionCol = "Utils.reloadGrid('" + selectCol[index] + "')";
                    htmlTable = htmlTable + '<th ' + (columns.length === index ? 'class="ultimaColumna"' : '') + '>';
                    htmlTable = htmlTable + '<div>';
                    htmlTable = htmlTable +
                        '<a href="#"' +
                        (columns.length != index ? ' onclick="' + functionCol + '">' : '>') +
                        value +
                        '</a>';
                    htmlTable = htmlTable + '<div class="SeparadorTabla"></div>';
                    htmlTable = htmlTable + '</div>';
                    htmlTable = htmlTable + '</th>';
                });

            htmlTable = htmlTable + '</tr>';
            htmlTable = htmlTable + '</thead>';
         }
    htmlTable = htmlTable + '<tbody>';

        var properties = Object.keys(response);

        for (var i = 0; i < properties.length; i++) {

            //obtiene el valor de la variable del objecto
            var values = response[properties[i]];


            var subproperties = Object.keys(values);
            htmlTable = htmlTable + '<tr>';
            for (var j = 0; j < subproperties.length; j++) {
                var value = values[subproperties[j]];
                //concatena el nombre de la variable del objecto y su valor en un string    
                if (!hiddenSplit.includes(subproperties[j])) {
                    htmlTable = htmlTable + '<td class="OtrasColumnas">';
                    htmlTable = htmlTable + '<div>';
                    htmlTable = htmlTable + value;
                    htmlTable = htmlTable + '<div class="SeparadorTabla"></div>';
                    htmlTable = htmlTable + '</div>';
                    htmlTable = htmlTable + '</td>';
                }
            }
            htmlTable = htmlTable + '<td class="ultimaColumna">';
            htmlTable = htmlTable + '<div>';
            //htmlTable = htmlTable + '<a href="' + __env.baseUrl + url + '"><img id="img' + i + '" class="flecha" src="' + __env.baseUrl + '/Content/Images/flechaRoja.png" /></a></div>';
            htmlTable = htmlTable + '<a id="img2' + i + '" ng-click="verificacion()"><span class="mdi mdi-chevron-right-circle-outline mdi-24px text-red"></span></a>';
            htmlTable = htmlTable + '<div class="SeparadorTabla"></div>';
            htmlTable = htmlTable + '</div>';
            htmlTable = htmlTable + '</td>';
            htmlTable = htmlTable + '</tr>';

        }

        htmlTable = htmlTable + '</table></div>';
        htmlTable = htmlTable + '<div class="footerTabla"><a href="#' + container + '" class="LetrasContenido textoNegrita ColorLetraAzul centrarTexto" onclick="Utils.reloadGrid2()">Ver más</a></div>';
        if(response.length === 0) {
            htmlTable = '<p class="text-center py-4">No hay datos disponibles</p>'
        }
        $("#" + container).empty();
        $("#" + container).html(htmlTable);

        if (totalGrid != undefined) {
            $("#" + totalGrid).empty();
            $("#" + totalGrid).html('(' + Utils.countGrid + ')');
        }

        $.each(response, function (index, value) {
            $('#img2' + index).on('click', function () {
                var param = value;
                //alert(index);
                //alert(param);
                url(param);
            });
        });
    },
    searchGrid2: function (table, data, search, container, columns, select, url, top, totalGrid) {
        if (top === undefined) {
            top = 6
        }
        o(table).select(select).search(data, search).take(top)
            .get(
                function (response) {
                    Utils.buildGrid(response, container, columns, url, totalGrid)
                });
    },
    //---------------------Grids para entrevistas-----------------------------------------------------------------------
    //---------------------Grids para entrevistas Rechazadas-----------------------------------------------------------------------
    objParams3: {},
    filterGrid3: function (table, data, container, columns, select, url, top, totalGrid, hiddenColumns) {
        var query = Utils.getFilterQuery(data);
        var selection = select;

        if (hiddenColumns != undefined) {
            selection += ',' + hiddenColumns
        }

        if (top === undefined) {
            top = 6
        }

        o(table).inlineCount('allpages').select(selection).filter(query).take(top)
            .get(
                function (response) {
                    Utils.buildGrid3(response, container, columns, url, totalGrid, hiddenColumns)
                });
    },
    getGrid3: function (table, data, container, columns, select, url, top, totalGrid, hiddenColumns, orderby, direction, searchColumns = '', seachWord = '') {
        var query = Utils.getFilterQuery(data);
        var selection = select;
        if (hiddenColumns != undefined) {
            selection += ',' + hiddenColumns
        }
        if (top === undefined) {
            top = 6
        }
        if (orderby === undefined) {
            var firstcol = select.split(',');
            orderby = firstcol[0];
        }
        if (direction === undefined) {
            direction = 'asc';
        }
        Utils.objParams3 =
            {
                table: table,
                data: data,
                container: container,
                columns: columns,
                select: select,
                url: url,
                top: top,
                totalGrid: totalGrid,
                hiddenColumns: hiddenColumns,
                orderby: orderby,
                direction: direction
            };
        o(table).select(selection).filter(query).search(searchColumns, seachWord).take(top).orderBy(orderby, direction)
            .get(
                function (response) {
                    Utils.buildGrid3(response, container, columns, url, totalGrid, hiddenColumns, select)
                    $('#popupLoading').modal('hide');
                });
    },
    reloadGrid3: function (orderby) {
        var obj = Utils.objParams3;

        if (obj.orderby === orderby) {
            if (obj.direction === 'asc') {
                obj.direction = 'desc'
            }
            else {
                obj.direction = 'asc'
            }
        }
        if (orderby === undefined) {
            obj.top = obj.top + obj.top;
        }
        Utils.getGrid3(obj.table, obj.data, obj.container, obj.columns, obj.select, obj.url, obj.top, obj.totalGrid, obj.hiddenColumns, orderby, obj.direction);
    },
    buildGrid3: function (response, container, columns, url, totalGrid, hiddenColumns, select) {
        var htmlTable = '';
        var hiddenSplit = [];
        var selectCol = [];
        if (hiddenColumns != undefined) {
            hiddenSplit = hiddenColumns.split(',');
        }
        if (select != undefined) {
            selectCol = select.split(',');
        }

        htmlTable = htmlTable + '<div class="table-responsive"><table class="table" id="4">';
        var isEmpty = columns.length === 2 && columns[0] === '' && columns[1] === '';
        if (!isEmpty) {
            htmlTable = htmlTable + '<thead>';
            htmlTable = htmlTable + '<tr>';

            $.each(columns,
                function(index, value) {
                    var functionCol = "Utils.reloadGrid('" + selectCol[index] + "')";
                    htmlTable = htmlTable + '<th ' + (columns.length === index ? 'class="ultimaColumna"' : '') + '>';
                    htmlTable = htmlTable + '<div>';
                    htmlTable = htmlTable +
                        '<a href="#"' +
                        (columns.length != index ? ' onclick="' + functionCol + '">' : '>') +
                        value +
                        '</a>';
                    htmlTable = htmlTable + '<div class="SeparadorTabla"></div>';
                    htmlTable = htmlTable + '</div>';
                    htmlTable = htmlTable + '</th>';
                });

            htmlTable = htmlTable + '</tr>';
            htmlTable = htmlTable + '</thead>';
        }
        htmlTable = htmlTable + '<tbody>';

        var properties = Object.keys(response);

        for (var i = 0; i < properties.length; i++) {

            //obtiene el valor de la variable del objecto
            var values = response[properties[i]];


            var subproperties = Object.keys(values);
            htmlTable = htmlTable + '<tr>';
            for (var j = 0; j < subproperties.length; j++) {
                var value = values[subproperties[j]];
                //concatena el nombre de la variable del objecto y su valor en un string    
                if (!hiddenSplit.includes(subproperties[j])) {
                    htmlTable = htmlTable + '<td class="OtrasColumnas">';
                    htmlTable = htmlTable + '<div>';
                    htmlTable = htmlTable + value;
                    htmlTable = htmlTable + '<div class="SeparadorTabla"></div>';
                    htmlTable = htmlTable + '</div>';
                    htmlTable = htmlTable + '</td>';
                }
            }
            htmlTable = htmlTable + '<td class="ultimaColumna">';
            htmlTable = htmlTable + '<div>';
            //htmlTable = htmlTable + '<a href="' + __env.baseUrl + url + '"><img id="img' + i + '" class="flecha" src="' + __env.baseUrl + '/Content/Images/flechaRoja.png" /></a></div>';
            htmlTable = htmlTable + '<a id="img3' + i + '" ng-click="verificacion()"><span class="mdi mdi-chevron-right-circle-outline mdi-24px text-red"></span></a>';
            htmlTable = htmlTable + '<div class="SeparadorTabla"></div>';
            htmlTable = htmlTable + '</div>';
            htmlTable = htmlTable + '</td>';
            htmlTable = htmlTable + '</tr>';

        }

        htmlTable = htmlTable + '</table></div>';
        htmlTable = htmlTable + '<div class="footerTabla"><a href="#' + container + '" class="LetrasContenido textoNegrita ColorLetraAzul centrarTexto" onclick="Utils.reloadGrid3()">Ver más</a></div>';
        if(response.length === 0) {
            htmlTable = '<p class="text-center py-4">No hay datos disponibles</p>'
        }
        $("#" + container).empty();
        $("#" + container).html(htmlTable);

        if (totalGrid != undefined) {
            $("#" + totalGrid).empty();
            $("#" + totalGrid).html('(' + Utils.countGrid + ')');
        }

        $.each(response, function (index, value) {
            $('#img3' + index).on('click', function () {
                var param = value;
                //alert(index);
                //alert(param);
                url(param);
            });
        });
    },
    searchGrid3: function (table, data, search, container, columns, select, url, top, totalGrid) {
        if (top === undefined) {
            top = 6
        }
        o(table).select(select).search(data, search).take(top)
            .get(
                function (response) {
                    Utils.buildGrid(response, container, columns, url, totalGrid)
                });
    },
    //---------------------Grids para entrevistas-----------------------------------------------------------------------
    //---------------------Grids para entrevistas Realizadas-----------------------------------------------------------------------
    objParams4: {},
    filterGrid4: function (table, data, container, columns, select, url, top, totalGrid, hiddenColumns) {
        var query = Utils.getFilterQuery(data);
        var selection = select;

        if (hiddenColumns != undefined) {
            selection += ',' + hiddenColumns
        }

        if (top === undefined) {
            top = 6
        }

        o(table).inlineCount('allpages').select(selection).filter(query).take(top)
            .get(
                function (response) {
                    Utils.buildGrid4(response, container, columns, url, totalGrid, hiddenColumns)
                });
    },
    getGrid4: function (table, data, container, columns, select, url, top, totalGrid, hiddenColumns, orderby, direction, searchColumns = '', seachWord = '') {
        var query = Utils.getFilterQuery(data);
        var selection = select;
        if (hiddenColumns != undefined) {
            selection += ',' + hiddenColumns
        }
        if (top === undefined) {
            top = 6
        }
        if (orderby === undefined) {
            var firstcol = select.split(',');
            orderby = firstcol[0];
        }
        if (direction === undefined) {
            direction = 'asc';
        }
        Utils.objParams4 =
            {
                table: table,
                data: data,
                container: container,
                columns: columns,
                select: select,
                url: url,
                top: top,
                totalGrid: totalGrid,
                hiddenColumns: hiddenColumns,
                orderby: orderby,
                direction: direction
            };
        o(table).select(selection).filter(query).search(searchColumns, seachWord).take(top).orderBy(orderby, direction)
            .get(
                function (response) {
                    Utils.buildGrid4(response, container, columns, url, totalGrid, hiddenColumns, select)
                    $('#popupLoading').modal('hide');
                });
    },
    reloadGrid4: function (orderby) {
        var obj = Utils.objParams4;

        if (obj.orderby === orderby) {
            if (obj.direction === 'asc') {
                obj.direction = 'desc'
            }
            else {
                obj.direction = 'asc'
            }
        }
        if (orderby === undefined) {
            obj.top = obj.top + obj.top;
        }
        Utils.getGrid4(obj.table, obj.data, obj.container, obj.columns, obj.select, obj.url, obj.top, obj.totalGrid, obj.hiddenColumns, orderby, obj.direction);
    },
    buildGrid4: function (response, container, columns, url, totalGrid, hiddenColumns, select) {
        var htmlTable = '';
        var hiddenSplit = [];
        var selectCol = [];
        if (hiddenColumns != undefined) {
            hiddenSplit = hiddenColumns.split(',');
        }
        if (select != undefined) {
            selectCol = select.split(',');
        }

        htmlTable = htmlTable + '<div class="table-responsive"><table class="table">';
        var isEmpty = columns.length === 2 && columns[0] === '' && columns[1] === '';
        if (!isEmpty) {
            htmlTable = htmlTable + '<thead>';
            htmlTable = htmlTable + '<tr>';
            
            $.each(columns,
                function(index, value) {
                    var functionCol = "Utils.reloadGrid('" + selectCol[index] + "')";
                    htmlTable = htmlTable + '<th ' + (columns.length === index ? 'class="ultimaColumna"' : '') + '>';
                    htmlTable = htmlTable + '<div>';
                    htmlTable = htmlTable +
                        '<a href="#"' +
                        (columns.length != index ? ' onclick="' + functionCol + '">' : '>') +
                        value +
                        '</a>';
                    htmlTable = htmlTable + '<div class="SeparadorTabla"></div>';
                    htmlTable = htmlTable + '</div>';
                    htmlTable = htmlTable + '</th>';
                });

            htmlTable = htmlTable + '</tr>';
            htmlTable = htmlTable + '</thead>';
        }
        htmlTable = htmlTable + '<tbody>';

        var properties = Object.keys(response);

        for (var i = 0; i < properties.length; i++) {

            //obtiene el valor de la variable del objecto
            var values = response[properties[i]];


            var subproperties = Object.keys(values);
            htmlTable = htmlTable + '<tr>';
            for (var j = 0; j < subproperties.length; j++) {
                var value = values[subproperties[j]];
                //concatena el nombre de la variable del objecto y su valor en un string    
                if (!hiddenSplit.includes(subproperties[j])) {
                    htmlTable = htmlTable + '<td class="OtrasColumnas">';
                    htmlTable = htmlTable + '<div>';
                    htmlTable = htmlTable + value;
                    htmlTable = htmlTable + '<div class="SeparadorTabla"></div>';
                    htmlTable = htmlTable + '</div>';
                    htmlTable = htmlTable + '</td>';
                }
            }
            htmlTable = htmlTable + '<td class="ultimaColumna">';
            htmlTable = htmlTable + '<div>';
            //htmlTable = htmlTable + '<a href="' + __env.baseUrl + url + '"><img id="img' + i + '" class="flecha" src="' + __env.baseUrl + '/Content/Images/flechaRoja.png" /></a></div>';
            htmlTable = htmlTable + '<a id="img4' + i + '" ng-click="verificacion()"><span class="mdi mdi-chevron-right-circle-outline mdi-24px text-red"></span></a>';
            htmlTable = htmlTable + '<div class="SeparadorTabla"></div>';
            htmlTable = htmlTable + '</div>';
            htmlTable = htmlTable + '</td>';
            htmlTable = htmlTable + '</tr>';

        }

        htmlTable = htmlTable + '</table></div>';
        htmlTable = htmlTable + '<div class="footerTabla"><a href="#' + container + '" class="LetrasContenido textoNegrita ColorLetraAzul centrarTexto" onclick="Utils.reloadGrid4()">Ver más</a></div>';
        if(response.length === 0) {
            htmlTable = '<img src="/Content/Images/IconoCactus.png" alt="Sin resultados" class="no-results" /><p class="text-center">Vuelve a intentar ingresando otras palabras claves o aplicando nuevos filtros</p>'
        }
        $("#" + container).empty();
        $("#" + container).html(htmlTable);

        if (totalGrid != undefined) {
            $("#" + totalGrid).empty();
            $("#" + totalGrid).html('(' + Utils.countGrid + ')');
        }

        $.each(response, function (index, value) {
            $('#img4' + index).on('click', function () {
                var param = value;
                //alert(index);
                //alert(param);
                url(param);
            });
        });
    },
    searchGrid4: function (table, data, search, container, columns, select, url, top, totalGrid) {
        if (top === undefined) {
            top = 6
        }
        o(table).select(select).search(data, search).take(top)
            .get(
                function (response) {
                    Utils.buildGrid(response, container, columns, url, totalGrid)
                });
    },//---------------------Grids para entrevistas-----------------------------------------------------------------------
    SeguridadHTML: function () {
       /* $.each($('.ReglasAplicadas'), function (index, value) {
            var reglaId = $('#' + value.id).attr('data-regla');
            var lista = JSON.parse(sessionStorage.getItem("role"));

            var valorHTML = lista.where(function (x) { return x.TipoAccionId === 4 && x.AccionId === reglaId });
            if (valorHTML.length > 0) {
                $('#' + value.id).removeClass('ReglasAplicadas');
            }
        });*/
        var lista = JSON.parse(sessionStorage.getItem("role"));

        var listaHTML = lista.where(function (x) { return x.TipoAccionId === 4 });

        $.each(listaHTML, function (index, value) {
            /*var funcion = eval('$scope.' + value.ReferenciaJS);
            if (funcion != undefined && funcion != null && funcion != '') {
                eval('$scope.' + value.ReferenciaJS + '= function () { }');
            }*/
            $('#' + value.ReferenciaHTML).addClass('ReglasAplicadas');
        });
    }
}