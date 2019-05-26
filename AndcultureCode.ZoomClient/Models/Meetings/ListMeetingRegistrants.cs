// Decompiled with JetBrains decompiler
// Type: AndcultureCode.ZoomClient.Models.Meetings.ListMeetingRegistrants
// Assembly: AndcultureCode.ZoomClient, Version=1.0.17.0, Culture=neutral, PublicKeyToken=null
// MVID: 17CE22F4-AACB-40F0-A40B-481263D3D4EF
// Assembly location: C:\Users\gustavo.solano\Downloads\AndcultureCode.ZoomClient.dll

using System.Collections.Generic;

namespace AndcultureCode.ZoomClient.Models.Meetings
{
  public class ListMeetingRegistrants : BaseList
  {
    public List<MeetingRegistrant> Registrants { get; set; }
  }
}
