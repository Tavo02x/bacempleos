using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace BolsaEmpleoBAC.BL.Interface
{
    public interface MasterFilter<T>
    {
       Expression<Func<T, bool>> LimitFilter();
    }
}
