using Newtonsoft.Json;
using System;
using System.Net.Http.Formatting;
using System.Net.Http.Headers;

namespace BolsaEmpleoBAC.WebAPI.Utils
{
    public class JSONFormatter : JsonMediaTypeFormatter
    {
        public JSONFormatter()
        {
            this.SupportedMediaTypes.Add(new MediaTypeHeaderValue("text/html"));
            this.SerializerSettings.Formatting = Formatting.Indented;
        }

        public override void SetDefaultContentHeaders(Type type, HttpContentHeaders headers, MediaTypeHeaderValue mediaType)
        {
            base.SetDefaultContentHeaders(type, headers, mediaType);
            headers.ContentType = new MediaTypeHeaderValue("application/json");
        }

    }
}