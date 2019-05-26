using BolsaEmpleoBAC.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace BolsaEmpleoBAC.BL.Interface
{
    public class FilterDiscapacidades:MasterFilter<Discapacidad>
    {
        public Expression<Func<Discapacidad, bool>> LimitFilter()
        {
            return x => !x.Borrado.Value;
        }
    }
}
