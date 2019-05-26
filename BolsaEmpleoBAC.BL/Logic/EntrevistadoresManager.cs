using BolsaEmpleoBAC.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BolsaEmpleoBAC.BL.Logic
{
    public class EntrevistadoresManager:MasterManager<Usuario,BACEntities>
    {
        public List<dynamic> GetEntrevistadorByPais(int IdPais)
        {
            try
            {

                var list = GetContext().Paises_Bac_Usuario.Where(x => x.IdPais == IdPais && 
                                                            (x.Usuario.Usuario_Roles.Select(z=> z.IdRol).Contains(4)
                                                            || x.Usuario.Usuario_Roles.Select(z => z.IdRol).Contains(1)
                                                            || x.Usuario.Usuario_Roles.Select(z => z.IdRol).Contains(2)
                                                            ))
                                                         .Select(y => new { IdPostulante = y.IdUsuario, Descripcion = y.Usuario.NombreCompleto })
                                                         .ToList<dynamic>();
                return list;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }

        }

        public List<dynamic> GetEntrevistadorByNombre(string Nombre,int IdPais)
        {
            try
            {
                var list = GetContext().Paises_Bac_Usuario.Where(x => x.IdPais == IdPais && x.Usuario.NombreCompleto.ToLower().Contains(Nombre.ToLower()) && 
                                                            (x.Usuario.Usuario_Roles.Select(z => z.IdRol).Contains(4)
                                                            || x.Usuario.Usuario_Roles.Select(z => z.IdRol).Contains(1)
                                                            || x.Usuario.Usuario_Roles.Select(z => z.IdRol).Contains(2)
                                                            ))
                                                         .Select(y => new { IdPostulante = y.IdUsuario, Descripcion = y.Usuario.NombreCompleto })
                                                         .ToList<dynamic>();
                return list;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }

        }
    }
}
