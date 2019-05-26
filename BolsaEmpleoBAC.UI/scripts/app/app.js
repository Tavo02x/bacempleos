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