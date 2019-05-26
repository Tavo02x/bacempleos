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
    [RoutePrefix("api/FeriaVirtual")]
    [Authorize]
    public class FeriaVirtualController : ParentController<FeriaEmpleo>
    {
        public FeriaVirtualController()
        {
            exe = new FeriaEmpleoManager();
        }

        [HttpPost]
        [Route("SaveFeriaVirtual")]
        public WebAPIResponse<FeriaEmpleo> SaveFeriaVirtual(WebAPIRequest<FeriaEmpleo> entity)
        {
            try
            {
                entity.Objeto.FechaCreacion = DateTime.Now;

                foreach (var e in entity.Objeto.Paises_Bac_FeriaEmpleo)
                {
                    e.FechaCreacion = DateTime.Now;
                    e.Borrado = false;
                }

                foreach (var e in entity.Objeto.FeriaEmpleo_Entrevistadores)
                {
                    e.FechaCreacion = DateTime.Now;
                    e.Borrado = false;
                }

                
                foreach (var e in entity.Objeto.FeriaEmpleo_Puestos)
                {
                    e.FechaCreacion = DateTime.Now;
                    e.Borrado = false;
                }

                DateTime dateIni = entity.Objeto.FechaInicio.Date;
                DateTime dateEnd = entity.Objeto.FechaFinal.Date;

                entity.Objeto.FechaInicio = dateIni;
                entity.Objeto.FechaFinal = dateEnd;
                entity.Objeto.FeriaCerrada = false;

                exe.Save(entity.Objeto, entity.Id);

                return new WebAPIResponse<FeriaEmpleo>() { Resultado = true, Objeto = null, Lista = null, Mensaje = AppMensajes.FinalizadoExitoso };
            }
            catch (Exception ex)
            {

                return new WebAPIResponse<FeriaEmpleo>() { Resultado = false, Objeto = null, Lista = null, Mensaje = ex.Message };
            }
        }

        [HttpGet]
        [Route("GetFeriaDetalles")]
        public WebAPIResponse<dynamic> GetFeriaDetalles(int IdFeriaEmpleo,int? IdUsuario = 0)
        {
            try
            {
                var obj = new FeriaEmpleoManager();
                var result = obj.GetFeriaDetalles(IdFeriaEmpleo, IdUsuario.Value);

                return new WebAPIResponse<dynamic>() { Resultado = true, Objeto = result, Lista = null, Mensaje = AppMensajes.FinalizadoExitoso };
            }
            catch (Exception ex)
            {

                return new WebAPIResponse<dynamic>() { Resultado = false, Objeto = null, Lista = null, Mensaje = ex.Message };
            }
        }

        [HttpGet]
        [Route("GetEntrevistadoresFeria")]
        public WebAPIResponse<dynamic> GetEntrevistadoresFeria(int IdFeriaEmpleo)
        {
            try
            {
                var obj = new FeriaEmpleoManager();
                var result = obj.GetEntrevistadoresFeria(IdFeriaEmpleo);

                return new WebAPIResponse<dynamic>() { Resultado = true, Objeto = result, Lista = null, Mensaje = AppMensajes.FinalizadoExitoso };
            }
            catch (Exception ex)
            {

                return new WebAPIResponse<dynamic>() { Resultado = false, Objeto = null, Lista = null, Mensaje = ex.Message };
            }
        }

    }
}
