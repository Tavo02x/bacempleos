using BolsaEmpleoBAC.General.Validaciones;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace BolsaEmpleoBAC.UI.Controllers
{
    public class AreasLaboralesController : ParentController
    {
        [NavegacionManager(IdNavegacion = 65)]
        public ActionResult Index()
        {
            ViewBag.SessionState = ValidateSession();
            return View();
        }
    }
}