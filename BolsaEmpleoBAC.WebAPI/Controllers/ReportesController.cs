using BolsaEmpleoBAC.BL.Logic;
using BolsaEmpleoBAC.Entities;
using BolsaEmpleoBAC.General;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace BolsaEmpleoBAC.WebAPI.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    [RoutePrefix("api/reportes")]
    [Authorize]
    public class ReportesController : ApiController
    {
        [Authorize]
        [Route("ReporteAplicantesPorPuesto")]
        [HttpGet]
        public WebAPIResponse<ReporteAplicantesPorPuesto_Result> ReporteAplicantesPorPuesto(int idUsuario, int idPais)
        {
            try
            {
                var lista = ReportesManager.ReporteAplicantesPorPuesto(idUsuario,idPais);
                return new WebAPIResponse<ReporteAplicantesPorPuesto_Result>() { Resultado = true, Objeto = null, Lista = lista, Mensaje = AppMensajes.FinalizadoExitoso };
            }
            catch (Exception ex)
            {
                return new WebAPIResponse<ReporteAplicantesPorPuesto_Result>() { Resultado = false, Lista = null, Objeto = null, Mensaje = ex.Message };
            }
        }

        [Authorize]
        [Route("ReportePuestosActivos")]
        [HttpGet]
        public WebAPIResponse<ReportePuestoActivos_Result> ReportePuestosActivos(int idUsuario,int idPais)
        {
            try
            {
                var lista = ReportesManager.ReportePuestosActivos(idUsuario, idPais);
                return new WebAPIResponse<ReportePuestoActivos_Result>() { Resultado = true, Objeto = null, Lista = lista, Mensaje = AppMensajes.FinalizadoExitoso };
            }
            catch (Exception ex)
            {
                return new WebAPIResponse<ReportePuestoActivos_Result>() { Resultado = false, Lista = null, Objeto = null, Mensaje = ex.Message };
            }
        }

        [Authorize]
        [Route("UsuariosPorPais")]
        [HttpGet]
        public WebAPIResponse<Usuario> UsuariosPorPais(int idPais)
        {
            try
            {
                var lista = ReportesManager.UsuariosPorPais(idPais);
                return new WebAPIResponse<Usuario>() { Resultado = true, Objeto = null, Lista = lista, Mensaje = AppMensajes.FinalizadoExitoso };
            }
            catch (Exception ex)
            {
                return new WebAPIResponse<Usuario>() { Resultado = false, Lista = null, Objeto = null, Mensaje = ex.Message };
            }
        }

        [Authorize]
        [Route("ReporteAplicantesPorArea")]
        [HttpGet]
        public WebAPIResponse<ReporteAplicantesPorArea_Result> ReporteAplicantesPorArea(DateTime? fechaInicio, DateTime? fechaFinal, string paises, string estados, string idiomas, int? porcentajeIdioma, string discapacidades, bool? sexo, int? paisRecidencia)
            {
            try
            {
                paises = paises.Equals("null") ? null : paises;
                estados = estados.Equals("null") ? null : estados;
                idiomas = idiomas.Equals("null") ? null : idiomas;
                discapacidades = discapacidades.Equals("null") ? null : discapacidades;
                var lista = ReportesManager.ReporteAplicantesPorArea(fechaInicio,fechaFinal,paises,estados,idiomas,porcentajeIdioma,discapacidades,sexo,paisRecidencia);
                return new WebAPIResponse<ReporteAplicantesPorArea_Result>() { Resultado = true, Objeto = null, Lista = lista, Mensaje = AppMensajes.FinalizadoExitoso };
            }
            catch (Exception ex)
            {
                return new WebAPIResponse<ReporteAplicantesPorArea_Result>() { Resultado = false, Lista = null, Objeto = null, Mensaje = ex.Message };
            }
        }

        [Authorize]
        [Route("ReporteAplicantesPorDiscapacidad")]
        [HttpGet]
        public WebAPIResponse<ReporteAplicantesPorDiscapacidad_Result> ReporteAplicantesPorDiscapacidad(DateTime? fechaInicio, DateTime? fechaFinal, string paises, string estados, string idiomas, int? porcentajeIdioma, string discapacidades, bool? sexo, int? paisRecidencia)
        {
            try
            {
                paises = paises.Equals("null") ? null : paises;
                estados = estados.Equals("null") ? null : estados;
                idiomas = idiomas.Equals("null") ? null : idiomas;
                discapacidades = discapacidades.Equals("null") ? null : discapacidades;
                var lista = ReportesManager.ReporteAplicantesPorDiscapacidad(fechaInicio, fechaFinal, paises, estados, idiomas, porcentajeIdioma, discapacidades, sexo, paisRecidencia);
                return new WebAPIResponse<ReporteAplicantesPorDiscapacidad_Result>() { Resultado = true, Objeto = null, Lista = lista, Mensaje = AppMensajes.FinalizadoExitoso };
            }
            catch (Exception ex)
            {
                return new WebAPIResponse<ReporteAplicantesPorDiscapacidad_Result>() { Resultado = false, Lista = null, Objeto = null, Mensaje = ex.Message };
            }
        }

        [Authorize]
        [Route("ReporteAplicantesPorEstado")]
        [HttpGet]
        public WebAPIResponse<ReporteAplicantesPorEstado_Result> ReporteAplicantesPorEstado(DateTime? fechaInicio, DateTime? fechaFinal, string paises, string estados, string idiomas, int? porcentajeIdioma, string discapacidades, bool? sexo, int? paisRecidencia)
        {
            try
            {
                paises = paises.Equals("null") ? null : paises;
                estados = estados.Equals("null") ? null : estados;
                idiomas = idiomas.Equals("null") ? null : idiomas;
                discapacidades = discapacidades.Equals("null") ? null : discapacidades;
                var lista = ReportesManager.ReporteAplicantesPorEstado(fechaInicio, fechaFinal, paises, estados, idiomas, porcentajeIdioma, discapacidades, sexo, paisRecidencia);
                return new WebAPIResponse<ReporteAplicantesPorEstado_Result>() { Resultado = true, Objeto = null, Lista = lista, Mensaje = AppMensajes.FinalizadoExitoso };
            }
            catch (Exception ex)
            {
                return new WebAPIResponse<ReporteAplicantesPorEstado_Result>() { Resultado = false, Lista = null, Objeto = null, Mensaje = ex.Message };
            }
        }

        [Authorize]
        [Route("ReporteAplicantesPorGenero")]
        [HttpGet]
        public WebAPIResponse<ReporteAplicantesPorGenero_Result> ReporteAplicantesPorGenero(DateTime? fechaInicio, DateTime? fechaFinal, string paises, string estados, string idiomas, int? porcentajeIdioma, string discapacidades, bool? sexo, int? paisRecidencia)
        {
            try
            {
                paises = paises.Equals("null") ? null : paises;
                estados = estados.Equals("null") ? null : estados;
                idiomas = idiomas.Equals("null") ? null : idiomas;
                discapacidades = discapacidades.Equals("null") ? null : discapacidades;
                var lista = ReportesManager.ReporteAplicantesPorGenero(fechaInicio, fechaFinal, paises, estados, idiomas, porcentajeIdioma, discapacidades, sexo, paisRecidencia);
                return new WebAPIResponse<ReporteAplicantesPorGenero_Result>() { Resultado = true, Objeto = null, Lista = lista, Mensaje = AppMensajes.FinalizadoExitoso };
            }
            catch (Exception ex)
            {
                return new WebAPIResponse<ReporteAplicantesPorGenero_Result>() { Resultado = false, Lista = null, Objeto = null, Mensaje = ex.Message };
            }
        }

        [Authorize]
        [Route("ReporteAplicantesPorIdioma")]
        [HttpGet]
        public WebAPIResponse<ReporteAplicantesPorIdioma_Result> ReporteAplicantesPorIdioma(DateTime? fechaInicio, DateTime? fechaFinal, string paises, string estados, string idiomas, int? porcentajeIdioma, string discapacidades, bool? sexo, int? paisRecidencia)
        {
            try
            {
                paises = paises.Equals("null") ? null : paises;
                estados = estados.Equals("null") ? null : estados;
                idiomas = idiomas.Equals("null") ? null : idiomas;
                discapacidades = discapacidades.Equals("null") ? null : discapacidades;
                var lista = ReportesManager.ReporteAplicantesPorIdioma(fechaInicio, fechaFinal, paises, estados, idiomas, porcentajeIdioma, discapacidades, sexo, paisRecidencia);
                return new WebAPIResponse<ReporteAplicantesPorIdioma_Result>() { Resultado = true, Objeto = null, Lista = lista, Mensaje = AppMensajes.FinalizadoExitoso };
            }
            catch (Exception ex)
            {
                return new WebAPIResponse<ReporteAplicantesPorIdioma_Result>() { Resultado = false, Lista = null, Objeto = null, Mensaje = ex.Message };
            }
        }

        [Authorize]
        [Route("ReporteInteresadosPorPais")]
        [HttpGet]
        public WebAPIResponse<ReporteInteresadosPorPais_Result> ReporteInteresadosPorPais(DateTime? fechaInicio, DateTime? fechaFinal, string paises, string estados, string idiomas, int? porcentajeIdioma, string discapacidades, bool? sexo, int? paisRecidencia)
        {
            try
            {
                paises = paises.Equals("null") ? null : paises;
                estados = estados.Equals("null") ? null : estados;
                idiomas = idiomas.Equals("null") ? null : idiomas;
                discapacidades = discapacidades.Equals("null") ? null : discapacidades;
                var lista = ReportesManager.ReporteInteresadosPorPais(fechaInicio, fechaFinal, paises, estados, idiomas, porcentajeIdioma, discapacidades, sexo, paisRecidencia);
                return new WebAPIResponse<ReporteInteresadosPorPais_Result>() { Resultado = true, Objeto = null, Lista = lista, Mensaje = AppMensajes.FinalizadoExitoso };
            }
            catch (Exception ex)
            {
                return new WebAPIResponse<ReporteInteresadosPorPais_Result>() { Resultado = false, Lista = null, Objeto = null, Mensaje = ex.Message };
            }
        }

        [Authorize]
        [Route("ReporteEstadosEntrevista")]
        [HttpGet]
        public WebAPIResponse<EstadoEntrevista> ReporteEstadosEntrevista()
        {
            try
            {
                var lista = ReportesManager.EstadosEntrevista();
                return new WebAPIResponse<EstadoEntrevista>() { Resultado = true, Objeto = null, Lista = lista, Mensaje = AppMensajes.FinalizadoExitoso };
            }
            catch (Exception ex)
            {
                return new WebAPIResponse<EstadoEntrevista>() { Resultado = false, Lista = null, Objeto = null, Mensaje = ex.Message };
            }
        }
    }
}
