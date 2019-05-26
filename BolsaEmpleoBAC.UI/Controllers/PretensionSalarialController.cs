using BolsaEmpleoBAC.General.Validaciones;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace BolsaEmpleoBAC.UI.Controllers
{
    public class PretensionSalarialController : ParentController
    {
        [NavegacionManager(IdNavegacion = 58)]
        public ActionResult Index()
        {
            ViewBag.SessionState = ValidateSession();
            return View();
        }
    }
}