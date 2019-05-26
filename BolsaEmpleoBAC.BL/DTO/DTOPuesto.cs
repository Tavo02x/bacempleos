using BolsaEmpleoBAC.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BolsaEmpleoBAC.BL.DTO
{
    public class DTOPuesto
    {
        public Puestos PuestoInfo { set; get; }
        public List<Puestos_Idiomas> Idiomas { set; get; }
        public List<Puesto_TipoJornada> TipoJornadas { set; get; }
        public List<FeriaEmpleo_Puestos> Ferias { set; get; }
        public List<Puestos_Postulante> Postulantes { set; get; }
        public List<Puestos_Paises_BAC> Puestos_Paises_BAC { set; get; }
        public List<RequisitosPuesto> Requisitos { set; get; }
    }
}
