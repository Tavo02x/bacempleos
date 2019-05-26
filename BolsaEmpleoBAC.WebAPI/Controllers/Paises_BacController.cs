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
    [RoutePrefix("api/Paises_Bac")]
 
    public class Paises_BacController : ParentController<Paises_Bac>
    {
        public Paises_BacController()
        {
            exe = new PaisesBACManager();
        }

        [HttpGet]
        [Authorize]
        [Route("GetPaisesxUsuario")]
        public WebAPIResponse<Paises_Bac> GetPaisesxUsuario(int id)
        {
            try
            {
                var lista = ((PaisesBACManager)exe).GetPaisesxUsuario(id);
                return new WebAPIResponse<Paises_Bac>() { Resultado = true, Objeto = null, Lista = lista, Mensaje = AppMensajes.FinalizadoExitoso };
            }
            catch (Exception ex)
            {
                return new WebAPIResponse<Paises_Bac>() { Resultado = false, Lista = null, Objeto = null, Mensaje = ex.Message };
            }
        }
    }
}
