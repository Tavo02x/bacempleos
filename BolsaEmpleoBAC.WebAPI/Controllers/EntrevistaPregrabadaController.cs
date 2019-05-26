using BolsaEmpleoBAC.BL.DTO;
using BolsaEmpleoBAC.BL.Logic;
using BolsaEmpleoBAC.Entities;
using BolsaEmpleoBAC.General;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace BolsaEmpleoBAC.WebAPI.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    [RoutePrefix("api/EntrevistaPregrabada")]
    [Authorize]
    public class EntrevistaPregrabadaController : ParentController<DTOEntrevistaPregrabada>
    {
        public EntrevistaPregrabadaController()
        {
            exe = new EntrevistaPregrabadaManager();
        }

        [HttpPost]
        [Route("SaveEntrevista")]
        public WebAPIResponse<DTOEntrevistaPregrabada> SaveEntrevista(WebAPIRequest<DTOEntrevistaPregrabada> entity)
        {
            try
            {
                var obj = new EntrevistaPregrabadaManager();
                obj.Save(entity.Objeto, entity.Id);
                return new WebAPIResponse<DTOEntrevistaPregrabada>() { Resultado = true, Objeto = null, Lista = null, Mensaje = AppMensajes.FinalizadoExitoso };
            }
            catch (Exception ex)
            {
                return new WebAPIResponse<DTOEntrevistaPregrabada>() { Resultado = false, Lista = null, Objeto = null, Mensaje = ex.Message };
            }
        }

        [HttpGet]
        [Route("GetPreguntasByArea")]
        public WebAPIResponse<Preguntas> getPreguntasByArea(string Descripcion, int IdArea)
        {
            try
            {
                var obj = new EntrevistaPregrabadaManager();
                var list = obj.GetPreguntasByArea(Descripcion, IdArea);
                return new WebAPIResponse<Preguntas>() { Resultado = true, Objeto = null, Lista = list, Mensaje = AppMensajes.FinalizadoExitoso };
            }
            catch (Exception ex)
            {
                return new WebAPIResponse<Preguntas>() { Resultado = false, Lista = null, Objeto = null, Mensaje = ex.Message };
            }
        }

        [HttpGet]
        [Route("GetPreguntasByEntrevista")]
        public WebAPIResponse<dynamic> GetPreguntasByEntrevista(int IdEntrevista, int IdPostulante, int IdUser)
        {
            try
            {
                var obj = new EntrevistaPregrabadaManager();
                var result = obj.GetPreguntasByEntrevista(IdEntrevista, IdPostulante, IdUser);

                return new WebAPIResponse<dynamic>() { Resultado = true, Objeto = result, Lista = null, Mensaje = AppMensajes.FinalizadoExitoso };
            }
            catch (Exception ex)
            {
                return new WebAPIResponse<dynamic>() { Resultado = false, Lista = null, Objeto = null, Mensaje = ex.Message };
            }
        }

        [HttpPost]
        [Route("SaveVideosPregrabada")]
        public WebAPIResponse<DTOEntrevistaVideo> SaveVideosPregrabada(WebAPIRequest<DTOEntrevistaVideo> entity)
        {
            try
            {
                var obj = new EntrevistaPregrabadaManager();
                obj.SaveVideosPregrabada(entity.Objeto);

                return new WebAPIResponse<DTOEntrevistaVideo>() { Resultado = true, Objeto = null, Lista = null, Mensaje = AppMensajes.FinalizadoExitoso };
            }
            catch (Exception ex)
            {
                return new WebAPIResponse<DTOEntrevistaVideo>() { Resultado = false, Lista = null, Objeto = null, Mensaje = ex.Message };
            }
        }

        [HttpGet]
        [Route("GetVideosPregrabados")]
        public WebAPIResponse<dynamic> GetVideosPregrabados(int IdEntrevista)
        {
            try
            {
                var obj = new EntrevistaPregrabadaManager();
                var result = obj.GetVideosPregrabados(IdEntrevista);

                return new WebAPIResponse<dynamic>() { Resultado = true, Objeto = result, Lista = null, Mensaje = AppMensajes.FinalizadoExitoso };
            }
            catch (Exception ex)
            {
                return new WebAPIResponse<dynamic>() { Resultado = false, Lista = null, Objeto = null, Mensaje = ex.Message };
            }
        }

        [HttpGet]
        [Route("CalificarVideoPregrabado")]
        public WebAPIResponse<dynamic> CalificarVideoPregrabado(int IdEntrevista, int IdEntrevistaVideo, int Calificacion)
        {
            try
            {
                var obj = new EntrevistaPregrabadaManager();
                obj.CalificarVideoPregrabado(IdEntrevista, IdEntrevistaVideo, Calificacion);

                return new WebAPIResponse<dynamic>() { Resultado = true, Objeto = null, Lista = null, Mensaje = AppMensajes.FinalizadoExitoso };
            }
            catch (Exception ex)
            {
                return new WebAPIResponse<dynamic>() { Resultado = false, Lista = null, Objeto = null, Mensaje = ex.Message };
            }
        }

        [HttpGet]
        [Route("RechazarEntrevista")]
        public WebAPIResponse<dynamic> RechazarEntrevista(int IdEntrevista)
        {
            try
            {
                var obj = new EntrevistaPregrabadaManager();
                obj.RechazarEntrevista(IdEntrevista);

                return new WebAPIResponse<dynamic>() { Resultado = true, Objeto = null, Lista = null, Mensaje = AppMensajes.FinalizadoExitoso };
            }
            catch (Exception ex)
            {
                return new WebAPIResponse<dynamic>() { Resultado = false, Lista = null, Objeto = null, Mensaje = ex.Message };
            }
        }

        [HttpGet]
        [Route("AceptarEntrevista")]
        public WebAPIResponse<dynamic> AceptarEntrevista(int IdEntrevista)
        {
            try
            {
                var obj = new EntrevistaPregrabadaManager();
                obj.AceptarEntrevista(IdEntrevista);

                return new WebAPIResponse<dynamic>() { Resultado = true, Objeto = null, Lista = null, Mensaje = AppMensajes.FinalizadoExitoso };
            }
            catch (Exception ex)
            {
                return new WebAPIResponse<dynamic>() { Resultado = false, Lista = null, Objeto = null, Mensaje = ex.Message };
            }
        }
    }
}
