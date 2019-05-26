using BolsaEmpleoBAC.Entities;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BolsaEmpleoBAC.BL.Logic
{
    public class AccionManager : MasterManager<Acciones, BACEntities>
    {
        public List<TipoAccion> GetTiposAccion()
        {
            try
            {
                using (var context = new BACEntities())
                {
                    var lista = context.TipoAccion.ToList();
                    return lista;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message) { Source = ex.Source };
            }
        }

        public string Menu(int userid)
        {
            try
            {
                using (var context = new BACEntities())
                {
                    var lista = context.Acciones
                        .Where(x => x.Rol_Acciones.Any(y => y.Roles.Usuario_Roles.Any(z => z.IdUsuario == userid)) && !x.Borrado)
                        .OrderBy(x=> x.Secuencia)
                        .ToList();

                    return JsonConvert.SerializeObject(lista);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message) { Source = ex.Source };
            }
        }

        public List<Acciones> MenuList(int userid)
        {
            try
            {
                using (var context = new BACEntities())
                {
                    var lista = context.Acciones
                        .Where(x => x.Rol_Acciones.Any(y => y.Roles.Usuario_Roles.Any(z => z.IdUsuario == userid)) && !x.Borrado)
                        .OrderBy(x => x.Secuencia)
                        .ToList();

                    return lista;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message) { Source = ex.Source };
            }
        }
        public List<Acciones> GetPermisos(string email)
        {
            try
            {
                using (var context = new BACEntities())
                {
                    List<int> tipoMenu = new List<int>() { 1, 2 };
                    var lista = context.Acciones
                        .Where(x => !tipoMenu.Contains(x.TipoAccionId.Value) && x.Rol_Acciones.Any(y => y.Roles.Usuario_Roles.Any(z=> z.Usuario.Usuario1.Equals(email)))).ToList();
                    return lista;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public dynamic GetRestricciones()
        {
            try
            {
                using (var context = new BACEntities())
                {
                    List<int> tipoMenu = new List<int>() { 1, 2 };
                    var lista = context.Acciones.ToList();
                    return lista;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
