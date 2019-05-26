using BolsaEmpleoBAC.General.Validaciones;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace BolsaEmpleoBAC.UI.Controllers
{
    public class HabilidadesController : ParentController
    {
        [NavegacionManager(IdNavegacion = 63)]
        public ActionResult Index()
        {
            ViewBag.SessionState = ValidateSession();
            return View();
        }
    }
}