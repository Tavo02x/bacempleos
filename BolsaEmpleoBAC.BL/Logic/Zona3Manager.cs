using BolsaEmpleoBAC.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BolsaEmpleoBAC.BL.Logic
{
    public class Zona3Manager:MasterManager<Zona3,BACEntities>
    {
        public List<Zona3> GetZona(int id)
        {
            try
            {
                return GetContext().Zona3.Where(x => x.IdZona2 == id).ToList();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
