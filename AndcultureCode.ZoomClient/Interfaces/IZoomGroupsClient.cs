// Decompiled with JetBrains decompiler
// Type: AndcultureCode.ZoomClient.Interfaces.IZoomGroupsClient
// Assembly: AndcultureCode.ZoomClient, Version=1.0.17.0, Culture=neutral, PublicKeyToken=null
// MVID: 17CE22F4-AACB-40F0-A40B-481263D3D4EF
// Assembly location: C:\Users\gustavo.solano\Downloads\AndcultureCode.ZoomClient.dll

using AndcultureCode.ZoomClient.Models.Groups;
using System.Collections.Generic;

namespace AndcultureCode.ZoomClient.Interfaces
{
  public interface IZoomGroupsClient
  {
    ListGroups GetGroups();

    Group CreateGroup(CreateGroup createGroup);

    Group GetGroup(string groupId);

    bool UpdateGroup(string groupId, UpdateGroup group);

    bool DeleteGroup(string groupId);

    ListMembers GetGroupMembers(string groupId, int pageSize = 30, int pageNumber = 1);

    bool AddGroupMembers(string groupId, List<CreateMember> createMembers);

    bool DeleteGroupMembers(string groupId, string memberId);
  }
}
