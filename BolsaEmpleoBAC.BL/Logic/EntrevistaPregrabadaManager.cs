using BolsaEmpleoBAC.BL.DTO;
using BolsaEmpleoBAC.BL.Integrations.Zoom;
using BolsaEmpleoBAC.Entities;
using BolsaEmpleoBAC.General.Utilitarios;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Dynamic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BolsaEmpleoBAC.BL.Logic
{
    public class EntrevistaPregrabadaManager : MasterManager<DTOEntrevistaPregrabada,BACEntities>
    {
        private readonly static string frontUrl = ConfigurationManager.AppSettings["UrlFrontend"].ToString();
        public override void Save(DTOEntrevistaPregrabada entity, int id)
        {
            int entrevistaId = 0;
            try
            {
                using (var db = new BACEntities())
                {
                    using (var tran = db.Database.BeginTransaction())
                    {
                        var FechaAgenda = entity.FechaEntrevista.Date;
                        if (db.Entrevistas.Any(x => x.IdPostulante == entity.IdPostulante && x.FechaEntrevista == FechaAgenda && x.IdTipoEntrevista == 2 && (x.IdEstadoEntrevista !=2 && x.IdEstadoEntrevista != 3)))
                        {
                            throw new Exception("Este postulante ya tiene agendada una entrevista para esta fecha, por favor seleccione otra fecha");
                        }
                        var obj = new Entrevistas()
                        {
                            IdAgenda = null,
                            IdPostulante = entity.IdPostulante,
                            IdFeriaEmpleo = null,
                            TipoEntrevista = 2,
                            FechaEntrevista = entity.FechaEntrevista,
                            IdPuesto = entity.IdPuesto,
                            IdEstadoEntrevista = 1,
                            IdTipoEntrevista = 2,
                            IdUsuarioCreador = entity.IdUsuario,
                            CalificacionGeneral = 0
                        };

                        db.Entrevistas.Add(obj);

                        db.SaveChanges();

                        entrevistaId = obj.IdEntrevista;

                        foreach (var e in entity.preguntas)
                        {
                            if (e.IdPregunta == 0)
                            {
                                var pregunta = new Preguntas()
                                {
                                    Descripcion = e.Descripcion,
                                    Borrado = false,
                                    FechaCreacion = DateTime.Now,
                                    IdArea = db.Puestos.FirstOrDefault(x => x.IdPuesto == entity.IdPuesto).IdArea
                                };
                                db.Preguntas.Add(pregunta);

                                db.SaveChanges();
                                var preguntaId = pregunta.IdPregunta;

                                db.Preguntas_Entrevistas.Add(new Preguntas_Entrevistas()
                                {
                                    IdPregunta = preguntaId,
                                    IdEntrevista = entrevistaId,
                                    FechaCreacion = DateTime.Now,
                                    Borrado = false,
                                    Tiempo = e.Tiempo
                                });
                                db.SaveChanges();
                            }
                            else
                            {
                                var preguntaId = e.IdPregunta;

                                db.Preguntas_Entrevistas.Add(new Preguntas_Entrevistas()
                                {
                                    IdPregunta = preguntaId,
                                    IdEntrevista = entrevistaId,
                                    FechaCreacion = DateTime.Now,
                                    Borrado = false,
                                    Tiempo = e.Tiempo
                                });
                                db.SaveChanges();
                            }
                        }
                        tran.Commit();
                    }
                }
            
                try
                {
                    var urlBase = frontUrl + "principal/login?x=";
                    var url = "<a href='" +urlBase + frontUrl + "entrevistas/videopregrabado?IdEntrevista=" + entrevistaId + "xxxxIdPostulante=" + entity.IdPostulante + "'>Link para entrevista pregrabada</a>";
                    var postulante = GetContext().Postulante.FirstOrDefault(x => x.IdPostulante == entity.IdPostulante);
                    var solicitante = GetContext().Usuario.FirstOrDefault(x => x.IdUsuario  == entity.IdUsuario);
                    var puesto = GetContext().Puestos.FirstOrDefault(x => x.IdPuesto == entity.IdPuesto);
                    Correo.SolicitudEntrevistaPregrabada(postulante.Email, postulante.NombreCompleto, solicitante.NombreCompleto,puesto.Titulo,entity.FechaEntrevista.ToString("dd/MM/yyyy"),url);
                }
                catch
                {

                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public List<Preguntas> GetPreguntasByArea(string Descripcion,int IdArea)
        {
            try
            {
                if (Descripcion == null)
                {
                    return GetContext().Preguntas.Where(x => x.IdArea == IdArea).ToList();
                }
                else
                {
                    return GetContext().Preguntas.Where(x => x.Descripcion.ToLower().Contains(Descripcion) && x.IdArea == IdArea).ToList();
                }
                
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public void RechazarEntrevista(int IdEntrevista)
        {
            try
            {
                var zoom = new ZoomManager();
                var entrevista = GetContext().Entrevistas.Include("Puestos").Include("Agenda_Usuario").FirstOrDefault(x => x.IdEntrevista == IdEntrevista);
                entrevista.IdEstadoEntrevista = 4;
                if (entrevista.Agenda_Usuario != null)
                {
                    entrevista.Agenda_Usuario.IsHoraCancelada = true;
                }
                GetContext().SaveChanges();
                var postulante = GetContext().Postulante.FirstOrDefault(x => x.IdPostulante == entrevista.IdPostulante);

                var solicitante = GetContext().Usuario.FirstOrDefault(x => x.IdUsuario == entrevista.IdUsuarioCreador);

                if (entrevista.IdTipoEntrevista == 1)
                {
                    zoom.DeleteMeetings(entrevista.Agenda_Usuario.Id);
                    Correo.RechazoAplicanteEntrevistaEnVivo(solicitante.Email, postulante.NombreCompleto, solicitante.NombreCompleto);
                }
                else
                {
                    Correo.RechazoEntrevistaPregrabada(solicitante.Email, postulante.NombreCompleto, solicitante.NombreCompleto, entrevista.Puestos.Titulo);
                }
                

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public void AceptarEntrevista(int IdEntrevista)
        {
            try
            {

                var entrevista = GetContext().Entrevistas.Include("Agenda_Usuario").FirstOrDefault(x => x.IdEntrevista == IdEntrevista);
                entrevista.IdEstadoEntrevista = 3;
                GetContext().SaveChanges();
                var postulante = GetContext().Postulante.FirstOrDefault(x => x.IdPostulante == entrevista.IdPostulante);

                var solicitante = GetContext().Usuario.FirstOrDefault(x => x.IdUsuario == entrevista.IdUsuarioCreador);

                if (entrevista.IdTipoEntrevista == 1)
                {
                    Correo.AceptacionAplicanteEntrevistaEnVivos(solicitante.Email, postulante.NombreCompleto, solicitante.NombreCompleto, entrevista.FechaEntrevista.ToString("dd/MM/yyyy"),entrevista.Agenda_Usuario.Hora.ToString(), entrevista.Agenda_Usuario.JoinUrl);
                }
                else
                {
                    var urlBase = frontUrl + "principal/login?x=";
                    var url = urlBase + frontUrl + "entrevistas/videopregrabado?IdEntrevista=" + entrevista.IdEntrevista + "xxxxIdPostulante=" + entrevista.IdPostulante;
                    Correo.AceptacionAplicanteEntrevistaPregrabada(solicitante.Email, postulante.NombreCompleto, solicitante.NombreCompleto, entrevista.FechaEntrevista.ToString("dd/MM/yyyy"), url);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public dynamic GetPreguntasByEntrevista(int IdEntrevista, int IdPostulante, int IdUser)
        {
            try
            {
                var user = GetContext().Postulante.Include("Usuario").FirstOrDefault(x => x.IdPostulante == IdPostulante).Usuario;

                if (user.IdUsuario == IdUser)
                {
                    if (!GetContext().Entrevistas.Any(x => x.IdEstadoEntrevista == 2 && x.IdEntrevista == IdEntrevista))
                    {
                        if (!GetContext().Entrevistas.Any(x => x.IdEstadoEntrevista == 4 && x.IdEntrevista == IdEntrevista))
                        {
                            DateTime dateNow = DateTime.Now.Date;

                            var entrevista = GetContext().Entrevistas.FirstOrDefault(x => x.FechaEntrevista < dateNow && x.IdEntrevista == IdEntrevista);

                            if (entrevista == null)
                            {
                                dynamic obj = new ExpandoObject();
                                var list = GetContext().Preguntas_Entrevistas.Where(x => x.IdEntrevista == IdEntrevista).Select(y => new { y.Preguntas, y.Tiempo }).ToList();
                                var nombre = GetContext().Postulante.FirstOrDefault(x => x.IdPostulante == IdPostulante).NombreCompleto;
                                var puesto = GetContext().Entrevistas.Include("Puestos").FirstOrDefault(x => x.IdEntrevista == IdEntrevista).Puestos.Titulo;
                                obj.nombre = nombre;
                                obj.list = list;
                                obj.puesto = puesto;
                                return obj;
                            }
                            else
                            {
                                entrevista.IdEstadoEntrevista = 5;
                                GetContext().SaveChanges();
                                throw new Exception("El tiempo de realización de la entrevista ha caducado.");
                            }
                        }
                        else
                        {
                            throw new Exception("Esta entrevista fue rechazada por el usuario.");
                        }
                    }
                    else
                    {
                        throw new Exception("Esta entrevista ya fue realizada.");
                    }
                }
                else
                {
                    throw new Exception("Esta entrevista no fue asignada a su usuario.");
                }

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public void SaveVideosPregrabada(DTOEntrevistaVideo entity)
        {
            try
            {
                if (!GetContext().Entrevistas.Any(x => x.IdEntrevista == entity.IdEntrevista && x.IdEstadoEntrevista == 2))
                {
                    var entrevista = GetContext().Entrevistas.FirstOrDefault(x => x.IdEntrevista == entity.IdEntrevista);
                    entrevista.IdEstadoEntrevista = 2;

                    var list = new List<Entrevistas_Videos>();
                    foreach (var e in entity.PreguntasVideo)
                    {
                        if (!GetContext().Entrevistas_Videos.Any(x => x.IdEntrevista == entity.IdEntrevista && x.IdPregunta == e.IdPregunta && x.IdZiggeo == e.Video))
                        {
                            list.Add(new Entrevistas_Videos()
                            {
                                IdEntrevista = entity.IdEntrevista,
                                IdPregunta = e.IdPregunta,
                                UrlVideo = e.Video,
                                IdZiggeo = e.Video,
                                FechaCreacion = DateTime.Now,
                                Borrado = false
                            });
                        }
                    }
                    GetContext().Entrevistas_Videos.AddRange(list);
                    GetContext().SaveChanges();

                    try
                    {
                        var postulante = GetContext().Postulante.FirstOrDefault(x => x.IdPostulante == entrevista.IdPostulante);
                        var entrevistador = GetContext().Usuario.FirstOrDefault(x => x.IdUsuario == entrevista.IdUsuarioCreador);
                        var puesto = GetContext().Puestos.FirstOrDefault(x => x.IdPuesto == entrevista.IdPuesto);

                        Correo.ConfirmacionEntrevistaPregrabada(entrevistador.Email, postulante.NombreCompleto, entrevistador.NombreCompleto, puesto.Titulo);
                    }
                    catch
                    {
                    }
                }
                else
                {
                    throw new Exception("Esta entrevista ya fue grabada.");
                }
                
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public dynamic GetVideosPregrabados(int IdEntrevista)
        {
            try
            {
                dynamic obj = new ExpandoObject();

                var entrevista = GetContext().Entrevistas.Include("Entrevistas_Videos").Include("Puestos").Include("Postulante").FirstOrDefault(x => x.IdEntrevista == IdEntrevista);

                obj.IdEntrevista = entrevista.IdEntrevista;
                obj.Fecha = entrevista.FechaEntrevista.ToString("dd/MM/yyyy");
                obj.Nombre = entrevista.Postulante.NombreCompleto;
                obj.Creador = GetContext().Usuario.FirstOrDefault(x => x.IdUsuario == entrevista.IdUsuarioCreador).NombreCompleto;
                obj.Puesto = entrevista.Puestos.Titulo;
                obj.Preguntas = GetContext().Entrevistas_Videos.Where(x => x.IdEntrevista == IdEntrevista).Select(y => new { y.IdEntrevista_Video,Pregunta = y.Preguntas.Descripcion, Video = y.IdZiggeo, y.Calificacion }).ToList();
                obj.IdTipoEntrevista = entrevista.IdTipoEntrevista;
                return obj;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public void CalificarVideoPregrabado(int IdEntrevista, int IdEntrevistaVideo, int Calificacion)
        {
            try
            {
                var video = GetContext().Entrevistas_Videos.FirstOrDefault(x => x.IdEntrevista_Video == IdEntrevistaVideo);

                video.Calificacion = Calificacion;
                GetContext().SaveChanges();

                var entrevista = GetContext().Entrevistas.Include("Preguntas_Entrevistas").Include("Entrevistas_Videos").FirstOrDefault(x => x.IdEntrevista == IdEntrevista);
                var preguntasCant = entrevista.Preguntas_Entrevistas.Count();
                var calificacionVideos = entrevista.Entrevistas_Videos.Sum(x => x.Calificacion);
                var promedio = calificacionVideos / preguntasCant;
                entrevista.CalificacionGeneral = promedio;

                GetContext().SaveChanges();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
