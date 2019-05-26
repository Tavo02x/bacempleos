using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;
using BolsaEmpleoBAC.Entities;
namespace BolsaEmpleoBAC.General.Utilitarios
{
    public class Correo
    {
        private readonly static string email = ConfigurationManager.AppSettings["Email"].ToString();
        private readonly static string password = ConfigurationManager.AppSettings["Password"].ToString();
        private readonly static string host = ConfigurationManager.AppSettings["SMTP_Host"].ToString();
        private readonly static string port = ConfigurationManager.AppSettings["SMTP_Port"].ToString();
        private readonly static string urlFrontend = ConfigurationManager.AppSettings["UrlFrontend"].ToString();
        private static readonly log4net.ILog log = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        public enum StatusEmail
        {
            Pendiente = 1,
            Enviado = 2,
            Error = 3,
            ReintentoFallido = 4,
            ReintentoExitoso = 5
        }
        public static bool SendEmail(string To, string Subject, string Body, out string Error)
        {
            Error = "";
            try
            {
                string displayName = "BAC Empleos";
                MailMessage message = new MailMessage();
                SmtpClient smtpClient1 = new SmtpClient(host);
                smtpClient1.Credentials = new NetworkCredential(email, password);
                smtpClient1.EnableSsl = true;
                //smtpClient1.Port = Convert.ToInt32(port);
                SmtpClient smtpClient2 = smtpClient1;
                message.To.Add(To);
                message.From = new MailAddress(email, displayName);
                message.Subject = Subject;
                message.Body = Body;
                message.IsBodyHtml = true;
                smtpClient2.Send(message);
                return true;
            }
            catch (Exception ex)
            {
                Error = "Error: " +ex.Message+", InnerException: "+ ex.InnerException;
                return false;
            }
        }

        public static void ProcessQueue()
        {
            BACEntities db = new BACEntities();
            List<EmailQueue> queue = new List<EmailQueue>();
            try
            {
                log.Info("Inicio de procesamiento de la cola" + DateTime.Now.ToString());
                queue = db.EmailQueue.Where(x => x.Status != (int)StatusEmail.Enviado).OrderBy(y=> y.DateCreate).ToList();

                foreach (var email in queue)
                {
                    log.Info("Envío de correo " + email.IdEmailQueue);
                    string Error = "";
                    bool result = SendEmail(email.EmailTo, email.Subject,email.Body, out Error);

                    var obj = db.EmailQueue.FirstOrDefault(x => x.IdEmailQueue == email.IdEmailQueue);

                    if (result)
                    {                     
                        obj.Status = email.Status == (int)StatusEmail.Error? (int)StatusEmail.ReintentoExitoso : (int)StatusEmail.Enviado;
                        obj.ErrorMessage = "";
                        obj.DateSended = DateTime.Now;
                        log.Info("Envío de correo " + email.IdEmailQueue + ". Status enviado. Fecha: " + DateTime.Now.ToString());
                    }
                    else
                    {
                       
                        obj.Status = email.Status == (int)StatusEmail.Error ? (int)StatusEmail.ReintentoFallido : (int)StatusEmail.Error;
                        obj.ErrorMessage = Error;
                        log.Info("Envío de correo " + email.IdEmailQueue + ". Status error. Fecha: "+DateTime.Now.ToString() + ". Message: "+ Error);
                    }

                    db.SaveChanges();
                }
                log.Info("Cola de correos procesada."+DateTime.Now.ToString());

            }
            catch (Exception ex)
            {
                log.Error(ex);
                throw new Exception(ex.Message);
            }
        }

        public static void AddEmailToQueue(string To, string Subject, string Body)
        {

            try
            {

                using (BACEntities db = new BACEntities())
                {
                    db.EmailQueue.Add(new EmailQueue() { Subject = Subject,Body = Body, EmailFrom = email, EmailTo = To, DateCreate = DateTime.Now, Status = (int)StatusEmail.Pendiente });
                    db.SaveChanges();
                }
                  
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message, ex.InnerException);
            }
        }

