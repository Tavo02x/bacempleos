using BolsaEmpleoBAC.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BolsaEmpleoBAC.BL.Logic
{
    public class PretensionSalarialManager:MasterManager<PretensionSalarial,BACEntities>
    {
        public List<vw_PretensionConMoneda> GetPretensiones()
        {
            try
            {
                using(var context = new BACEntities())
                {
                    return context.vw_PretensionConMoneda.ToList();
                }
            }catch(Exception ex)
            {
                throw new Exception(ex.Message) { Source = ex.Source };
            }
        }
    }
}
