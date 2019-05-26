using BolsaEmpleoBAC.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace BolsaEmpleoBAC.BL.Interface
{
    public class FilterZona3 : MasterFilter<Zona3>
    {
        public Expression<Func<Zona3, bool>> LimitFilter()
        {
            return x => !x.Borrado.Value;
        }
    }
}