        public static void CreacionCuenta(string Email, string Url="")
        {
            string html = "";
            try
            {
                string Error = "";
                Url = urlFrontend;
                string Subject = "Cuenta creada de Empleos BAC Credomatic";

                html += "<p>Gracias por registrarse en BAC Credomatic. Ahora puede ingresar haciendo click en este enlace o copiar y pegarlo en tu navegador:<a href='" + Url + "'></a></p>";
                html += "<p>Si quieres conocer más de nuestra cultura de innovación y valores, puedes ingresar al siguiente enlace: <a href='https://empleosbaccredomatic.com/cultura-de-innovacion'></a></p>";
                html += "<p>Estamos en contacto,</p><br/>";
                html += "<p><img style='width: 100px; height: 35px;' src='https://s3.us-east-2.amazonaws.com/bac-rrhh-test/s3fs-public/uploads/bac_4e9c31ea-5070-4b31-b7d8-6c7c10e75832.png'></img></p>";
                html += "<p><b>Departamento Recursos Humanos</b></p>";

                AddEmailToQueue(Email, Subject, html);
                //SendEmail(Email, Subject, html, out Error);
            }
            catch 
            {

            }
        }

        public static void RecuperacionContrasena(string Email,string clave, string Url = "")
        {
            string html = "";
            try
            {
                string Subject = "Restablece tu contraseña de Empleos BAC Credomatic";

                html += "<p>Has solicitado un cambio de contraseña.</p>";
                html += "<p>Haga Clic en el siguiente enlace para continuar con el proceso: <a href='" + Url + "'> Aplicar cambio de contraseña </a></p>";
                html += "<p>La contraseña temporal es \"" + clave + "\" la cual debe ingresar en la página que abrirá en el URL para realizar el cambio de contraseña.</p>";
                html += "<p>Si no has solicitado un cambio de contraseña de tu cuenta, entonces omita este mensaje.</p>";
                html += "<p>Saludos,</p><br/>";
                html += "<p><img style='width: 100px; height: 35px;' src='https://s3.us-east-2.amazonaws.com/bac-rrhh-test/s3fs-public/uploads/bac_4e9c31ea-5070-4b31-b7d8-6c7c10e75832.png'></img></p>";
                html += "<p><b>Departamento Recursos Humanos</b></p>";

                AddEmailToQueue(Email, Subject, html);
            }
            catch
            {

            }
        }

        public static void CompartirPerfil(string Email, string clave,string NombreReceptor, string NombrePostulante, string Url = "")
        {
            string html = "";
            try
            {
                string Subject = "Se ha compartido el perfil "+ NombrePostulante;

                html += "<p>Se ha compartido el perfil " + NombrePostulante +".</p>";
                html += "<p>Haga Click en el siguiente enlace para continuar con el proceso: <a href='" + Url + "'> Aplicar cambio de contraseña </a></p>";
                html += "<p>La contraseña temporal es \"" + clave + "\" la cual debe ingresar en la página que abrirá en el URL para realizar el cambio de contraseña.</p>";
                html += "<p>Despues del cambio de contraseña deberá iniciar sesión y podra visualizar el perfil del aplicante.</p>";
                html += "<p>Saludos,</p><br/>";
                html += "<p><img style='width: 100px; height: 35px;' src='https://s3.us-east-2.amazonaws.com/bac-rrhh-test/s3fs-public/uploads/bac_4e9c31ea-5070-4b31-b7d8-6c7c10e75832.png'></img></p>";
                html += "<p><b>Departamento Recursos Humanos</b></p>";

                AddEmailToQueue(Email, Subject, html);
            }
            catch
            {

            }
        }

        public static void EdicionPerfil(string Email, string Url = "")
        {
            string html = "";
            try
            {
                string Subject = "Tu cuenta ha sido actualizada en Empleos BAC Credomatic";

                html += "<p>Has solicitado un cambio de contraseña.</p>";
                html += "<p>La información de tu cuenta en el sitio de Empleos BAC Credomatic ha sido actualizada con éxito. Puedes ingresar a tu perfil en el siguiente enlace: <a href='https://empleosbaccredomatic.com/'></a></p>";
                html += "<p>Estamos en contacto,</p><br/>";
                html += "<p><img style='width: 100px; height: 35px;' src='https://s3.us-east-2.amazonaws.com/bac-rrhh-test/s3fs-public/uploads/bac_4e9c31ea-5070-4b31-b7d8-6c7c10e75832.png'></img></p>";
                html += "<p><b>Departamento Recursos Humanos</b></p>";

                AddEmailToQueue(Email, Subject, html);
            }
            catch
            {

            }
        }

