// Decompiled with JetBrains decompiler
// Type: AndcultureCode.ZoomClient.ZoomUsersClient
// Assembly: AndcultureCode.ZoomClient, Version=1.0.17.0, Culture=neutral, PublicKeyToken=null
// MVID: 17CE22F4-AACB-40F0-A40B-481263D3D4EF
// Assembly location: C:\Users\gustavo.solano\Downloads\AndcultureCode.ZoomClient.dll

using AndcultureCode.ZoomClient.Extensions;
using AndcultureCode.ZoomClient.Interfaces;
using AndcultureCode.ZoomClient.Models;
using AndcultureCode.ZoomClient.Models.Users;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Net;

namespace AndcultureCode.ZoomClient
{
  public class ZoomUsersClient : IZoomUsersClient
  {
    private const string DELETE_USER = "users/{userId}";
    private const string GET_LIST_USERS = "users";
    private const string GET_USER = "users/{userId}";
    private const string GET_USER_EMAIL = "users/email";
    private const string PATCH_USER = "users/{userId}";
    private const string POST_CREATE_USER = "users";
    private const string PUT_UPDATE_USER_EMAIL = "users/{userId}/email";

    private ZoomClientOptions Options { get; set; }

    private RestClient WebClient { get; set; }

    internal ZoomUsersClient(ZoomClientOptions options, RestClient webClient)
    {
      this.Options = options;
      this.WebClient = webClient;
    }

    public ListUsers GetUsers(UserStatuses status = UserStatuses.Active, int pageSize = 30, int pageNumber = 1)
    {
      if (pageSize > 300)
        throw new Exception("GetUsers page size max 300");
      RestRequest restRequest = this.BuildRequestAuthorization("users", (Method) 0);
      restRequest.AddParameter(nameof (status), (object) status.ToString().ToLowerInvariant(), (ParameterType) 5);
      restRequest.AddParameter("page_size", (object) pageSize, (ParameterType) 5);
      restRequest.AddParameter("page_number", (object) pageNumber, (ParameterType) 5);
      IRestResponse<ListUsers> irestResponse = (IRestResponse<ListUsers>) this.WebClient.Execute<ListUsers>((IRestRequest) restRequest);
      if (((IRestResponse) irestResponse).ResponseStatus == ResponseStatus.Completed && ((IRestResponse) irestResponse).StatusCode == HttpStatusCode.OK)
        return irestResponse.Data;
      if (!string.IsNullOrWhiteSpace(((IRestResponse) irestResponse).ErrorMessage))
        throw new Exception(((IRestResponse) irestResponse).ErrorMessage);
      if (!string.IsNullOrWhiteSpace(((IRestResponse) irestResponse).Content) && !string.IsNullOrWhiteSpace(((IRestResponse) irestResponse).Content))
        throw new Exception(((IRestResponse) irestResponse).Content + " || " + ((IRestResponse) irestResponse).Content);
      return (ListUsers) null;
    }

    public User CreateUser(CreateUser createUser, string action)
    {
      List<string> stringList = createUser.Validate();
      if (stringList.Count > 0)
        throw new Exception("CreateUser request does not pass validation. " + string.Join(" :: ", (IEnumerable<string>) stringList));
      if (!action.Equals(CreateUserAction.Create, StringComparison.InvariantCultureIgnoreCase) && !action.Equals(CreateUserAction.AutoCreate, StringComparison.InvariantCultureIgnoreCase) && (!action.Equals(CreateUserAction.CustCreate, StringComparison.InvariantCultureIgnoreCase) && !action.Equals(CreateUserAction.SsoCreate, StringComparison.InvariantCultureIgnoreCase)))
        throw new Exception("CreateUser action allowed values are [" + CreateUserAction.Create + "," + CreateUserAction.AutoCreate + "," + CreateUserAction.CustCreate + "," + CreateUserAction.SsoCreate + "]");
      if (string.IsNullOrWhiteSpace(createUser.Password) && !string.IsNullOrWhiteSpace(action) && action.Equals(CreateUserAction.AutoCreate, StringComparison.InvariantCultureIgnoreCase))
        throw new Exception("Password property is required for creating user when action is set to " + CreateUserAction.AutoCreate);
      RestRequest restRequest = this.BuildRequestAuthorization("users", (Method) 1);
      restRequest.AddJsonBody((object) new
      {
        action = action,
        user_info = createUser
      });
      IRestResponse<User> irestResponse = (IRestResponse<User>) this.WebClient.Execute<User>((IRestRequest) restRequest);
      if (((IRestResponse) irestResponse).ResponseStatus == ResponseStatus.Completed && ((IRestResponse) irestResponse).StatusCode == HttpStatusCode.Created)
        return irestResponse.Data;
      if (!string.IsNullOrWhiteSpace(((IRestResponse) irestResponse).ErrorMessage))
        throw new Exception(((IRestResponse) irestResponse).ErrorMessage);
      if (!string.IsNullOrWhiteSpace(((IRestResponse) irestResponse).Content) && !string.IsNullOrWhiteSpace(((IRestResponse) irestResponse).Content))
        throw new Exception(((IRestResponse) irestResponse).Content + " || " + ((IRestResponse) irestResponse).Content);
      return (User) null;
    }

