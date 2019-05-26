using BolsaEmpleoBAC.BL.Logic;
using BolsaEmpleoBAC.General.Validaciones;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace BolsaEmpleoBAC.UI.Controllers
{
    public class PrincipalController : ParentController
    {
        private LoginManager login = new LoginManager();
        private AccionManager accion = new AccionManager();
        [NavegacionManager(IdNavegacion = 57)]
        public ActionResult Index(string token = null)
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

        public ActionResult Login()
        {
            if (Session["sessionString"] == null)
            {
                System.Web.HttpContext.Current.Session.Add("sessionString", "");
                System.Web.HttpContext.Current.Session.Timeout = 30;
            }
            ViewBag.SessionState = false;
            return View();
        }
        
        public ActionResult Error()
        {
            return View();
        }

        public ActionResult CambiarClave()
        {
            ViewBag.SessionState = ValidateSession();
            return View();
        }

        public ActionResult LoginBAC()
         {
            return View();
         }



}
}