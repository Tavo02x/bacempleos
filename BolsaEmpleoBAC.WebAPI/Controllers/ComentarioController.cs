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
    [RoutePrefix("api/Comentario")]
    [Authorize]
    public class ComentarioController : ApiController
    {
        [HttpGet]
        [HttpPost]
        [Route("Save")]
        public WebAPIResponse<Comentarios> Save(WebAPIRequest<Comentarios> entity)
        {
            try
            {
                ComentariosManager manager = new ComentariosManager();
                entity.Objeto.FechaCreacion = DateTime.Now;
                manager.Save(entity.Objeto, entity.Objeto.IdComentario);
                return new WebAPIResponse<Comentarios>() { Resultado = true, Objeto = null, Lista = null, Mensaje = AppMensajes.FinalizadoExitoso };
            }
            catch (Exception ex)
            {
                return new WebAPIResponse<Comentarios>() { Resultado = false, Lista = null, Objeto = null, Mensaje = ex.Message };
            }
        }
    }
}
