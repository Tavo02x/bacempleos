// Decompiled with JetBrains decompiler
// Type: AndcultureCode.ZoomClient.Interfaces.IZoomUsersClient
// Assembly: AndcultureCode.ZoomClient, Version=1.0.17.0, Culture=neutral, PublicKeyToken=null
// MVID: 17CE22F4-AACB-40F0-A40B-481263D3D4EF
// Assembly location: C:\Users\gustavo.solano\Downloads\AndcultureCode.ZoomClient.dll

using AndcultureCode.ZoomClient.Models.Users;

namespace AndcultureCode.ZoomClient.Interfaces
{
  public interface IZoomUsersClient
  {
    ListUsers GetUsers(UserStatuses status = UserStatuses.Active, int pageSize = 30, int pageNumber = 1);

    User CreateUser(CreateUser createUser, string action);

    User GetUser(string userId, LoginTypes? loginType = null);

    bool UpdateUser(string userId, UpdateUser user);

    bool CheckUser(string email);

    bool DeleteUser(
      string userId,
      string action = "disassociate",
      string transferEmail = null,
      bool transferMeeting = false,
      bool transferWebinar = false,
      bool transferRecording = false);

    bool UpdateUserEmail(string userId, string newEmail);
  }
}
