// Decompiled with JetBrains decompiler
// Type: AndcultureCode.ZoomClient.Interfaces.IZoomMeetingsClient
// Assembly: AndcultureCode.ZoomClient, Version=1.0.17.0, Culture=neutral, PublicKeyToken=null
// MVID: 17CE22F4-AACB-40F0-A40B-481263D3D4EF
// Assembly location: C:\Users\gustavo.solano\Downloads\AndcultureCode.ZoomClient.dll

using AndcultureCode.ZoomClient.Models.Meetings;
using System.Collections.Generic;

namespace AndcultureCode.ZoomClient.Interfaces
{
  public interface IZoomMeetingsClient
  {
    ListMeetings GetMeetings(
      string userId,
      MeetingListTypes type = MeetingListTypes.Live,
      int pageSize = 30,
      int pageNumber = 1);

    Meeting CreateMeeting(string userId, Meeting meeting);

    Meeting GetMeeting(string meetingId);

    bool UpdateMeeting(string meetingId, Meeting meeting);

    bool DeleteMeeting(string meetingId, string occurrenceId = null);

    bool EndMeeting(string meetingId);

    ListMeetingRegistrants GetMeetingRegistrants(
      string meetingId,
      string status = "approved",
      string occurrenceId = null,
      int pageSize = 30,
      int pageNumber = 1);

    MeetingRegistrant CreateMeetingRegistrant(
      string meetingId,
      CreateMeetingRegistrant meetingRegistrant,
      string occurrenceIds = null);

    bool UpdateMeetingRegistrant(
      string meetingId,
      List<UpdateMeetingRegistrant> registrants,
      string status,
      string occurrenceId = null);
  }
}
