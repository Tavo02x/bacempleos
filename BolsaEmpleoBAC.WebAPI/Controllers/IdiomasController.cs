using BolsaEmpleoBAC.BL.Interface;
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
    [RoutePrefix("api/Idiomas")]
    [Authorize]
    public class IdiomasController : ParentController<Idioma>
    {
        public IdiomasController()
        {
            exe = new IdiomasManager();
            filtro = new FilterIdiomas();
        }

        [HttpPost]
        [Authorize]
        [Route("Save")]
        public WebAPIResponse<Idioma> Save(WebAPIRequest<Idioma> entity)
        {
            try
            {
                entity.Objeto.FechaCreacion = DateTime.Now;
                exe.Save(entity.Objeto, entity.Id);
                return new WebAPIResponse<Idioma>() { Resultado = true, Objeto = null, Lista = null, Mensaje = AppMensajes.FinalizadoExitoso };
            }
            catch (Exception ex)
            {
                return new WebAPIResponse<Idioma>() { Resultado = false, Lista = null, Objeto = null, Mensaje = ex.Message };
            }
        }

        [HttpPost]
        [Authorize]
        [Route("Delete")]
        public WebAPIResponse<Idioma> Delete(WebAPIRequest<Idioma> entity)
        {
            try
            {
                exe.Delete(entity.Id);
                return new WebAPIResponse<Idioma>() { Resultado = true, Objeto = null, Lista = null, Mensaje = AppMensajes.FinalizadoExitoso };
            }
            catch (Exception ex)
            {
                return new WebAPIResponse<Idioma>() { Resultado = false, Lista = null, Objeto = null, Mensaje = ex.Message };
            }
        }

        [HttpGet]
        [Authorize]
        [Route("Paging")]
        public dynamic Paging(int pageSize, int page)
        {
            try
            {
                var lista = exe.GetPagedData(page, pageSize);
                return lista;
            }
            catch (Exception ex)
            {
                return new WebAPIResponse<Idioma>() { Resultado = false, Lista = null, Objeto = null, Mensaje = ex.Message };
            }
        }
    }
}
