using BolsaEmpleoBAC.BL.DTO;
using BolsaEmpleoBAC.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BolsaEmpleoBAC.BL.Logic
{
    public class RolManager:MasterManager<Roles,BACEntities> {
        public void SaveRol(DTORol objeto, int id)
        {
            try
            {
                var acciones = objeto.Acciones.Split(',');
                var listRoles = new List<Rol_Acciones>();

                var rol = GetContext().Roles.Include("Rol_Acciones").FirstOrDefault(x => x.IdRol == id);

                if (rol == null)
                {
                    foreach (var e in acciones)
                    {
                        listRoles.Add(new Rol_Acciones() { IdRol = objeto.IdRol, AccionId = Convert.ToInt32(e), FechaCreado = DateTime.Now });
                    }

                    GetContext().Roles.Add(new Roles()
                    {
                        IdRol = objeto.IdRol,
                        Descripcion = objeto.Descripcion,
                        Borrado = objeto.Borrado,
                        EsMultiPais = objeto.EsMultiPais,
                        FechaCreacion = DateTime.Now,
                        Rol_Acciones = listRoles
                    });
                }
                else
                {
                    var listAcciones = GetContext().Rol_Acciones.Where(x => x.IdRol == id).ToList();
                    GetContext().Rol_Acciones.RemoveRange(listAcciones);

                    foreach (var e in acciones)
                    {
                        listRoles.Add(new Rol_Acciones() { IdRol = objeto.IdRol, AccionId = Convert.ToInt32(e), FechaCreado = DateTime.Now });
                    }
                    
                    rol.Descripcion = objeto.Descripcion;
                    rol.Borrado = objeto.Borrado;
                    rol.EsMultiPais = objeto.EsMultiPais;
                    rol.Rol_Acciones = listRoles;
                }
                GetContext().SaveChanges();
            }
            catch(Exception ex)
            {
                throw new Exception (ex.Message);
            }
        }

        public Roles GetRolAccion(int id) {
            try
            {
                Roles roles = new Roles();
                roles = GetContext().Roles.Include("Rol_Acciones").FirstOrDefault(x=> x.IdRol == id);
                List<Rol_Acciones> accionesAux = new List<Rol_Acciones>();
                foreach(var aux in roles.Rol_Acciones)
                {
                    accionesAux.Add(new Rol_Acciones()
                    {
                        AccionId = aux.AccionId
                    });
                }
                roles.Rol_Acciones = accionesAux;
                return roles;
            }
            catch(Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
