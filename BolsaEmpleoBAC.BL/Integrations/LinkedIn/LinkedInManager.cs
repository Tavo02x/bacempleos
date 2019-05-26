using BolsaEmpleoBAC.BL.DTO;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace BolsaEmpleoBAC.BL.Integrations.LinkedIn
{
    public class LinkedInManager
    {
        public static DTOLinkedInInfo LinkedInAuth(string code, string state)
        {
            var client = new RestClient("https://www.linkedin.com/oauth/v2/accessToken");
            var request = new RestRequest(Method.POST);
            request.AddParameter("grant_type", "authorization_code");
            request.AddParameter("code", code);
            request.AddParameter("redirect_uri", "http://localhost:1981/Postulante/RegistroPostulante/");//"http://localhost:1981/LinkedIn/LinkedINAuth/");
            request.AddParameter("client_id", ConfigurationManager.AppSettings["LinkedInAccessKey"].ToString());
            request.AddParameter("client_secret", ConfigurationManager.AppSettings["LinkedInSecretKey"].ToString());
            IRestResponse response = client.Execute(request);
            var content = response.Content;
            //Get Profile Details  
            DTOLinkedInAccess linkedINVM = JsonConvert.DeserializeObject<DTOLinkedInAccess>(content);
            client = new RestClient("https://api.linkedin.com/v1/people/~?oauth2_access_token=" + linkedINVM.access_token + "&format=json");
            request = new RestRequest(Method.GET);
            response = client.Execute(request);
            content = response.Content;

            DTOLinkedInInfo infoResponse = JsonConvert.DeserializeObject<DTOLinkedInInfo>(content);

            return infoResponse;
        }
    }
}
