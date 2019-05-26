using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BolsaEmpleoBAC.BL.DTO
{
    public class DTOEntrevistaVideo
    {
        public DTOEntrevistaVideo()
        {
            PreguntasVideo = new List<DTOPreguntasVideo>();
        }
        public int IdEntrevista { get; set; }
        public List<DTOPreguntasVideo> PreguntasVideo;
   }

    public class DTOPreguntasVideo
    {
        public int IdPregunta { get; set; }
        public string Video { get; set; }
    }
}
