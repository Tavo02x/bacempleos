using BolsaEmpleoBAC.General.Validaciones;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace BolsaEmpleoBAC.UI.Controllers
{
    public class PreguntasController : ParentController
    {
        [NavegacionManager(IdNavegacion = 59)]
        public ActionResult BuscarPreguntas()
        {
            ViewBag.SessionState = ValidateSession();
            return View();
        }

        [NavegacionManager(IdNavegacion = 60)]
        public ActionResult MantenimientoPreguntas()
        {
            ViewBag.SessionState = ValidateSession();
            return View();
        }
    }
}