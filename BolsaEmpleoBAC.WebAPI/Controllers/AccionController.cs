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
    [RoutePrefix("api/accion")]
    [Authorize]
    public class AccionController : ParentController<Acciones>
    {
        public AccionController()
        {
            exe = new AccionManager();
        }

        [Authorize]
        [Route("GetTipos")]
        public WebAPIResponse<TipoAccion> GetTipos(WebAPIRequest<string> entity)
        {
            try
            {
                var lista = ((AccionManager)exe).GetTiposAccion();
                return new WebAPIResponse<TipoAccion>() { Resultado = true, Objeto = null, Lista = lista, Mensaje = AppMensajes.FinalizadoExitoso };
            }
            catch (Exception ex)
            {
                return new WebAPIResponse<TipoAccion>() { Resultado = false, Lista = null, Objeto = null, Mensaje = ex.Message };
            }
        }

        [Authorize]
        [Route("GetMenu")]
        public WebAPIResponse<string> GetMenu(int userid)
        {
            try
            {
                var obj = ((AccionManager)exe).Menu(userid);
                return new WebAPIResponse<string>() { Resultado = true, Objeto = obj, Lista = null, Mensaje = AppMensajes.FinalizadoExitoso };
            }
            catch (Exception ex)
            {
                return new WebAPIResponse<string>() { Resultado = false, Lista = null, Objeto = null, Mensaje = ex.Message };
            }
        }
    }
}
