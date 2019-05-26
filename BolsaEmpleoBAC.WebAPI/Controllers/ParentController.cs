using BolsaEmpleoBAC.BL.Interface;
using BolsaEmpleoBAC.BL.Logic;
using BolsaEmpleoBAC.Entities;
using BolsaEmpleoBAC.General;
using System;
using System.Web.Http;
using System.Web.Http.Cors;

namespace BolsaEmpleoBAC.WebAPI.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class ParentController<T> : ApiController where T : class
    {
        protected MasterManager<T, BACEntities> exe;
        protected MasterFilter<T> filtro;

        [HttpGet]
        [HttpPost]
        [Authorize]
        [Route("Save")]
        public WebAPIResponse<T> Save(WebAPIRequest<T> entity)
        {
            try
            {
                exe.Save(entity.Objeto, entity.Id);
                return new WebAPIResponse<T>() { Resultado = true, Objeto = null, Lista = null, Mensaje = AppMensajes.FinalizadoExitoso };
            }
            catch (Exception ex)
            {
                return new WebAPIResponse<T>() { Resultado = false, Lista = null, Objeto = null, Mensaje = ex.Message };
            }
        }

        [HttpPost]
        [Authorize]
        [Route("Delete")]
        public WebAPIResponse<T> Delete(WebAPIRequest<T> entity)
        {
            try
            {
                exe.Delete(entity.Id);
                return new WebAPIResponse<T>() { Resultado = true, Objeto = null, Lista = null, Mensaje = AppMensajes.FinalizadoExitoso };
            }
            catch (Exception ex)
            {
                return new WebAPIResponse<T>() { Resultado = false, Lista = null, Objeto = null, Mensaje = ex.Message };
            }
        }


        [HttpGet]
        [AllowAnonymous]
        [Route("Get")]
        public WebAPIResponse<T> Filter(int? id)
        {
            try
            {
                if (id == null)
                {
                    var lista = filtro == null ? exe.Get() : exe.Get(filtro);
                    
                    return new WebAPIResponse<T>() { Resultado = true, Objeto = null, Lista = lista, Mensaje = AppMensajes.FinalizadoExitoso };
                }
                else
                {
                    var objeto = exe.Get(id.Value);
                    return new WebAPIResponse<T>() { Resultado = true, Objeto = objeto, Lista = null, Mensaje = AppMensajes.FinalizadoExitoso };
                }
               
            }
            catch (Exception ex)
            {
                return new WebAPIResponse<T>() { Resultado = false, Lista = null, Objeto = null, Mensaje = ex.Message };
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
                return new WebAPIResponse<T>() { Resultado = false, Lista = null, Objeto = null, Mensaje = ex.Message };
            }
        }
    }
}
