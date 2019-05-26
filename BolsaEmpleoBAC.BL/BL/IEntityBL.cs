using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BolsaEmpleoBAC.BL.BL
{
    public interface IEntityBL<T> where T:class
     {
        void Salvar(T entity);
        void Eliminar(T entity);
        T Get(Func<T> lambda);
        List<T> Listar();

        List<T> Filtrar(Func<List<T>> lambda);
    }
}
