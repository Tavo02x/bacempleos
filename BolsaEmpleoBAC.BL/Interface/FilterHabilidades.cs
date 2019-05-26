using BolsaEmpleoBAC.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace BolsaEmpleoBAC.BL.Interface
{
    public class FilterHabilidades : MasterFilter<Habilidades>
    {
        public Expression<Func<Habilidades, bool>> LimitFilter()
        {
            return x => !x.Borrado.Value;
        }
    }
}
