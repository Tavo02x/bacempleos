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
    [RoutePrefix("api/Zona2")]
    public class Zona2Controller : ParentController<Zona2>
    {
        //Zona2Manager exe;
        public Zona2Controller()
        {
            exe = new Zona2Manager();
            filtro = new FilterZona2();
        }

        [HttpPost]
        [Authorize]
        [Route("Save")]
        public WebAPIResponse<Zona2> Save(WebAPIRequest<Zona2> entity)
        {
            try
            {
                entity.Objeto.FechaCreacion = DateTime.Now;
                exe.Save(entity.Objeto, entity.Id);
                return new WebAPIResponse<Zona2>() { Resultado = true, Objeto = null, Lista = null, Mensaje = AppMensajes.FinalizadoExitoso };
            }
            catch (Exception ex)
            {
                return new WebAPIResponse<Zona2>() { Resultado = false, Lista = null, Objeto = null, Mensaje = ex.Message };
            }
        }

        [HttpPost]
        [Authorize]
        [Route("Delete")]
        public WebAPIResponse<Zona2> Delete(WebAPIRequest<Zona2> entity)
        {
            try
            {
                exe.Delete(entity.Id);
                return new WebAPIResponse<Zona2>() { Resultado = true, Objeto = null, Lista = null, Mensaje = AppMensajes.FinalizadoExitoso };
            }
            catch (Exception ex)
            {
                return new WebAPIResponse<Zona2>() { Resultado = false, Lista = null, Objeto = null, Mensaje = ex.Message };
            }
        }


        [HttpGet]
        [AllowAnonymous]
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
                return new WebAPIResponse<Zona2>() { Resultado = false, Lista = null, Objeto = null, Mensaje = ex.Message };
            }
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("GetZona")]
        public dynamic GetZona(int? id)
        {
            try
            {
                var list = ((Zona2Manager)exe).GetZona(id.Value);
                return new WebAPIResponse<Zona2>() { Resultado = true, Objeto = null, Lista = list, Mensaje = AppMensajes.FinalizadoExitoso };
            }
            catch (Exception ex)
            {
                return new WebAPIResponse<Zona2>() { Resultado = false, Lista = null, Objeto = null, Mensaje = ex.Message };
            }
        }
    }
}