        public static void ConfirmacionAplicacionPuesto(string Email,string NombrePuesto, string Url = "")
        {
            string html = "";
            try
            {
                string Subject = "Aplicaste al Puesto "+ NombrePuesto + " en Empleos BAC Credomatic ";

                html += "<p>¡Has aplicado correctamente al puesto: "+ NombrePuesto + "!.</p>";
                html += "<p>Nuestro equipo de reclutamiento analizará los perfiles recibidos con detenimiento. En caso de ser pre-seleccionado te estaremos contacto.</p>";
                html += "<p>Para conocer un poco más de la cultura de BAC Credomatic te invitamos a leer nuestro blog, donde puedes encontrar casos de éxito, historias de nuestros colaborares y más detalles que nos caracterizan. <a href='https://empleosbaccredomatic.com/historias'>Link al blog</a></p><br/>";
                html += "<p>Saludos,</p><br/>";
                html += "<p><img style='width: 100px; height: 35px;' src='https://s3.us-east-2.amazonaws.com/bac-rrhh-test/s3fs-public/uploads/bac_4e9c31ea-5070-4b31-b7d8-6c7c10e75832.png'></img></p>";
                html += "<p><b>Departamento Recursos Humanos</b></p>";

                AddEmailToQueue(Email, Subject, html);
            }
            catch(Exception ex)
            {

            }
        }

        public static void PuestoCerrado(string Email, string NombrePuesto,string NombreAplicante ,string Url = "")
        {
            string html = "";
            try
            {
                string Subject = "Gracias por aplicar - Empleos BAC Credomatic ";

                html += "<p>Hola " + NombreAplicante + "</p>";
                html += "<p>Agradecemos tu interés en aplicar al puesto" +NombrePuesto+", sin embargo este puesto ya no se encuentra activo en nuestra plataforma.</p>";
                html += "<p>Puedes encontrar más puestos disponibles en nuestro sitio <a href='https://empleosbaccredomatic.com/puestos'></a></p>";
                html += "<p>Saludos,</p><br/>";
                html += "<p><img style='width: 100px; height: 35px;' src='https://s3.us-east-2.amazonaws.com/bac-rrhh-test/s3fs-public/uploads/bac_4e9c31ea-5070-4b31-b7d8-6c7c10e75832.png'></img></p>";
                html += "<p><b>Departamento Recursos Humanos</b></p>";

                AddEmailToQueue(Email, Subject, html);
            }
            catch
            {

            }
        }

        public static void SolicitudEntrevistaEnVivo(string Email, string NombreAplicante,string Fecha,string Hora, string Url = "")
        {
            string html = "";
            try
            {
                string Subject = "Entrevista en Vivo - BAC Credomatic";

                html += "<p>¡Hola " + NombreAplicante + "!</p>";
                html += "<p>Te invitamos a realizar una entrevista en vivo con uno de nuestros reclutadores.</p>";
                html += "<h4>Detalles de la entrevista<h4>";
                html += "<p>";
                html += "Fecha: "+ Fecha + "<br/>";
                html += "Hora: "+Hora+" <br/>";
                html += "URL de ingreso: "+ Url + " <br/>";
                html += "</p>";
                html += "<p><b>Para confirmar tu participación en la entrevista virtual ingresa a tu cuenta y acepta la solicitud.</b> En caso de no poder tomar la entrevista de igual forma en tu perfil puedes rechazar la solicitud y así uno de nuestros reclutadores puede reprogramar una nueva fecha. </p>";
                html += "<p>Recomendación: Te recordamos que las entrevistas virtuales son igual de importantes que una presencial por eso cuida tu presentación personal y prepárate para mostrar lo mejor de tu perfil.</p>";
                html += "<p>Saludos,</p>";
                html += "<p><img style='width: 100px; height: 35px;' src='https://s3.us-east-2.amazonaws.com/bac-rrhh-test/s3fs-public/uploads/bac_4e9c31ea-5070-4b31-b7d8-6c7c10e75832.png'></img></p>";
                html += "<p><b>Departamento Recursos Humanos</b></p>";

                AddEmailToQueue(Email, Subject, html);
            }
            catch
            {

            }
        }


