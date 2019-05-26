using BolsaEmpleoBAC.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace BolsaEmpleoBAC.BL.Interface
{
    public class FilterIdiomas : MasterFilter<Idioma>
    {
        public Expression<Func<Idioma, bool>> LimitFilter()
        {
            return x => !x.Borrado;
        }
    }
}
