using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BolsaEmpleoBAC.BL.DTO
{
    public class DTOCambiarClave
    {
        public string Usuario { set; get; }
        public string ClaveAnterior { set; get; }
        public string ClaveNueva { set; get; }
        public string ClaveConfirmar { set; get; }
    }
}
