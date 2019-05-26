using BolsaEmpleoBAC.Entities;
using BolsaEmpleoBAC.General.Utilitarios;
using Microsoft.Owin.Security.DataHandler.Encoder;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace BolsaEmpleoBAC.BL.Logic
{
    public class LoginManager : MasterManager<Usuario, BACEntities>
    {
        public bool ValidateCredencial(string username, string password , bool isChatbot = false)
        {
            try
            {
                string chatbotuser = ConfigurationManager.AppSettings["ChatbotUser"].ToString();
                string charbotpass = ConfigurationManager.AppSettings["ChatbotPassword"].ToString();

                var validated = false;
                var user = GetContext().Usuario.FirstOrDefault(x => x.Email.Equals(username) && x.FechaCaducidad != null);
                if (user != null)
                {
                    if (DateTime.Compare(DateTime.Now, user.FechaCaducidad.Value) > 0)
                    {
                        user.Borrado = true;
                        GetContext().SaveChanges();
                    }
                }
                if (isChatbot)
                {
                    if (chatbotuser.Equals(username) && charbotpass.Equals(password))
                    {
                        validated = GetContext().Usuario.Any(x => x.Email.Equals(username));
                    }           
                }
                else
                {
                    var passwordEncrypt = EncryptSHA256(password);
                    validated = GetContext().Usuario.Any(x => x.Email.Equals(username) && x.Password.Equals(passwordEncrypt) && x.Borrado == false);
                }
                return validated;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public int GetUserId(string username)
        {
            try
            {
                return GetContext().Usuario.FirstOrDefault(x => x.Email.Equals(username)).IdUsuario;
            }
            catch (Exception ex)
            {
                return 0;
            }
        }

        public int AddSession(string username, string hostname, out string userKey, out string secretKey)
        {
            try
            {
                userKey = GenerateSessionKey();
                secretKey = GenerateSessionKey();
                GetContext().Configuration.LazyLoadingEnabled = true;
                var user = GetContext().Usuario.Include("Sesiones").FirstOrDefault(x => x.Email.Equals(username));
                int minExpires = Convert.ToInt32(ConfigurationManager.AppSettings["JWT_EXPIRE_MINUTES"]);

                if (user.Sesiones.Count == 0)
                {
                    DateTime expire = DateTime.Now.AddMinutes(minExpires);
                    GetContext().Sesiones.Add(new Sesiones() { IdUsuario = user.IdUsuario, User_key = userKey, Secret_key = secretKey, Hostname = hostname, FechaCreacion = DateTime.Now, FechaExpiración = expire });
                    GetContext().SaveChanges();
                }
                else
                {
                    var dateNow = DateTime.Now;

                    var expire = user.Sesiones.FirstOrDefault().FechaExpiración;
                    if (DateTime.Compare(dateNow, expire) > 0)
                    {
                        GetContext().Sesiones.RemoveRange(user.Sesiones);
                        expire = dateNow.AddMinutes(minExpires);
                        GetContext().Sesiones.Add(new Sesiones() { IdUsuario = user.IdUsuario, User_key = userKey, Secret_key = secretKey, Hostname = hostname, FechaCreacion = dateNow, FechaExpiración = expire });
                        GetContext().SaveChanges();
                    }
                    else
                    {
                        var session = user.Sesiones.FirstOrDefault();
                        userKey = session.User_key;
                        secretKey = session.Secret_key;
                    }
                }
                return user.IdUsuario;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public Sesiones GetSesiones(string username)
        {
            try
            {
                GetContext().Configuration.LazyLoadingEnabled = true;
                var user = GetContext().Usuario.FirstOrDefault(x => x.Email.Equals(username));
                if (user != null)
                {
                    return user.Sesiones.FirstOrDefault();
                }
                else
                {
                    return null;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public static string GenerateSessionKey()
        {
            try
            {
                var key = new byte[32];
                RandomNumberGenerator.Create().GetBytes(key);
                var base64Secret = TextEncodings.Base64Url.Encode(key);
                return base64Secret;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        /// <summary>
        /// Encripta la cadena en SHA256
        /// </summary>
        /// <param name="str"></param>
        /// <returns></returns>
        public static string EncryptSHA256(string str)
        {
            try
            {
                SHA256 sha256 = SHA256.Create();
                ASCIIEncoding encoding = new ASCIIEncoding();
                byte[] stream = null;
                StringBuilder sb = new StringBuilder();
                stream = sha256.ComputeHash(encoding.GetBytes(str));
                for (int i = 0; i < stream.Length; i++) sb.AppendFormat("{0:x2}", stream[i]);
                return sb.ToString();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        /// <summary>
        /// Encripta la cadena en MD5
        /// </summary>
        /// <param name="str"></param>
        /// <returns></returns>
        public static string EncryptMD5(string str)
        {
            MD5 md5 = MD5.Create();
            ASCIIEncoding encoding = new ASCIIEncoding();
            byte[] stream = null;
            StringBuilder sb = new StringBuilder();
            stream = md5.ComputeHash(encoding.GetBytes(str));
            for (int i = 0; i < stream.Length; i++) sb.AppendFormat("{0:x2}", stream[i]);
            return sb.ToString();
        }

        public bool Logout(string username)
        {
            try
            {
                //var userBac = GetContext().Usuario.Include("Sesiones").FirstOrDefault(x => x.Email.Equals(username));

                //var sessionBac = userBac.Sesiones.FirstOrDefault();
                //if (sessionBac != null)
                //{
                //    GetContext().Sesiones.Remove(sessionBac);
                //}
                //GetContext().SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public bool verifySession(string username)
        {
            try
            {
                var userBac = GetContext().Usuario.Include("Sesiones").FirstOrDefault(x => x.Email.Equals(username));

                var sessionBac = userBac.Sesiones.FirstOrDefault();
                if (sessionBac != null)
                {
                    return true;
                }
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

    }

    public class LoginRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}

