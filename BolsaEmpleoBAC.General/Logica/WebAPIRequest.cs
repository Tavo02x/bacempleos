using System.Collections.Generic;

namespace BolsaEmpleoBAC.General
{
    public class WebAPIRequest<T>
    {
        public WebAPIRequest()
        {
            Lista = new List<T>();
        }

        public T Objeto { set; get; }

        public List<T> Lista { set; get; }

		public string Token { set; get; }

        public int Id { set; get; }
    }
}
