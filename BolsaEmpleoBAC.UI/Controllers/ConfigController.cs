using BolsaEmpleoBAC.UI.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace BolsaEmpleoBAC.UI.Controllers
{
    public class ConfigController : Controller
    {
        public JavaScriptResult Index()
        {
            var result = new JavaScriptResult();

            string apiUrl = Helper.GetValue("apiUrl"),
                baseUrl = Request.Url.Scheme + "://" + Request.Url.Authority + Request.ApplicationPath.TrimEnd('/') + "/",
                ZiggeoKey = Helper.GetValue("ZIGGEO_API_KEY"),
                MaxSizeDoc = Helper.GetValue("MaxSizeDoc"),
                MaxSizeImagen = Helper.GetValue("MaxSizeImagen"),
                FormatosDoc = Helper.GetValue("FormatosDoc"),
                FormatosImagen = Helper.GetValue("FormatosImagen");
                

            string script = $@"(function(window) {{
                window.__env = window.__env || {{}};

                window.__env.apiUrl = '{apiUrl}';
                window.__env.baseUrl = '{baseUrl}';
                window.__env.ZiggeoApiKey = '{ZiggeoKey}';
                window.__env.MaxSizeDoc = '{MaxSizeDoc}';
                window.__env.MaxSizeImagen = '{MaxSizeImagen}';
                window.__env.FormatosDoc = '{FormatosDoc}';
                window.__env.FormatosImagen = '{FormatosImagen}';

            }} (this));";

            result.Script = script;

            Response.ContentType = "application/javascript";
            return result;
        }
    }
}