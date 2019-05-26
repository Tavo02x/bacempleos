using BolsaEmpleoBAC.General.Validaciones;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace BolsaEmpleoBAC.UI.Controllers
{
    public class ReportesController : ParentController
    {
        [NavegacionManager(IdNavegacion = 49)]
        public ActionResult Reportes()
        {
            ViewBag.SessionState = ValidateSession();
            return View();
        }
    }
}