using BolsaEmpleoBAC.BL.DTO;
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
    [RoutePrefix("api/rol")]
    [Authorize]
    public class RolController : ParentController<Roles>
    {
        public RolController()
        {
            exe = new RolManager();
        }

        [HttpPost]
        [Authorize]
        [Route("SaveRol")]
        public WebAPIResponse<DTORol> Save(WebAPIRequest<DTORol> entity)
        {
            try
            {
                //entity.Objeto.FechaCreacion = DateTime.Now;
                ((RolManager)exe).SaveRol(entity.Objeto, entity.Id);
                return new WebAPIResponse<DTORol>() { Resultado = true, Objeto = null, Lista = null, Mensaje = AppMensajes.FinalizadoExitoso };
            }
            catch (Exception ex)
            {
                return new WebAPIResponse<DTORol>() { Resultado = false, Lista = null, Objeto = null, Mensaje = ex.Message };
            }
        }
        
        [HttpGet]
        [Authorize]
        [Route("GetRolAccion")]
        public WebAPIResponse<Roles> GetRolAccion(int id)
        {
            try
            {
                return new WebAPIResponse<Roles>() { Resultado = true, Objeto = ((RolManager)exe).GetRolAccion(id), Lista = null, Mensaje = AppMensajes.FinalizadoExitoso };
            }
            catch (Exception ex)
            {
                return new WebAPIResponse<Roles>() { Resultado = false, Lista = null, Objeto = null, Mensaje = ex.Message };
            }
        }
    }
}
