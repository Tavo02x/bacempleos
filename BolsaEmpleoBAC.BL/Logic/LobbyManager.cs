using BolsaEmpleoBAC.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BolsaEmpleoBAC.BL.Logic
{
    public class LobbyManager
    {
        public static int GetPuestos(List<int> idPais)
        {
            try
            {
                using (var context = new BACEntities())
                {
                    //var lista = context.Puestos.Where(x => x.Puestos_Paises_BAC.Any(y => (idPais.Contains(y.IdPais) || idPais.FirstOrDefault() == 0))).ToList();
                    //return lista.Count;
                    return context.Puestos.Where(x => x.Puestos_Paises_BAC.Any(y => (idPais.Contains(y.IdPais) || idPais.FirstOrDefault() == 0))).Count();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message) { Source = ex.Source };
            }
        }

        public static int GetAplicantes(List<int> idPais)
        {
            try
            {
                using (var context = new BACEntities())
                {
                    //var lista = context.Puestos_Postulante.Where(x => x.Puestos.Puestos_Paises_BAC.Any(y => (idPais.Contains(y.IdPais) || idPais.FirstOrDefault() == 0))).ToList();
                    //return lista.Count;
                    return context.Puestos_Postulante.Where(x => x.Puestos.Puestos_Paises_BAC.Any(y => (idPais.Contains(y.IdPais) || idPais.FirstOrDefault() == 0))).Count();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message) { Source = ex.Source };
            }
        }

        public static int GetUsuarios(List<int> idPais)
        {
            try
            {
                using (var context = new BACEntities())
                {
                    //var lista = context.Usuario.Where(x => (idPais.Contains(x.IdPais) || idPais.FirstOrDefault() == 0)).ToList();
                    //return lista.Count;
                    return context.Usuario.Where(x => (idPais.Contains(x.IdPais) || idPais.FirstOrDefault() == 0)).Count();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message) { Source = ex.Source };
            }
        }

        public static int AdministradoresPais(List<int> idPais)
        {
            try
            {
                using (var context = new BACEntities())
                {
                    var lista = context.Usuario_Roles.Where(x => x.IdRol == 2 && (x.Usuario.Paises_Bac_Usuario.Any(y => idPais.Contains(y.IdPais) || idPais.FirstOrDefault() == 0))).ToList();
                    return lista.Count;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message) { Source = ex.Source };
            }
        }

        public static int AdministradoresRegional(List<int> idPais)
        {
            try
            {
                using (var context = new BACEntities())
                {
                    var lista = context.Usuario_Roles.Where(x => x.IdRol == 1 && x.Usuario.Paises_Bac_Usuario.Any(y => idPais.Contains(y.IdPais) || idPais.FirstOrDefault() == 0)).ToList();
                    return lista.Count;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message) { Source = ex.Source };
            }
        }
    }
}
