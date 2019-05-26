using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Web;
using Microsoft.Owin.Security.DataHandler.Encoder;
using BolsaEmpleoBAC.Entities;
using BolsaEmpleoBAC.BL.Logic;

namespace BolsaEmpleoBAC.WebAPI.Security
{
    internal static class TokenGenerator
    {

        public static string GenerateTokenJwt(string username, out string roles, out int UserId )
        {
            try
            {
                var loginMag = new LoginManager();
                var accMag = new AccionManager();
                var uMag = new UsuarioManager();
                Sesiones session = new Sesiones();
                string secretKey = "";
                string apiKey = "";

                var userId = loginMag.AddSession(username, "", out apiKey, out secretKey);
                UserId = userId;
                roles = accMag.Menu(userId);
                var paisesFiltro = uMag.GetPaisesUsuario(userId);
                
                var audienceToken = ConfigurationManager.AppSettings["JWT_AUDIENCE_TOKEN"];
                var issuerToken = ConfigurationManager.AppSettings["JWT_ISSUER_TOKEN"];
                var expireTime = ConfigurationManager.AppSettings["JWT_EXPIRE_MINUTES"];

                var securityKey = new SymmetricSecurityKey(System.Text.Encoding.Default.GetBytes(secretKey));
                var signingCredentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256Signature);

                // create a claimsIdentity
                ClaimsIdentity claimsIdentity = new ClaimsIdentity(new[] { new Claim(ClaimTypes.Name, username),
                                                                   //new Claim(ClaimTypes.Role, roles),
                                                                   new Claim("UserId",userId.ToString()),
                                                                   new Claim("PaisesFiltro",paisesFiltro)
                });

                if (roles.Contains("82"))
                {
                    string urlTemp = uMag.GetUrlTempUsuario(userId);
                    claimsIdentity.AddClaim(new Claim("urlTemp", urlTemp));
                }

                // create token to the user
                var tokenHandler = new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler();
                var jwtSecurityToken = tokenHandler.CreateJwtSecurityToken(
                    audience: audienceToken,
                    issuer: issuerToken,
                    subject: claimsIdentity,
                    notBefore: DateTime.UtcNow,
                    expires: DateTime.UtcNow.AddMinutes(Convert.ToInt32(expireTime)),
                    signingCredentials: signingCredentials);

                var jwtTokenString = tokenHandler.WriteToken(jwtSecurityToken);
                return jwtTokenString;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

    }
}