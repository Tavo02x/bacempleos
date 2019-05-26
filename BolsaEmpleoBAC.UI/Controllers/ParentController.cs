using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace BolsaEmpleoBAC.UI.Controllers
{
    public class ParentController : Controller
    {
        public bool ValidateSession()
        {
            try
            {
                var value = Session["sessionString"] == null ? true : false;
                return value;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
    }
}