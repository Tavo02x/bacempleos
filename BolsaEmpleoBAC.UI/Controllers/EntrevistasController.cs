using BolsaEmpleoBAC.General.Validaciones;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace BolsaEmpleoBAC.UI.Controllers
{
    public class EntrevistasController : ParentController
    {
        [NavegacionManager(IdNavegacion = 67)]
        public ActionResult EnVivo()
        {
            ViewBag.SessionState = ValidateSession();
            return View();
        }

        [NavegacionManager(IdNavegacion = 68)]
        public ActionResult SolicitarEntrevistas()
        {
            ViewBag.SessionState = ValidateSession();
            return View();
        }

        [NavegacionManager(IdNavegacion = 69)]
        public ActionResult AplicarEntrevista()
        {
            ViewBag.SessionState = ValidateSession();
            return View();
        }

        [NavegacionManager(IdNavegacion = 70)]
        public ActionResult VideoPregrabado()
        {
            ViewBag.SessionState = ValidateSession();
            return View();
        }

        [NavegacionManager(IdNavegacion = 71)]
        public ActionResult FinalizarEntrevista()
        {
            ViewBag.SessionState = ValidateSession();
            return View();
        }

        [NavegacionManager(IdNavegacion = 72)]
        public ActionResult VideosEntrevista()
        {
            ViewBag.SessionState = ValidateSession();
            return View();
        }

        [NavegacionManager(IdNavegacion = 73)]
        public ActionResult SolicitarEntrevistasFeria()
        {
            ViewBag.SessionState = ValidateSession();
            return View();
        }

        [NavegacionManager(IdNavegacion = 73)]
        public ActionResult ReagendarEntrevistasFeria()
        {
            ViewBag.SessionState = ValidateSession();
            return View();
        }
    }
}