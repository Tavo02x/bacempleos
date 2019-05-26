// Decompiled with JetBrains decompiler
// Type: AndcultureCode.ZoomClient.ZoomMeetingsClient
// Assembly: AndcultureCode.ZoomClient, Version=1.0.17.0, Culture=neutral, PublicKeyToken=null
// MVID: 17CE22F4-AACB-40F0-A40B-481263D3D4EF
// Assembly location: C:\Users\gustavo.solano\Downloads\AndcultureCode.ZoomClient.dll

using AndcultureCode.ZoomClient.Extensions;
using AndcultureCode.ZoomClient.Interfaces;
using AndcultureCode.ZoomClient.Models;
using AndcultureCode.ZoomClient.Models.Meetings;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Net;

namespace AndcultureCode.ZoomClient
{
  public class ZoomMeetingsClient : IZoomMeetingsClient
  {
    private const string DELETE_MEETING = "meetings/{meetingId}";
    private const string GET_MEETING = "meetings/{meetingId}";
    private const string GET_LIST_MEETINGS = "users/{userId}/meetings";
    private const string GET_MEETING_REGISTRANTS = "meetings/{meetingId}/registrants";
    private const string PATCH_MEETING = "meetings/{meetingId}";
    private const string PATCH_MEETING_REGISTRANTS = "meetings/{meetingId}/registrants";
    private const string POST_MEETING = "users/{userId}/meetings";
    private const string POST_MEETING_REGISTRANTS = "meetings/{meetingId}/registrants";
    private const string POST_MEETING_REGISTRANTS_STATUS = "meetings/{meetingId}/registrants/status";
    private const string PUT_MEETING = "meetings/{meetingId}/status";
    private const string PUT_MEETING_REGISTRANTS = "meetings/{meetingId}/registrants";

    private ZoomClientOptions Options { get; set; }

    private RestClient WebClient { get; set; }

    internal ZoomMeetingsClient(ZoomClientOptions options, RestClient webClient)
    {
      this.Options = options;
      this.WebClient = webClient;
    }

    public ListMeetings GetMeetings(
      string userId,
      MeetingListTypes type = MeetingListTypes.Live,
      int pageSize = 30,
      int pageNumber = 1)
    {
      if (pageSize > 300)
        throw new Exception("GetMeetings page size max 300");
      RestRequest restRequest = this.BuildRequestAuthorization("users/{userId}/meetings", (Method) 0);
      restRequest.AddParameter(nameof (userId), (object) userId, (ParameterType) 2);
      restRequest.AddParameter(nameof (type), (object) type.ToString().ToLowerInvariant(), (ParameterType) 5);
      restRequest.AddParameter("page_size", (object) pageSize, (ParameterType) 5);
      restRequest.AddParameter("page_number", (object) pageNumber, (ParameterType) 5);
      IRestResponse<ListMeetings> irestResponse = (IRestResponse<ListMeetings>) this.WebClient.Execute<ListMeetings>((IRestRequest) restRequest);
      if (((IRestResponse) irestResponse).ResponseStatus == ResponseStatus.Completed && ((IRestResponse) irestResponse).StatusCode == HttpStatusCode.OK)
        return irestResponse.Data;
      if (!string.IsNullOrWhiteSpace(((IRestResponse) irestResponse).ErrorMessage))
        throw new Exception(((IRestResponse) irestResponse).ErrorMessage);
      if (!string.IsNullOrWhiteSpace(((IRestResponse) irestResponse).StatusDescription) && !string.IsNullOrWhiteSpace(((IRestResponse) irestResponse).Content))
        throw new Exception(((IRestResponse) irestResponse).StatusDescription + " || " + ((IRestResponse) irestResponse).Content);
      return (ListMeetings) null;
    }