        public static void ReagendarEntrevistaEnVivo(string Email, string NombreAplicante, string Fecha, string Hora, string Url = "")
        {
            string html = "";
            try
            {
                string Subject = "Se ha reagendado la Entrevista en Vivo - BAC Credomatic";

                html += "<p>¡Hola " + NombreAplicante + "!</p>";
                html += "<p>Se ha reagendado la entrevista solicitada al reclutador.</p>";
                html += "<h4>Detalles del cambio entrevista<h4>";
                html += "<p>";
                html += "Fecha: " + Fecha + "<br/>";
                html += "Hora: " + Hora + " <br/>";
                html += "URL de ingreso: " + Url + " <br/>";
                html += "</p>";
                html += "<p>Recomendación: Te recordamos que las entrevistas virtuales son igual de importantes que una presencial por eso cuida tu presentación personal y prepárate para mostrar lo mejor de tu perfil.</p>";
                html += "<p>Saludos,</p>";
                html += "<p><img style='width: 100px; height: 35px;' src='https://s3.us-east-2.amazonaws.com/bac-rrhh-test/s3fs-public/uploads/bac_4e9c31ea-5070-4b31-b7d8-6c7c10e75832.png'></img></p>";
                html += "<p><b>Departamento Recursos Humanos</b></p>";

                AddEmailToQueue(Email, Subject, html);
            }
            catch
            {

            }
        }

        public static void RechazoAplicanteEntrevistaEnVivo(string Email, string NombreAplicante, string NombreReclutador,string Url = "")
        {
            string html = "";
            try
            {
                string Subject = "Entrevista en Vivo de "+ NombreAplicante + "fue Rechazada";

                html += "<p>¡Hola " + NombreReclutador + "!</p>";
                html += "<p>La entrevista en vivo solicitada para el aplicante: "+ NombreAplicante + " fue rechaza. Para reprogramar la entrevista debes ingresar a su perfil y solicitar la entrevista con una nueva fecha. </p>";
                html += "<p>Ingreso a la plataforma de empleos: <a href='empleosbaccredomatic.com'></a></p>";
                html += "<p>Saludos,</p>";
                html += "<p><img style='width: 100px; height: 35px;' src='https://s3.us-east-2.amazonaws.com/bac-rrhh-test/s3fs-public/uploads/bac_4e9c31ea-5070-4b31-b7d8-6c7c10e75832.png'></img></p>";
                html += "<p><b>Departamento Recursos Humanos</b></p>";

                AddEmailToQueue(Email, Subject, html);
            }
            catch
            {

            }
        }

        public static void AceptacionAplicanteEntrevistaEnVivos(string Email, string NombreAplicante, string NombreReclutador, string Fecha, string Hora, string Url = "")
        {
            string html = "";
            try
            {
                string Subject = "Entrevista en Vivo de "+ NombreAplicante + " fue Aceptada";

                html += "<p>¡Hola " + NombreReclutador + "!</p>";
                html += "<p>La entrevista en vivo solicitada para el aplicante: "+ NombreAplicante + " fue aceptada.</p>";
                html += "<h4>Detalles de la entrevista<h4>";
                html += "<p>";
                html += "Fecha: " + Fecha + "<br/>";
                html += "Hora: " + Hora + " <br/>";
                html += "URL de ingreso: " + Url + " <br/>";
                html += "</p>";             
                html += "<p>Saludos,</p>";
                html += "<p><img style='width: 100px; height: 35px;' src='https://s3.us-east-2.amazonaws.com/bac-rrhh-test/s3fs-public/uploads/bac_4e9c31ea-5070-4b31-b7d8-6c7c10e75832.png'></img></p>";
                html += "<p><b>Departamento Recursos Humanos</b></p>";

                AddEmailToQueue(Email, Subject, html);
            }
            catch
            {

            }
        }

        public static void AceptacionAplicanteEntrevistaPregrabada(string Email, string NombreAplicante, string NombreReclutador, string Fecha, string Url = "")
        {
            string html = "";
            try
            {
                string Subject = "Entrevista Pregrabada de " + NombreAplicante + " fue Aceptada";

                html += "<p>¡Hola " + NombreReclutador + "!</p>";
                html += "<p>La entrevista pregrabada solicitada para el aplicante: " + NombreAplicante + " fue aceptada.</p>";
                html += "<h4>Detalles de la entrevista<h4>";
                html += "<p>";
                html += "Fecha: " + Fecha + "<br/>";
                html += "URL de ingreso: " + Url + " <br/>";
                html += "</p>";
                html += "<p>Saludos,</p>";
                html += "<p><img style='width: 100px; height: 35px;' src='https://s3.us-east-2.amazonaws.com/bac-rrhh-test/s3fs-public/uploads/bac_4e9c31ea-5070-4b31-b7d8-6c7c10e75832.png'></img></p>";
                html += "<p><b>Departamento Recursos Humanos</b></p>";

                AddEmailToQueue(Email, Subject, html);
            }
            catch
            {

            }
        }


