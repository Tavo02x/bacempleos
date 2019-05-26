using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BolsaEmpleoBAC.General.Constantes
{
    public class AppSetting
    {
        public static int MaxAplicantes = int.Parse(ConfigurationManager.AppSettings["MaxAplicaciones"]);
    }
}
