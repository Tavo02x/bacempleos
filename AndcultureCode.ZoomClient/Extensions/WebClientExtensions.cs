// Decompiled with JetBrains decompiler
// Type: AndcultureCode.ZoomClient.Extensions.WebClientExtensions
// Assembly: AndcultureCode.ZoomClient, Version=1.0.17.0, Culture=neutral, PublicKeyToken=null
// MVID: 17CE22F4-AACB-40F0-A40B-481263D3D4EF
// Assembly location: C:\Users\gustavo.solano\Downloads\AndcultureCode.ZoomClient.dll

using AndcultureCode.ZoomClient.Models;
using Jose;
using RestSharp;
using RestSharp.Authenticators;
using RestSharp.Serializers;
using System;
using System.Collections.Generic;
using System.Text;

namespace AndcultureCode.ZoomClient.Extensions
{
  public static class WebClientExtensions
  {
    public static RestRequest BuildRequestAuthorization(
      this RestClient webClient,
      ZoomClientOptions options,
      string resource,
      Method method)
    {
      RestRequest restRequest = new RestRequest(resource, method);
      Dictionary<string, object> dictionary = new Dictionary<string, object>()
      {
        {
          "iss",
          (object) options.ZoomApiKey
        },
        {
          "exp",
          (object) new DateTimeOffset(DateTime.UtcNow.AddMinutes(90.0)).ToUnixTimeSeconds()
        }
      };
      webClient.Authenticator =((IAuthenticator) new JwtAuthenticator(JWT.Encode((object) dictionary, (object) Encoding.UTF8.GetBytes(options.ZoomApiSecret), (JwsAlgorithm) 1, (IDictionary<string, object>) null, (JwtSettings) null)));
      restRequest.JsonSerializer =((ISerializer) new NewtonsoftJsonSerializer());
      return restRequest;
    }
  }
}