        public static void SolicitudEntrevistaPregrabada(string Email, string NombreAplicante, string NombreReclutador,string NombrePuesto , string Fecha, string Url = "")
        {
            string html = "";
            try
            {
                string Subject = "Entrevista en Pregrabada - BAC Credomatic";

                html += "<p>¡Hola " + NombreAplicante + "!</p>";
                html += "<p>Como parte del proceso de reclutamiento para la posición de "+ NombrePuesto + ", agradecemos nos contestes las preguntas que se te harán de forma virtual. </p>";
                html += "<p>Para contestar las preguntas debes ingresar a nuestra plataforma y seguir los pasos que se te indicarán.</p>";
                html += "<h4>Detalles de la entrevista pregrabada<h4>";
                html += "<p>";
                html += "Fecha: " + Fecha + "<br/>";
                html += "URL de ingreso: " + Url + " <br/>";
                html += "</p>";
                html += "<h4>Consideraciones<h4>";
                html += "<p>Te recordamos que las entrevistas virtuales son igual de importantes que una presencial por eso cuida tu presentación personal y prepárate para mostrar lo mejor de tu perfil. </p>";
                html += "<p>Tienes un tiempo límite antes de contestar cada pregunta. Una vez que se inicie el tiempo para responder aprovéchalo, ya que no podrás re-grabar tus respuestas. </p>";
                html += "<p>Mucha suerte,</p>";
                html += "<p><img style='width: 100px; height: 35px;' src='https://s3.us-east-2.amazonaws.com/bac-rrhh-test/s3fs-public/uploads/bac_4e9c31ea-5070-4b31-b7d8-6c7c10e75832.png'></img></p>";
                html += "<p><b>Departamento Recursos Humanos</b></p>";

                AddEmailToQueue(Email, Subject, html);
            }
            catch
            {

            }
        }


        public static void RechazoEntrevistaPregrabada(string Email, string NombreAplicante, string NombreReclutador, string NombrePuesto)
        {
            string html = "";
            try
            {
                string Subject = "Entrevista Pregrabada de" + NombreAplicante + "fue Rechazada";

                html += "<p>¡Hola " + NombreReclutador + "!</p>";
                html += "<p>La solicitud de entrevista pregrabada del aplicante: "+ NombreAplicante + " quien aplicó al puesto "+ NombrePuesto + " fue rechaza. Para volver a solicitar una entrevista debes ingresar a su perfil y solicitar nuevamente una entrevista.</p>";
                html += "<p>Ingreso a la plataforma de empleos: <a href='empleosbaccredomatic.com'></a></p>";
                html += "<p>Saludos,</p>";
                html += "<p><img style='width: 100px; height: 35px;' src='https://s3.us-east-2.amazonaws.com/bac-rrhh-test/s3fs-public/uploads/bac_4e9c31ea-5070-4b31-b7d8-6c7c10e75832.png'></img></p>";
                html += "<p><b>Departamento Recursos Humanos</b></p>";

                AddEmailToQueue(Email, Subject, html);
            }
            catch
            {

            }
        }

        public static void ConfirmacionEntrevistaPregrabada(string Email, string NombreAplicante, string NombreReclutador, string NombrePuesto, string Url = "")
        {
            string html = "";
            try
            {
                string Subject = "Entrevista Pregrabada de "+ NombreAplicante + " fue Completada";

                html += "<p>¡Hola " + NombreReclutador + "!</p>";
                html += "<p>La solicitud de entrevista pregrabada del aplicante: "+ NombreAplicante + " quien aplicó al puesto "+ NombrePuesto + " se completó con éxito. Para ver sus respuestas debes ingresar a su perfil. </p>";
                html += "<p>Ingreso a la plataforma de empleos: <a href='empleosbaccredomatic.com'></a></p>";
                html += "<p>Saludos,</p>";
                html += "<p><img style='width: 100px; height: 35px;' src='https://s3.us-east-2.amazonaws.com/bac-rrhh-test/s3fs-public/uploads/bac_4e9c31ea-5070-4b31-b7d8-6c7c10e75832.png'></img></p>";
                html += "<p><b>Departamento Recursos Humanos</b></p>";

                AddEmailToQueue(Email, Subject, html);
            }
            catch
            {

            }
        }
    }
}
