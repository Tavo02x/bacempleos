using BolsaEmpleoBAC.BL.DTO;
using BolsaEmpleoBAC.Entities;
using BolsaEmpleoBAC.General.Utilitarios;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BolsaEmpleoBAC.BL.Logic
{
    public class DTOUsuarioManager:MasterManager<DTOUsuario,BACEntities>
    {
        override
        public void Save(DTOUsuario entity,int id)
        {
            try
            {
                int idUsuario = 0;
                using (var context = new BACEntities())
                {
                    using (var tran = context.Database.BeginTransaction())
                    {
                        var user = context.Usuario.FirstOrDefault(x=> x.IdUsuario == id);
                        if(user == null)
                        {
                            entity.Info.FechaCreacion = DateTime.Now;
                            entity.Info.Password = LoginManager.EncryptSHA256(entity.Info.Password);
                            context.Usuario.Add(entity.Info);
                            context.SaveChanges();

                            idUsuario = entity.Info.IdUsuario;

                            AgregarLista(context, idUsuario, entity.Paises);
                            context.SaveChanges();
                            AgregarLista(context, idUsuario, entity.Roles);
                            context.SaveChanges();
                        }
                        else
                        {
                            idUsuario = user.IdUsuario;
                            user.NombreCompleto = entity.Info.NombreCompleto;
                            user.Email = entity.Info.Email;

                            if (entity.Info.Password != "")
                            {
                                user.Password = LoginManager.EncryptSHA256(entity.Info.Password);
                            }                      
                            user.Usuario1 = entity.Info.Email;
                            user.Borrado = entity.Info.Borrado;

                            context.SaveChanges();

                            IntercambiarLista(context, idUsuario, entity.Paises);
                            context.SaveChanges();
                            IntercambiarLista(context, idUsuario, entity.Roles);
                            context.SaveChanges();
                        }

                        tran.Commit();
                    }
                }
            }
            catch(Exception ex)
            {
                throw new Exception(ex.Message) { Source = ex.Source };
            }
        }

        override
        public DTOUsuario Get(int id) {
            try
            {
                using (var context = new BACEntities())
                {
                    DTOUsuario entity = new DTOUsuario();
                    entity.Info = context.Usuario.FirstOrDefault(x=> x.IdUsuario == id);
                    entity.Info.Password = "" ;
                    var postulante = context.Postulante.FirstOrDefault(x => x.IdUsuario == id);
                    entity.IdPostulante = postulante == null ? 0 : postulante.IdPostulante;
                    entity.Paises = context.Paises_Bac_Usuario.Where(x => x.IdUsuario == id).ToList();
                    List<Paises_Bac_Usuario> paises = new List<Paises_Bac_Usuario>();

                    foreach(var pais in entity.Paises)
                    {
                        paises.Add(new Paises_Bac_Usuario() { IdPais = pais.IdPais, IdUsuario = pais.IdUsuario });
                    }

                    entity.Paises = paises;

                    entity.Roles = context.Usuario_Roles.Where(x => x.IdUsuario == id).ToList();
                    List<Usuario_Roles> roles = new List<Usuario_Roles>();

                    foreach(var rol in entity.Roles)
                    {
                        roles.Add(new Usuario_Roles() { IdRol = rol.IdRol, IdUsuario = rol.IdUsuario });
                    }

                    entity.Roles = roles;

                    entity.Info.Paises_Bac_Usuario = null;
                    entity.Info.FeriaEmpleo_Entrevistadores = null;
                    entity.Info.Usuario_Roles = null;
                    entity.Info.Sesiones = null;
                    entity.Info.TipoLogin = null;
                    entity.Info.Postulante = null;
                    entity.Info.Comentarios = null;
                    entity.Info.Bitacora_Log = null;
                    entity.Info.Agenda_Usuario = null;

                    return entity;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message) { Source = ex.Source };
            }
        }

        public void RecuperarClave(string username)
        {
            try
            {
                var userBac = GetContext().Usuario.FirstOrDefault(x => x.Email.Equals(username));

                if (userBac != null)
                {
                    try
                    {
                        string baseUrl = ConfigurationManager.AppSettings["UrlFrontend"];
                        string url = string.Format("{1}Principal/CambiarClave?username={0}", userBac.Email, baseUrl);
                        Correo.RecuperacionContrasena(userBac.Email,userBac.Password, url);
                    }
                    catch
                    {

                    }
                }
                else
                {
                    throw new Exception("Correo inválido, este no se encuentra registrado en el sistema. Vuelva a intentarlo o comuniquese con el administrador del sitio para más asistencia.");
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    
        public void CambiarClave(DTOCambiarClave cambio)
        {
            try
            {
                using(var context = new BACEntities())
                {
                    var user = context.Usuario.FirstOrDefault(x => x.Email.Equals(cambio.Usuario) && x.Password.Equals(cambio.ClaveAnterior));
                    if(user != null)
                    {
                        string passwordEncrypt = LoginManager.EncryptSHA256(cambio.ClaveNueva);
                        user.Password = passwordEncrypt;
                        context.SaveChanges();
                    }
                    else
                    {
                        throw new Exception("Las credenciales no coinciden, vuelva a intentarlo.");
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

    #region Método privados
    private static void AgregarLista(BACEntities context, int idUsuario, List<Paises_Bac_Usuario> lista)
        {
            if (lista != null && lista.Count > 0)
            {
                foreach (var aux in lista)
                {
                    aux.IdUsuario = idUsuario;
                    aux.FechaCreacion = DateTime.Now;
                }
                context.Paises_Bac_Usuario.AddRange(lista);
            }
        }

        private static void AgregarLista(BACEntities context, int idUsuario, List<Usuario_Roles> lista)
        {
            if (lista != null && lista.Count > 0)
            {
                foreach (var aux in lista)
                {
                    aux.IdUsuario = idUsuario;
                    aux.FechaCreacion = DateTime.Now;
                }
                context.Usuario_Roles.AddRange(lista);
            }
        }

        private static void IntercambiarLista(BACEntities context, int idUsuario, List<Paises_Bac_Usuario> lista)
        {
            var listaEliminar = context.Paises_Bac_Usuario.Where(x => x.IdUsuario == idUsuario);
            context.Paises_Bac_Usuario.RemoveRange(listaEliminar);

            AgregarLista(context, idUsuario, lista);
        }

        private static void IntercambiarLista(BACEntities context, int idUsuario, List<Usuario_Roles> lista)
        {
            var listaEliminar = context.Usuario_Roles.Where(x => x.IdUsuario == idUsuario);
            context.Usuario_Roles.RemoveRange(listaEliminar);

            AgregarLista(context, idUsuario, lista);
        }
        #endregion Métodos privados
    }
}

