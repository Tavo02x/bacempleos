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
    [RoutePrefix("api/Usuario")]
    [Authorize]
    public class UsuarioController : ParentController<Usuario>
    {
        public UsuarioController()
        {
            exe = new UsuarioManager();
        }

        [Authorize]
        [Route("SaveUsuario")]
        public WebAPIResponse<DTOUsuario> SavePostulante(WebAPIRequest<DTOUsuario> entity)
        {
            try
            {
                DTOUsuarioManager p = new DTOUsuarioManager();
                var id = entity.Objeto.Info.IdUsuario;
                p.Save(entity.Objeto, id);
                return new WebAPIResponse<DTOUsuario>() { Resultado = true, Objeto = null, Lista = null, Mensaje = AppMensajes.FinalizadoExitoso };
            }
            catch (Exception ex)
            {
                return new WebAPIResponse<DTOUsuario>() { Resultado = false, Lista = null, Objeto = null, Mensaje = ex.Message };
            }
        }

        [Authorize]
        [HttpGet]
        [Route("GetUsuario")]
        public dynamic GetUsuario(int id)
        {
            try
            {
                DTOUsuarioManager p = new DTOUsuarioManager();
                var obj = p.Get(id);
                return new WebAPIResponse<dynamic>() { Resultado = true, Lista = null, Objeto = obj, Mensaje = AppMensajes.FinalizadoExitoso };
            }
            catch (Exception ex)
            {
                return new WebAPIResponse<dynamic>() { Resultado = false, Lista = null, Objeto = null, Mensaje = ex.Message };
            }
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("Recuperar")]
        public dynamic Recuperar(WebAPIRequest<string> request)
        {
            try
            {
                DTOUsuarioManager p = new DTOUsuarioManager();
                p.RecuperarClave(request.Objeto);
                return new WebAPIResponse<dynamic>() { Resultado = true, Lista = null, Objeto = null, Mensaje = AppMensajes.FinalizadoExitoso };
            }
            catch (Exception ex)
            {
                return new WebAPIResponse<dynamic>() { Resultado = false, Lista = null, Objeto = null, Mensaje = ex.Message };
            }
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("CambiarClave")]
        public dynamic CambiarClave(WebAPIRequest<DTOCambiarClave> request)
        {
            try
            {
                DTOUsuarioManager p = new DTOUsuarioManager();
                p.CambiarClave(request.Objeto);
                return new WebAPIResponse<dynamic>() { Resultado = true, Lista = null, Objeto = null, Mensaje = AppMensajes.FinalizadoExitoso };
            }
            catch (Exception ex)
            {
                return new WebAPIResponse<dynamic>() { Resultado = false, Lista = null, Objeto = null, Mensaje = ex.Message };
            }
        }
    }
}
