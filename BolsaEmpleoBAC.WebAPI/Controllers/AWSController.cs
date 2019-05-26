using BolsaEmpleoBAC.BL.Integrations.AWS;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;

namespace BolsaEmpleoBAC.WebAPI.Controllers
{
    [RoutePrefix("api/AWS")]
    public class AWSController : ApiController
    {
        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [Route("UploadFile")]
        [HttpPost]
        public Task<HttpResponseMessage> UploadFile()
        {

            List<string> savedFilePath = new List<string>();
            // Check if the request contains multipart/form-data
            if (!Request.Content.IsMimeMultipartContent())
            {
                throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);
            }
            //Get the path of folder where we want to upload all files.
            string path = @"C:\XMLs";
            //string path = AppDomain.CurrentDomain.BaseDirectory + "/App_Data/uploads/";
            var provider = new MultipartFileStreamProvider(path);
            // Read the form data.
            //If any error(Cancelled or any fault) occurred during file read , return internal server error
            var task = Request.Content.ReadAsMultipartAsync(provider).
                ContinueWith<HttpResponseMessage>(t =>
                {
                    if (t.IsCanceled || t.IsFaulted)
                    {
                        Request.CreateErrorResponse(HttpStatusCode.InternalServerError, t.Exception);
                    }
                    foreach (MultipartFileData dataitem in provider.FileData)
                    {
                        try
                        {
                            //Replace / from file name
                            string name = dataitem.Headers.ContentDisposition.FileName.Replace("\"", "");
                            //Create New file name using GUID to prevent duplicate file name
                            //save extention and validate
                            var extention = Path.GetExtension(name);
                            var filename = Path.GetFileNameWithoutExtension(name);

                            string newFileName = Guid.NewGuid() + Path.GetExtension(name);
                            //Move file from current location to target folder.
                            //create a new location file
                            var newPathFile = Path.Combine(path, newFileName);
                            File.Move(dataitem.LocalFileName, newPathFile);

                            string s3FileName = @filename;
                            string url = AWSManager.SendMyFileToS3(path, newFileName);

                            savedFilePath.Add(url);
                        }
                        catch (Exception ex)
                        {
                            string message = ex.Message;
                            return Request.CreateResponse(HttpStatusCode.BadRequest, message);
                        }
                    }
                    return Request.CreateResponse(HttpStatusCode.OK, savedFilePath);
                });
            return task;
        }
    }
}
