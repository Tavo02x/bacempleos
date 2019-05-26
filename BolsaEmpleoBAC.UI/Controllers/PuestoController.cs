using BolsaEmpleoBAC.BL.Logic;
using BolsaEmpleoBAC.General.Validaciones;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace BolsaEmpleoBAC.UI.Controllers
{
    public class PuestoController : ParentController
    {
        private LoginManager login = new LoginManager();
        private AccionManager accion = new AccionManager();
        [NavegacionManager(IdNavegacion = 50)]
        public ActionResult FiltrarPuestos()
        {
            ViewBag.SessionState = ValidateSession();
            return View();
        }

        [NavegacionManager(IdNavegacion = 28)]
        public ActionResult PuestosAplicados()
        {
            ViewBag.SessionState = ValidateSession();
            return View();
        }

        [NavegacionManager(IdNavegacion = 51)]
        public ActionResult MantenimientoPuesto()
        {
            ViewBag.SessionState = ValidateSession();
            return View();
        }

        [NavegacionManager(IdNavegacion = 52)]
        public ActionResult MantenimientoPuestoEdit()
        {
            ViewBag.SessionState = ValidateSession();
            return View();
        }

        [NavegacionManager(IdNavegacion = 53)]
        public ActionResult VerPuesto()
        {
            ViewBag.SessionState = ValidateSession();
            return View();
        }

        [NavegacionManager(IdNavegacion = 54)]
        public ActionResult VerPuestoFeria()
        {
            ViewBag.SessionState = ValidateSession();
            return View();
        }

        [NavegacionManager(IdNavegacion = 55)]
        public ActionResult PostulantesPuesto()
        {
            ViewBag.SessionState = ValidateSession();
            return View();
        }

        [NavegacionManager(IdNavegacion = 83)]
        public ActionResult PostulantesPuestoFeria()
        {
            ViewBag.SessionState = ValidateSession();
            return View();
        }

        [NavegacionManager(IdNavegacion = 56)]
        public ActionResult PuestosDisponibles(string token = null)
        {

            ViewBag.SessionState = ValidateSession();
            //if(!String.IsNullOrEmpty(token))
            //{
            //    string user = System.Web.HttpContext.Current.Session["sessionString"] as String;
            //    int IdUser = login.GetUserId(user);
            //    ViewBag.Token = token;
            //    ViewBag.Menu = accion.MenuList(IdUser); ;
            //}
            return View();
        }

        public ActionResult Error()
        {
            ViewBag.SessionState = ValidateSession();
            return View();
        }
    }
}