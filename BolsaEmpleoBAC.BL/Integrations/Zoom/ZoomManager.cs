
using AndcultureCode.ZoomClient;
using AndcultureCode.ZoomClient.Models;
using AndcultureCode.ZoomClient.Models.Meetings;
using BolsaEmpleoBAC.BL.DTO;
using BolsaEmpleoBAC.BL.Logic;
using BolsaEmpleoBAC.Entities;
using BolsaEmpleoBAC.General.Utilitarios;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Dynamic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace BolsaEmpleoBAC.BL.Integrations.Zoom
{
    public class ZoomManager
    {
        private readonly string frontUrl = ConfigurationManager.AppSettings["UrlFrontend"].ToString();
        private ZoomClientOptions options;
        private ZoomClient client;
        public readonly string userId = ConfigurationManager.AppSettings["ZOOM_USER_ID"].ToString();
        public readonly string token = ConfigurationManager.AppSettings["ZOOM_TOKEN"].ToString();
        private BACEntities db = new BACEntities();

        public ZoomManager()
        {
            options = new ZoomClientOptions
            {
                ZoomApiKey = ConfigurationManager.AppSettings["ZOOM_API_KEY"].ToString(),
                ZoomApiSecret = ConfigurationManager.AppSettings["ZOOM_SECRET_KEY"].ToString()
            };

            client = new ZoomClient(options);
        }

        public async Task<Meeting> CreateMeetingREST(string userId,Meeting obj)
        {
            Meeting meeting = new Meeting();
            try
            {
                HttpClient client = new HttpClient();
                client.BaseAddress = new Uri("https://api.zoom.us/v2/");
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(
                new MediaTypeWithQualityHeaderValue("application/json"));
                client.DefaultRequestHeaders.Add("Authorization", "Bearer " + token);
                string json = JsonConvert.SerializeObject(obj);
                var httpContent = new StringContent(json);
                HttpResponseMessage response = await client.PostAsync("users/" + userId + "/meetings", httpContent);

                if (response.IsSuccessStatusCode)
                {
                    string result = await response.Content.ReadAsStringAsync();
                    meeting = JsonConvert.DeserializeObject<Meeting>(result);
                }
                return meeting;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<Meeting> CreateMeeting(DTOEntrevistaVivo obj )
        {
            try
            {
                var FechaAgenda = obj.Start_time.Date;
                var postulante = db.Postulante.FirstOrDefault(x => x.IdPostulante == obj.IdPostulante);

                var solicitante = db.Usuario.Include("Agenda_Usuario").FirstOrDefault(x => x.IdUsuario == obj.IdSolicitante);

                if (solicitante.Agenda_Usuario.Any(x => x.IsHoraCancelada == false && x.Hora.Equals(obj.Hour) && x.FechaAgenda == FechaAgenda))
                {
                    throw new Exception("Ya se encuentra agendada una entrevista para esta hora, seleccione una hora diferente.");
                }

                TimeSpan time = TimeSpan.Parse(obj.Hour);

                obj.Start_time = obj.Start_time.Date.Add(time);

                DateTime utcTime1 = obj.Start_time;

                utcTime1 = DateTime.SpecifyKind(utcTime1, DateTimeKind.Utc);
                DateTimeOffset utcTime2 = utcTime1;
                int IdPais = Convert.ToInt32(postulante.PaisRecidencia);

                string timezone = db.Paises_Bac.FirstOrDefault(x => x.IdPais == IdPais).ZonaHoraria;

                Meeting meeting = new Meeting
                {
                    Topic = obj.Topic,
                    Type = MeetingTypes.Scheduled,
                    StartTime = utcTime2,
                    Duration = obj.Duration,
                    Timezone = timezone,
                    Settings = new MeetingSettings()
                    {
                        EnableHostVideo = true,
                        EnableParticipantVideo = true,
                        EnableJoinBeforeHost = false,
                        EnableMuteOnEntry = false,
                        ApprovalType = MeetingApprovalTypes.Manual,
                        AutoRecording = obj.Auto_recording
                    }
                };
                var result = client.Meetings.CreateMeeting(userId, meeting);
                //Meeting result = await CreateMeetingREST(userId, meeting);
                var agenda = new Agenda_Usuario()
                {
                    FechaAgenda = utcTime1,
                    Hora = obj.Hour,
                    IsHoraBloqueada = true,
                    IsHoraCancelada = false,
                    IdPostulante = obj.IdPostulante,
                    IdUsuario = obj.IdSolicitante,
                    FechaCreacion = obj.Start_time,
                    JoinUrl = result.JoinUrl,
                    StarUrl = result.StartUrl,
                    Id = result.Id,
                    Uuid = result.Uuid,
                    UserIdZoom = userId,
                    IdPais = IdPais,
                };

                db.Agenda_Usuario.Add(agenda);
                db.SaveChanges();
                var agendaId = agenda.IdAgenda_Usuario;

                db.Entrevistas.Add( new Entrevistas ()
                {
                    IdAgenda = agendaId,
                    IdPostulante = obj.IdPostulante,
                    IdFeriaEmpleo = null,
                    TipoEntrevista = 1,
                    FechaEntrevista = obj.Start_time,
                    IdPuesto = null,
                    IdEstadoEntrevista = 1,
                    IdTipoEntrevista = 1,
                    CalificacionGeneral = 0,
                    IdUsuarioCreador = obj.IdSolicitante
                });
                db.SaveChanges();

                try
                {
                    Correo.SolicitudEntrevistaEnVivo(postulante.Email, postulante.NombreCompleto, result.StartTime.ToString("dd/MM/yyyy"), obj.Hour, result.JoinUrl);
                }
                catch
                {

                }
                return result;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message) { Source=ex.Source};
            }
        }

        public Meeting CreateMeetingFeria(DTOEntrevistaVivo obj)
        {
            try
            {
                var puesto = new DTOPuestoManager();
                var searchEntrevistador = true;
                var IsSearched = false;
                var entrevistadores = new List<int>();
                var postulante = new Usuario();
                var FechaAgenda = obj.Start_time.Date;

                entrevistadores = db.FeriaEmpleo_Entrevistadores.Where(x => x.IdFeriaEmpleo == obj.IdFeriaEmpleo).Select(y => y.IdUsuario).ToList();

                if (entrevistadores.Count() == 0)
                {
                    throw new Exception("No existen entrevistadores disponibles para esta feria virtual.");
                }
                while (searchEntrevistador)
                {
                    var randomList = new List<int>();
                    foreach (int e in entrevistadores)
                    {
                        randomList.Add(e);
                    }
                    var IdUsuario = randomList.RandomList().FirstOrDefault();

                    postulante = db.Usuario.Include("Agenda_Usuario").FirstOrDefault(x => x.IdUsuario == IdUsuario);

                    if (postulante.Agenda_Usuario != null)
                    {
                        if (postulante.Agenda_Usuario.Any(x => x.IsHoraCancelada == false && x.Hora.Equals(obj.Hour) && x.FechaAgenda == FechaAgenda))
                        {
                            entrevistadores.Remove(IdUsuario);
                            IsSearched = false;
                        }
                        else
                        {
                            IsSearched = true;
                        }
                    }
                    else
                    {
                        IsSearched = true;
                    }

                    searchEntrevistador = !IsSearched;

                    if (entrevistadores.Count == 0)
                    {
                        searchEntrevistador = false;
                        IsSearched = false;
                    }
                }

                if (IsSearched == false)
                {
                    throw new Exception("No se encontraron entrevistadores disponibles para esta hora, seleccione una hora diferente.");
                }

                var solicitante = db.Usuario.Include("Postulante").FirstOrDefault(x => x.IdUsuario == obj.IdSolicitante);

                puesto.AplicarPuesto(obj.IdPuesto, solicitante.Postulante.FirstOrDefault().IdUsuario, false, true);

                TimeSpan time = TimeSpan.Parse(obj.Hour);

                obj.Start_time = obj.Start_time.Date.Add(time);

                DateTime utcTime1 = obj.Start_time;

                utcTime1 = DateTime.SpecifyKind(utcTime1, DateTimeKind.Utc);
                DateTimeOffset utcTime2 = utcTime1;
                //int IdPais = Convert.ToInt32(postulante.PaisRecidencia);
                var pais = db.Puestos_Paises_BAC.Include("Paises_Bac").FirstOrDefault(x => x.IdPuesto == obj.IdPuesto).Paises_Bac;
                string timezone = pais.ZonaHoraria;
                int paisId = pais.IdPais;
                Meeting meeting = new Meeting
                {
                    Topic = obj.Topic,
                    Type = MeetingTypes.Scheduled,
                    StartTime = utcTime2,
                    Duration = obj.Duration,
                    Timezone = timezone,
                    Settings = new MeetingSettings()
                    {
                        EnableHostVideo = true,
                        EnableParticipantVideo = true,
                        EnableJoinBeforeHost = false,
                        EnableMuteOnEntry = false,
                        ApprovalType = MeetingApprovalTypes.Manual,
                        AutoRecording = obj.Auto_recording
                    }
                };
                var result = client.Meetings.CreateMeeting(userId, meeting);

                var agenda = new Agenda_Usuario()
                {
                    FechaAgenda = utcTime1,
                    Hora = obj.Hour,
                    IsHoraBloqueada = true,
                    IsHoraCancelada = false,
                    IdPostulante = solicitante.Postulante.FirstOrDefault().IdPostulante,//obj.IdPostulante,
                    IdUsuario = postulante.IdUsuario,
                    FechaCreacion = DateTime.Now,
                    JoinUrl = result.JoinUrl,
                    StarUrl = result.StartUrl,
                    Id = result.Id,
                    Uuid = result.Uuid,
                    UserIdZoom = userId,
                    IdPais = paisId
                };

                db.Agenda_Usuario.Add(agenda);
                db.SaveChanges();
                var agendaId = agenda.IdAgenda_Usuario;

                db.Entrevistas.Add(new Entrevistas()
                {
                    IdAgenda = agendaId,
                    IdPostulante = solicitante.Postulante.FirstOrDefault().IdPostulante,
                    IdFeriaEmpleo = obj.IdFeriaEmpleo,
                    TipoEntrevista = 1,
                    FechaEntrevista = obj.Start_time,
                    IdPuesto = obj.IdPuesto,
                    IdEstadoEntrevista = 1,
                    IdTipoEntrevista = 1,
                    CalificacionGeneral = 0,
                    IdUsuarioCreador = solicitante.IdUsuario
                });
                db.SaveChanges();

               

                try
                {
                    Correo.SolicitudEntrevistaEnVivo(postulante.Email, postulante.NombreCompleto, result.StartTime.ToString("dd/MM/yyyy"), obj.Hour, result.JoinUrl);
                }
                catch
                {

                }
                return result;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message) { Source = ex.Source };
            }
        }

        public Entrevistas UpdateMeeting(DTOEntrevistaVivo obj)
        {
            try
            {
                var puesto = new DTOPuestoManager();
                var postulante = new Postulante();
                var FechaAgenda = obj.Start_time.Date;

                var entrevista = db.Entrevistas.Include("Agenda_Usuario").FirstOrDefault(x => x.IdEntrevista == obj.IdEntrevista);

                if (entrevista.Agenda_Usuario != null)
                {
                    if (db.Agenda_Usuario.Any(x => x.IsHoraCancelada == false && x.Hora.Equals(obj.Hour) && x.FechaAgenda == FechaAgenda && x.IdUsuario == obj.IdSolicitante))
                    {
                        throw new Exception("Ya se encuentra agendada esta hora y fecha. Seleccione otra hora o fecha.");
                    }
                }

                TimeSpan time = TimeSpan.Parse(obj.Hour);

                obj.Start_time = obj.Start_time.Date.Add(time);

                DateTime utcTime1 = obj.Start_time;

                utcTime1 = DateTime.SpecifyKind(utcTime1, DateTimeKind.Utc);
                DateTimeOffset utcTime2 = utcTime1;
                //int IdPais = Convert.ToInt32(postulante.PaisRecidencia);
                string timezone = db.Puestos_Paises_BAC.Include("Paises_Bac").FirstOrDefault(x => x.IdPuesto == entrevista.IdPuesto).Paises_Bac.ZonaHoraria;
                Meeting meeting = new Meeting
                {
                    Topic = obj.Topic,
                    Type = MeetingTypes.Scheduled,
                    StartTime = utcTime2,
                    Duration = obj.Duration,
                    Timezone = timezone,
                    Settings = new MeetingSettings()
                    {
                        EnableHostVideo = true,
                        EnableParticipantVideo = true,
                        EnableJoinBeforeHost = false,
                        EnableMuteOnEntry = false,
                        ApprovalType = MeetingApprovalTypes.Manual,
                        AutoRecording = obj.Auto_recording
                    }
                };
                var result = client.Meetings.UpdateMeeting(entrevista.Agenda_Usuario.Id, meeting);

                if (result)
                {
                    entrevista.FechaEntrevista = obj.Start_time;
                    entrevista.IdEstadoEntrevista = 3;
                    entrevista.Agenda_Usuario.FechaAgenda = obj.Start_time;
                    entrevista.Agenda_Usuario.Hora = obj.Hour;
                    db.SaveChanges();

                    postulante = db.Postulante.FirstOrDefault(x => x.IdUsuario == entrevista.IdUsuarioCreador.Value);

                    try
                    {
                        Correo.ReagendarEntrevistaEnVivo(postulante.Email, postulante.NombreCompleto, entrevista.Agenda_Usuario.FechaAgenda.ToString("dd/MM/yyyy"), obj.Hour, entrevista.Agenda_Usuario.JoinUrl);
                    }
                    catch
                    {

                    }
                }
                return entrevista;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message) { Source = ex.Source };
            }
        }

        public Usuario ReasignMeeting(DTOEntrevistaVivo obj)
        {
            try
            {
                var puesto = new DTOPuestoManager();
                var searchEntrevistador = true;
                var IsSearched = false;
                var entrevistadores = new List<int>();
                var postulante = new Usuario();
                var FechaAgenda = obj.Start_time.Date;

                entrevistadores = db.FeriaEmpleo_Entrevistadores.Where(x => x.IdFeriaEmpleo == obj.IdFeriaEmpleo && x.IdUsuario != obj.IdSolicitante).Select(y => y.IdUsuario).ToList();

                while (searchEntrevistador)
                {
                    var randomList = new List<int>();
                    foreach (int e in entrevistadores)
                    {
                        randomList.Add(e);
                    }
                    var IdUsuario = randomList.RandomList().FirstOrDefault();

                    postulante = db.Usuario.Include("Agenda_Usuario").FirstOrDefault(x => x.IdUsuario == IdUsuario);

                    if (postulante.Agenda_Usuario != null)
                    {
                        if (postulante.Agenda_Usuario.Any(x => x.IsHoraCancelada == false && x.Hora.Equals(obj.Hour) && x.FechaAgenda == FechaAgenda))
                        {
                            entrevistadores.Remove(IdUsuario);
                            IsSearched = false;
                        }
                        else
                        {
                            IsSearched = true;
                        }
                    }
                    else
                    {
                        IsSearched = true;
                    }

                    searchEntrevistador = !IsSearched;

                    if (entrevistadores.Count == 0)
                    {
                        searchEntrevistador = false;
                        IsSearched = false;
                    }
                }

                if (IsSearched == false)
                {
                    throw new Exception("No se encontraron entrevistadores disponibles para esta hora, seleccione una hora diferente.");
                }


                Meeting meeting = new Meeting
                {
                    Topic = obj.Topic,
                    Type = MeetingTypes.Scheduled,
                    Duration = obj.Duration,
                    Settings = new MeetingSettings()
                    {
                        EnableHostVideo = true,
                        EnableParticipantVideo = true,
                        EnableJoinBeforeHost = false,
                        EnableMuteOnEntry = false,
                        ApprovalType = MeetingApprovalTypes.Manual,
                        AutoRecording = obj.Auto_recording
                    }
                };

                var entrevista = db.Entrevistas.Include("Agenda_Usuario").FirstOrDefault(x => x.IdEntrevista == obj.IdEntrevista);
                var result = client.Meetings.UpdateMeeting(entrevista.Agenda_Usuario.Id, meeting);
                Usuario usuario = db.Usuario.FirstOrDefault(x => x.IdUsuario == entrevista.Agenda_Usuario.IdUsuario);
                if (result)
                {
                    entrevista.Agenda_Usuario.IdUsuario = postulante.IdUsuario;
                    db.SaveChanges();

                    try
                    {
                        Correo.SolicitudEntrevistaEnVivo(postulante.Email, postulante.NombreCompleto, entrevista.Agenda_Usuario.FechaAgenda.ToString("dd/MM/yyyy"), obj.Hour, entrevista.Agenda_Usuario.JoinUrl);
                    }
                    catch
                    {

                    }
                }
                return usuario;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message) { Source = ex.Source };
            }
        }

        public bool DeleteMeetings(string meetingId)
        {
            try
            {
                var result = client.Meetings.DeleteMeeting(meetingId);
                return result;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message) { Source = ex.Source };
            }
        }

        public ListMeetings GetListMeetingsByUser()
        {
            try
            {
                var result = client.Meetings.GetMeetings(userId);
                return result;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message) { Source = ex.Source };
            }
        }

        public Meeting GetDetailMeeting(string meetingId)
        {
            try
            {
                var result = client.Meetings.GetMeeting(meetingId);
                return result;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message) { Source = ex.Source };
            }
        }

        public List<Entrevistas> GetEntrevistasByUser(int userId)
        {
            try
            {
               var list = new List<Entrevistas>();
               list = db.Entrevistas.Include("Agenda_Usuario").Include("TipoEntrevista1").Include("EstadoEntrevista").Where(x => x.IdPostulante == userId).ToList();              
               return list;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message) { Source = ex.Source };
            }
        }

        public Entrevistas GetEntrevistasById(int IdEntrevista)
        {
            try
            {
                var obj = new Entrevistas();
                obj = db.Entrevistas.Include("Agenda_Usuario").Include("TipoEntrevista1").Include("EstadoEntrevista").FirstOrDefault(x => x.IdEntrevista  == IdEntrevista);
                return obj;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message) { Source = ex.Source };
            }
        }

        public string GetCreadorEntrevista(int userId)
        {
            try
            {
                string Nombre = "";
                var obj = db.Usuario.FirstOrDefault(x => x.IdUsuario == userId);

                if (obj != null)
                {
                    Nombre = obj.NombreCompleto;
                }
                return Nombre;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message) { Source = ex.Source };
            }
        }

        public void EntrevistaAddVideo(string UrlVideo,int IdEntrevista, int IdPregunta,string IdZiggeo =  "")
        {
            try
            {

                if (!db.Entrevistas_Videos.Any(x => x.IdEntrevista == IdEntrevista && x.UrlVideo.Equals(UrlVideo)))
                {
                    db.Entrevistas_Videos.Add(new Entrevistas_Videos()
                    {
                        IdEntrevista = IdEntrevista,
                        UrlVideo = UrlVideo,
                        IdPregunta = null,
                        IdZiggeo = IdZiggeo,
                        FechaCreacion = DateTime.Now,
                        Borrado = false
                    });
                    var entrevista = db.Entrevistas.FirstOrDefault(x => x.IdEntrevista == IdEntrevista);
                    entrevista.IdEstadoEntrevista = 2;
                    db.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message) { Source = ex.Source };
            }
        }

        public dynamic GetEntrevista(int IdEntrevista)
        {
            try
            {
                dynamic obj = new ExpandoObject();

                var entrevista = db.Entrevistas.Include("Agenda_Usuario").FirstOrDefault(x => x.IdEntrevista == IdEntrevista);
                obj.IdEntrevista = entrevista.IdEntrevista;
                obj.FechaEntrevista = entrevista.FechaEntrevista;
                obj.IdPostulante = entrevista.IdPostulante;
                obj.IdUsuario =  entrevista.IdUsuarioCreador;
                obj.Hora = entrevista.Agenda_Usuario.Hora;

                return obj;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message) { Source = ex.Source };
            }
        }
    }
}