    public Meeting CreateMeeting(string userId, Meeting meeting)
    {
      RestRequest restRequest = this.BuildRequestAuthorization("users/{userId}/meetings", (Method) 1);
      restRequest.AddParameter(nameof (userId), (object) userId, (ParameterType) 2);
      restRequest.AddJsonBody((object) meeting);
      IRestResponse<Meeting> irestResponse = (IRestResponse<Meeting>) this.WebClient.Execute<Meeting>((IRestRequest) restRequest);
            if (irestResponse.ResponseStatus == ResponseStatus.Completed && ((IRestResponse)irestResponse).StatusCode == HttpStatusCode.Created)
            {
                return irestResponse.Data;
            }

            if (!string.IsNullOrWhiteSpace(((IRestResponse) irestResponse).ErrorMessage))
        throw new Exception(((IRestResponse) irestResponse).ErrorMessage);
      if (!string.IsNullOrWhiteSpace(((IRestResponse) irestResponse).StatusDescription) && !string.IsNullOrWhiteSpace(((IRestResponse) irestResponse).Content))
        throw new Exception(((IRestResponse) irestResponse).StatusDescription + " || " + ((IRestResponse) irestResponse).Content);
      return (Meeting) null;
    }

    public Meeting GetMeeting(string meetingId)
    {
      RestRequest restRequest = this.BuildRequestAuthorization("meetings/{meetingId}", (Method) 0);
      restRequest.AddParameter(nameof (meetingId), (object) meetingId, (ParameterType) 2);
      IRestResponse<Meeting> irestResponse = (IRestResponse<Meeting>) this.WebClient.Execute<Meeting>((IRestRequest) restRequest);
      if (((IRestResponse) irestResponse).ResponseStatus == ResponseStatus.Completed && ((IRestResponse) irestResponse).StatusCode == HttpStatusCode.OK)
        return irestResponse.Data;
      if (!string.IsNullOrWhiteSpace(((IRestResponse) irestResponse).ErrorMessage))
        throw new Exception(((IRestResponse) irestResponse).ErrorMessage);
      if (!string.IsNullOrWhiteSpace(((IRestResponse) irestResponse).StatusDescription) && !string.IsNullOrWhiteSpace(((IRestResponse) irestResponse).Content))
        throw new Exception(((IRestResponse) irestResponse).StatusDescription + " || " + ((IRestResponse) irestResponse).Content);
      return (Meeting) null;
    }

    public bool UpdateMeeting(string meetingId, Meeting meeting)
    {
      RestRequest restRequest = this.BuildRequestAuthorization("meetings/{meetingId}", (Method) 6);
      restRequest.AddParameter(nameof (meetingId), (object) meetingId, (ParameterType) 2);
      restRequest.AddJsonBody((object) meeting);
      IRestResponse irestResponse = this.WebClient.Execute((IRestRequest) restRequest);
      if (irestResponse.ResponseStatus == ResponseStatus.Completed && irestResponse.StatusCode == HttpStatusCode.NoContent)
        return true;
      if (!string.IsNullOrWhiteSpace(irestResponse.ErrorMessage))
        throw new Exception(irestResponse.ErrorMessage);
      if (!string.IsNullOrWhiteSpace(irestResponse.StatusDescription) && !string.IsNullOrWhiteSpace(irestResponse.Content))
        throw new Exception(irestResponse.StatusDescription + " || " + irestResponse.Content);
      return false;
    }

    public bool DeleteMeeting(string meetingId, string occurrenceId = null)
    {
      RestRequest restRequest = this.BuildRequestAuthorization("meetings/{meetingId}", (Method) 3);
      restRequest.AddParameter(nameof (meetingId), (object) meetingId, (ParameterType) 2);
      if (!string.IsNullOrWhiteSpace(occurrenceId))
        restRequest.AddParameter("occurrence_id", (object) occurrenceId, (ParameterType) 5);
      IRestResponse irestResponse = this.WebClient.Execute((IRestRequest) restRequest);
      if (irestResponse.ResponseStatus == ResponseStatus.Completed && irestResponse.StatusCode == HttpStatusCode.NoContent)
        return true;
      if (!string.IsNullOrWhiteSpace(irestResponse.ErrorMessage))
        throw new Exception(irestResponse.ErrorMessage);
      if (!string.IsNullOrWhiteSpace(irestResponse.StatusDescription) && !string.IsNullOrWhiteSpace(irestResponse.Content))
        throw new Exception(irestResponse.StatusDescription + " || " + irestResponse.Content);
      return false;
    }

