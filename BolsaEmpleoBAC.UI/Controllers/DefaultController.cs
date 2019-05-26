using BolsaEmpleoBAC.BL.Logic;
using BolsaEmpleoBAC.UI.Utils;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace BolsaEmpleoBAC.UI.Controllers
{
    public class DefaultController : Controller
    {
        private string apiUrl = Helper.GetValue("apiUrl");
        private LoginManager login = new LoginManager();
        private AccionManager accion = new AccionManager();
        public ActionResult Index() {
            return View();
        }

        public void Direccionador(string username, string urlExterna)
        {
            //this.Session.Add("username", username);
            

            if (Session["sessionString"] == null)
            {
                System.Web.HttpContext.Current.Session.Add("sessionString", username);
                System.Web.HttpContext.Current.Session.Timeout = 30;
            }
            else
            {
                System.Web.HttpContext.Current.Session["sessionString"] = username;
                System.Web.HttpContext.Current.Session.Timeout = 30;
            }

            if (string.IsNullOrEmpty(urlExterna))
            {
                string user = System.Web.HttpContext.Current.Session["sessionString"] as String; //HttpContext.Session["username"].ToString();
                var list = accion.GetPermisos(user);
                var nodo = list.FirstOrDefault(x => x.TipoAccionId == 9);
                string url = Request.Url.Scheme + "://" + Request.Url.Authority + Request.ApplicationPath.TrimEnd('/') + "/" + nodo.URL;
                Response.Redirect(url);
            }
            else
            {
                urlExterna = urlExterna.Replace("xxxx","&");
                Response.Redirect(urlExterna);
            }
        }

        public void ValidateAccess(string username, string token = null)
        {
            //this.Session.Add("username", username);
            AccionManager accion = new AccionManager();
            bool result = false;
            if (!string.IsNullOrEmpty(token))
            {
                result = ValidateSession(token, username);
            }

            if (result)
            {
                if (Session["sessionString"] == null)
                {
                    System.Web.HttpContext.Current.Session.Add("sessionString", username);
                    System.Web.HttpContext.Current.Session.Timeout = 30;
                }
                else
                {
                    System.Web.HttpContext.Current.Session["sessionString"] = username;
                    System.Web.HttpContext.Current.Session.Timeout = 30;
                }
                string user = System.Web.HttpContext.Current.Session["sessionString"] as String; //HttpContext.Session["username"].ToString();
                var list = accion.GetPermisos(user);
                var nodo = list.FirstOrDefault(x => x.TipoAccionId == 9);
                string url = Request.Url.Scheme + "://" + Request.Url.Authority + Request.ApplicationPath.TrimEnd('/') + "/" + nodo.URL+"?token="+token;
                Response.Redirect(url);
            }
            else
            {
                string url = Request.Url.Scheme + "://" + Request.Url.Authority + Request.ApplicationPath.TrimEnd('/') + "/principal/login";
                login.Logout(username);
                Response.Redirect(url);
            }
        }

        private bool ValidateSession(string token, string username)
        {
            var client = new HttpClient();
            try
            {
                var httpRequestMessage = new HttpRequestMessage
                {
                    Method = HttpMethod.Get,
                    RequestUri = new Uri(apiUrl+"api/Login/verifySession?username="+ username),
                    Headers = {
                            { HttpRequestHeader.Authorization.ToString(), "Bearer "+token },
                            { HttpRequestHeader.Accept.ToString(), "application/json" },
                            { "username", username}
                       }
                };

                var response = client.SendAsync(httpRequestMessage).Result;

                if (response.IsSuccessStatusCode)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            catch (Exception ex)
            {
                return false;
            }
        }
    }
}