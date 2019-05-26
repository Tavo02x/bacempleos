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
    [RoutePrefix("api/AreasLaborales")]
    [Authorize]
    public class AreasLaboralesController : ParentController<AreasLaborales>
    {
        public AreasLaboralesController()
        {
            exe = new AreasLaboralesManager();
            filtro = new FilterAreasLaborales();
        }

        [HttpPost]
        [Route("Save")]
        public WebAPIResponse<AreasLaborales> Save(WebAPIRequest<AreasLaborales> entity)
        {
            try
            {
                entity.Objeto.FechaCreacion = DateTime.Now;
                exe.Save(entity.Objeto, entity.Id);
                return new WebAPIResponse<AreasLaborales>() { Resultado = true, Objeto = null, Lista = null, Mensaje = AppMensajes.FinalizadoExitoso };
            }
            catch (Exception ex)
            {
                return new WebAPIResponse<AreasLaborales>() { Resultado = false, Lista = null, Objeto = null, Mensaje = ex.Message };
            }
        }

        [HttpPost]
        [Route("Delete")]
        public WebAPIResponse<AreasLaborales> Delete(WebAPIRequest<AreasLaborales> entity)
        {
            try
            {
                exe.Delete(entity.Id);
                return new WebAPIResponse<AreasLaborales>() { Resultado = true, Objeto = null, Lista = null, Mensaje = AppMensajes.FinalizadoExitoso };
            }
            catch (Exception ex)
            {
                return new WebAPIResponse<AreasLaborales>() { Resultado = false, Lista = null, Objeto = null, Mensaje = ex.Message };
            }
        }

        [HttpGet]
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
                return new WebAPIResponse<AreasLaborales>() { Resultado = false, Lista = null, Objeto = null, Mensaje = ex.Message };
            }
        }

    }
}
