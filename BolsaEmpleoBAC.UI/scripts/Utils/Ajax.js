var Ajax = {
    Inicialize: function () {

    },
    sendAny: function (url, type, data, onSuccess, onError) {
        //$.ajax({
        //    url: __env.apiUrl+url,
        //    dataType: 'json',
        //    method: method,
        //    data: data,
        //    success: callback,
        //    error: error
        //});

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
    },
    send: function (url, method, data, onSuccess, onError) {
        var token = sessionStorage.getItem("token");

        var decode = Utils.decodeJWT();
        $.ajax({
            url: __env.apiUrl + url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
                'username': decode.unique_name
            },
            //beforeSend: function (request) {
            dataType: 'json',
            method: method,
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
    },
    sendFile: function (data, onSuccess, onError) {
        $('#popupLoading').modal('show');
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
}

$(document).ready(function () {
    Ajax.Inicialize();
});