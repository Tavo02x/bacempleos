using System.Collections.Generic;

namespace BolsaEmpleoBAC.General
{
    public class WebAPIResponse<T>
    {
        public WebAPIResponse()
        {
            Lista = new List<T>();
        }

        public bool Resultado { set; get; }

        public string Mensaje { set; get; }

        public T Objeto { set; get; }

        public List<T> Lista { set; get; }
    }
}
