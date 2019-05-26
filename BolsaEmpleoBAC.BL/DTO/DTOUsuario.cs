using BolsaEmpleoBAC.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BolsaEmpleoBAC.BL.DTO
{
    public class DTOUsuario
    {
        public Usuario Info { set; get; }
        public int IdPostulante { set; get; }
        public List<Paises_Bac_Usuario> Paises { set; get; }
        public List<Usuario_Roles> Roles { set; get; }
    }
}
