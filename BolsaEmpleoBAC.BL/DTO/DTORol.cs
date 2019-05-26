using BolsaEmpleoBAC.Entities;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BolsaEmpleoBAC.BL.DTO
{
    public class DTORol
    {
        public int IdRol { get; set; }
        public string Descripcion {get;set;}
        public bool Borrado { get; set; }
        public string Acciones { get; set; }
        public bool EsMultiPais { get; set; }
    }
}
