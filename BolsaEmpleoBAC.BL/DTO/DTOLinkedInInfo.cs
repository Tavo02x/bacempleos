using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BolsaEmpleoBAC.BL.DTO
{
    public class DTOLinkedInInfo
    {
        public string firstName { set; get; }
        public string headline { set; get; }
        public string id { set; get; }
        public string lastName { set; get; }
        public DTOURL siteStandardProfileRequest { set; get; }
    }

    public class DTOURL
    {
        public string url { set; get; }
    }
}
