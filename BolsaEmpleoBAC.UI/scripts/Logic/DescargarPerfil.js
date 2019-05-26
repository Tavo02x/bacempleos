$(document).ready(function () {
    var getWebApi = function (data, table, callback) {

        var query = Utils.getFilterParameters(data);

        Ajax.send(ApiService.PostulanteGet + query, 'GET', {}, callback, callback);

    }

    var id = Utils.getUrlParameter('IdPostulante');
    $('#lblNombreCompleto').text(id);

    var token = sessionStorage.getItem("token");

    var decode = Utils.decodeJWT();

    var data = {
        username: {
            value: (id == "" ? decode.unique_name : id)
        }
    };


    getWebApi(data, ApiService.PostulanteGet,
        function (response) {
            //$scope.obj.IdPostulante = response.Objeto.IdPostulante;
            $('#lblNombreCompleto').text(response.Objeto.NombreCompleto);

            //$('lblNombreCompleto').val('Prueba');

            //$scope.obj.Nacionalidad = response.Objeto.Nacionalidad;
            //$scope.obj.Identificacion = response.Objeto.Identificacion;
            //$scope.obj.FechaNacimiento = response.Objeto.FechaNacimiento;
            //$scope.obj.Edad = calcularEdad(response.Objeto.FechaNacimiento);
            //$scope.obj.Genero = response.Objeto.Genero;
            //$scope.obj.EstadoCivil = response.Objeto.EstadoCivil;
            //$scope.obj.Telefono = response.Objeto.Telefono;
            //$scope.obj.ImagenURL = response.Objeto.ImagenURL;
            //$scope.obj.PaisRecidencia = response.Objeto.PaisRecidencia;
            //$scope.obj.Vehiculo = response.Objeto.Vehiculo;
            //$scope.obj.Email = response.Objeto.Email;
            //$scope.obj.Zona1 = response.Objeto.Zona1;
            //$scope.obj.Zona2 = response.Objeto.Zona2;
            //$scope.obj.Zona3 = response.Objeto.Zona3;
            //$scope.obj.EstudiaActualidad = response.Objeto.EstudiaActualidad;
            //$scope.obj.GradoAcademico = response.Objeto.GradoAcademico;
            //$scope.obj.Profesion = response.Objeto.Profesion;
            //$scope.obj.PretensionSalarial = response.Objeto.PretensionSalarial;
            //$scope.obj.TrabajoBAC = response.Objeto.TrabajoBAC;
            //$scope.obj.CurriculumURL = response.Objeto.CurriculumURL;
            //$scope.obj.TitulosCertificaciones = response.Objeto.TitulosCertificaciones;
            //$scope.obj.ExperienciaLaboral = response.Objeto.ExperienciaLaboral;
            //$scope.obj.Habilidades = response.Objeto.Habilidades;
            //$scope.obj.Referencias = response.Objeto.Referencias;
            //$scope.obj.Idiomas = response.Objeto.Idiomas;
            //$scope.obj.Areas = response.Objeto.Areas;
            //$scope.obj.Paises = response.Objeto.Paises;
            //$scope.obj.Discapacidades = response.Objeto.Discapacidades;
            $('#FotoPerfil').attr('src', $scope.obj.ImagenURL);
        }
    )
});