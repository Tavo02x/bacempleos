using BolsaEmpleoBAC.Entities;
using BolsaEmpleoBAC.WebAPI.Security;
using BolsaEmpleoBAC.WebAPI.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using System.Web.Http.OData.Builder;
using System.Web.Http.OData.Extensions;

namespace BolsaEmpleoBAC.WebAPI
{
    public static class WebApiConfig
    { 
        public static void Register(HttpConfiguration config)
        {
            // Configuración y servicios de API web
            // Web API CORS
            config.EnableCors();

            // Web API configuration and services
            config.Formatters.Add(new JSONFormatter());
            // Rutas de API web
            config.MapHttpAttributeRoutes();

            config.MessageHandlers.Add(new TokenValidationHandler());

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

            ODataConventionModelBuilder builder = new ODataConventionModelBuilder();
            builder.EntitySet<vw_Postulante>("vw_Postulante");
            builder.EntitySet<vw_Puestos>("vw_Puestos");
            builder.EntitySet<vw_zona3>("vw_zona3");
            builder.EntitySet<vw_zona2>("vw_zona2");
            builder.EntitySet<vw_zona1>("vw_zona1");
            builder.EntitySet<vw_pretensionsSalarial>("vw_pretensionsSalarial");
            builder.EntitySet<vw_jornadalaboral>("vw_jornadalaboral");
            builder.EntitySet<vw_idioma>("vw_idioma");
            builder.EntitySet<vw_habilidades>("vw_habilidades");
            builder.EntitySet<vw_discapacidad>("vw_discapacidad");
            builder.EntitySet<vw_areaslaborales>("vw_areaslaborales");
            builder.EntitySet<vw_rol>("vw_rol");
            builder.EntitySet<vw_acciones>("vw_acciones");
            builder.EntitySet<vw_usuarios>("vw_usuarios");
            builder.EntitySet<vw_feriaEmpleo>("vw_feriaEmpleo");
            builder.EntitySet<vw_feriaEmpleoTodas>("vw_feriaEmpleoTodas");
            builder.EntitySet<vw_PuestosAplicados>("vw_PuestosAplicados");
            builder.EntitySet<vw_PostulanteXPuesto>("vw_PostulanteXPuesto");
            builder.EntitySet<vw_PuestosDisponibles>("vw_PuestosDisponibles");
            builder.EntitySet<vw_ListaPostulanteReporte>("vw_ListaPostulanteReporte");
            builder.EntitySet<vw_Puestos_FeriaEmpleo>("vw_Puestos_FeriaEmpleo");
            builder.EntitySet<vw_EntrevistasSolicitadas>("vw_EntrevistasSolicitadas");
            builder.EntitySet<vw_EntrevistasRechazadas>("vw_EntrevistasRechazadas");
            builder.EntitySet<vw_EntrevistasAgendadas>("vw_EntrevistasAgendadas");
            builder.EntitySet<vw_EntrevistasRealizadas>("vw_EntrevistasRealizadas");
            builder.EntitySet<vw_PostulanteXPuestoFeria>("vw_PostulanteXPuestoFeria");

            config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
        }
    }
}