    public bool EndMeeting(string meetingId)
    {
      RestRequest restRequest = this.BuildRequestAuthorization("meetings/{meetingId}/status", (Method) 2);
      restRequest.AddParameter(nameof (meetingId), (object) meetingId, (ParameterType) 2);
      restRequest.AddJsonBody((object) new{ action = "end" });
      IRestResponse irestResponse = this.WebClient.Execute((IRestRequest) restRequest);
      if (irestResponse.ResponseStatus == ResponseStatus.Completed && irestResponse.StatusCode == HttpStatusCode.NoContent)
        return true;
      if (!string.IsNullOrWhiteSpace(irestResponse.ErrorMessage))
        throw new Exception(irestResponse.ErrorMessage);
      if (!string.IsNullOrWhiteSpace(irestResponse.StatusDescription) && !string.IsNullOrWhiteSpace(irestResponse.Content))
        throw new Exception(irestResponse.StatusDescription + " || " + irestResponse.Content);
      return false;
    }

    public ListMeetingRegistrants GetMeetingRegistrants(
      string meetingId,
      string status = "approved",
      string occurrenceId = null,
      int pageSize = 30,
      int pageNumber = 1)
    {
      if (pageSize > 300)
        throw new Exception("GetMeetingRegistrants page size max 300");
      if (!status.Equals(MeetingRegistrantStatuses.Approved, StringComparison.InvariantCultureIgnoreCase) && !status.Equals(MeetingRegistrantStatuses.Denied, StringComparison.InvariantCultureIgnoreCase) && !status.Equals(MeetingRegistrantStatuses.Pending, StringComparison.InvariantCultureIgnoreCase))
        throw new Exception("GetMeetingRegistrants status allowed values are [" + MeetingRegistrantStatuses.Approved + "," + MeetingRegistrantStatuses.Denied + "," + MeetingRegistrantStatuses.Pending + "]");
      RestRequest restRequest = this.BuildRequestAuthorization("meetings/{meetingId}/registrants", (Method) 0);
      restRequest.AddParameter(nameof (meetingId), (object) meetingId, (ParameterType) 2);
      restRequest.AddParameter(nameof (status), (object) status, (ParameterType) 5);
      restRequest.AddParameter("page_size", (object) pageSize, (ParameterType) 5);
      restRequest.AddParameter("page_number", (object) pageNumber, (ParameterType) 5);
      if (!string.IsNullOrWhiteSpace(occurrenceId))
        restRequest.AddParameter("occurrence_id", (object) occurrenceId, (ParameterType) 5);
      IRestResponse<ListMeetingRegistrants> irestResponse = (IRestResponse<ListMeetingRegistrants>) this.WebClient.Execute<ListMeetingRegistrants>((IRestRequest) restRequest);
      if (((IRestResponse) irestResponse).ResponseStatus == ResponseStatus.Completed && ((IRestResponse) irestResponse).StatusCode == HttpStatusCode.OK)
        return irestResponse.Data;
      if (!string.IsNullOrWhiteSpace(((IRestResponse) irestResponse).ErrorMessage))
        throw new Exception(((IRestResponse) irestResponse).ErrorMessage);
      if (!string.IsNullOrWhiteSpace(((IRestResponse) irestResponse).StatusDescription) && !string.IsNullOrWhiteSpace(((IRestResponse) irestResponse).Content))
        throw new Exception(((IRestResponse) irestResponse).StatusDescription + " || " + ((IRestResponse) irestResponse).Content);
      return (ListMeetingRegistrants) null;
    }

