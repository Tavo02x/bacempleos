using BolsaEmpleoBAC.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace BolsaEmpleoBAC.BL.Interface
{
    public class FilterZona2 : MasterFilter<Zona2>
    {
        public Expression<Func<Zona2, bool>> LimitFilter()
        {
            return x => !x.Borrado;
        }
    }
}
