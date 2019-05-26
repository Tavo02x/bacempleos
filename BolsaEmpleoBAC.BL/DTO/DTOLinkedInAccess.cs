using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BolsaEmpleoBAC.BL.DTO
{
    public class DTOLinkedInAccess
    {
        public string access_token { set; get; }
        public int expires_in { set; get; }
    }
}
