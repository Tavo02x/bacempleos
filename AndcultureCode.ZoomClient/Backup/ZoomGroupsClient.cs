// Decompiled with JetBrains decompiler
// Type: AndcultureCode.ZoomClient.ZoomGroupsClient
// Assembly: AndcultureCode.ZoomClient, Version=1.0.17.0, Culture=neutral, PublicKeyToken=null
// MVID: 17CE22F4-AACB-40F0-A40B-481263D3D4EF
// Assembly location: C:\Users\gustavo.solano\Downloads\AndcultureCode.ZoomClient.dll

using AndcultureCode.ZoomClient.Extensions;
using AndcultureCode.ZoomClient.Interfaces;
using AndcultureCode.ZoomClient.Models;
using AndcultureCode.ZoomClient.Models.Groups;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Net;

namespace AndcultureCode.ZoomClient
{
  internal class ZoomGroupsClient : IZoomGroupsClient
  {
    private const string DELETE_GROUP = "groups/{groupId}";
    private const string DELETE_GROUP_MEMBER = "groups/{groupId}/members/{memberId}";
    private const string GET_LIST_GROUPS = "groups";
    private const string GET_GROUP = "groups/{groupId}";
    private const string GET_GROUP_MEMBERS = "groups/{groupId}/members";
    private const string PATCH_GROUP = "groups/{groupId}";
    private const string POST_GROUP = "groups";
    private const string POST_GROUP_MEMBERS = "groups/{groupId}/members";

    private ZoomClientOptions Options { get; set; }

    private RestClient WebClient { get; set; }

    internal ZoomGroupsClient(ZoomClientOptions options, RestClient webClient)
    {
      this.Options = options;
      this.WebClient = webClient;
    }

    public ListGroups GetGroups()
    {
      IRestResponse<ListGroups> irestResponse = (IRestResponse<ListGroups>) this.WebClient.Execute<ListGroups>((IRestRequest) this.BuildRequestAuthorization("groups", (Method) 0));
      if (((IRestResponse) irestResponse).get_ResponseStatus() == 1 && ((IRestResponse) irestResponse).get_StatusCode() == HttpStatusCode.OK)
        return irestResponse.get_Data();
      if (!string.IsNullOrWhiteSpace(((IRestResponse) irestResponse).get_ErrorMessage()))
        throw new Exception(((IRestResponse) irestResponse).get_ErrorMessage());
      if (!string.IsNullOrWhiteSpace(((IRestResponse) irestResponse).get_StatusDescription()) && !string.IsNullOrWhiteSpace(((IRestResponse) irestResponse).get_Content()))
        throw new Exception(((IRestResponse) irestResponse).get_StatusDescription() + " || " + ((IRestResponse) irestResponse).get_Content());
      return (ListGroups) null;
    }

    public Group CreateGroup(CreateGroup createGroup)
    {
      RestRequest restRequest = this.BuildRequestAuthorization("groups", (Method) 1);
      restRequest.AddJsonBody((object) createGroup);
      IRestResponse<Group> irestResponse = (IRestResponse<Group>) this.WebClient.Execute<Group>((IRestRequest) restRequest);
      if (((IRestResponse) irestResponse).get_ResponseStatus() == 1 && ((IRestResponse) irestResponse).get_StatusCode() == HttpStatusCode.Created)
        return irestResponse.get_Data();
      if (!string.IsNullOrWhiteSpace(((IRestResponse) irestResponse).get_ErrorMessage()))
        throw new Exception(((IRestResponse) irestResponse).get_ErrorMessage());
      if (!string.IsNullOrWhiteSpace(((IRestResponse) irestResponse).get_StatusDescription()) && !string.IsNullOrWhiteSpace(((IRestResponse) irestResponse).get_Content()))
        throw new Exception(((IRestResponse) irestResponse).get_StatusDescription() + " || " + ((IRestResponse) irestResponse).get_Content());
      return (Group) null;
    }

    public Group GetGroup(string groupId)
    {
      RestRequest restRequest = this.BuildRequestAuthorization("groups/{groupId}", (Method) 0);
      restRequest.AddParameter(nameof (groupId), (object) groupId, (ParameterType) 2);
      IRestResponse<Group> irestResponse = (IRestResponse<Group>) this.WebClient.Execute<Group>((IRestRequest) restRequest);
      if (((IRestResponse) irestResponse).get_ResponseStatus() == 1 && ((IRestResponse) irestResponse).get_StatusCode() == HttpStatusCode.OK)
        return irestResponse.get_Data();
      if (!string.IsNullOrWhiteSpace(((IRestResponse) irestResponse).get_ErrorMessage()))
        throw new Exception(((IRestResponse) irestResponse).get_ErrorMessage());
      if (!string.IsNullOrWhiteSpace(((IRestResponse) irestResponse).get_StatusDescription()) && !string.IsNullOrWhiteSpace(((IRestResponse) irestResponse).get_Content()))
        throw new Exception(((IRestResponse) irestResponse).get_StatusDescription() + " || " + ((IRestResponse) irestResponse).get_Content());
      return (Group) null;
    }

