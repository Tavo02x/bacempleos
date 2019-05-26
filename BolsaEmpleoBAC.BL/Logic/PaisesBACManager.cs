using BolsaEmpleoBAC.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BolsaEmpleoBAC.BL.Logic
{
    public class PaisesBACManager:MasterManager<Paises_Bac,BACEntities>{
        public List<Paises_Bac> GetPaisesxUsuario(int userId)
        {
            try
            {
                List<Paises_Bac> lista = GetContext().Paises_Bac_Usuario.Include("Paises_Bac").Where(x => x.IdUsuario == userId).Select(x => x.Paises_Bac).ToList();
                return lista;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message) { Source = ex.Source };
            }
        }
    }
}
