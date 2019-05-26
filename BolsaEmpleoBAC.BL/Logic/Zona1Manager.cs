using BolsaEmpleoBAC.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BolsaEmpleoBAC.BL.Logic
{
    public class Zona1Manager : MasterManager<Zona1, BACEntities>
    {
        public List<Zona1> GetZona(int id)
        {
            try
            {
                return GetContext().Zona1.Where(x => x.IdPais == id).ToList();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
