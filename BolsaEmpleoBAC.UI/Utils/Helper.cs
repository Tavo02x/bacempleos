using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BolsaEmpleoBAC.UI.Utils
{
    public static class Helper
    {
        private static String ValueOf(string parameter)
        {
            return System.Web.Configuration.WebConfigurationManager.AppSettings[parameter];
        }

        public static string GetValue(string keyname) => ValueOf(keyname);
    }
}