using BolsaEmpleoBAC.General.Validaciones;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace BolsaEmpleoBAC.UI.Controllers
{
    public class UsuarioController : ParentController
    {
        [NavegacionManager(IdNavegacion = 48)]
        public ActionResult Usuarios()
        {
            ViewBag.SessionState = ValidateSession();
            return View();
        }

        [NavegacionManager(IdNavegacion = 47)]
        public ActionResult VerUsuarios()
        {
            ViewBag.SessionState = ValidateSession();
            return View();
        }

    }
}