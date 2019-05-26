using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BolsaEmpleoBAC.BL.DTO
{
    public class DTOEntrevistaPregrabada
    {
        public DTOEntrevistaPregrabada()
        {
            preguntas = new List<DTOPreguntas>();
        }
        public int IdPostulante { get; set; }
        public int IdEntrevista { get; set; }
        public int IdPuesto { get; set; }
        public int IdUsuario { get; set; }
        public DateTime FechaEntrevista { get; set; }
        public List<DTOPreguntas> preguntas;
    }
    public class DTOPreguntas
    {
        public int IdPregunta { get; set; }
        public string Descripcion { get; set; }
        public int Tiempo { get; set; }
        public int IdArea { get; set; }
    }
}
