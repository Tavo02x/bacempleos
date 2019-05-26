// Decompiled with JetBrains decompiler
// Type: AndcultureCode.ZoomClient.Interfaces.IZoomReportsClient
// Assembly: AndcultureCode.ZoomClient, Version=1.0.17.0, Culture=neutral, PublicKeyToken=null
// MVID: 17CE22F4-AACB-40F0-A40B-481263D3D4EF
// Assembly location: C:\Users\gustavo.solano\Downloads\AndcultureCode.ZoomClient.dll

using AndcultureCode.ZoomClient.Models.Reports;

namespace AndcultureCode.ZoomClient.Interfaces
{
  public interface IZoomReportsClient
  {
    MeetingParticipantsReport GetMeetingParticipantsReport(
      string meetingId,
      int pageSize = 30,
      string nextPageToken = null);
  }
}
