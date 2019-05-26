// Decompiled with JetBrains decompiler
// Type: AndcultureCode.ZoomClient.ZoomReportsClient
// Assembly: AndcultureCode.ZoomClient, Version=1.0.17.0, Culture=neutral, PublicKeyToken=null
// MVID: 17CE22F4-AACB-40F0-A40B-481263D3D4EF
// Assembly location: C:\Users\gustavo.solano\Downloads\AndcultureCode.ZoomClient.dll

using AndcultureCode.ZoomClient.Extensions;
using AndcultureCode.ZoomClient.Interfaces;
using AndcultureCode.ZoomClient.Models;
using AndcultureCode.ZoomClient.Models.Reports;
using RestSharp;
using System;
using System.Net;

namespace AndcultureCode.ZoomClient
{
  public class ZoomReportsClient : IZoomReportsClient
  {
    protected const string GET_MEETING_PARTICIPANTS = "report/meetings/{meetingId}/participants";

    protected ZoomClientOptions Options { get; set; }

    protected RestClient WebClient { get; set; }

    internal ZoomReportsClient(ZoomClientOptions options, RestClient webClient)
    {
      this.Options = options;
      this.WebClient = webClient;
    }

    public MeetingParticipantsReport GetMeetingParticipantsReport(
      string meetingId,
      int pageSize = 30,
      string nextPageToken = null)
    {
      if (pageSize > 300)
        throw new Exception("GetMeetingParticipantsReport page size max 300");
      RestRequest restRequest = this.BuildRequestAuthorization("report/meetings/{meetingId}/participants", (Method) 0);
      restRequest.AddParameter(nameof (meetingId), (object) meetingId, (ParameterType) 2);
      restRequest.AddParameter("page_size", (object) pageSize, (ParameterType) 5);
      if (!string.IsNullOrWhiteSpace(nextPageToken))
        restRequest.AddParameter("next_page_token", (object) nextPageToken, (ParameterType) 5);
      IRestResponse<MeetingParticipantsReport> irestResponse = (IRestResponse<MeetingParticipantsReport>) this.WebClient.Execute<MeetingParticipantsReport>((IRestRequest) restRequest);
      if (((IRestResponse) irestResponse).get_ResponseStatus() == 1 && ((IRestResponse) irestResponse).get_StatusCode() == HttpStatusCode.OK)
        return irestResponse.get_Data();
      if (!string.IsNullOrWhiteSpace(((IRestResponse) irestResponse).get_ErrorMessage()))
        throw new Exception(((IRestResponse) irestResponse).get_ErrorMessage());
      if (!string.IsNullOrWhiteSpace(((IRestResponse) irestResponse).get_StatusDescription()) && !string.IsNullOrWhiteSpace(((IRestResponse) irestResponse).get_Content()))
        throw new Exception(((IRestResponse) irestResponse).get_StatusDescription() + " || " + ((IRestResponse) irestResponse).get_Content());
      return (MeetingParticipantsReport) null;
    }

    private RestRequest BuildRequestAuthorization(string resource, Method method)
    {
      return this.WebClient.BuildRequestAuthorization(this.Options, resource, method);
    }
  }
}
