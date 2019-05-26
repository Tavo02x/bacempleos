// Decompiled with JetBrains decompiler
// Type: AndcultureCode.ZoomClient.ZoomClient
// Assembly: AndcultureCode.ZoomClient, Version=1.0.17.0, Culture=neutral, PublicKeyToken=null
// MVID: 17CE22F4-AACB-40F0-A40B-481263D3D4EF
// Assembly location: C:\Users\gustavo.solano\Downloads\AndcultureCode.ZoomClient.dll

using AndcultureCode.ZoomClient.Interfaces;
using AndcultureCode.ZoomClient.Models;
using RestSharp;
using System;

namespace AndcultureCode.ZoomClient
{
  public class ZoomClient : IZoomClient
  {
    protected const string BASE_URL = "https://api.zoom.us/v2/";

    private ZoomClientOptions Options { get; }

    private RestClient WebClient { get; }

    public IZoomGroupsClient Groups { get; }

    public IZoomMeetingsClient Meetings { get; }

    public IZoomReportsClient Reports { get; }

    public IZoomUsersClient Users { get; }

    public IZoomWebhookClient Webhooks { get; }

    public ZoomClient(ZoomClientOptions options)
    {
      if (options == null)
        throw new Exception("No options provided for zoom client");
      if (string.IsNullOrWhiteSpace(options.ZoomApiKey))
        throw new Exception("No api key provided for zoom client");
      if (string.IsNullOrWhiteSpace(options.ZoomApiSecret))
        throw new Exception("No api secret provided for zoom client");
      this.Options = options;
      if (string.IsNullOrWhiteSpace(this.Options.ZoomApiBaseUrl))
        this.Options.ZoomApiBaseUrl = "https://api.zoom.us/v2/";
      this.WebClient = new RestClient(options.ZoomApiBaseUrl);
      this.Groups = (IZoomGroupsClient) new ZoomGroupsClient(this.Options, this.WebClient);
      this.Meetings = (IZoomMeetingsClient) new ZoomMeetingsClient(this.Options, this.WebClient);
      this.Reports = (IZoomReportsClient) new ZoomReportsClient(this.Options, this.WebClient);
      this.Users = (IZoomUsersClient) new ZoomUsersClient(this.Options, this.WebClient);
      this.Webhooks = (IZoomWebhookClient) new ZoomWebhookClient(this.Options, this.WebClient);
    }
  }
}
