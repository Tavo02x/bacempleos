// Decompiled with JetBrains decompiler
// Type: AndcultureCode.ZoomClient.ZoomWebhookClient
// Assembly: AndcultureCode.ZoomClient, Version=1.0.17.0, Culture=neutral, PublicKeyToken=null
// MVID: 17CE22F4-AACB-40F0-A40B-481263D3D4EF
// Assembly location: C:\Users\gustavo.solano\Downloads\AndcultureCode.ZoomClient.dll

using AndcultureCode.ZoomClient.Extensions;
using AndcultureCode.ZoomClient.Interfaces;
using AndcultureCode.ZoomClient.Models;
using AndcultureCode.ZoomClient.Models.Webhooks;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Net;

namespace AndcultureCode.ZoomClient
{
  public class ZoomWebhookClient : IZoomWebhookClient
  {
    private const string DELETE_WEBHOOK = "webhooks/{webhookId}";
    private const string GET_LIST_WEBHOOKS = "webhooks";
    private const string GET_WEBHOOK = "webhooks/{webhookId}";
    private const string PATCH_WEBHOOK = "webhooks/{webhookId}";
    private const string POST_CREATE_WEBHOOK = "webhooks";

    private ZoomClientOptions Options { get; set; }

    private RestClient WebClient { get; set; }

    internal ZoomWebhookClient(ZoomClientOptions options, RestClient webClient)
    {
      this.Options = options;
      this.WebClient = webClient;
    }

    public ListWebhooks GetWebhooks()
    {
      IRestResponse<ListWebhooks> irestResponse = (IRestResponse<ListWebhooks>) this.WebClient.Execute<ListWebhooks>((IRestRequest) this.BuildRequestAuthorization("webhooks", (Method) 0));
      if (((IRestResponse) irestResponse).ResponseStatus == ResponseStatus.Completed && ((IRestResponse) irestResponse).StatusCode == HttpStatusCode.OK)
        return irestResponse.Data;
      if (!string.IsNullOrWhiteSpace(((IRestResponse) irestResponse).ErrorMessage))
        throw new Exception(((IRestResponse) irestResponse).ErrorMessage);
      if (!string.IsNullOrWhiteSpace(((IRestResponse) irestResponse).Content) && !string.IsNullOrWhiteSpace(((IRestResponse) irestResponse).Content))
        throw new Exception(((IRestResponse) irestResponse).Content + " || " + ((IRestResponse) irestResponse).Content);
      return (ListWebhooks) null;
    }

    public Webhook CreateWebhook(CreateWebhook createWebhook)
    {
      List<string> stringList = createWebhook.Validate();
      if (stringList.Count > 0)
        throw new Exception("CreateWebhook request does not pass validation. " + string.Join(" :: ", (IEnumerable<string>) stringList));
      RestRequest restRequest = this.BuildRequestAuthorization("webhooks", (Method) 1);
      restRequest.AddJsonBody((object) createWebhook);
      IRestResponse<Webhook> irestResponse = (IRestResponse<Webhook>) this.WebClient.Execute<Webhook>((IRestRequest) restRequest);
      if (((IRestResponse) irestResponse).ResponseStatus == ResponseStatus.Completed && ((IRestResponse) irestResponse).StatusCode == HttpStatusCode.Created)
        return irestResponse.Data;
      if (!string.IsNullOrWhiteSpace(((IRestResponse) irestResponse).ErrorMessage))
        throw new Exception(((IRestResponse) irestResponse).ErrorMessage);
      if (!string.IsNullOrWhiteSpace(((IRestResponse) irestResponse).Content) && !string.IsNullOrWhiteSpace(((IRestResponse) irestResponse).Content))
        throw new Exception(((IRestResponse) irestResponse).Content + " || " + ((IRestResponse) irestResponse).Content);
      return (Webhook) null;
    }

    public Webhook GetWebhook(string webhookId)
    {
      RestRequest restRequest = this.BuildRequestAuthorization("webhooks/{webhookId}", (Method) 0);
      restRequest.AddParameter(nameof (webhookId), (object) webhookId, (ParameterType) 2);
      IRestResponse<Webhook> irestResponse = (IRestResponse<Webhook>) this.WebClient.Execute<Webhook>((IRestRequest) restRequest);
      if (((IRestResponse) irestResponse).ResponseStatus == ResponseStatus.Completed && ((IRestResponse) irestResponse).StatusCode == HttpStatusCode.OK)
        return irestResponse.Data;
      if (!string.IsNullOrWhiteSpace(((IRestResponse) irestResponse).ErrorMessage))
        throw new Exception(((IRestResponse) irestResponse).ErrorMessage);
      if (!string.IsNullOrWhiteSpace(((IRestResponse) irestResponse).Content) && !string.IsNullOrWhiteSpace(((IRestResponse) irestResponse).Content))
        throw new Exception(((IRestResponse) irestResponse).Content + " || " + ((IRestResponse) irestResponse).Content);
      return (Webhook) null;
    }

    public bool UpdateWebhook(string webhookId, UpdateWebhook webhook)
    {
      RestRequest restRequest = this.BuildRequestAuthorization("webhooks/{webhookId}", (Method) 6);
      restRequest.AddParameter(nameof (webhookId), (object) webhookId, (ParameterType) 2);
      restRequest.AddJsonBody((object) webhook);
      IRestResponse irestResponse = this.WebClient.Execute((IRestRequest) restRequest);
      if (irestResponse.ResponseStatus == ResponseStatus.Completed && irestResponse.StatusCode == HttpStatusCode.NoContent)
        return true;
      if (!string.IsNullOrWhiteSpace(irestResponse.ErrorMessage))
        throw new Exception(irestResponse.ErrorMessage);
      if (!string.IsNullOrWhiteSpace(irestResponse.Content) && !string.IsNullOrWhiteSpace(irestResponse.Content))
        throw new Exception(irestResponse.Content + " || " + irestResponse.Content);
      return false;
    }

    public bool DeleteWebhook(string webhookId)
    {
      RestRequest restRequest = this.BuildRequestAuthorization("webhooks/{webhookId}", (Method) 3);
      restRequest.AddParameter(nameof (webhookId), (object) webhookId, (ParameterType) 2);
      IRestResponse irestResponse = this.WebClient.Execute((IRestRequest) restRequest);
      if (irestResponse.ResponseStatus == ResponseStatus.Completed && irestResponse.StatusCode == HttpStatusCode.NoContent)
        return true;
      if (!string.IsNullOrWhiteSpace(irestResponse.ErrorMessage))
        throw new Exception(irestResponse.ErrorMessage);
      if (!string.IsNullOrWhiteSpace(irestResponse.Content) && !string.IsNullOrWhiteSpace(irestResponse.Content))
        throw new Exception(irestResponse.Content + " || " + irestResponse.Content);
      return false;
    }

    private RestRequest BuildRequestAuthorization(string resource, Method method)
    {
      return this.WebClient.BuildRequestAuthorization(this.Options, resource, method);
    }
  }
}
