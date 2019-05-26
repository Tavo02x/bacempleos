using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BolsaEmpleoBAC.BL.Logic
{
    public interface IBL<T>
    {
        void Save(T entry);
        void Delete(T entry);
        T Get(Func<T> funcion);
        List<T> GetList(T entry);
    }
}
