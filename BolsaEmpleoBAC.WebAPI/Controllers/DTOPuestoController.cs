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
    [RoutePrefix("api/DTOPuesto")]
    public class DTOPuestoController : ParentController<DTOPuesto>
    {
        public DTOPuestoController()
        {
            exe = new DTOPuestoManager();
        }

        [Route("SavePuesto")]
        [HttpPost]
        [Authorize]
        public dynamic SavePuesto(WebAPIRequest<DTOPuesto> entity)
        {
            try
            {
                DTOPuestoManager p = new DTOPuestoManager();
                entity.Objeto.PuestoInfo.FechaCreacion = DateTime.Now;
                p.Save(entity.Objeto, entity.Id);

                return new WebAPIResponse<dynamic>() { Resultado = true, Objeto = null, Lista = null, Mensaje = AppMensajes.FinalizadoExitoso };
            }
            catch (Exception ex)
            {

                return new WebAPIResponse<dynamic>() { Resultado = false, Objeto = null, Lista = null, Mensaje = ex.Message };
            }
        }

        [HttpGet]
        [Authorize]
        [Route("GetPuesto")]
        public WebAPIResponse<DTOPuesto> Filter(int? id)
        {
            try
            {
                if (id == null)
                {
                    var lista = exe.Get();
                    return new WebAPIResponse<DTOPuesto>() { Resultado = true, Objeto = null, Lista = lista, Mensaje = AppMensajes.FinalizadoExitoso };
                }
                else
                {
                    var objeto = exe.Get(id.Value);
                    objeto.PuestoInfo.Entrevistas = null;
                    objeto.PuestoInfo.Puestos_Idiomas = null;
                    objeto.PuestoInfo.Puestos_Paises_BAC = null;
                    objeto.PuestoInfo.Puestos_Postulante = null;
                    objeto.PuestoInfo.Puesto_TipoJornada = null;
                    return new WebAPIResponse<DTOPuesto>() { Resultado = true, Objeto = objeto, Lista = null, Mensaje = AppMensajes.FinalizadoExitoso };
                }

            }
            catch (Exception ex)
            {
                return new WebAPIResponse<DTOPuesto>() { Resultado = false, Lista = null, Objeto = null, Mensaje = ex.Message };
            }
        }

        [HttpGet]
        [Authorize]
        [Route("GetPublicadoTrack")]
        public WebAPIResponse<dynamic> GetPublicadoTrack(int IdPuesto)
        {
            try
            {
                var exe = new DTOPuestoManager();
                var list = exe.GetPublicadoTrack(IdPuesto);
                return new WebAPIResponse<dynamic>() { Resultado = true, Objeto = null, Lista = list, Mensaje = AppMensajes.FinalizadoExitoso };
            }
            catch (Exception ex)
            {
                return new WebAPIResponse<dynamic>() { Resultado = false, Lista = null, Objeto = null, Mensaje = ex.Message };
            }
        }

        [HttpGet]
        [Authorize]
        [Route("VerPuesto")]
        public WebAPIResponse<dynamic> VerPuesto(int? IdPuesto,int? IdPostulante)
        {
            try
            {
                var exe = new DTOPuestoManager();
                var objeto = exe.VerPuesto(IdPuesto.Value, IdPostulante.Value);
                return new WebAPIResponse<dynamic>() { Resultado = true, Objeto = objeto, Lista = null, Mensaje = AppMensajes.FinalizadoExitoso };

            }
            catch (Exception ex)
            {
                return new WebAPIResponse<dynamic>() { Resultado = false, Lista = null, Objeto = null, Mensaje = ex.Message };
            }
        }

        [HttpGet]
        [Authorize]
        [Route("GetPuestosRelacionados")]
        public WebAPIResponse<dynamic> GetPuestosRelacionados(int IdArea, int top)
        {
            try
            {
                var exe = new DTOPuestoManager();
                var objeto = exe.PuestosRelacionados(IdArea, top);
                return new WebAPIResponse<dynamic>() { Resultado = true, Objeto = null, Lista = objeto, Mensaje = AppMensajes.FinalizadoExitoso };

            }
            catch (Exception ex)
            {
                return new WebAPIResponse<dynamic>() { Resultado = false, Lista = null, Objeto = null, Mensaje = ex.Message };
            }
        }

        [HttpGet]
        [Authorize]
        [Route("AplicarPuesto")]
        public WebAPIResponse<DTOPuesto> AplicarPuesto(int IdPuesto,int IdPostulante)
        {
            try
            {
                var exe = new DTOPuestoManager();
                bool bandera = exe.AplicarPuesto(IdPuesto,IdPostulante);
                exe.EnviarCorreoPuesto(IdPuesto, IdPostulante, bandera);
                return new WebAPIResponse<DTOPuesto>() { Resultado = true, Objeto = null, Lista = null, Mensaje = AppMensajes.FinalizadoExitoso };

            }
            catch (Exception ex)
            {
                return new WebAPIResponse<DTOPuesto>() { Resultado = false, Lista = null, Objeto = null, Mensaje = ex.Message };
            }
        }

        [HttpGet]
        [Authorize]
        [Route("CambiarEstadoPerfil")]
        public WebAPIResponse<DTOPuesto> CambiarEstadoPerfil(int IdPostulante, int IdPuesto, int IdEstado, int IdUsuario)
        {
            try
            {
                var exe = new DTOPuestoManager();
                exe.CambiarEstadoPerfil(IdPostulante, IdPuesto, IdEstado, IdUsuario);
                return new WebAPIResponse<DTOPuesto>() { Resultado = true, Objeto = null, Lista = null, Mensaje = AppMensajes.FinalizadoExitoso };

            }
            catch (Exception ex)
            {
                return new WebAPIResponse<DTOPuesto>() { Resultado = false, Lista = null, Objeto = null, Mensaje = ex.Message };
            }
        }

        [HttpGet]
        [Authorize]
        [Route("CambiarEstadoPerfilLeido")]
        public WebAPIResponse<DTOPuesto> CambiarEstadoPerfilLeido(int IdPostulante, int IdPuesto)
        {
            try
            {
                var exe = new DTOPuestoManager();
                exe.CambiarEstadoPerfilLeido(IdPostulante, IdPuesto);
                return new WebAPIResponse<DTOPuesto>() { Resultado = true, Objeto = null, Lista = null, Mensaje = AppMensajes.FinalizadoExitoso };

            }
            catch (Exception ex)
            {
                return new WebAPIResponse<DTOPuesto>() { Resultado = false, Lista = null, Objeto = null, Mensaje = ex.Message };
            }
        }

        [Route("PuestosByPaisGet")]
        [HttpGet]
        [Authorize]
        public dynamic PuestosByPaisGet(int IdPais)
        {
            try
            {
                var list= ((DTOPuestoManager)exe).GetPuestosByPais(IdPais);

                return new WebAPIResponse<dynamic>() { Resultado = true, Objeto = null, Lista = list, Mensaje = AppMensajes.FinalizadoExitoso };
            }
            catch (Exception ex)
            {

                return new WebAPIResponse<dynamic>() { Resultado = false, Objeto = null, Lista = null, Mensaje = ex.Message };
            }
        }

        [Route("PuestosByPaisNombre")]
        [HttpGet]
        [Authorize]
        public dynamic PuestosByPaisNombre(string Nombre, int IdPais)
        {
            try
            {
                var list = ((DTOPuestoManager)exe).GetPuestosByNombre(Nombre,IdPais);

                return new WebAPIResponse<dynamic>() { Resultado = true, Objeto = null, Lista = list, Mensaje = AppMensajes.FinalizadoExitoso };
            }
            catch (Exception ex)
            {

                return new WebAPIResponse<dynamic>() { Resultado = false, Objeto = null, Lista = null, Mensaje = ex.Message };
            }
        }

        [Route("PuestosByPostulante")]
        [HttpGet]
        [Authorize]
        public dynamic PuestosByPostulante(int IdPostulante)
        {
            try
            {
                var list = ((DTOPuestoManager)exe).GetPuestosByPostulante(IdPostulante);

                return new WebAPIResponse<dynamic>() { Resultado = true, Objeto = null, Lista = list, Mensaje = AppMensajes.FinalizadoExitoso };
            }
            catch (Exception ex)
            {

                return new WebAPIResponse<dynamic>() { Resultado = false, Objeto = null, Lista = null, Mensaje = ex.Message };
            }
        }

        [HttpGet]
        [Authorize]
        [Route("CerrarTodosLosPuestosPorFechaActual")]
        public WebAPIResponse<dynamic> CerrarTodosLosPuestosPorFechaActual()
        {
            try
            {
                var exe = new DTOPuestoManager();
                exe.CerrarPuestos();
                return new WebAPIResponse<dynamic>() { Resultado = true, Objeto = null, Lista = null, Mensaje = AppMensajes.FinalizadoExitoso };

            }
            catch (Exception ex)
            {
                return new WebAPIResponse<dynamic>() { Resultado = false, Lista = null, Objeto = null, Mensaje = ex.Message };
            }
        }

        [HttpGet]
        [Authorize]
        [Route("GetPuestosDisponibles")]
        public WebAPIResponse<dynamic> GetPuestosDisponibles()
        {
            try
            {
                var exe = new DTOPuestoManager();
                exe.CerrarPuestos();
                return new WebAPIResponse<dynamic>() { Resultado = true, Objeto = null, Lista = null, Mensaje = AppMensajes.FinalizadoExitoso };

            }
            catch (Exception ex)
            {
                return new WebAPIResponse<dynamic>() { Resultado = false, Lista = null, Objeto = null, Mensaje = ex.Message };
            }
        }
    }
}
