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
    [RoutePrefix("api/Zona1")]
    public class Zona1Controller : ParentController<Zona1>
    {
        public Zona1Controller()
        {
            exe = new Zona1Manager();
            filtro = new FilterZona1();
        }

        [HttpPost]
        [Authorize]
        [Route("Save")]
        public WebAPIResponse<Zona1> Save(WebAPIRequest<Zona1> entity)
        {
            try
            {
                entity.Objeto.FechaCreacion = DateTime.Now;
                exe.Save(entity.Objeto, entity.Id);
                return new WebAPIResponse<Zona1>() { Resultado = true, Objeto = null, Lista = null, Mensaje = AppMensajes.FinalizadoExitoso };
            }
            catch (Exception ex)
            {
                return new WebAPIResponse<Zona1>() { Resultado = false, Lista = null, Objeto = null, Mensaje = ex.Message };
            }
        }

        [HttpPost]
        [Authorize]
        [Route("Delete")]
        public WebAPIResponse<Zona1> Delete(WebAPIRequest<Zona1> entity)
        {
            try
            {
                exe.Delete(entity.Id);
                return new WebAPIResponse<Zona1>() { Resultado = true, Objeto = null, Lista = null, Mensaje = AppMensajes.FinalizadoExitoso };
            }
            catch (Exception ex)
            {
                return new WebAPIResponse<Zona1>() { Resultado = false, Lista = null, Objeto = null, Mensaje = ex.Message };
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
                return new WebAPIResponse<Zona1>() { Resultado = false, Lista = null, Objeto = null, Mensaje = ex.Message };
            }
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("GetZona")]
        public dynamic GetZona(int? id)
        {
            try
            {
                var list = ((Zona1Manager)exe).GetZona(id.Value);
                return new WebAPIResponse<Zona1>() { Resultado = true, Objeto = null, Lista = list, Mensaje = AppMensajes.FinalizadoExitoso };
            }
            catch (Exception ex)
            {
                return new WebAPIResponse<Zona3>() { Resultado = false, Lista = null, Objeto = null, Mensaje = ex.Message };
            }
        }

    }
}
