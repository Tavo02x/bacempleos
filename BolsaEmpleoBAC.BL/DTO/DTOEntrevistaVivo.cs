using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BolsaEmpleoBAC.BL.DTO
{
    public class DTOEntrevistaVivo
    {
        public string Topic { get; set; }
        public DateTime Start_time { get; set; }
        public string Hour { get; set; }
        public int IdPostulante { get; set; }
        public int IdSolicitante { get; set; }
        public int IdFeriaEmpleo { get; set; }
        public int IdPuesto { get; set; }
        public int IdEntrevista{ get; set; }
        public string Auto_recording = "local";
        public int Duration = 15;
    }
}
