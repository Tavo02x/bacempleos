using BolsaEmpleoBAC.General.Validaciones;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace BolsaEmpleoBAC.UI.Controllers
{
    public class JornadaLaboralController : ParentController
    {
        [NavegacionManager(IdNavegacion = 61)]
        public ActionResult Index()
        {
            ViewBag.SessionState = ValidateSession();
            return View();
        }
    }
}