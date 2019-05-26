using BolsaEmpleoBAC.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BolsaEmpleoBAC.BL.Logic
{
    public class Zona2Manager : MasterManager<Zona2, BACEntities>
    {
        public List<Zona2> GetZona(int id)
        {
            try
            {
                return GetContext().Zona2.Where(x => x.IdZona1 == id).ToList();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