    public bool UpdateGroup(string groupId, UpdateGroup group)
    {
      RestRequest restRequest = this.BuildRequestAuthorization("groups/{groupId}", (Method) 6);
      restRequest.AddParameter(nameof (groupId), (object) groupId, (ParameterType) 2);
      restRequest.AddJsonBody((object) group);
      IRestResponse irestResponse = this.WebClient.Execute((IRestRequest) restRequest);
      if (irestResponse.get_ResponseStatus() == 1 && irestResponse.get_StatusCode() == HttpStatusCode.NoContent)
        return true;
      if (!string.IsNullOrWhiteSpace(irestResponse.get_ErrorMessage()))
        throw new Exception(irestResponse.get_ErrorMessage());
      if (!string.IsNullOrWhiteSpace(irestResponse.get_StatusDescription()) && !string.IsNullOrWhiteSpace(irestResponse.get_Content()))
        throw new Exception(irestResponse.get_StatusDescription() + " || " + irestResponse.get_Content());
      return false;
    }

    public bool DeleteGroup(string groupId)
    {
      RestRequest restRequest = this.BuildRequestAuthorization("groups/{groupId}", (Method) 3);
      restRequest.AddParameter(nameof (groupId), (object) groupId, (ParameterType) 2);
      IRestResponse irestResponse = this.WebClient.Execute((IRestRequest) restRequest);
      if (irestResponse.get_ResponseStatus() == 1 && irestResponse.get_StatusCode() == HttpStatusCode.NoContent)
        return true;
      if (!string.IsNullOrWhiteSpace(irestResponse.get_ErrorMessage()))
        throw new Exception(irestResponse.get_ErrorMessage());
      if (!string.IsNullOrWhiteSpace(irestResponse.get_StatusDescription()) && !string.IsNullOrWhiteSpace(irestResponse.get_Content()))
        throw new Exception(irestResponse.get_StatusDescription() + " || " + irestResponse.get_Content());
      return false;
    }

    public ListMembers GetGroupMembers(string groupId, int pageSize = 30, int pageNumber = 1)
    {
      RestRequest restRequest = this.BuildRequestAuthorization("groups/{groupId}/members", (Method) 0);
      restRequest.AddParameter(nameof (groupId), (object) groupId, (ParameterType) 2);
      restRequest.AddParameter("page_size", (object) pageSize, (ParameterType) 5);
      restRequest.AddParameter("page_number", (object) pageNumber, (ParameterType) 5);
      IRestResponse<ListMembers> irestResponse = (IRestResponse<ListMembers>) this.WebClient.Execute<ListMembers>((IRestRequest) restRequest);
      if (((IRestResponse) irestResponse).get_ResponseStatus() == 1 && ((IRestResponse) irestResponse).get_StatusCode() == HttpStatusCode.OK)
        return irestResponse.get_Data();
      if (!string.IsNullOrWhiteSpace(((IRestResponse) irestResponse).get_ErrorMessage()))
        throw new Exception(((IRestResponse) irestResponse).get_ErrorMessage());
      if (!string.IsNullOrWhiteSpace(((IRestResponse) irestResponse).get_StatusDescription()) && !string.IsNullOrWhiteSpace(((IRestResponse) irestResponse).get_Content()))
        throw new Exception(((IRestResponse) irestResponse).get_StatusDescription() + " || " + ((IRestResponse) irestResponse).get_Content());
      return (ListMembers) null;
    }

    public bool AddGroupMembers(string groupId, List<CreateMember> createMembers)
    {
      RestRequest restRequest = this.BuildRequestAuthorization("groups/{groupId}/members", (Method) 1);
      restRequest.AddParameter(nameof (groupId), (object) groupId, (ParameterType) 2);
      restRequest.AddJsonBody((object) new
      {
        members = createMembers
      });
      IRestResponse irestResponse = this.WebClient.Execute((IRestRequest) restRequest);
      if (irestResponse.get_ResponseStatus() == 1 && irestResponse.get_StatusCode() == HttpStatusCode.Created)
        return true;
      if (!string.IsNullOrWhiteSpace(irestResponse.get_ErrorMessage()))
        throw new Exception(irestResponse.get_ErrorMessage());
      if (!string.IsNullOrWhiteSpace(irestResponse.get_StatusDescription()) && !string.IsNullOrWhiteSpace(irestResponse.get_Content()))
        throw new Exception(irestResponse.get_StatusDescription() + " || " + irestResponse.get_Content());
      return false;
    }

    public bool DeleteGroupMembers(string groupId, string memberId)
    {
      RestRequest restRequest = this.BuildRequestAuthorization("groups/{groupId}/members/{memberId}", (Method) 3);
      restRequest.AddParameter(nameof (groupId), (object) groupId, (ParameterType) 2);
      restRequest.AddParameter(nameof (memberId), (object) memberId, (ParameterType) 2);
      IRestResponse irestResponse = this.WebClient.Execute((IRestRequest) restRequest);
      if (irestResponse.get_ResponseStatus() == 1 && irestResponse.get_StatusCode() == HttpStatusCode.NoContent)
        return true;
      if (!string.IsNullOrWhiteSpace(irestResponse.get_ErrorMessage()))
        throw new Exception(irestResponse.get_ErrorMessage());
      if (!string.IsNullOrWhiteSpace(irestResponse.get_StatusDescription()) && !string.IsNullOrWhiteSpace(irestResponse.get_Content()))
        throw new Exception(irestResponse.get_StatusDescription() + " || " + irestResponse.get_Content());
      return false;
    }

    private RestRequest BuildRequestAuthorization(string resource, Method method)
    {
      return this.WebClient.BuildRequestAuthorization(this.Options, resource, method);
    }
  }
}
