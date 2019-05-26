using BolsaEmpleoBAC.BL.DTO;
using BolsaEmpleoBAC.BL.Integrations.LinkedIn;
using BolsaEmpleoBAC.BL.Logic;
using BolsaEmpleoBAC.General.Validaciones;
using Newtonsoft.Json;
using SelectPdf;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace BolsaEmpleoBAC.UI.Controllers
{
    public class PostulanteController : ParentController
    {
        [NavegacionManager(IdNavegacion = 24)]
        public ActionResult MiPerfil()
        {
            return View();
        }

        public ActionResult RegistroPostulante(string code, string state)
        {
            try
            {
                ViewBag.SessionState = ValidateSession();
                if (string.IsNullOrEmpty(code) && string.IsNullOrEmpty(state))
                {
                    ViewBag.JsonNombreCompleto = "undefined";
                }
                else
                {
                    DTOLinkedInInfo obj = LinkedInManager.LinkedInAuth(code, state);
                    ViewBag.JsonNombreCompleto = string.Format("{0} {1}", obj.firstName, obj.lastName);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message) { Source = ex.Source };
            }
            return View();
        }

        [NavegacionManager(IdNavegacion = 82)]
        public ActionResult CompartirPerfil()
        {
            ViewBag.SessionState = ValidateSession();
            return View();
        }

        [NavegacionManager(IdNavegacion = 40)]
        public ActionResult VerPostulantes()
        {
            ViewBag.SessionState = ValidateSession();
            return View();
        }

        [NavegacionManager(IdNavegacion = 21)]
        public ActionResult VerPerfil()
        {
            ViewBag.SessionState = ValidateSession();
            return View();
        }

        public ActionResult VerPerfilAnonimo()
        {
            ViewBag.SessionState = ValidateSession();
            return View();
        }

        public ActionResult Error()
        {
            return View();
        }

        [NavegacionManager(IdNavegacion = 41)]
        public ActionResult PerfilDescargar(string email)
        {
            try
            {
                string baseUrl = Request.Url.Scheme + "://" + Request.Url.Authority + Request.ApplicationPath.TrimEnd('/') + "/";

                var postulanteManager = new DTOPostulanteManager();

                string pdf_page_size = "A4";
                PdfPageSize pageSize =
                    (PdfPageSize)Enum.Parse(typeof(PdfPageSize), pdf_page_size, true);

                string pdf_orientation = "Portrait";
                PdfPageOrientation pdfOrientation =
                    (PdfPageOrientation)Enum.Parse(typeof(PdfPageOrientation),
                    pdf_orientation, true);

                int webPageWidth = 1024;

                int webPageHeight = 0;
                // instantiate a html to pdf converter object
                HtmlToPdf converter = new HtmlToPdf();

                // set converter options
                converter.Options.PdfPageSize = pageSize;
                converter.Options.PdfPageOrientation = pdfOrientation;
                converter.Options.WebPageWidth = webPageWidth;
                converter.Options.WebPageHeight = webPageHeight;
                converter.Options.MinPageLoadTime = 1;

                //// set the page timeout
                converter.Options.MaxPageLoadTime = 30;

                converter.Options.ExternalLinksEnabled = true;
                converter.Options.JavaScriptEnabled = true;
                converter.Options.JpegCompressionEnabled = true;
                //converter.Options.RenderPageOnTimeout = true;

                // create a new pdf document converting an url

                PdfDocument doc = converter.ConvertHtmlString(postulanteManager.Descargar(email,baseUrl));//.ConvertUrl(url);

                // save pdf document
                byte[] pdf = doc.Save();

                // close pdf document
                doc.Close();

                // return resulted pdf document
                FileResult fileResult = new FileContentResult(pdf, "application/pdf");
                fileResult.FileDownloadName = string.Format("{0}.pdf", email);
                return fileResult;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}