
using AndcultureCode.ZoomClient.Models.Meetings;
using BolsaEmpleoBAC.BL.DTO;
using BolsaEmpleoBAC.BL.Integrations.Zoom;
using BolsaEmpleoBAC.BL.Logic;
using BolsaEmpleoBAC.Entities;
using BolsaEmpleoBAC.General;
using BolsaEmpleoBAC.WebAPI.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Dynamic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Cors;

namespace BolsaEmpleoBAC.WebAPI.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    [RoutePrefix("api/Zoom")]
    [Authorize]
    public class ZoomController : ApiController
    {
        private readonly static string frontUrl = ConfigurationManager.AppSettings["UrlFrontend"].ToString();
        private ZoomManager zoom = new ZoomManager();
        private HttpClient client = new HttpClient();

        public ZoomController()
        {
            client.BaseAddress = new Uri("https://api.zoom.us/v2/");
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(
            new MediaTypeWithQualityHeaderValue("application/json"));
        }

        [HttpPost]
        [Route("CreateMeeting")]
        public async Task<WebAPIResponse<Meeting>> CreateMeeting(WebAPIRequest<DTOEntrevistaVivo> entity)
        {
            try
            {
                var meeting = await zoom.CreateMeeting(entity.Objeto);
                return new WebAPIResponse<Meeting>() { Resultado = true, Objeto = meeting, Lista = null, Mensaje = AppMensajes.FinalizadoExitoso };
            }
            catch (Exception ex)
            {
                return new WebAPIResponse<Meeting>() { Resultado = false, Objeto = null, Lista = null, Mensaje = ex.Message };
            }
        }

        [HttpPost]
        [Route("CreateMeetingFeria")]
        public WebAPIResponse<Meeting> CreateMeetingFeria(WebAPIRequest<DTOEntrevistaVivo> entity)
        {
            try
            {
                var meeting = zoom.CreateMeetingFeria(entity.Objeto);

                return new WebAPIResponse<Meeting>() { Resultado = true, Objeto = meeting, Lista = null, Mensaje = AppMensajes.FinalizadoExitoso };
            }
            catch(Exception ex)
            {
                return new WebAPIResponse<Meeting>() { Resultado = false, Objeto = null, Lista = null, Mensaje =ex.Message };
            }
        }

        [HttpPost]
        [Route("UpdateMeeting")]
        public WebAPIResponse<Entrevistas> UpdateMeeting(WebAPIRequest<DTOEntrevistaVivo> entity)
        {
            try
            {
                var meeting = zoom.UpdateMeeting(entity.Objeto);
                return new WebAPIResponse<Entrevistas>() { Resultado = true, Objeto = null, Lista = null, Mensaje = AppMensajes.FinalizadoExitoso };
            }
            catch (Exception ex)
            {
                return new WebAPIResponse<Entrevistas>() { Resultado = false, Objeto = null, Lista = null, Mensaje = ex.Message };
            }
        }

        [HttpPost]
        [Route("ReasignMeeting")]
        public WebAPIResponse<Usuario> ReasignMeeting(WebAPIRequest<DTOEntrevistaVivo> entity)
        {
            try
            {
                var meeting = zoom.ReasignMeeting(entity.Objeto);
                return new WebAPIResponse<Usuario>() { Resultado = true, Objeto = meeting, Lista = null, Mensaje = AppMensajes.FinalizadoExitoso };
            }
            catch (Exception ex)
            {
                return new WebAPIResponse<Usuario>() { Resultado = false, Objeto = null, Lista = null, Mensaje = ex.Message };
            }
        }

        [HttpGet]
        [Route("GetListRecording")]
        public async Task<IHttpActionResult> GetListRecording()
        {
            try
            {

                HttpResponseMessage response = await client.GetAsync("users/"+ zoom.userId + "/recordings?access_token=" + zoom.token);
                if (response.IsSuccessStatusCode)
                {
                    var model = await response.Content.ReadAsAsync<dynamic>();
                    return Ok(model);
                }
                else
                {
                    return BadRequest();
                }        
            }
            catch
            {
                return StatusCode(HttpStatusCode.BadRequest);
            }
        }

        [HttpGet]
        [Route("GetMeetingRecording")]
        public async Task<IHttpActionResult> GetMeetingRecording(int userId)
        {
            try
            {
                var list = new List<dynamic>();
                var listEntrevista = zoom.GetEntrevistasByUser(userId);
                
                foreach (var e in listEntrevista)
                {
                    string UrlVideo = "";
                    if (e.IdTipoEntrevista == 1)
                    {                    
                        client.DefaultRequestHeaders.Accept.Clear();
                        client.DefaultRequestHeaders.Accept.Add(
                        new MediaTypeWithQualityHeaderValue("application/json"));                   
                        HttpResponseMessage response = await client.GetAsync("meetings/" + e.Agenda_Usuario.Uuid + "/recordings?access_token=" + zoom.token);
                        if (response.IsSuccessStatusCode)
                        {
                            var model = await response.Content.ReadAsAsync<MeetingsZoom>();

                            UrlVideo = model.recording_files.FirstOrDefault(x => x.file_type.Equals("MP4")).play_url;
                            zoom.EntrevistaAddVideo(UrlVideo, e.IdEntrevista, 0);

                        }
                    }

                    var UrlPregrabada = frontUrl + "entrevistas/videopregrabado?IdEntrevista=" + e.IdEntrevista + "&IdPostulante=" + e.IdPostulante;

                    dynamic obj = new ExpandoObject();
                    obj.IdEntrevista = e.IdEntrevista;
                    obj.TipoEntrevista = e.TipoEntrevista1.Descripcion;
                    obj.FechaEntrevista = e.FechaEntrevista.ToString("dd/MM/yyyy");
                    obj.Url = e.IdTipoEntrevista == 1 ? UrlVideo: UrlPregrabada;
                    obj.Creada = zoom.GetCreadorEntrevista((int)e.IdUsuarioCreador);
                    obj.IdEstado = e.IdEstadoEntrevista;
                    obj.Estado = e.EstadoEntrevista.Descripcion;
                    obj.CalificacionGeneral = e.CalificacionGeneral;
                    obj.IdTipoEntrevista = e.IdTipoEntrevista;
                    obj.IsFeria = e.IdFeriaEmpleo == null ? false : true;
                    
                    list.Add(obj);
                }

                return Ok(list);

            }
            catch(Exception ex)
            {
                return StatusCode(HttpStatusCode.BadRequest);
            }
        }

        [HttpGet]
        [Route("GetMeetingRecordingById")]
        public async Task<IHttpActionResult> GetMeetingRecordingById(int IdEntrevista)
        {
            try
            {
                dynamic obj = new ExpandoObject();
                var e = zoom.GetEntrevistasById(IdEntrevista);
                var video = new EntrevistaPregrabadaManager();
                string UrlVideo = "";
                    if (e.IdTipoEntrevista == 1)
                    {
                        client.DefaultRequestHeaders.Accept.Clear();
                        client.DefaultRequestHeaders.Accept.Add(
                        new MediaTypeWithQualityHeaderValue("application/json"));
                        HttpResponseMessage response = await client.GetAsync("meetings/" + e.Agenda_Usuario.Uuid + "/recordings?access_token=" + zoom.token);
                        if (response.IsSuccessStatusCode)
                        {
                            var model = await response.Content.ReadAsAsync<MeetingsZoom>();

                            UrlVideo = model.recording_files.FirstOrDefault(x => x.file_type.Equals("MP4")).play_url;
                            zoom.EntrevistaAddVideo(UrlVideo, e.IdEntrevista, 0);
                        }


                        var UrlPregrabada = frontUrl + "entrevistas/videopregrabado?IdEntrevista=" + e.IdEntrevista + "&IdPostulante=" + e.IdPostulante;

                        obj.IdEntrevista = e.IdEntrevista;
                        obj.TipoEntrevista = e.TipoEntrevista1.Descripcion;
                        obj.FechaEntrevista = e.FechaEntrevista.ToString("dd/MM/yyyy");
                        obj.Url = e.IdTipoEntrevista == 1 ? UrlVideo : UrlPregrabada;
                        obj.Creada = zoom.GetCreadorEntrevista((int)e.IdUsuarioCreador);
                        obj.IdEstado = e.IdEstadoEntrevista;
                        obj.Estado = e.EstadoEntrevista.Descripcion;
                        obj.CalificacionGeneral = e.CalificacionGeneral;
                        obj.IdTipoEntrevista = e.IdTipoEntrevista;
                        obj.Hora = e.Agenda_Usuario.Hora;
                        obj.Puesto = "";
                    }

                    if (e.IdTipoEntrevista == 2)
                    {
                        obj = video.GetVideosPregrabados(e.IdEntrevista);
                    }
                return Ok(obj);

            }
            catch (Exception ex)
            {
                return StatusCode(HttpStatusCode.BadRequest);
            }
        }

    }
}
