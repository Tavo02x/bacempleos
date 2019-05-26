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
    [RoutePrefix("api/DTOPostulante")]
    public class DTOPostulanteController : ParentController<DTOPostulante>
    {
        public DTOPostulanteController()
        {
            exe = new DTOPostulanteManager();
        }

        [AllowAnonymous]
        [Route("SavePostulante")]
        public WebAPIResponse<DTOPostulante> SavePostulante(WebAPIRequest<DTOPostulante> entity)
        {
            try
            {
                DTOPostulanteManager p = new DTOPostulanteManager();
                var id = entity.Objeto.PostulanteInfo.IdPostulante;
             
                p.Save(entity.Objeto, id);
                return new WebAPIResponse<DTOPostulante>() { Resultado = true, Objeto = null, Lista = null, Mensaje = AppMensajes.FinalizadoExitoso };
            }
            catch (Exception ex)
            {
                return new WebAPIResponse<DTOPostulante>() { Resultado = false, Lista = null, Objeto = null, Mensaje = ex.Message };
            }
        }

        [AllowAnonymous]
        [Route("GetLicencias")]
        [HttpGet]
        public WebAPIResponse<TipoLicencia> GetLicencias(WebAPIRequest<string> entity)
        {
            try
            {
                DTOPostulanteManager p = new DTOPostulanteManager();
                var lista = p.GetLicencias();
                return new WebAPIResponse<TipoLicencia>() { Resultado = true, Objeto = null, Lista = lista, Mensaje = AppMensajes.FinalizadoExitoso };
            }
            catch (Exception ex)
            {
                return new WebAPIResponse<TipoLicencia>() { Resultado = false, Lista = null, Objeto = null, Mensaje = ex.Message };
            }
        }

        [Authorize]
        [HttpGet]
        [Route("MarcarFavorito")]
        public WebAPIResponse<int> MarcarFavorito(int id)
        {
            try
            {
                DTOPostulanteManager p = new DTOPostulanteManager();
                p.MarcarFavorito(id);
                return new WebAPIResponse<int>() { Resultado = true, Objeto = 0, Lista = null, Mensaje = AppMensajes.FinalizadoExitoso };
            }
            catch (Exception ex)
            {
                return new WebAPIResponse<int>() { Resultado = false, Lista = null, Objeto = 0, Mensaje = ex.Message };
            }
        }

        [Authorize]
        [HttpGet]
        [Route("GetPostulante")]
        public dynamic GetPostulante(string username)
        {
            try
            {
                DTOPostulanteManager p = new DTOPostulanteManager();
                var obj = p.Get(username);
                return new WebAPIResponse<dynamic>() { Resultado = true, Lista = null, Objeto = obj, Mensaje = AppMensajes.FinalizadoExitoso };
            }
            catch (Exception ex)
            {
                return new WebAPIResponse<dynamic>() { Resultado = false, Lista = null, Objeto = null, Mensaje = ex.Message };
            }
        }

        [EnableCors(origins: "console.chathub.ai,test.chathub.ai,ws.edna.ai,104.236.199.160,159.65.175.212,205.144.171.67 ", headers: "*", methods: "*")]
        [Authorize]
        [HttpGet]
        [Route("GetIdByEmail")]
        public dynamic GetIdByEmail(string email)
        {
            try
            {
                string message = AppMensajes.FinalizadoExitoso;
                DTOPostulanteManager p = new DTOPostulanteManager();
                var id = p.GetIdByEmail(email);
                var result = true;
                if (id == 0)
                {
                    message = "Este correo ya se encuentra registrado.";
                    result = false;
                }
                return new WebAPIResponse<dynamic>() { Resultado = result, Lista = null, Objeto = id, Mensaje = message };
            }
            catch (Exception ex)
            {
                return new WebAPIResponse<dynamic>() { Resultado = false, Lista = null, Objeto = null, Mensaje = ex.Message };
            }
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("ValidateEmail")]
        public dynamic ValidateEmail(string email)
        {
            try
            {
                string message = AppMensajes.FinalizadoExitoso;
                DTOPostulanteManager p = new DTOPostulanteManager();
                var exists = p.ValidateEmail(email);
                if (exists)
                {
                    message = "Este correo ya se encuentra registrado.";
                }
                return new WebAPIResponse<dynamic>() { Resultado = exists, Lista = null, Objeto = exists, Mensaje = message };
            }
            catch (Exception ex)
            {
                return new WebAPIResponse<dynamic>() { Resultado = false, Lista = null, Objeto = null, Mensaje = ex.Message };
            }
        }

        [Authorize]
        [HttpGet]
        [Route("CompartirPerfil")]
        public dynamic CompartirPerfil(string Email, string Nombre, int IdEntrevista, int IdPostulante)
        {
            try
            {
                DTOPostulanteManager p = new DTOPostulanteManager();
                p.CompartirPerfil(Email, Nombre,IdEntrevista,IdPostulante);
                return new WebAPIResponse<dynamic>() { Resultado = true, Lista = null, Objeto = null, Mensaje = AppMensajes.FinalizadoExitoso };
            }
            catch (Exception ex)
            {
                return new WebAPIResponse<dynamic>() { Resultado = false, Lista = null, Objeto = null, Mensaje = ex.Message };
            }
        }
    }
}
