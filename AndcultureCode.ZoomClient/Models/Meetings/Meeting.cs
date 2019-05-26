// Decompiled with JetBrains decompiler
// Type: AndcultureCode.ZoomClient.Models.Meetings.Meeting
// Assembly: AndcultureCode.ZoomClient, Version=1.0.17.0, Culture=neutral, PublicKeyToken=null
// MVID: 17CE22F4-AACB-40F0-A40B-481263D3D4EF
// Assembly location: C:\Users\gustavo.solano\Downloads\AndcultureCode.ZoomClient.dll

using System;

namespace AndcultureCode.ZoomClient.Models.Meetings
{
  public class Meeting : BaseObject
  {
    public string Uuid { get; set; }

    public string Topic { get; set; }

    public MeetingTypes Type { get; set; }

    public DateTimeOffset StartTime { get; set; }

    public int Duration { get; set; }

    public string Timezone { get; set; }

    public string Password { get; set; }

    public string Agenda { get; set; }

    public string StartUrl { get; set; }

    public string JoinUrl { get; set; }

    public MeetingRecurrence Recurrence { get; set; }

    public MeetingSettings Settings { get; set; }
  }
}
