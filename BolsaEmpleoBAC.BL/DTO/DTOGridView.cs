using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BolsaEmpleoBAC.BL.DTO
{
    public class DTOGridView<T> 
    {
        public DTOGridView()
        {
            Data = new List<T>();
        }
        public List<T> Data { set; get; }
        public int TotalRows { set; get; }
    }
}
