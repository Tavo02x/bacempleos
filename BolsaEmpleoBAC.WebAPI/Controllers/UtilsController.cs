using BolsaEmpleoBAC.General;
using BolsaEmpleoBAC.General.Utilitarios;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace BolsaEmpleoBAC.WebAPI.Controllers
{

    [EnableCors(origins: "*", headers: "*", methods: "*")]
    [RoutePrefix("api/Utils")]
    [Authorize]
    public class UtilsController : ApiController
    {
        [HttpGet]
        [Authorize]
        [Route("SendEmail")]
        public IHttpActionResult SendEmail(string To, string Subject, string Body)
        {
            string Error = "";
            try
            {
                Correo.SendEmail(To,Subject,Body,out Error);
                return StatusCode(HttpStatusCode.OK);
            }
            catch
            {
                return StatusCode(HttpStatusCode.BadRequest);
            }
        }
    }
}