    public User GetUser(string userId, LoginTypes? loginType)
    {
      RestRequest restRequest = this.BuildRequestAuthorization("users/{userId}", (Method) 0);
      restRequest.AddParameter(nameof (userId), (object) userId, (ParameterType) 2);
      IRestResponse<User> irestResponse = (IRestResponse<User>) this.WebClient.Execute<User>((IRestRequest) restRequest);
      if (((IRestResponse) irestResponse).ResponseStatus == ResponseStatus.Completed && ((IRestResponse) irestResponse).StatusCode == HttpStatusCode.OK)
        return irestResponse.Data;
      if (!string.IsNullOrWhiteSpace(((IRestResponse) irestResponse).ErrorMessage))
        throw new Exception(((IRestResponse) irestResponse).ErrorMessage);
      if (!string.IsNullOrWhiteSpace(((IRestResponse) irestResponse).Content) && !string.IsNullOrWhiteSpace(((IRestResponse) irestResponse).Content))
        throw new Exception(((IRestResponse) irestResponse).Content + " || " + ((IRestResponse) irestResponse).Content);
      return (User) null;
    }

    public bool UpdateUser(string userId, UpdateUser user)
    {
      RestRequest restRequest = this.BuildRequestAuthorization("users/{userId}", (Method) 6);
      restRequest.AddParameter(nameof (userId), (object) userId, (ParameterType) 2);
      restRequest.AddJsonBody((object) user);
      IRestResponse irestResponse = this.WebClient.Execute((IRestRequest) restRequest);
      if (irestResponse.ResponseStatus == ResponseStatus.Completed && irestResponse.StatusCode == HttpStatusCode.NoContent)
        return true;
      if (!string.IsNullOrWhiteSpace(irestResponse.ErrorMessage))
        throw new Exception(irestResponse.ErrorMessage);
      if (!string.IsNullOrWhiteSpace(irestResponse.Content) && !string.IsNullOrWhiteSpace(irestResponse.Content))
        throw new Exception(irestResponse.Content + " || " + irestResponse.Content);
      return false;
    }

    public bool CheckUser(string email)
    {
      RestRequest restRequest = this.BuildRequestAuthorization("users/email", (Method) 0);
      restRequest.AddParameter(nameof (email), (object) email, (ParameterType) 5);
      IRestResponse<CheckUserEmail> irestResponse = (IRestResponse<CheckUserEmail>) this.WebClient.Execute<CheckUserEmail>((IRestRequest) restRequest);
      if (((IRestResponse) irestResponse).ResponseStatus == ResponseStatus.Completed && ((IRestResponse) irestResponse).StatusCode == HttpStatusCode.OK)
        return irestResponse.Data.EmailExists;
      if (!string.IsNullOrWhiteSpace(((IRestResponse) irestResponse).ErrorMessage))
        throw new Exception(((IRestResponse) irestResponse).ErrorMessage);
      if (!string.IsNullOrWhiteSpace(((IRestResponse) irestResponse).Content) && !string.IsNullOrWhiteSpace(((IRestResponse) irestResponse).Content))
        throw new Exception(((IRestResponse) irestResponse).Content + " || " + ((IRestResponse) irestResponse).Content);
      return false;
    }

    public bool DeleteUser(
      string userId,
      string action = "disassociate",
      string transferEmail = null,
      bool transferMeeting = false,
      bool transferWebinar = false,
      bool transferRecording = false)
    {
      if (!action.Equals(DeleteUserAction.Disassociate, StringComparison.InvariantCultureIgnoreCase) && !action.Equals(DeleteUserAction.Delete, StringComparison.InvariantCultureIgnoreCase))
        throw new Exception("DeleteUser action allowed values are [" + DeleteUserAction.Disassociate + "," + DeleteUserAction.Delete + "]");
      RestRequest restRequest = this.BuildRequestAuthorization("users/{userId}", (Method) 3);
      restRequest.AddParameter(nameof (userId), (object) userId, (ParameterType) 2);
      if (!string.IsNullOrWhiteSpace(transferEmail))
      {
        restRequest.AddParameter("transfer_email", (object) transferEmail, (ParameterType) 5);
        restRequest.AddParameter("transfer_meeting", (object) transferMeeting, (ParameterType) 5);
        restRequest.AddParameter("transfer_webinar", (object) transferWebinar, (ParameterType) 5);
        restRequest.AddParameter("transfer_recording", (object) transferRecording, (ParameterType) 5);
      }
      IRestResponse irestResponse = this.WebClient.Execute((IRestRequest) restRequest);
      if (irestResponse.ResponseStatus == ResponseStatus.Completed && irestResponse.StatusCode == HttpStatusCode.NoContent)
        return true;
      if (!string.IsNullOrWhiteSpace(irestResponse.ErrorMessage))
        throw new Exception(irestResponse.ErrorMessage);
      if (!string.IsNullOrWhiteSpace(irestResponse.Content) && !string.IsNullOrWhiteSpace(irestResponse.Content))
        throw new Exception(irestResponse.Content + " || " + irestResponse.Content);
      return false;
    }

    public bool UpdateUserEmail(string userId, string newEmail)
    {
      UpdateUserEmail updateUserEmail = new UpdateUserEmail()
      {
        Email = newEmail
      };
      RestRequest restRequest = this.BuildRequestAuthorization("users/{userId}/email", (Method) 2);
      restRequest.AddParameter(nameof (userId), (object) userId, (ParameterType) 2);
      restRequest.AddJsonBody((object) updateUserEmail);
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
