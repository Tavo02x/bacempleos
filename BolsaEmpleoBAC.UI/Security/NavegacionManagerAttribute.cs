using BolsaEmpleoBAC.BL.Logic;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace BolsaEmpleoBAC.General.Validaciones
{
    public class NavegacionManagerAttribute : ActionFilterAttribute
    {
        private AccionManager accion = new AccionManager();
        public int IdNavegacion;

        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            var request = HttpContext.Current.Request;
            string baseUrl = request.Url.Scheme + "://" + request.Url.Authority + request.ApplicationPath.TrimEnd('/') + "/";
            //string username = (string)System.Web.HttpContext.Current.Session["username"]; 
            if (HttpContext.Current.Session["sessionString"] == null)
            {
                HttpContext.Current.Response.Redirect(baseUrl + "Principal/Login");
            }

            string user = HttpContext.Current.Session["sessionString"] as String; //HttpContext.Current.Session["username"].ToString();
            var list = accion.GetPermisos(user);
            var nodo = list.Any(x => x.AccionId == IdNavegacion);
            if (!nodo)
            {
                HttpContext.Current.Response.Redirect(baseUrl + "Principal/Error");
            }
            base.OnActionExecuting(filterContext);
        }

        public override void OnActionExecuted(ActionExecutedContext filterContext)
        {

            base.OnActionExecuted(filterContext);
        }
    }
}
