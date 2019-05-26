using BolsaEmpleoBAC.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace BolsaEmpleoBAC.BL.Interface
{
    public class FilterAreasLaborales : MasterFilter<AreasLaborales>
    {
        public Expression<Func<AreasLaborales, bool>> LimitFilter()
        {
            return x => !x.Borrado;
        }
    }
}
