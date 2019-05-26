using BolsaEmpleoBAC.BL.Integrations.LinkedIn;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace BolsaEmpleoBAC.UI.Controllers
{
    public class LinkedInController : Controller
    {
        public ActionResult LinkedINAuth(string code, string state)
        {
            //This method path is your return URL  
            try
            {
                //Get Accedd Token  
                LinkedInManager.LinkedInAuth(code, state);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message) { Source = ex.Source };
            }
            return View();
        }
    }
}