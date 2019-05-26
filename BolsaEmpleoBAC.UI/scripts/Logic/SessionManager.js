String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

var Session =
{
    Login: function (username, password) {
        $('#popupLoading').modal('show');
        var obj = {
            username: username,
            password: md5(password)

        };
        Ajax.sendAny(ApiService.login, 'POST', obj, Session.LoginResponse, Session.Error);
    },

    Logout: function () {

        if (localStorage.hasOwnProperty("role")) {
            localStorage.removeItem("role");
        }

        if (localStorage.hasOwnProperty("token")) {
            localStorage.removeItem("token");
        }

        if (sessionStorage.hasOwnProperty("role")) {
            sessionStorage.removeItem("role");
        }
        if (sessionStorage.hasOwnProperty("token")) {
            var decode = Utils.decodeJWT();
            sessionStorage.getItem('token')
            var obj = {
                username: decode.unique_name,
                password: ''
            };
            Ajax.sendAny(ApiService.logout, 'POST', obj, Session.LogoutResponse, Session.Error);
        }
    },


    EndSession: function () {

        //if (localStorage.hasOwnProperty("role")) {
        //    localStorage.removeItem("role");
        //}

        //if (localStorage.hasOwnProperty("token")) {
        //    localStorage.removeItem("token");
        //}

        if (sessionStorage.hasOwnProperty("role")) {
            sessionStorage.removeItem("role");
        }
        if (sessionStorage.hasOwnProperty("token")) {
            var decode = Utils.decodeJWT();
            sessionStorage.getItem('token')
            var obj = {
                username: decode.unique_name,
                password: ''
            };
            Ajax.sendAny(ApiService.logout, 'POST', obj, Session.EndSessionResponse, Session.Error);
        }
    },

    LoginResponse: function (response) {
        // Store
        sessionStorage.setItem("token", response.token);
        sessionStorage.setItem("role", response.role);

        var decode = Utils.decodeJWT();
        var lista = JSON.parse(sessionStorage.getItem("role"));

        var redirectOpcional = Utils.getUrlParameter('x');

        if (Utils.decodeJWT().urlTemp != undefined && Utils.decodeJWT().urlTemp != null)
        {
            redirectOpcional = Utils.decodeJWT().urlTemp;
        }
        //redirectOpcional = redirectOpcional.replaceAll('xxxx', '&');

        //if (redirectOpcional != null && redirectOpcional != '' && redirectOpcional != undefined) {
        //    window.location = redirectOpcional;
        //} else {
            //var opcionesPrincipales = lista.where(function (x) { return x.TipoAccionId == 9 });
        //window.location = __env.baseUrl + opcionesPrincipales[0].URL + '?username=' + decode.unique_name;
        window.location = __env.baseUrl + 'Default/Direccionador?username=' + decode.unique_name + '&urlExterna=' + redirectOpcional;
        //}
    },

    LogoutResponse: function (response) {
        // Store
        if (localStorage.hasOwnProperty("role")) {
            localStorage.removeItem("role");
        }

        if (localStorage.hasOwnProperty("token")) {
            localStorage.removeItem("token");
        }
        if (sessionStorage.hasOwnProperty("role")) {
            sessionStorage.removeItem("role");
        }
        if (sessionStorage.hasOwnProperty("token")) {
            sessionStorage.removeItem("token");
        }
        $('#popupLoading').modal('hide');
       // window.location = __env.baseUrl + 'Principal/Login';
    },

    EndSessionResponse: function (response) {
        // Store
        if (localStorage.hasOwnProperty("role")) {
            localStorage.removeItem("role");
        }

        if (localStorage.hasOwnProperty("token")) {
            localStorage.removeItem("token");
        }
        if (sessionStorage.hasOwnProperty("role")) {
            sessionStorage.removeItem("role");
        }
        if (sessionStorage.hasOwnProperty("token")) {
            sessionStorage.removeItem("token");
        }
        $('#popupLoading').modal('hide');
         window.location = __env.baseUrl + 'Principal/Login';
    },

    Error: function (response) {
        //alert(response);
        Utils.MessageBox(
            'Login',
            'Login',
            'Credenciales invalidos',
            "Content/Images/IconoErrorGeneral.png",
            function () {
                $('#popupLoading').modal('hide');
                this.modal('hide')
            }
        );
    },
}
$(document).ready(function () {
    //Session.Login();
});