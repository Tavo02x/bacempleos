using BolsaEmpleoBAC.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace BolsaEmpleoBAC.BL.Interface
{
    public class FilterZona1 : MasterFilter<Zona1>
    {
        public Expression<Func<Zona1, bool>> LimitFilter()
        {
            return x => !x.Borrado;
        }
    }
}
