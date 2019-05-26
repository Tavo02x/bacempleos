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
    [RoutePrefix("api/Entrevistadores")]
    [Authorize]
    public class EntrevistadoresController : ParentController<Usuario>
    {
        public EntrevistadoresController()
        {
            exe = new EntrevistadoresManager();
        }

        [Route("EntrevistadorByPaisGet")]
        [HttpGet]
        public dynamic EntrevistadorByPaisGet(int IdPais)
        {
            try
            {
                var list = ((EntrevistadoresManager)exe).GetEntrevistadorByPais(IdPais);

                return new WebAPIResponse<dynamic>() { Resultado = true, Objeto = null, Lista = list, Mensaje = AppMensajes.FinalizadoExitoso };
            }
            catch (Exception ex)
            {

                return new WebAPIResponse<dynamic>() { Resultado = false, Objeto = null, Lista = null, Mensaje = ex.Message };
            }
        }

        [Route("EntrevistadorByNombreGet")]
        [HttpGet]
        public dynamic EntrevistadorByNombreGet(string Nombre, int IdPais)
        {
            try
            {
                var list = ((EntrevistadoresManager)exe).GetEntrevistadorByNombre(Nombre,IdPais);

                return new WebAPIResponse<dynamic>() { Resultado = true, Objeto = null, Lista = list, Mensaje = AppMensajes.FinalizadoExitoso };
            }
            catch (Exception ex)
            {

                return new WebAPIResponse<dynamic>() { Resultado = false, Objeto = null, Lista = null, Mensaje = ex.Message };
            }
        }
    }
}
