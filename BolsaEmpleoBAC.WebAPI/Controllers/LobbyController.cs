using BolsaEmpleoBAC.BL.Logic;
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
    [RoutePrefix("api/Lobby")]
    [Authorize]
    public class LobbyController : ApiController
    {
        [HttpPost]
        [Route("GetPuestos")]
        public WebAPIResponse<int> GetPuestos(WebAPIRequest<int> paisId)
        {
            try
            {
                return new WebAPIResponse<int>() { Resultado = true, Objeto = LobbyManager.GetPuestos(paisId.Lista), Lista = null, Mensaje = AppMensajes.FinalizadoExitoso };
            }
            catch (Exception ex)
            {
                return new WebAPIResponse<int>() { Resultado = false, Lista = null, Objeto = 0, Mensaje = ex.Message };
            }
        }

        [HttpPost]
        [Route("GetAplicantes")]
        public WebAPIResponse<int> GetAplicantes(WebAPIRequest<int> paisId)
        {
            try
            {
                return new WebAPIResponse<int>() { Resultado = true, Objeto = LobbyManager.GetAplicantes(paisId.Lista), Lista = null, Mensaje = AppMensajes.FinalizadoExitoso };
            }
            catch (Exception ex)
            {
                return new WebAPIResponse<int>() { Resultado = false, Lista = null, Objeto = 0, Mensaje = ex.Message };
            }
        }

        [HttpPost]
        [Route("GetUsuarios")]
        public WebAPIResponse<int> GetUsuarios(WebAPIRequest<int> paisId)
        {
            try
            {
                return new WebAPIResponse<int>() { Resultado = true, Objeto = LobbyManager.GetUsuarios(paisId.Lista), Lista = null, Mensaje = AppMensajes.FinalizadoExitoso };
            }
            catch (Exception ex)
            {
                return new WebAPIResponse<int>() { Resultado = false, Lista = null, Objeto = 0, Mensaje = ex.Message };
            }
        }

        [HttpPost]
        [Route("AdministradoresPais")]
        public WebAPIResponse<int> AdministradoresPais(WebAPIRequest<int> paisId)
        {
            try
            {
                return new WebAPIResponse<int>() { Resultado = true, Objeto = LobbyManager.AdministradoresPais(paisId.Lista), Lista = null, Mensaje = AppMensajes.FinalizadoExitoso };
            }
            catch (Exception ex)
            {
                return new WebAPIResponse<int>() { Resultado = false, Lista = null, Objeto = 0, Mensaje = ex.Message };
            }
        }

        [HttpPost]
        [Route("AdministradoresRegional")]
        public WebAPIResponse<int> AdministradoresRegional(WebAPIRequest<int> paisId)
        {
            try
            {
                return new WebAPIResponse<int>() { Resultado = true, Objeto = LobbyManager.AdministradoresRegional(paisId.Lista), Lista = null, Mensaje = AppMensajes.FinalizadoExitoso };
            }
            catch (Exception ex)
            {
                return new WebAPIResponse<int>() { Resultado = false, Lista = null, Objeto = 0, Mensaje = ex.Message };
            }
        }
    }
}
