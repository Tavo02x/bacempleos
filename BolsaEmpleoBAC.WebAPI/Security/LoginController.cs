using BolsaEmpleoBAC.BL.Logic;
using BolsaEmpleoBAC.Entities;
using BolsaEmpleoBAC.WebAPI.Controllers;
using BolsaEmpleoBAC.WebAPI.Security;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Web.Http;
using System.Web.Http.Cors;

namespace BolsaEmpleoBAC.WebAPI.Controllers
{
    
    [RoutePrefix("api/login")]
    public class LoginController : ParentController <Usuario>
    {
        private LoginManager loginMag = new LoginManager();
        public LoginController()
        {
            exe = new LoginManager();
        }

        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpPost]
        [Route("authenticate")]
        [AllowAnonymous]
        public IHttpActionResult Authenticate(LoginRequest login)
        {
            if (login == null)
            {
                throw new HttpResponseException(HttpStatusCode.BadRequest);
            }
               
            bool isCredentialValid = loginMag.ValidateCredencial(login.Username, login.Password,false);
            if (isCredentialValid)
            {
                string roles = "";
                int userId = 0;
                var token = TokenGenerator.GenerateTokenJwt(login.Username, out roles, out userId);
                dynamic result = new ExpandoObject();
                result.token = token;
                result.role = roles;
                result.userId = userId;
                return Ok(result);
            }
            else
            {
                return Unauthorized();
            }
        }

        [EnableCors(origins: "console.chathub.ai,test.chathub.ai,ws.edna.ai,104.236.199.160,159.65.175.212,205.144.171.67 ", headers: "*", methods: "*")]
        [HttpPost]
        [Route("authenticateToken")]
        [AllowAnonymous]
        public IHttpActionResult AuthenticateToken(LoginRequest login)
        {
            if (login == null)
            {
                throw new HttpResponseException(HttpStatusCode.BadRequest);
            }

            bool isCredentialValid = loginMag.ValidateCredencial(login.Username, login.Password,true);
            if (isCredentialValid)
            {
                string roles = "";
                int userId = 0;
                var token = TokenGenerator.GenerateTokenJwt(login.Username, out roles, out userId);
                dynamic result = new ExpandoObject();
                result.token = token;
                return Ok(result);
            }
            else
            {
                return Unauthorized();
            }
        }

        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpPost]
        [AllowAnonymous]
        [Route("logout")]
        public IHttpActionResult logout(LoginRequest login)
        {
            if (login == null)
            {
                throw new HttpResponseException(HttpStatusCode.BadRequest);
            }

            bool isCredentialValid = loginMag.Logout(login.Username);
            if (isCredentialValid)
            {
                return Ok();
            }
            else
            {
                return Unauthorized();
            }
        }

        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpGet]
        [Authorize]
        [Route("verifySession")]
        public IHttpActionResult verifySession(string username)
        {
            if (username == null)
            {
                return Unauthorized();
            }

            bool isCredentialValid = loginMag.verifySession(username);
            if (isCredentialValid)
            {
                return Ok();
            }
            else
            {
                return Unauthorized();
            }
        }
    }
}
