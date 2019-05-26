using BolsaEmpleoBAC.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BolsaEmpleoBAC.BL.DTO
{
    public class DTOPostulante
    {
        public Postulante PostulanteInfo { set; get; }
        public Usuario Credenciales { set; get; }
        public List<Idiomas_Postulante> Idiomas { set; get; }
        public List<Titulos> InformacionAcademica { set; get; }
        public List<PaisPostulante> Paises { set; get; }
        public List<Postulante_Discapacidad> Discapacidades { set; get; }
        public List<ReferenciasLaborales> ReferenciasLaborales { set; get; }
        public List<AreasPostulante> Areas { set; get; }
        public List<ExperienciaLaboral> Experiencia { set; get; }
        public List<Habilidades_Postulante> Habilidades { set; get; }
    }
}