    public MeetingRegistrant CreateMeetingRegistrant(
      string meetingId,
      CreateMeetingRegistrant meetingRegistrant,
      string occurrenceIds = null)
    {
      RestRequest restRequest = this.BuildRequestAuthorization("meetings/{meetingId}/registrants", (Method) 1);
      restRequest.AddParameter(nameof (meetingId), (object) meetingId, (ParameterType) 2);
      if (!string.IsNullOrWhiteSpace(occurrenceIds))
        restRequest.AddParameter("occurrence_ids", (object) occurrenceIds, (ParameterType) 5);
      restRequest.AddJsonBody((object) meetingRegistrant);
      IRestResponse<MeetingRegistrant> irestResponse = (IRestResponse<MeetingRegistrant>) this.WebClient.Execute<MeetingRegistrant>((IRestRequest) restRequest);
      if (((IRestResponse) irestResponse).ResponseStatus == ResponseStatus.Completed && ((IRestResponse) irestResponse).StatusCode == HttpStatusCode.Created)
        return irestResponse.Data;
      if (!string.IsNullOrWhiteSpace(((IRestResponse) irestResponse).ErrorMessage))
        throw new Exception(((IRestResponse) irestResponse).ErrorMessage);
      if (!string.IsNullOrWhiteSpace(((IRestResponse) irestResponse).StatusDescription) && !string.IsNullOrWhiteSpace(((IRestResponse) irestResponse).Content))
        throw new Exception(((IRestResponse) irestResponse).StatusDescription + " || " + ((IRestResponse) irestResponse).Content);
      return (MeetingRegistrant) null;
    }

    public bool UpdateMeetingRegistrant(
      string meetingId,
      List<UpdateMeetingRegistrant> registrants,
      string status,
      string occurrenceId = null)
    {
      if (!status.Equals(UpdateMeetingRegistrantStatuses.Approve, StringComparison.InvariantCultureIgnoreCase) && !status.Equals(UpdateMeetingRegistrantStatuses.Deny, StringComparison.InvariantCultureIgnoreCase) && !status.Equals(UpdateMeetingRegistrantStatuses.Cancel, StringComparison.InvariantCultureIgnoreCase))
        throw new Exception("UpdateMeetingRegistrant status allowed values are [" + UpdateMeetingRegistrantStatuses.Approve + "," + UpdateMeetingRegistrantStatuses.Deny + "," + UpdateMeetingRegistrantStatuses.Cancel + "]");
      RestRequest restRequest = this.BuildRequestAuthorization("meetings/{meetingId}/registrants/status", (Method) 2);
      restRequest.AddParameter(nameof (meetingId), (object) meetingId, (ParameterType) 2);
      if (!string.IsNullOrWhiteSpace(occurrenceId))
        restRequest.AddParameter("occurrence_id", (object) occurrenceId, (ParameterType) 5);
      restRequest.AddJsonBody((object) new
      {
        action = status,
        registrants = registrants
      });
      IRestResponse irestResponse = this.WebClient.Execute((IRestRequest) restRequest);
      if (irestResponse.ResponseStatus == ResponseStatus.Completed && irestResponse.StatusCode == HttpStatusCode.NoContent)
        return true;
      if (!string.IsNullOrWhiteSpace(irestResponse.ErrorMessage))
        throw new Exception(irestResponse.ErrorMessage);
      if (!string.IsNullOrWhiteSpace(irestResponse.StatusDescription) && !string.IsNullOrWhiteSpace(irestResponse.Content))
        throw new Exception(irestResponse.StatusDescription + " || " + irestResponse.Content);
      return false;
    }

    private RestRequest BuildRequestAuthorization(string resource, Method method)
    {
      return this.WebClient.BuildRequestAuthorization(this.Options, resource, method);
    }
  }
}
