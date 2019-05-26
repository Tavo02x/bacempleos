using BolsaEmpleoBAC.General.Validaciones;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace BolsaEmpleoBAC.UI.Controllers
{
    public class RolController : ParentController
    {
        [NavegacionManager(IdNavegacion = 45)]
        public ActionResult Index()
        {
            ViewBag.SessionState = ValidateSession();
            return View();
        }

        [NavegacionManager(IdNavegacion = 46)]
        public ActionResult Mantenimiento()
        {
            ViewBag.SessionState = ValidateSession();
            return View();
        }
    }
}