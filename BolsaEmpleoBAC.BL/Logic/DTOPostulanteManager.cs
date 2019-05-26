using BolsaEmpleoBAC.BL.DTO;

using BolsaEmpleoBAC.Entities;
using BolsaEmpleoBAC.General.Constantes;
using BolsaEmpleoBAC.General.Utilitarios;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Dynamic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Security;

namespace BolsaEmpleoBAC.BL.Logic
{
    public class DTOPostulanteManager : MasterManager<DTOPostulante, BACEntities>
    {
        private readonly string frontUrl = ConfigurationManager.AppSettings["UrlFrontend"].ToString();
      

        public List<TipoLicencia> GetLicencias()
        {
            try
            {
                var lista = GetContext().TipoLicencia.ToList();
                return lista;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message) { Source = ex.Source };
            }
        }

        public void MarcarFavorito(int id)
        {
            try
            {
                using (var context = new BACEntities())
                {
                    var postulante = context.Postulante.FirstOrDefault(x => x.IdPostulante == id);
                    if (postulante != null)
                    {
                        if (postulante.Favorito)
                        {
                            postulante.Favorito = false;
                        }
                        else
                        {
                            postulante.Favorito = true;
                        }
                    }
                    context.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message) { Source = ex.Source };
            }
        }

        override
        public void Save(DTOPostulante entry, int id)
        {
            try
            {
                int idPostulante = 0;
                using (var context = new BACEntities())
                {
                    using (var tran = context.Database.BeginTransaction())
                    {
                        var postulante = context.Postulante.FirstOrDefault(x => x.IdPostulante == entry.PostulanteInfo.IdPostulante);
                        if (postulante == null)
                        {
                            entry.Credenciales.FechaCreacion = DateTime.Now;
                            entry.Credenciales.Borrado = false;
                            entry.Credenciales.Password = LoginManager.EncryptSHA256(entry.Credenciales.Password);
                            context.Usuario.Add(entry.Credenciales);
                            context.SaveChanges();

                            context.Usuario_Roles.Add(new Usuario_Roles()
                            {
                                Borrado = false,
                                FechaCreacion = DateTime.Now,
                                IdUsuario = entry.Credenciales.IdUsuario,
                                IdRol = 3
                            });

                            foreach (var e in entry.Paises)
                            {
                                context.Paises_Bac_Usuario.Add(new Paises_Bac_Usuario()
                                {
                                    FechaCreacion = DateTime.Now,
                                    IdUsuario = entry.Credenciales.IdUsuario,
                                    IdPais = e.IdPais
                                });
                            }
                            context.SaveChanges();

                            entry.PostulanteInfo.OtraDiscapacidad = "";
                            entry.PostulanteInfo.Profesion = "";
                            entry.PostulanteInfo.DescripcionCualidades = "";
                            entry.PostulanteInfo.DescripcionVentajaCompetitiva = "";

                            entry.PostulanteInfo.IdUsuario = entry.Credenciales.IdUsuario;

                            entry.PostulanteInfo.FechaCreacion = DateTime.Now;
                            context.Postulante.Add(entry.PostulanteInfo);
                            context.SaveChanges();

                            idPostulante = entry.PostulanteInfo.IdPostulante;

                            AgregarLista(context, idPostulante, entry.Idiomas);
                            context.SaveChanges();

                            AgregarLista(context, idPostulante, entry.InformacionAcademica);
                            context.SaveChanges();

                            AgregarLista(context, idPostulante, entry.Paises);
                            context.SaveChanges();

                            AgregarLista(context, idPostulante, entry.Discapacidades);
                            context.SaveChanges();

                            AgregarLista(context, idPostulante, entry.ReferenciasLaborales);
                            context.SaveChanges();

                            AgregarLista(context, idPostulante, entry.Experiencia);
                            context.SaveChanges();

                            AgregarLista(context, idPostulante, entry.Areas);
                            context.SaveChanges();

                            AgregarLista(context, idPostulante, entry.Habilidades);
                            context.SaveChanges();

                            context.SaveChanges();
                            tran.Commit();

                            try
                            {
                                
                                Correo.CreacionCuenta(entry.PostulanteInfo.Email);
                            }
                            catch
                            {

                            }
                        }
                        else
                        {
                            idPostulante = postulante.IdPostulante;
                            postulante.Borrado = entry.PostulanteInfo.Borrado;
                            postulante.CurriculumURL = entry.PostulanteInfo.CurriculumURL;
                            postulante.DescripcionCualidades = entry.PostulanteInfo.DescripcionCualidades;
                            postulante.DescripcionVentajaCompetitiva = entry.PostulanteInfo.DescripcionVentajaCompetitiva;
                            postulante.Email = entry.PostulanteInfo.Email;
                            postulante.EstudiaActualidad = entry.PostulanteInfo.EstudiaActualidad;
                            postulante.Favorito = entry.PostulanteInfo.Favorito;
                            DateTime fechaNacimiento = new DateTime(entry.PostulanteInfo.FechaNacimiento.Year, entry.PostulanteInfo.FechaNacimiento.Month, entry.PostulanteInfo.FechaNacimiento.Day);
                            postulante.FechaNacimiento = fechaNacimiento;
                            postulante.Genero = entry.PostulanteInfo.Genero;
                            postulante.GradoAcademico = entry.PostulanteInfo.GradoAcademico;
                            postulante.Identificacion = entry.PostulanteInfo.Identificacion;
                            postulante.IdEstadoCivil = entry.PostulanteInfo.IdEstadoCivil;
                            postulante.IdPretensionSalarial = entry.PostulanteInfo.IdPretensionSalarial;
                            //postulante.IdUsuario = entry.PostulanteInfo.IdUsuario;
                            postulante.IdZona1 = entry.PostulanteInfo.IdZona1;
                            postulante.IdZona2 = entry.PostulanteInfo.IdZona2 == 0? null: entry.PostulanteInfo.IdZona2;
                            postulante.IdZona3 = entry.PostulanteInfo.IdZona3 == 0? null: entry.PostulanteInfo.IdZona3;
                            postulante.ImagenURL = entry.PostulanteInfo.ImagenURL;
                            postulante.Nacionalidad = entry.PostulanteInfo.Nacionalidad;
                            postulante.NombreCompleto = entry.PostulanteInfo.NombreCompleto;
                            postulante.PaisRecidencia = entry.PostulanteInfo.PaisRecidencia;
                            postulante.Profesion = entry.PostulanteInfo.Profesion;
                            postulante.Telefono = entry.PostulanteInfo.Telefono;
                            postulante.Vehiculo = entry.PostulanteInfo.Vehiculo;
                            postulante.IdTipoLicencia = entry.PostulanteInfo.IdTipoLicencia;

                            //postulante = entry.PostulanteInfo;
                            context.SaveChanges();

                            var user = context.Usuario.FirstOrDefault(x => x.IdUsuario == entry.Credenciales.IdUsuario);
                            if (user != null)
                            {
                                user = entry.Credenciales;
                                context.SaveChanges();
                            }

                            IntercambiarLista(context, idPostulante, entry.Idiomas.Where(x => x.IdIdioma != 0).ToList());
                            context.SaveChanges();
                            IntercambiarLista(context, idPostulante, entry.InformacionAcademica.ToList());
                            context.SaveChanges();
                            IntercambiarLista(context, idPostulante, entry.Paises.Where(x => x.IdPais != 0).ToList());
                            context.SaveChanges();
                            IntercambiarLista(context, idPostulante, entry.Discapacidades.Where(x => x.IdDiscapacidad != 0).ToList());
                            context.SaveChanges();
                            IntercambiarLista(context, idPostulante, entry.ReferenciasLaborales.ToList());
                            context.SaveChanges();
                            IntercambiarLista(context, idPostulante, entry.Experiencia.ToList());
                            context.SaveChanges();
                            IntercambiarLista(context, idPostulante, entry.Areas.Where(x => x.IdArea != 0).ToList());
                            context.SaveChanges();
                            IntercambiarLista(context, idPostulante, entry.Habilidades.Where(x => x.IdHabilidad != 0).ToList());


                            context.SaveChanges();
                            tran.Commit();
                            try
                            {
                                Correo.EdicionPerfil(entry.PostulanteInfo.Email);
                            }
                            catch
                            {

                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message) { Source = ex.Source }; ;
            }
        }

        override
        public void Delete(int id)
        {
            try
            {
                using (var context = new BACEntities())
                {
                    var postulante = context.Postulante.FirstOrDefault(x => x.IdPostulante == id);
                    if (postulante != null)
                    {
                        postulante.Borrado = true;
                    }
                    else
                    {
                        throw new Exception(MensajesRespuesta.ElementoNoEncontrado);
                    }

                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message) { Source = ex.Source }; ;
            }
        }

        override
        public DTOPostulante Get(int id)
        {
            try
            {
                using (var context = new BACEntities())
                {
                    int idPostulante = id;
                    var postulante = context.Postulante.FirstOrDefault(x => x.IdPostulante == idPostulante);
                    var usuario = context.Usuario.FirstOrDefault(x => x.IdUsuario == postulante.IdUsuario);
                    usuario.Agenda_Usuario = null;
                    usuario.Postulante = null;
                    usuario.Bitacora_Log = null;
                    usuario.Comentarios = null;
                    usuario.FeriaEmpleo_Entrevistadores = null;
                    usuario.Paises_Bac_Usuario = null;
                    usuario.Sesiones = null;
                    usuario.Usuario_Roles = null;

                    var idiomas = context.Idiomas_Postulante.Where(x => x.IdPostulante == idPostulante).ToList();

                    List<Idiomas_Postulante> idiomasAux = new List<Idiomas_Postulante>();

                    foreach (var x in idiomas)
                    {
                        idiomasAux.Add(new Idiomas_Postulante()
                        {
                            Borrado = x.Borrado,
                            FechaCreacion = x.FechaCreacion,
                            IdIdioma = x.IdIdioma,
                            IdPostulante = x.IdPostulante,
                            Porcentaje = x.Porcentaje
                        });
                    }

                    idiomas = idiomasAux;

                    var titulos = context.Titulos.Where(x => x.IdPostulante == idPostulante).ToList();

                    List<Titulos> titulosAux = new List<Titulos>();

                    foreach (var x in titulos)
                    {
                        titulosAux.Add(new Titulos()
                        {
                            AnioFin = x.AnioFin,
                            AnioInicio = x.AnioInicio,
                            Borrado = x.Borrado,
                            Descripcion = x.Descripcion,
                            FechaCreacion = x.FechaCreacion,
                            IdPostulante = x.IdPostulante,
                            IdTitulo = x.IdTitulo,
                            Institucion = x.Institucion,
                            TipoCertificacion = x.TipoCertificacion
                        });
                    }

                    titulos = titulosAux;

                    var paises = context.PaisPostulante.Where(x => x.IdPostulante == idPostulante).ToList();

                    List<PaisPostulante> paisAux = new List<PaisPostulante>();

                    foreach (var x in paises)
                    {
                        paisAux.Add(new PaisPostulante()
                        {
                            Borrado = x.Borrado,
                            FechaCreacion = x.FechaCreacion,
                            IdPais = x.IdPais,
                            IdPostulante = x.IdPostulante
                        });
                    }

                    paises = paisAux;

                    var discapacidades = context.Postulante_Discapacidad.Where(x => x.IdPostulante == idPostulante).ToList();

                    List<Postulante_Discapacidad> discapacidadAux = new List<Postulante_Discapacidad>();

                    foreach (var x in discapacidades)
                    {
                        discapacidadAux.Add(new Postulante_Discapacidad()
                        {
                            Borrado = x.Borrado,
                            FechaCreacion = x.FechaCreacion,
                            IdDiscapacidad = x.IdDiscapacidad,
                            IdPostulante = x.IdPostulante
                        });
                    }

                    discapacidades = discapacidadAux;

                    var referenciaLaboral = context.ReferenciasLaborales.Where(x => x.IdPostulante == idPostulante).ToList();

                    List<ReferenciasLaborales> referenciaLaboralAux = new List<ReferenciasLaborales>();

                    foreach (var x in referenciaLaboral)
                    {
                        referenciaLaboralAux.Add(new ReferenciasLaborales()
                        {
                            Borrada = x.Borrada,
                            FechaCreacion = x.FechaCreacion,
                            IdPostulante = x.IdPostulante,
                            IdReferencia = x.IdReferencia,
                            UrlReferencia = x.UrlReferencia
                        });
                    }

                    referenciaLaboral = referenciaLaboralAux;

                    var areas = context.AreasPostulante.Where(x => x.IdPostulante == idPostulante).ToList();

                    List<AreasPostulante> areasAux = new List<AreasPostulante>();

                    foreach (var x in areas)
                    {
                        areasAux.Add(new AreasPostulante()
                        {
                            Borrado = x.Borrado,
                            FechaCreacion = x.FechaCreacion,
                            IdArea = x.IdArea,
                            IdPostulante = x.IdPostulante
                        });
                    }

                    areas = areasAux;

                    var experiencia = context.ExperienciaLaboral.Where(x => x.IdPostulante == idPostulante).ToList();

                    List<ExperienciaLaboral> experienciaAux = new List<ExperienciaLaboral>();

                    foreach (var x in experiencia)
                    {
                        experienciaAux.Add(new ExperienciaLaboral()
                        {
                            Borrado = x.Borrado,
                            DescripcionPuesto = x.DescripcionPuesto,
                            Empresa = x.Empresa,
                            Puesto = x.Puesto,
                            FechaCreacion = x.FechaCreacion,
                            FechaFin = x.FechaFin,
                            FechaInicio = x.FechaInicio,
                            IdExperienciaLaboral = x.IdExperienciaLaboral,
                            IdPostulante = x.IdPostulante
                        });
                    }

                    experiencia = experienciaAux;

                    var habilidades = context.Habilidades_Postulante.Where(x => x.IdPostulante == idPostulante).ToList();

                    List<Habilidades_Postulante> habilidadesAux = new List<Habilidades_Postulante>();

                    foreach (var x in habilidades)
                    {
                        habilidadesAux.Add(new Habilidades_Postulante()
                        {
                            Borrado = x.Borrado,
                            FechaCreacion = x.FechaCreacion,
                            IdHabilidad = x.IdHabilidad,
                            IdPostulante = x.IdPostulante
                        });
                    }

                    habilidades = habilidadesAux;

                    var aux = new DTOPostulante()
                    {
                        PostulanteInfo = postulante,
                        Credenciales = usuario,
                        Idiomas = idiomas,
                        Discapacidades = discapacidades,
                        InformacionAcademica = titulos,
                        Paises = paises,
                        ReferenciasLaborales = referenciaLaboral,
                        Areas = areas,
                        Experiencia = experiencia,
                        Habilidades = habilidades
                    };

                    aux.PostulanteInfo.AreasPostulante = null;
                    aux.PostulanteInfo.PaisPostulante = null;
                    aux.PostulanteInfo.Idiomas_Postulante = null;
                    aux.PostulanteInfo.Titulos = null;
                    aux.PostulanteInfo.ReferenciasLaborales = null;
                    aux.PostulanteInfo.Puestos_Postulante = null;
                    aux.PostulanteInfo.Postulante_MediosInformacion = null;
                    aux.PostulanteInfo.Postulante_Discapacidad = null;
                    aux.PostulanteInfo.Idiomas_Postulante = null;
                    aux.PostulanteInfo.Habilidades_Postulante = null;
                    aux.PostulanteInfo.ExperienciaLaboral = null;
                    aux.PostulanteInfo.AreasPostulante = null;

                    return aux;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message) { Source = ex.Source }; ;
            }
        }

        override
        public List<DTOPostulante> Get()
        {
            try
            {
                List<DTOPostulante> resultado = new List<DTOPostulante>();
                using (var context = new BACEntities())
                {
                    var lista = context.Postulante.ToList();

                    foreach (var nodo in lista)
                    {
                        resultado.Add(Get(nodo.IdPostulante));
                    }
                }

                return resultado;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message) { Source = ex.Source }; ;
            }
        }

        override
        public DTOGridView<DTOPostulante> GetPagedData(int page, int pageSize)
        {
            var resultList = Get().OrderBy(x => "1").Skip(page * pageSize).Take(pageSize).ToList();

            var totalRows = Get().Count();

            return new DTOGridView<DTOPostulante> { Data = resultList, TotalRows = totalRows };

        }

        public int GetIdByEmail(string email)
        {
            try
            {
                var user = GetContext().Usuario.FirstOrDefault(x => x.Email.Equals(email));
                if (user == null)
                {
                    return 0;
                }
                else
                {
                    return user.IdUsuario;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public bool ValidateEmail(string email)
        {
            try
            {
                return GetContext().Usuario.Any(x => x.Email.Equals(email));
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }


        public dynamic Get(string username)
        {
            try
            {
                var postulante = GetContext().Postulante
                    .Include("Zona1")
                    .Include("Zona2")
                    .Include("Zona3")
                    .Include("Titulos")
                    .Include("ExperienciaLaboral")
                    .Include("ReferenciasLaborales")
                    .Include("AreasPostulante")
                    .Include("PaisPostulante")
                    .Include("EstadoCivil")
                    .Include("PretensionSalarial")
                    .FirstOrDefault(x => x.Email == username);

                dynamic obj = new ExpandoObject();

                obj.IdPostulante = postulante.IdPostulante;
                obj.NombreCompleto = postulante.NombreCompleto;
                obj.Nacionalidad = GetContext().Paises.First(x => x.Sigla == postulante.Nacionalidad).Nombre;
                obj.Identificacion = postulante.Identificacion;
                obj.FechaNacimiento = postulante.FechaNacimiento.ToString("MM/dd/yyyy");
                obj.Edad = 0;
                obj.Genero = postulante.Genero == true ? "Hombre" : (postulante.Genero == false ? "Mujer" : "Sin definir");
                obj.EstadoCivil = postulante.EstadoCivil.Descripcion;
                obj.Telefono = postulante.Telefono;
                obj.ImagenURL = postulante.ImagenURL;
                var IdPais = Convert.ToInt32(postulante.PaisRecidencia);
                obj.PaisRecidencia = GetContext().Paises_Bac.FirstOrDefault(x => x.IdPais == IdPais).Descripcion;
                obj.Vehiculo = postulante.Vehiculo == true ? "SI" :(postulante.Vehiculo == true ? "NO" : "Sin definir");
                obj.Email = postulante.Email;
                obj.Zona1 = (postulante.Zona1 == null ? string.Empty : postulante.Zona1.Descripcion);
                obj.Zona2 = (postulante.Zona2 == null ? string.Empty : postulante.Zona2.Descripcion);
                obj.Zona3 = (postulante.Zona3 == null ? string.Empty : postulante.Zona3.Descripcion);
                obj.Favorito = postulante.Favorito;
                obj.EstudiaActualidad = postulante.EstudiaActualidad == true ? "SI" : "NO";

                obj.GradoAcademico = postulante.GradoAcademico == 0 ? string.Empty : GetContext().NivelAcademico.FirstOrDefault(y => y.IdNivelAcademico == postulante.GradoAcademico).Descripcion;
                obj.Profesion = postulante.Profesion;
                obj.PretensionSalarial = postulante.PretensionSalarial.Descripcion;
                obj.TrabajoBAC = postulante.TrabajoBAC == true ? "SI" : "NO";
                obj.CurriculumURL = postulante.CurriculumURL;
                obj.TitulosCertificaciones = GetContext().Titulos.Where(x => x.IdPostulante == postulante.IdPostulante)
                    .Select(x => new { GradoAcademico = x.Descripcion + ", " + x.Institucion });
                /*postulante.Titulos.Select(x => new {
                GradoAcademico = GetContext().NivelAcademico.FirstOrDefault(y => y.IdNivelAcademico == x.TipoCertificacion).Descripcion + "," + x.Institucion }).ToList();*/
                obj.ExperienciaLaboral = postulante.ExperienciaLaboral
                    .Select(x => new { Puesto = x.Puesto, Empresa = x.Empresa, DescripcionPuesto = x.DescripcionPuesto });
                obj.Habilidades = GetContext().Habilidades_Postulante.Include("Habilidades").Where(x => x.IdPostulante == postulante.IdPostulante).Select(x => new { x.Habilidades.Descripcion }).ToList();
                obj.Referencias = postulante.ReferenciasLaborales.Select(x => new { x.UrlReferencia }).ToList();
                obj.Idiomas = GetContext().Idiomas_Postulante.Include("Idioma").Where(x => x.IdPostulante == postulante.IdPostulante)
                    .Select(x => new
                    {
                        x.Idioma.Descripcion,
                        Nivel = x.Porcentaje >= 0 && x.Porcentaje <=49 ? "Bajo" : (x.Porcentaje >= 50 && x.Porcentaje <= 75 ? "Medio" : (x.Porcentaje >= 76 && x.Porcentaje <= 99 ? "Avanzado" : "Nativo"))
                    }).ToList();
                obj.Areas = GetContext().AreasPostulante.Include("AreasLaborales").Where(x => x.IdPostulante == postulante.IdPostulante)
                    .Select(x => new { x.AreasLaborales.Area }).ToList();
                obj.Paises = GetContext().PaisPostulante.Include("Paises_Bac").Where(x => x.IdPostulante == postulante.IdPostulante).Select(x => new { x.Paises_Bac.Descripcion }).ToList();
                obj.Discapacidades = GetContext().Postulante_Discapacidad.Include("Discapacidad").Where(x => x.IdPostulante == postulante.IdPostulante).Select(x => new { x.Discapacidad.Descripcion }).ToList();
                obj.AplicacionesPuesto = GetContext().vw_PuestosAplicadosMiPerfil.Where(x => x.IdPostulante == postulante.IdPostulante).ToList();
                obj.EstadosPerfil = GetContext().EstadoPerfil.Select(x => new { x.IdEstadoPerfil, x.EstadoPerfil1 }).ToList();
                obj.DescripcionVentajaCompetitiva = postulante.DescripcionVentajaCompetitiva;
                //obj.Comentarios = GetContext().Comentarios.Include("Usuario").Where(x => x.IdPostulacion == postulante.IdPostulante).OrderByDescending(x=> x.FechaCreacion)
                obj.Comentarios = GetContext().vw_Comentarios.Where(x => x.IdPostulacion == postulante.IdPostulante).OrderByDescending(x => x.FechaCreacion)
                    .Select(x => new
                    {
                        NombreUsurio = x.NombreCompleto,
                        Fecha = x.Fecha,//.Value.ToString("dd/MM/yyyy HH:mm:ss"),
                        Mensaje = x.Descripcion
                    }).ToList();
                obj.IdTipoLicencia = GetContext().TipoLicencia.FirstOrDefault(x => x.IdTipoLicencia == postulante.IdTipoLicencia).Descripcion;
                var estado = GetContext().Puestos_Postulante.FirstOrDefault(x => x.IdPostulante == postulante.IdPostulante && x.IdEstadoPerfil == EstadoPerfilContants.Archivado);
                if (estado == null)
                {
                    estado = GetContext().Puestos_Postulante.FirstOrDefault(x => x.IdPostulante == postulante.IdPostulante && x.IdEstadoPerfil == EstadoPerfilContants.Contratado);

                    if (estado == null)
                    {
                        estado = GetContext().Puestos_Postulante.FirstOrDefault(x => x.IdPostulante == postulante.IdPostulante && x.IdEstadoPerfil == EstadoPerfilContants.PreSeleccionado);

                        if (estado == null)
                        {
                            estado = GetContext().Puestos_Postulante.FirstOrDefault(x => x.IdPostulante == postulante.IdPostulante && x.IdEstadoPerfil == EstadoPerfilContants.Leido);

                            if (estado == null)
                            {
                                estado = GetContext().Puestos_Postulante.FirstOrDefault(x => x.IdPostulante == postulante.IdPostulante && x.IdEstadoPerfil == EstadoPerfilContants.NoLeido);
                            }
                        }
                    }
                }
                var estadoObj = (estado == null ? null : GetContext().EstadoPerfil.FirstOrDefault(x => x.IdEstadoPerfil == estado.IdEstadoPerfil));
                obj.EstadoPostulante = (estadoObj == null ? "No leido" : estadoObj.EstadoPerfil1);
                return obj;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public string Descargar(string email, string baseUrl)
        {
            dynamic obj = Get(email);

            StringBuilder builterTxt = new StringBuilder();

            builterTxt.Append("<html id=\"ContenedorGeneral\">");
            builterTxt.Append("    <title>BAC Empleos</title>");
            builterTxt.Append("<link href=\"" + baseUrl + "Content/bootstrap.min.css\" rel=\"stylesheet\">");
            builterTxt.Append("<link href=\"" + baseUrl + "Content/Site.min.css\" rel=\"stylesheet\">");
            builterTxt.Append("<link href=\"" + baseUrl + "Content/ziggeo.css\" rel=\"stylesheet\">");
            builterTxt.Append("<link href=\"" + baseUrl + "Content/validaciones.css\" rel=\"stylesheet\">");
            builterTxt.Append("</head>");
            builterTxt.Append("<body>");
            builterTxt.Append("    <div class=\"Pagina\">");
            builterTxt.Append("        <div class=\"Cabecera\">");
            builterTxt.Append("            <div class=\"Fondo\"></div>");
            builterTxt.Append("            <a id=\"btnInicio\">");
            //builterTxt.Append("            <a id=\"btnInicio\" href=\"http://localhost:1981/postulante/VerPerfilAnonimo?IdPostulante=tortitavo@gmail.com1#\">");
            builterTxt.Append("                <div>");
            builterTxt.Append("                    <img src=\"" + baseUrl + "Content/Images/IconoBAC.png\" class=\"bitmapcopy2\">");
            builterTxt.Append("                </div>");
            builterTxt.Append("            </a>");
            /*builterTxt.Append("            <div class=\"group\">");
            builterTxt.Append("                <a id=\"btnSalir\" href=\"http://localhost:1981/postulante/VerPerfilAnonimo?IdPostulante=tortitavo@gmail.com1#\">");
            builterTxt.Append("                    <div>");
            builterTxt.Append("                    </div>");
            builterTxt.Append("                </a>");
            builterTxt.Append("            </div>");*/
            builterTxt.Append("        </div>");
            builterTxt.Append("        <div class=\"Cuerpo2\">");
            builterTxt.Append("            <div class=\"Contenido2\">");
            builterTxt.Append("				<div>");
            /*builterTxt.Append("					<div>");
            builterTxt.Append("						<img src=\"" + baseUrl + "Content/Images/IconoPuestoNegro.png\" alt=\"Puesto\" class=\"iconoTitulo\">");
            builterTxt.Append("						<h1 class=\"LetrasTitulo\">Mi Perfil</h1>");
            builterTxt.Append("					</div>");*/
            builterTxt.Append("					<div class=\"Panel\">");
            builterTxt.Append("						<div class=\"row\">");
            builterTxt.Append("							<div class=\"col-lg-8\">");
            builterTxt.Append("								<div class=\"row\">");
            builterTxt.Append("									<div class=\"col-md-4\">");
            builterTxt.Append("										<img id=\"FotoPerfil\" src=\"" + obj.ImagenURL + "\" class=\"FotoCircular\" />");
            builterTxt.Append("									</div>");
            builterTxt.Append("									<div class=\"col-md-8\">");
            builterTxt.Append("										<label id=\"lblNombreCompleto\" class=\"LetrasTituloPrincipal ng-binding\">" + obj.NombreCompleto + "</label><br>");
            builterTxt.Append("										<label class=\"LetrasSubTitulo ColorLetraGris ng-binding\">" + obj.Email + "</label>");
            builterTxt.Append("									</div>");
            builterTxt.Append("								</div>");
            builterTxt.Append("							</div>");
            builterTxt.Append("							<div class=\"col-lg-4\">");
            builterTxt.Append("							</div>");
            builterTxt.Append("						</div>");
            builterTxt.Append("						<div id=\"taps\" class=\"row tapDistansce\">");
            builterTxt.Append("							<div id=\"StepOne\" class=\"col-sm-2 tapSelect\">Datos </div>");
            builterTxt.Append("						</div>");
            builterTxt.Append("						<div id=\"paso1\" class=\"row\">");
            builterTxt.Append("							<div class=\"col-lg-4 Division\">");
            builterTxt.Append("								<h4 class=\"LetrasContenido textoNegrita\">Información de contacto</h4>");
            builterTxt.Append("								<label class=\"LetrasContenido textoNegrita\">Correo:</label><br>");
            builterTxt.Append("								<div class=\"col-lg-8\"> <label class=\"LetrasContenido ng-binding\">" + obj.Email + "</label><br></div>");
            builterTxt.Append("								<label class=\"LetrasContenido textoNegrita\">Teléfono:</label><br>");
            builterTxt.Append("								<div class=\"col-lg-8\"> <label class=\"LetrasContenido ng-binding\">" + obj.Telefono + "</label><br></div>");
            builterTxt.Append("								<label class=\"LetrasContenido textoNegrita\">Residencia:</label><br>");
            builterTxt.Append("								<div class=\"col-lg-8\">");
            builterTxt.Append("									<label class=\"LetrasContenido ng-binding\">" + obj.PaisRecidencia + "</label><br>");
            builterTxt.Append("									<label class=\"LetrasContenido ng-binding\">" + obj.Zona1 + "</label><br>");
            builterTxt.Append("									<label class=\"LetrasContenido ng-binding\">" + obj.Zona2 + "</label><br>");
            builterTxt.Append("									<label class=\"LetrasContenido ng-binding\">" + obj.Zona3 + "</label><br>");
            builterTxt.Append("								</div>");
            builterTxt.Append("							</div>");
            builterTxt.Append("							<div class=\"col-lg-4 Division\">");
            builterTxt.Append("								<h4 class=\"LetrasContenido textoNegrita\">Información personal</h4>");
            builterTxt.Append("								<label class=\"LetrasContenido textoNegrita\">Identificación:</label><br>");
            builterTxt.Append("								<div class=\"col-lg-8\"> <label class=\"LetrasContenido ng-binding\">" + obj.Identificacion + "</label><br></div>");
            builterTxt.Append("								<label class=\"LetrasContenido textoNegrita\">Género:</label>");
            builterTxt.Append("								<div class=\"col-lg-8\"> <label class=\"LetrasContenido ng-binding\">" + obj.Genero + "</label><br></div>");
            builterTxt.Append("								<label class=\"LetrasContenido textoNegrita\">Estado Civil:</label><br>");
            builterTxt.Append("								<div class=\"col-lg-8\"> <label class=\"LetrasContenido ng-binding\">" + obj.EstadoCivil + "</label><br></div>");
            builterTxt.Append("								<label class=\"LetrasContenido textoNegrita\">Fecha nacimiento:</label><br>");
            builterTxt.Append("								<div class=\"col-lg-8\"> <label class=\"LetrasContenido ng-binding\">" + obj.FechaNacimiento + "</label><br></div>");
            //builterTxt.Append("								<label class=\"LetrasContenido\">Edad:</label><br>");
            //builterTxt.Append("								<div class=\"col-lg-8\"> <label class=\"LetrasContenido ng-binding\">" + obj + "</label><br></div>");
            builterTxt.Append("								<label class=\"LetrasContenido textoNegrita\">Nacionalidad:</label><br>");
            builterTxt.Append("								<div class=\"col-lg-8\"> <label class=\"LetrasContenido ng-binding\">" + obj.Nacionalidad + "</label><br></div>");
            builterTxt.Append("							</div>");
            builterTxt.Append("							<div class=\"col-lg-4\">");
            builterTxt.Append("								<h4 class=\"LetrasContenido\">Información adicional</h4>");
            builterTxt.Append("								<label class=\"LetrasContenido textoNegrita\">Vehículo:</label>");
            builterTxt.Append("								<label class=\"LetrasContenido ng-binding\">" + obj.Vehiculo + "</label><br>");
            builterTxt.Append("                             <label class=\"LetrasContenido textoNegrita\">Licencia:</label><br />");
            builterTxt.Append("                             <label class=\"LetrasContenido\">" + obj.IdTipoLicencia + "</label><br />");
            builterTxt.Append("								<label class=\"LetrasContenido textoNegrita\">Discapacidad:</label><br>");
            builterTxt.Append("								<div id=\"divDiscapacidad\" ng-repeat=\"discapacidad in obj.Discapacidades\" class=\"col-lg-8 ng-scope\">");
            foreach (var nodo in obj.Discapacidades)
            {
                //string aux = nodo.ToString().Replace(" = ", "':'").Replace("{ ","{'").Replace(" }", "'}");
                DTODescarga descargaObj = JsonConvert.DeserializeObject<DTODescarga>(JsonConvert.SerializeObject(nodo));
                builterTxt.Append("									<label class=\"LetrasContenido ng-binding\">" + descargaObj.Descripcion + "</label><br>");
            }
            builterTxt.Append("								</div>");
            builterTxt.Append("							</div>");
            builterTxt.Append("						</div>");
            builterTxt.Append("						<div id=\"taps\" class=\"row tapDistansce\">");
            builterTxt.Append("							<div id=\"StepTwo\" class=\"col-sm-2 tapSelect\">Experiencia </div>");
            builterTxt.Append("						</div>");
            builterTxt.Append("						<div id=\"paso2\" class=\"row\" ng-show=\"StepTwo\">");
            builterTxt.Append("							<div class=\"col-lg-4 Division\">");
            builterTxt.Append("								<h1 class=\"LetrasContenido textoNegrita\">Educación</h1>");
            builterTxt.Append("								<label class=\"LetrasContenido textoNegrita\">Máximo grado académico</label>");
            builterTxt.Append("								<div class=\"col-lg-8\">");
            builterTxt.Append("									<label class=\"LetrasContenido ng-binding\">" + obj.GradoAcademico + "</label>");
            builterTxt.Append("								</div>");
            builterTxt.Append("								<label class=\"LetrasContenido textoNegrita\">Títulos y certificaciones</label>");
            builterTxt.Append("								<div class=\"col-lg-8\">");
            foreach (var nodo in obj.TitulosCertificaciones)
            {
                DTODescarga descargaObj = JsonConvert.DeserializeObject<DTODescarga>(JsonConvert.SerializeObject(nodo));
                builterTxt.Append("									<label class=\"LetrasContenido ng-binding ng-scope\" ng-repeat=\"grado in obj.TitulosCertificaciones\">" + descargaObj.GradoAcademico + "</label>");
            }
            builterTxt.Append("								</div>");
            builterTxt.Append("							</div>");
            builterTxt.Append("							<div class=\"col-lg-4 Division\">");
            builterTxt.Append("								<h1 class=\"LetrasContenido textoNegrita\">Laboral</h1>");
            builterTxt.Append("								<label class=\"LetrasContenido textoNegrita\">Experiencia Laboral</label>");
            builterTxt.Append("								<div ng-repeat=\"exp in obj.ExperienciaLaboral\" class=\"col-lg-8 ng-scope\">");
            foreach (var nodo in obj.ExperienciaLaboral)
            {
                DTODescarga descargaObj = JsonConvert.DeserializeObject<DTODescarga>(JsonConvert.SerializeObject(nodo));
                builterTxt.Append("									<label class=\"LetrasContenido ng-binding\">Puesto: " + descargaObj.Puesto + "</label><br>");
                builterTxt.Append("									<label class=\"LetrasContenido ng-binding\">Empresa: " + descargaObj.Empresa + "</label><br>");
                builterTxt.Append("									<label class=\"LetrasContenido ng-binding\">Descripción del puesto: " + descargaObj.DescripcionPuesto + "</label><br>");
            }
            builterTxt.Append("								</div>");
            builterTxt.Append("								<label class=\"LetrasContenido textoNegrita\">He trabajado en el BAC</label><br>");
            builterTxt.Append("								<label class=\"LetrasContenido ng-binding\">" + obj.TrabajoBAC + "</label><br>");
            builterTxt.Append("								<label class=\"LetrasContenido textoNegrita\">Habilidades Blandas</label><br>");
            builterTxt.Append("								<div ng-repeat=\"hab in obj.Habilidades\" class=\"col-lg-8 ng-scope\">");
            foreach (var nodo in obj.Habilidades)
            {
                DTODescarga descargaObj = JsonConvert.DeserializeObject<DTODescarga>(JsonConvert.SerializeObject(nodo));
                builterTxt.Append("									<label class=\"LetrasContenido ng-binding\">" + descargaObj.Descripcion + "</label><br>");
            }
            builterTxt.Append("								</div>");
            builterTxt.Append("							</div>");
            builterTxt.Append("							<div class=\"col-lg-4\">");
            builterTxt.Append("								<h1 class=\"LetrasContenido textoNegrita\">Referencias</h1>");
            builterTxt.Append("								<label class=\"LetrasContenido textoNegrita\">Sitios Referencia</label>");
            builterTxt.Append("								<div ng-repeat=\"url in obj.Referencias\" class=\"col-lg-8 ng-scope\">");
            foreach (var nodo in obj.Referencias)
            {
                DTODescarga descargaObj = JsonConvert.DeserializeObject<DTODescarga>(JsonConvert.SerializeObject(nodo));
                builterTxt.Append("									<label class=\"LetrasContenido ng-binding\">" + descargaObj.UrlReferencia + "</label><br>");
            }
            builterTxt.Append("								</div>");
            builterTxt.Append("							</div>");
            builterTxt.Append("						</div>");
            builterTxt.Append("						<div id=\"taps\" class=\"row tapDistansce\">");
            builterTxt.Append("							<div id=\"StepThree\" class=\"col-sm-2 tapSelect\">Intereses</div>");
            builterTxt.Append("						</div>");
            builterTxt.Append("						<div id=\"paso3\" class=\"row\" ng-show=\"StepThree\">");
            builterTxt.Append("							<div class=\"col-lg-4 Division\">");
            builterTxt.Append("								<label class=\"LetrasContenido textoNegrita\">Idiomas:</label>");
            builterTxt.Append("								<div ng-repeat=\"idioma in obj.Idiomas\" class=\"col-lg-8 ng-scope\">");
            foreach (var nodo in obj.Idiomas)
            {
                DTODescarga descargaObj = JsonConvert.DeserializeObject<DTODescarga>(JsonConvert.SerializeObject(nodo));
                builterTxt.Append("									<img src=\"" + baseUrl + "Content/Images/IconoIdiomaRojo.png\" class=\"icono-2\">");
                builterTxt.Append("									<label class=\"LetrasContenido ng-binding\">" + descargaObj.Descripcion + ", " + descargaObj.Nivel + "</label><br>");
            }
            builterTxt.Append("								</div>");
            builterTxt.Append("							</div>");
            builterTxt.Append("							<div class=\"col-lg-4 Division\">");
            builterTxt.Append("								<label class=\"LetrasContenido textoNegrita\">Quisiera trabajar en:</label>");
            builterTxt.Append("								<div ng-repeat=\"area in obj.Areas\" class=\"col-lg-8 ng-scope\">");
            foreach (var nodo in obj.Areas)
            {
                DTODescarga descargaObj = JsonConvert.DeserializeObject<DTODescarga>(JsonConvert.SerializeObject(nodo));
                builterTxt.Append("									<label class=\"LetrasContenido ng-binding\">" + descargaObj.Area + "</label><br>");
            }
            builterTxt.Append("								</div>");
            builterTxt.Append("								<label class=\"LetrasContenido textoNegrita\">Quisiera trabajar en:</label>");
            builterTxt.Append("								<div ng-repeat=\"pais in obj.Paises\" class=\"col-lg-8 ng-scope\">");
            foreach (var nodo in obj.Paises)
            {
                DTODescarga descargaObj = JsonConvert.DeserializeObject<DTODescarga>(JsonConvert.SerializeObject(nodo));
                builterTxt.Append("									<label class=\"LetrasContenido ng-binding\">" + descargaObj.Descripcion + "</label><br>");
            }
            builterTxt.Append("								</div>");
            builterTxt.Append("							</div>");
            builterTxt.Append("							<div class=\"col-lg-4\">  ");
            builterTxt.Append("								<label class=\"LetrasContenido textoNegrita\">Curriculum:</label><br>");
            builterTxt.Append("								<div class=\"col-lg-8\"> <a class=\"LetrasContenido ColorLetraAzul\" href=\"" + obj.CurriculumURL + "\" target =\"_blank\">Ver curriculum</a></div>");
            builterTxt.Append("							</div>");
            builterTxt.Append("						</div>");
            builterTxt.Append("					</div>");
            builterTxt.Append("				</div>");
            builterTxt.Append("            </div>");
            builterTxt.Append("        </div>");
            builterTxt.Append("    </div>");
            builterTxt.Append("<script type=\"text/javascript\" src=\"" + baseUrl + "Scripts/index\"></script>");
            builterTxt.Append("<script src=\"" + baseUrl + "Scripts/modernizr-2.8.3.js.descarga\"></script>");
            builterTxt.Append("<script src=\"" + baseUrl + "Scripts/jquery-1.10.2.js.descarga\"></script>");
            builterTxt.Append("<script src=\"" + baseUrl + "Scripts/bootstrap.js.descarga\"></script>");
            builterTxt.Append("<script src=\"" + baseUrl + "Scripts/respond.js.descarga\"></script>");
            builterTxt.Append("<script src=\"" + baseUrl + "Scripts/modernizr-2.8.3.js.descarga\"></script>");
            builterTxt.Append("</body></html>");
            return builterTxt.ToString();
        }

        public void CompartirPerfil(string email, string NombreCompleto, int IdEntrevista, int IdPostulante)
        {
            try
            {
                int expirationDays = Convert.ToInt32(ConfigurationManager.AppSettings["DiasUsuarioTemporal"].ToString());
                var user = GetContext().Usuario.FirstOrDefault(x => x.Email.Equals(email));

                if (user == null)
                {
                    var postulante = GetContext().Postulante.FirstOrDefault(x => x.IdPostulante == IdPostulante);
                    var urlTemp = frontUrl + "Postulante/CompartirPerfil?IdEntrevista=" + IdEntrevista + "xxxxIdPostulante=" + postulante.Email;
                    string url = frontUrl + "Principal/Login?x=" + urlTemp;
                    string urlRecuperar = string.Format("{1}Principal/CambiarClave?username={0}", email, frontUrl);

                    var password = Membership.GeneratePassword(12, 3);
                    var obj = new Usuario()
                    {
                        IdDrupal = null,
                        NombreCompleto = NombreCompleto,
                        Usuario1 = email,
                        Password = LoginManager.EncryptSHA256(LoginManager.EncryptMD5(password)),
                        Email = email,
                        Borrado = false,
                        FechaCreacion = DateTime.Now,
                        IdPais = 1,
                        IdTipoLogin = 1,
                        UrlIngresoTemporal = urlTemp,
                        FechaCaducidad = DateTime.Now.AddDays(expirationDays)
                    };

                    GetContext().Usuario.Add(obj);
                    GetContext().SaveChanges();

                    GetContext().Usuario_Roles.Add(
                    new Usuario_Roles()
                    {
                        IdRol = 13,
                        IdUsuario = obj.IdUsuario,
                        FechaCreacion = DateTime.Now,
                        Borrado = false,
                    });

                    GetContext().SaveChanges();

                    Correo.CompartirPerfil(email, obj.Password, NombreCompleto, postulante.NombreCompleto, urlRecuperar);
                }
                else
                {
                    var postulante = GetContext().Postulante.FirstOrDefault(x => x.IdPostulante == IdPostulante);
                    var urlTemp = frontUrl + "Postulante/CompartirPerfil?IdEntrevista=" + IdEntrevista + "xxxxIdPostulante=" + postulante.Email;
                    string url = frontUrl + "Principal/Login?x=" + urlTemp;

                    string urlRecuperar = string.Format("{1}Principal/CambiarClave?username={0}", email, frontUrl);

                    if (DateTime.Compare(DateTime.Now, user.FechaCaducidad.Value) > 0)
                    {
                        user.FechaCaducidad = DateTime.Now.AddDays(expirationDays);
                        user.Borrado = false;
                    }
                    user.UrlIngresoTemporal = urlTemp;
                    GetContext().SaveChanges();

                    Correo.CompartirPerfil(email, user.Password, NombreCompleto, postulante.NombreCompleto, urlRecuperar);
                }

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        #region  Método Privados 


        private static void AgregarLista(BACEntities context, int idPostulante, List<Idiomas_Postulante> lista)
        {
            if (lista != null && lista.Count > 0)
            {
                foreach (var aux in lista)
                {
                    aux.IdPostulante = idPostulante;
                    aux.FechaCreacion = DateTime.Now;
                    aux.Borrado = false;
                }
                context.Idiomas_Postulante.AddRange(lista);
            }
        }

        private static void AgregarLista(BACEntities context, int idPostulante, List<Titulos> lista)
        {

            if (lista != null && lista.Count > 0)
            {
                foreach (var aux in lista)
                {
                    aux.IdPostulante = idPostulante;
                    aux.FechaCreacion = DateTime.Now;
                    aux.Borrado = false;
                }
                context.Titulos.AddRange(lista);
            }
        }

        private static void AgregarLista(BACEntities context, int idPostulante, List<PaisPostulante> lista)
        {

            if (lista != null && lista.Count > 0)
            {
                foreach (var aux in lista)
                {
                    aux.IdPostulante = idPostulante;
                    aux.FechaCreacion = DateTime.Now;
                    aux.Borrado = false;
                }
                context.PaisPostulante.AddRange(lista);
            }
        }

        private static void AgregarLista(BACEntities context, int idPostulante, List<Postulante_Discapacidad> lista)
        {

            if (lista != null && lista.Count > 0)
            {
                foreach (var aux in lista)
                {
                    aux.IdPostulante = idPostulante;
                    aux.FechaCreacion = DateTime.Now;
                    aux.Borrado = false;
                }
                context.Postulante_Discapacidad.AddRange(lista);
            }
        }

        private static void AgregarLista(BACEntities context, int idPostulante, List<ReferenciasLaborales> lista)
        {

            if (lista != null && lista.Count > 0)
            {
                foreach (var aux in lista)
                {
                    aux.IdPostulante = idPostulante;
                    aux.FechaCreacion = DateTime.Now;
                    aux.Borrada = false;
                }
                context.ReferenciasLaborales.AddRange(lista);
            }
        }

        private static void AgregarLista(BACEntities context, int idPostulante, List<ExperienciaLaboral> lista)
        {

            if (lista != null && lista.Count > 0)
            {
                foreach (var aux in lista)
                {
                    aux.IdPostulante = idPostulante;
                    aux.FechaCreacion = DateTime.Now;
                    aux.Borrado = false;
                }
                context.ExperienciaLaboral.AddRange(lista);
            }
        }

        private static void AgregarLista(BACEntities context, int idPostulante, List<AreasPostulante> lista)
        {

            if (lista != null && lista.Count > 0)
            {
                foreach (var aux in lista)
                {
                    aux.IdPostulante = idPostulante;
                    aux.FechaCreacion = DateTime.Now;
                    aux.Borrado = false;
                }
                context.AreasPostulante.AddRange(lista);
            }
        }

        private static void AgregarLista(BACEntities context, int idPostulante, List<Habilidades_Postulante> lista)
        {

            if (lista != null && lista.Count > 0)
            {
                foreach (var aux in lista)
                {
                    aux.IdPostulante = idPostulante;
                    aux.FechaCreacion = DateTime.Now;
                    aux.Borrado = false;
                }
                context.Habilidades_Postulante.AddRange(lista);
            }
        }

        private static void IntercambiarLista(BACEntities context, int idPostulante, List<Idiomas_Postulante> lista)
        {
            var listaEliminar = context.Idiomas_Postulante.Where(x => x.IdPostulante == idPostulante);
            context.Idiomas_Postulante.RemoveRange(listaEliminar);

            AgregarLista(context, idPostulante, lista);
        }

        private static void IntercambiarLista(BACEntities context, int idPostulante, List<Titulos> lista)
        {
            var listaEliminar = context.Titulos.Where(x => x.IdPostulante == idPostulante);
            context.Titulos.RemoveRange(listaEliminar);

            AgregarLista(context, idPostulante, lista);
        }

        private static void IntercambiarLista(BACEntities context, int idPostulante, List<PaisPostulante> lista)
        {
            var listaEliminar = context.PaisPostulante.Where(x => x.IdPostulante == idPostulante);
            context.PaisPostulante.RemoveRange(listaEliminar);

            AgregarLista(context, idPostulante, lista);
        }

        private static void IntercambiarLista(BACEntities context, int idPostulante, List<Postulante_Discapacidad> lista)
        {
            var listaEliminar = context.Postulante_Discapacidad.Where(x => x.IdPostulante == idPostulante);
            context.Postulante_Discapacidad.RemoveRange(listaEliminar);

            AgregarLista(context, idPostulante, lista);
        }

        private static void IntercambiarLista(BACEntities context, int idPostulante, List<ReferenciasLaborales> lista)
        {
            var listaEliminar = context.ReferenciasLaborales.Where(x => x.IdPostulante == idPostulante);
            context.ReferenciasLaborales.RemoveRange(listaEliminar);

            AgregarLista(context, idPostulante, lista);
        }

        private static void IntercambiarLista(BACEntities context, int idPostulante, List<ExperienciaLaboral> lista)
        {
            var listaEliminar = context.ExperienciaLaboral.Where(x => x.IdPostulante == idPostulante);
            context.ExperienciaLaboral.RemoveRange(listaEliminar);

            AgregarLista(context, idPostulante, lista);
        }

        private static void IntercambiarLista(BACEntities context, int idPostulante, List<AreasPostulante> lista)
        {
            var listaEliminar = context.AreasPostulante.Where(x => x.IdPostulante == idPostulante);
            context.AreasPostulante.RemoveRange(listaEliminar);

            AgregarLista(context, idPostulante, lista);
        }

        private static void IntercambiarLista(BACEntities context, int idPostulante, List<Habilidades_Postulante> lista)
        {
            var listaEliminar = context.Habilidades_Postulante.Where(x => x.IdPostulante == idPostulante);
            context.Habilidades_Postulante.RemoveRange(listaEliminar);

            AgregarLista(context, idPostulante, lista);
        }

        #endregion Método privados
    }
}
