// Decompiled with JetBrains decompiler
// Type: RestSharp.Serializers.NewtonsoftJsonSerializer
// Assembly: AndcultureCode.ZoomClient, Version=1.0.17.0, Culture=neutral, PublicKeyToken=null
// MVID: 17CE22F4-AACB-40F0-A40B-481263D3D4EF
// Assembly location: C:\Users\gustavo.solano\Downloads\AndcultureCode.ZoomClient.dll

using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System.IO;

namespace RestSharp.Serializers
{
  public class NewtonsoftJsonSerializer : ISerializer
  {
    private readonly JsonSerializer _serializer;

    public NewtonsoftJsonSerializer()
    {
      this.ContentType = "application/json";
      JsonSerializer jsonSerializer = new JsonSerializer();
      jsonSerializer.set_MissingMemberHandling((MissingMemberHandling) 0);
      jsonSerializer.set_NullValueHandling((NullValueHandling) 0);
      jsonSerializer.set_DefaultValueHandling((DefaultValueHandling) 0);
      DefaultContractResolver contractResolver = new DefaultContractResolver();
      contractResolver.set_NamingStrategy((NamingStrategy) new SnakeCaseNamingStrategy());
      jsonSerializer.set_ContractResolver((IContractResolver) contractResolver);
      this._serializer = jsonSerializer;
    }

    public NewtonsoftJsonSerializer(JsonSerializer serializer)
    {
      this.ContentType = "application/json";
      this._serializer = serializer;
    }

    public string Serialize(object obj)
    {
      using (StringWriter stringWriter = new StringWriter())
      {
        using (JsonTextWriter jsonTextWriter = new JsonTextWriter((TextWriter) stringWriter))
        {
          ((JsonWriter) jsonTextWriter).set_Formatting((Formatting) 1);
          jsonTextWriter.set_QuoteChar('"');
          this._serializer.Serialize((JsonWriter) jsonTextWriter, obj);
          return stringWriter.ToString();
        }
      }
    }

    public string DateFormat { get; set; }

    public string RootElement { get; set; }

    public string Namespace { get; set; }

    public string ContentType { get; set; }
  }
}
