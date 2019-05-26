using BolsaEmpleoBAC.BL.DTO;
using BolsaEmpleoBAC.Entities;
using BolsaEmpleoBAC.General.Constantes;
using BolsaEmpleoBAC.General.Utilitarios;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BolsaEmpleoBAC.BL.Logic
{
    public class DTOPuestoManager : MasterManager<DTOPuesto, BACEntities>
    {

        public List<dynamic> GetPuestosByPais(int IdPais)
        {
            try
            {
                var list = GetContext().Puestos.Where(x => x.Puestos_Paises_BAC.FirstOrDefault(y => y.IdPais == IdPais).IdPais == IdPais)
                                                         .Select(y => new { y.IdPuesto, Descripcion= y.Titulo })
                                                         .ToList<dynamic>();
                return list;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }

        }

        public List<dynamic> GetPuestosByNombre(string nombre, int IdPais)
        {
            try
            {

                var list = GetContext().Puestos.Where(x => x.Titulo.ToLower().Contains(nombre) && x.Puestos_Paises_BAC.FirstOrDefault(y => y.IdPais == IdPais).IdPais == IdPais)
                                                       .Select(y => new { y.IdPuesto, Descripcion = y.Titulo})
                                                       .ToList<dynamic>();
                return list;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }

        }

        public List<dynamic> GetPuestosByPostulante(int IdPostulante)
        {
            try
            {

                var list = GetContext().Puestos.Where(x => x.Puestos_Postulante.FirstOrDefault(y => y.IdPostulante == IdPostulante).IdPostulante == IdPostulante)
                                                       .Select(y => new { y.IdPuesto, y.Titulo })
                                                       .ToList<dynamic>();
                return list;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public List<dynamic> GetPublicadoTrack(int IdPuesto)
        {
            try
            {
                var listFormat = new List<dynamic>();
                var list = GetContext().PuestosPublicacionTrack.Where(x => x.IdPuesto == IdPuesto && x.Borrado == false && x.Publicado == true).ToList();

                foreach (var e in list)
                {
                    dynamic obj = new ExpandoObject();
                    obj.IdPuesto = e.IdPuesto;
                    obj.IdPuestosPublicacionTrack = e.IdPuestosPublicacionTrack;
                    obj.FechaTack = e.FechaInicio.Value.ToString("dd/MM/yyyy")+" al "+ (e.FechaFin == null? DateTime.Now.ToString("dd/MM/yyyy"): e.FechaFin.Value.ToString("dd/MM/yyyy"));

                    listFormat.Add(obj);
                }
                return listFormat;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        override
        public void Save(DTOPuesto entry, int id)
        {
            try
            {
                int IdPuesto = 0;
                using (var context = new BACEntities())
                {
                    using (var tran = context.Database.BeginTransaction())
                    {
                        var puesto = context.Puestos.FirstOrDefault(x => x.IdPuesto == entry.PuestoInfo.IdPuesto);
                        if (puesto == null)
                        {
                            foreach (var pais in entry.Puestos_Paises_BAC)
                            {
                                entry.PuestoInfo.FechaCreacion = DateTime.Now;
                                entry.PuestoInfo.FechaInicio = DateTime.Now;
                                entry.PuestoInfo.Publicado = true;
                                entry.PuestoInfo.Activo = true;
                                context.Puestos.Add(entry.PuestoInfo);
                                context.SaveChanges();
                                IdPuesto = entry.PuestoInfo.IdPuesto;


                                context.PuestosPublicacionTrack.Add(new PuestosPublicacionTrack()
                                {
                                    IdPuesto = IdPuesto,
                                    FechaInicio = DateTime.Now,
                                    FechaFin = null,
                                    FechaCreacion = DateTime.Now,
                                    Borrado = false,
                                    Publicado = true
                                });

                                List<Puestos_Paises_BAC> paises = new List<Puestos_Paises_BAC>();
                                paises.Add(pais);

                                AgregarLista(context, IdPuesto, entry.Idiomas);
                                AgregarLista(context, IdPuesto, entry.TipoJornadas);
                                AgregarLista(context, IdPuesto, paises);
                                AgregarLista(context, IdPuesto, entry.Requisitos);

                                context.SaveChanges();
                            }
                        }
                        else
                        {
                            IdPuesto = puesto.IdPuesto;

                            if (puesto.Publicado != entry.PuestoInfo.Publicado)
                            {
                                puesto.PuestosPublicacionTrack.Add(
                                     new PuestosPublicacionTrack()
                                     {
                                         IdPuesto = entry.PuestoInfo.IdPuesto,
                                         FechaInicio = puesto.FechaModificacionPublicacion == null ? puesto.FechaCreacion : puesto.FechaModificacionPublicacion,
                                         FechaFin = DateTime.Now,
                                         Borrado = false,
                                         FechaCreacion = DateTime.Now,
                                         Publicado = entry.PuestoInfo.Publicado
                                     }
                                    );
                                puesto.FechaModificacionPublicacion = DateTime.Now;
                            }

                            if (entry.PuestoInfo.Activo)
                            {
                                puesto.Activo = entry.PuestoInfo.Activo;
                                puesto.Publicado = entry.PuestoInfo.Activo;
                                puesto.FechaInicio = DateTime.Now;
                            }
                            else
                            {
                                puesto.Activo = entry.PuestoInfo.Activo;
                                puesto.Publicado = entry.PuestoInfo.Activo;

                                var lista = context.Puestos_Postulante.Include("Postulante").Where(x => x.IdPuesto == IdPuesto && !x.Borrado).ToList();

                                foreach (var nodo in lista)
                                {
                                    Correo.PuestoCerrado(nodo.Postulante.Email, puesto.Titulo, nodo.Postulante.NombreCompleto);
                                    nodo.Borrado = true;
                                    context.SaveChanges();
                                }
                            }

                            if (!entry.PuestoInfo.Publicado)
                            {
                                var lista = context.Puestos_Postulante.Include("Postulante").Where(x => x.IdPuesto == IdPuesto && !x.Borrado).ToList();

                                foreach (var nodo in lista)
                                {
                                    Correo.PuestoCerrado(nodo.Postulante.Email, puesto.Titulo, nodo.Postulante.NombreCompleto);
                                    nodo.Borrado = true;
                                    context.SaveChanges();
                                }
                            }

                            puesto.Publicado = entry.PuestoInfo.Publicado;
                            puesto.Titulo = entry.PuestoInfo.Titulo;
                            puesto.Descripcion = entry.PuestoInfo.Descripcion;
                            puesto.FechaCierreOferta = entry.PuestoInfo.FechaCierreOferta;
                            puesto.IdArea = entry.PuestoInfo.IdArea;
                            puesto.IdNivelAcademico = entry.PuestoInfo.IdNivelAcademico;
                            puesto.IdUsuario = entry.PuestoInfo.IdUsuario;
                            puesto.ImagenURL = entry.PuestoInfo.ImagenURL;
                            puesto.IdZona1 = entry.PuestoInfo.IdZona1;
                            puesto.FechaModificacion = DateTime.Now;

                            context.SaveChanges();

                            IntercambiarLista(context, IdPuesto, entry.Idiomas);
                            IntercambiarLista(context, IdPuesto, entry.TipoJornadas);
                            IntercambiarLista(context, IdPuesto, entry.Puestos_Paises_BAC);
                            IntercambiarLista(context, IdPuesto, entry.Requisitos);
                        }

                        context.SaveChanges();
                        tran.Commit();
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message) { Source = ex.Source };
            }
        }


        override
        public void Delete(int id)
        {
            try
            {
                using (var context = new BACEntities())
                {
                    var puesto = context.Puestos.Include("Puestos_Postulante").FirstOrDefault(x => x.IdPuesto == id);
                    if (puesto != null)
                    {
                        foreach (var postulante in puesto.Puestos_Postulante)
                        {
                            var postulanteAux = context.Postulante.FirstOrDefault(x => x.IdPostulante == postulante.IdPostulante);
                            Correo.AddEmailToQueue(postulanteAux.Email, "", "");
                        }

                        context.Puestos_Postulante.RemoveRange(puesto.Puestos_Postulante);
                        context.Puestos_Idiomas.RemoveRange(context.Puestos_Idiomas.Where(x => x.IdPuesto == puesto.IdPuesto));
                        context.AreasLaborales.RemoveRange(context.AreasLaborales.Where(x => x.Puestos.Any(y => y.IdPuesto == puesto.IdPuesto)));
                        context.Puesto_TipoJornada.RemoveRange(context.Puesto_TipoJornada.Where(x => x.IdPuesto == puesto.IdPuesto));
                        context.RequisitosPuesto.RemoveRange(context.RequisitosPuesto.Where(x => x.IdPuesto == puesto.IdPuesto));
                        context.Puestos.Remove(puesto);
                    }
                    else
                    {
                        throw new Exception(MensajesRespuesta.ElementoNoEncontrado);
                    }

                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message) { Source = ex.Source };
            }
        }

        override
        public DTOPuesto Get(int id)
        {
            try
            {
                using (var context = GetContext())
                {
                    int IdPuesto = id;
                    var puesto = context.Puestos.FirstOrDefault(x => x.IdPuesto == IdPuesto);
                    var Puestos_Paises_BAC = context.Puestos_Paises_BAC.Where(x => x.Puestos.IdPuesto == IdPuesto).ToList();
                    foreach (var nodo in Puestos_Paises_BAC)
                    {
                        nodo.Puestos = null;
                        nodo.Paises_Bac = null;
                    }

                    var idiomas = context.Puestos_Idiomas.Where(x => x.IdPuesto == IdPuesto).ToList();
                    foreach (var nodo in idiomas)
                    {
                        nodo.Puestos = null;
                        nodo.Idioma = null;
                    }

                    var jornadas = context.Puesto_TipoJornada.Where(x => x.IdPuesto == IdPuesto).ToList();
                    foreach (var nodo in jornadas)
                    {
                        nodo.Puestos = null;
                        nodo.TipoJornada = null;
                    }

                    var requisitos = context.RequisitosPuesto.Where(x => x.IdPuesto == IdPuesto).ToList();
                    foreach (var nodo in requisitos)
                    {
                        nodo.Puestos = null;
                    }

                    return new DTOPuesto()
                    {
                        PuestoInfo = puesto,
                        Puestos_Paises_BAC = Puestos_Paises_BAC,
                        Idiomas = idiomas,
                        TipoJornadas = jornadas,
                        Requisitos = requisitos
                    };
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message) { Source = ex.Source };
            }
        }

        override
        public List<DTOPuesto> Get()
        {
            try
            {
                List<DTOPuesto> resultado = new List<DTOPuesto>();
                using (var context = new BACEntities())
                {
                    var lista = context.Puestos.ToList();

                    foreach (var nodo in lista)
                    {
                        resultado.Add(Get(nodo.IdPuesto));
                    }
                }

                return resultado;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message) { Source = ex.Source };
            }
        }

        public dynamic VerPuesto(int idPuesto, int IdPostulante)
        {
            try
            {
                var context = GetContext();
                Puestos nodo = context.Puestos.Include("AreasLaborales").Include("Puestos_Postulante").FirstOrDefault(x => x.IdPuesto == idPuesto);
                dynamic obj = new ExpandoObject();
                obj.IdPuesto = nodo.IdPuesto;
                obj.Titulo = nodo.Titulo;
                obj.Descripcion = nodo.Descripcion;
                obj.FechaCierre = nodo.FechaCierreOferta.ToString("dd/MM/yyyy");
                obj.FechaCreacion = nodo.FechaCreacion.ToString("dd/MM/yyyy");
                obj.Idiomas = context.Puestos_Idiomas.Include("Idioma").Where(x => x.IdPuesto == nodo.IdPuesto)
                    .Select(x => new
                    {
                        DEscripcion = x.Idioma.Descripcion,
                        Porcentaje = x.Porcentaje == 100 ? "Alto" : (x.Porcentaje == 50 ? "Intermedio" : (x.Porcentaje == 0 ? "Sin definir" : "Bajo"))
                    });
                obj.Jornada = context.Puesto_TipoJornada.Include("TipoJornada").Where(x => x.IdPuesto == nodo.IdPuesto).Select(x => new { x.TipoJornada.Descripcion });
                var zona = context.Zona1.FirstOrDefault(x => x.IdZona1 == nodo.IdZona1);
                var pais = context.Puestos_Paises_BAC.Include("Paises_Bac").FirstOrDefault(x => x.IdPuesto == nodo.IdPuesto);
                //.Select(x => new { x.Paises_Bac.Descripcion  });
                obj.Pais = (pais == null ? string.Empty : pais.Paises_Bac.Descripcion) + (zona == null ? string.Empty : ", " + zona.Descripcion);
                obj.IdArea = nodo.IdArea;
                obj.Area = nodo.AreasLaborales.Area;
                obj.NivelAcademico = context.NivelAcademico.FirstOrDefault(x => x.IdNivelAcademico == nodo.IdNivelAcademico).Descripcion;
                //obj.IsAplicado = nodo.Puestos_Postulante.Any(x => x.IdPostulante == IdPostulante && x.IdPuesto == idPuesto);
                obj.IsAplicado = IdPostulante == 0 ? false : context.Puestos_Postulante.Include("Postulante").Any(x => x.Postulante.IdUsuario == IdPostulante && x.IdPuesto == idPuesto);
                var puestoAplicado = context.Puestos_Postulante.Include("Postulante").FirstOrDefault(x => x.Postulante.IdUsuario == IdPostulante && x.IdPuesto == idPuesto);
                obj.FechaAplicacion = IdPostulante == 0 ? DateTime.Now : (puestoAplicado == null ? DateTime.Now : puestoAplicado.FechaRegistro);
                obj.Requisitos = context.RequisitosPuesto.Where(x => x.IdPuesto == idPuesto)
                    .Select(x => new
                    {
                        x.IdRequisito,
                        x.Descripcion
                    }).ToList();
                var lista = context.Puestos_Postulante.Where(x => x.IdPuesto == idPuesto).ToList();
                obj.CantidadAplicantes = lista.Count;
                return obj;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message) { Source = ex.Source };
            }
        }

        public List<dynamic> PuestosRelacionados(int idArea, int top)
        {
            try
            {
                List<dynamic> respuesta = new List<dynamic>();
                var context = GetContext();
                DateTime ahora = DateTime.Now;
                var lista = context.Puestos.Where(x => x.IdArea == idArea && x.FechaCierreOferta >= ahora).Take(top).OrderByDescending(x => x.FechaCreacion).ToList();
                foreach (var nodo in lista)
                {
                    dynamic obj = new ExpandoObject();
                    obj.IdPuesto = nodo.IdPuesto;
                    obj.Titulo = nodo.Titulo;
                    obj.FechaCierre = nodo.FechaCierreOferta.ToString("dd/MM/yyyy");
                    obj.Pais = context.Puestos_Paises_BAC.Include("Paises_Bac").Where(x => x.IdPuesto == nodo.IdPuesto).Select(x => new { x.Paises_Bac.Descripcion });

                    respuesta.Add(obj);
                }

                return respuesta;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message) { Source = ex.Source };
            }
        }

        public bool AplicarPuesto(int IdPuesto, int IdPostulante, bool EnviarEmail = true, bool Feria = false)
        {
            try
            {
                bool bandera = false;
                Postulante postulante = new Postulante();
                Puestos puesto = new Puestos();
                //var context = GetContext();
                using (var context = new BACEntities())
                {
                    var lista = context.Puestos_Postulante.Include("Postulante").Where(x => x.Postulante.IdUsuario == IdPostulante).ToList();
                    var obj = context.Puestos_Postulante.Include("Postulante").FirstOrDefault(x => x.Postulante.IdUsuario == IdPostulante && x.IdPuesto == IdPuesto);
                    if (lista.Count >= AppSetting.MaxAplicantes && obj == null)
                    {
                        throw new Exception("El máximo de aplicaciones de puestos es de " + AppSetting.MaxAplicantes + ", favor desapliquese de un proceso actual o mantengase con las posea.");
                    }
                    else
                    {
                        if (obj != null)
                        {
                            if (Feria == false)
                            {
                                context.Puestos_Postulante.Remove(obj);
                                context.SaveChanges();
                            }
                            
                        }
                        else
                        {
                            postulante = context.Postulante.FirstOrDefault(x => x.IdUsuario == IdPostulante);
                            var aux = context.Puestos_Postulante.Include("Postulante").FirstOrDefault(x => x.Postulante.IdUsuario == IdPostulante && x.IdPuesto == IdPuesto);
                            if (aux == null)
                            {
                                context.Puestos_Postulante.Add(new Puestos_Postulante() { IdPuesto = IdPuesto, IdPostulante = postulante.IdPostulante, Borrado = false, FechaRegistro = DateTime.Now, IdEstadoPerfil = EstadoPerfilContants.NoLeido });
                                puesto = context.Puestos.FirstOrDefault(x => x.IdPuesto == IdPuesto);
                                bandera = true;
                                context.SaveChanges();
                            }
                        }
                    }
                }
                //if (bandera)
                //{
                //    try
                //    {
                //        if (EnviarEmail)
                //        {
                //            Correo.ConfirmacionAplicacionPuesto(postulante.Email, puesto.Titulo);
                //        }
                //    }
                //    catch
                //    {

                //    }
                //}
                return bandera;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message) { Source = ex.Source };
            }
        }

        public void EnviarCorreoPuesto(int IdPuesto, int IdPostulante, bool EnviarEmail)
        {
            try
            {
                Postulante postulante = new Postulante();
                Puestos puesto = new Puestos();
                //var context = GetContext();
                using (var context = new BACEntities())
                {
                    postulante = context.Postulante.FirstOrDefault(x => x.IdUsuario == IdPostulante);
                    puesto = context.Puestos.FirstOrDefault(x => x.IdPuesto == IdPuesto);
                }
                if (EnviarEmail)
                {
                    Correo.ConfirmacionAplicacionPuesto(postulante.Email, puesto.Titulo);
                }
            }
            catch
            {

            }
        }

        public void CambiarEstadoPerfil(int IdPostulante, int IdPuesto, int IdEstado, int IdUsuario)
        {
            try
            {
                var context = GetContext();
                using (var tran = context.Database.BeginTransaction())
                {
                    var restrict = context.Puestos_Postulante.Include("Puestos").FirstOrDefault(x => x.IdPostulante == IdPostulante && (x.IdEstadoPerfil == EstadoPerfilContants.Contratado || x.IdEstadoPerfil == EstadoPerfilContants.PreSeleccionado) && x.Puestos.Activo);
                    if (restrict == null)
                    {
                        var entry = context.Puestos_Postulante.FirstOrDefault(x => x.IdPostulante == IdPostulante && x.IdPuesto == IdPuesto);
                        if (IdEstado == EstadoPerfilContants.Archivado)
                        {
                            var commente = new Comentarios()
                            {
                                IdPostulacion = IdPostulante,
                                Descripcion = "Ha sido archivado",
                                Borrado = false,
                                FechaCreacion = DateTime.Now,
                                IdUsuario = IdUsuario
                            };

                            context.Comentarios.Add(commente);

                            var postualnte = context.Postulante.FirstOrDefault(x => x.IdPostulante == IdPostulante);
                            if (postualnte != null)
                            {
                                postualnte.Borrado = true;
                                context.SaveChanges();
                            }

                            var aplicaciones = context.Puestos_Postulante.Include("Puestos").Where(x => x.IdPostulante == IdPostulante && x.Puestos.Activo).ToList();
                            foreach (var nodo in aplicaciones)
                            {
                                nodo.IdEstadoPerfil = IdEstado;
                                context.SaveChanges();
                            }
                        }

                        if (IdEstado == EstadoPerfilContants.Contratado)
                        {
                            var lista = context.Puestos_Postulante.Include("Postulante").Where(x => x.IdPuesto == IdPuesto && x.IdPostulante != IdPostulante).ToList();

                            foreach (var nodo in lista)
                            {
                                Correo.PuestoCerrado(nodo.Postulante.Email, entry.Puestos.Titulo, nodo.Postulante.NombreCompleto);
                                nodo.Borrado = true;
                                context.SaveChanges();
                            }

                            //context.Puestos_Postulante.RemoveRange(lista);
                            context.SaveChanges();

                            var puesto = context.Puestos.FirstOrDefault(x => x.IdPuesto == IdPuesto);
                            puesto.Activo = false;
                            puesto.Publicado = false;

                            context.SaveChanges();
                        }

                        entry.IdEstadoPerfil = IdEstado;
                        GetContext().SaveChanges();
                        tran.Commit();
                    }
                    else
                    {
                        if (restrict.IdEstadoPerfil == EstadoPerfilContants.Contratado)
                        {
                            throw new Exception("El postulante ya se encuentra contratado, no debe modificarse el estado de las otras aplicaciones a puesto.");
                        }
                        if (restrict.IdEstadoPerfil == EstadoPerfilContants.PreSeleccionado)
                        {
                            if (IdEstado == EstadoPerfilContants.Contratado)
                            {
                                var entry = context.Puestos_Postulante.FirstOrDefault(x => x.IdPostulante == IdPostulante && x.IdPuesto == IdPuesto);
                                entry.IdEstadoPerfil = IdEstado;
                                GetContext().SaveChanges();
                                tran.Commit();
                            }
                            else
                            {
                                throw new Exception("El postulante ya se encuentra pre-seleccionado, no debe modificarse el estado de las otras aplicaciones a puesto.");
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message) { Source = ex.Source };
            }
        }

        public void CambiarEstadoPerfilLeido(int IdPostulante, int IdPuesto)
        {
            try
            {
                var context = GetContext();
                var perfilNoLeido = context.Puestos_Postulante.FirstOrDefault(x => x.IdPostulante == IdPostulante && x.IdPuesto == IdPuesto);
                if (perfilNoLeido.IdEstadoPerfil == EstadoPerfilContants.NoLeido)
                {
                    CambiarEstadoPerfil(IdPostulante, IdPuesto, EstadoPerfilContants.Leido, 0);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message) { Source = ex.Source };
            }
        }

        public void CerrarPuestos()
        {
            try
            {
                using (var context = new BACEntities())
                {
                    using (var tran = context.Database.BeginTransaction())
                    {
                        DateTime ahora = DateTime.Now;
                        var lista = context.Puestos.Include("Puestos_Postulante").Where(x => x.FechaCierreOferta > ahora).ToList();
                        foreach (var nodo in lista)
                        {
                            foreach (var nodo2 in nodo.Puestos_Postulante)
                            {
                                // revisar estado
                                var postulante = context.Postulante.FirstOrDefault(x => x.IdPostulante == nodo2.IdPostulante);
                                try
                                {
                                    Correo.PuestoCerrado(postulante.Email, nodo.Titulo, postulante.NombreCompleto);
                                    nodo2.Borrado = true;
                                }
                                catch
                                {

                                }
                            }
                            nodo.Activo = false;
                            nodo.Publicado = false;
                            context.SaveChanges();
                        }

                        tran.Commit();
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message) { Source = ex.Source };
            }
        }

        #region  Método Privados


        private void AgregarLista(BACEntities context, int IdPuesto, List<Puestos_Idiomas> lista)
        {
            if (lista != null && lista.Count > 0)
            {
                foreach (var aux in lista)
                {
                    aux.IdPuesto = IdPuesto;
                    aux.FechaCreacion = DateTime.Now;
                }
                context.Puestos_Idiomas.AddRange(lista);
            }
        }

        private void AgregarLista(BACEntities context, int IdPuesto, List<Puesto_TipoJornada> lista)
        {

            if (lista != null && lista.Count > 0)
            {
                foreach (var aux in lista)
                {
                    aux.IdPuesto = IdPuesto;
                    aux.Borrado = false;
                }
                context.Puesto_TipoJornada.AddRange(lista);
            }
        }

        private void AgregarLista(BACEntities context, int IdPuesto, List<Puestos_Paises_BAC> lista)
        {

            if (lista != null && lista.Count > 0)
            {
                foreach (var aux in lista)
                {
                    aux.IdPuesto = IdPuesto;
                    aux.FechaCreacion = DateTime.Now;
                    aux.Borrado = false;
                }
                context.Puestos_Paises_BAC.AddRange(lista);
            }
        }

        private void AgregarLista(BACEntities context, int IdPuesto, List<RequisitosPuesto> lista)
        {

            if (lista != null && lista.Count > 0)
            {
                foreach (var aux in lista)
                {
                    aux.IdPuesto = IdPuesto;
                }
                context.RequisitosPuesto.AddRange(lista);
            }
        }

        private void IntercambiarLista(BACEntities context, int IdPuesto, List<Puestos_Idiomas> lista)
        {
            var listaEliminar = context.Puestos_Idiomas.Where(x => x.IdPuesto == IdPuesto);
            context.Puestos_Idiomas.RemoveRange(listaEliminar);

            AgregarLista(context, IdPuesto, lista);
        }

        private void IntercambiarLista(BACEntities context, int IdPuesto, List<Puesto_TipoJornada> lista)
        {
            var listaEliminar = context.Puesto_TipoJornada.Where(x => x.IdPuesto == IdPuesto);
            context.Puesto_TipoJornada.RemoveRange(listaEliminar);

            AgregarLista(context, IdPuesto, lista);
        }

        private void IntercambiarLista(BACEntities context, int IdPuesto, List<Puestos_Paises_BAC> lista)
        {
            var listaEliminar = context.Puestos_Paises_BAC.Where(x => x.Puestos.IdPuesto == IdPuesto);
            context.Puestos_Paises_BAC.RemoveRange(listaEliminar);

            AgregarLista(context, IdPuesto, lista);
        }

        private void IntercambiarLista(BACEntities context, int IdPuesto, List<RequisitosPuesto> lista)
        {
            var listaEliminar = context.RequisitosPuesto.Where(x => x.Puestos.IdPuesto == IdPuesto);
            context.RequisitosPuesto.RemoveRange(listaEliminar);

            AgregarLista(context, IdPuesto, lista);
        }

        #endregion Método privados
    }
}
