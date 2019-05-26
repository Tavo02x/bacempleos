using BolsaEmpleoBAC.General.Validaciones;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace BolsaEmpleoBAC.UI.Controllers
{
    public class ZonaController : ParentController
    {
        // GET: Zona
        [NavegacionManager(IdNavegacion = 42)]
        public ActionResult Index()
        {
            ViewBag.SessionState = ValidateSession();
            return View();
        }

        [NavegacionManager(IdNavegacion = 43)]
        public ActionResult Zona2()
        {
            ViewBag.SessionState = ValidateSession();
            return View();
        }

        [NavegacionManager(IdNavegacion = 44)]
        public ActionResult Zona3()
        {
            ViewBag.SessionState = ValidateSession();
            return View();
        }
    }
}