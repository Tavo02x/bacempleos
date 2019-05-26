using BolsaEmpleoBAC.BL.Logic;
using BolsaEmpleoBAC.General.Validaciones;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace BolsaEmpleoBAC.UI.Controllers
{
    public class FeriaVirtualController : ParentController
    {
        private LoginManager login = new LoginManager();
        private AccionManager accion = new AccionManager();
        [NavegacionManager(IdNavegacion = 74)]
        public ActionResult MantenimientoFeriaVirtual()
        {
            ViewBag.SessionState = ValidateSession();
            return View();

        }

        [NavegacionManager(IdNavegacion = 75)]
        public ActionResult VerFeriaVirtual(string token = null)
        {
            //if (!String.IsNullOrEmpty(token))
            //{
            //    string user = System.Web.HttpContext.Current.Session["sessionString"] as String;
            //    int IdUser = login.GetUserId(user);
            //    ViewBag.Token = token;
            //    ViewBag.Menu = accion.MenuList(IdUser); ;
            //}
            ViewBag.SessionState = ValidateSession();
            return View();
        }

        [NavegacionManager(IdNavegacion = 76)]
        public ActionResult DetalleFeriaVirtual()
        {
            ViewBag.SessionState = ValidateSession();
            return View();
        }

        [NavegacionManager(IdNavegacion = 77)]
        public ActionResult DetalleFeriaVirtualPostulante() {
            ViewBag.SessionState = ValidateSession();
            return View();
        }
    }
}