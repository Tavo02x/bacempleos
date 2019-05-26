// Decompiled with JetBrains decompiler
// Type: AndcultureCode.ZoomClient.Models.Reports.MeetingParticipant
// Assembly: AndcultureCode.ZoomClient, Version=1.0.17.0, Culture=neutral, PublicKeyToken=null
// MVID: 17CE22F4-AACB-40F0-A40B-481263D3D4EF
// Assembly location: C:\Users\gustavo.solano\Downloads\AndcultureCode.ZoomClient.dll

using System;

namespace AndcultureCode.ZoomClient.Models.Reports
{
  public class MeetingParticipant
  {
    public string Name { get; set; }

    public string UserEmail { get; set; }

    public DateTimeOffset JoinTime { get; set; }

    public DateTimeOffset LeaveTime { get; set; }

    public int Duration { get; set; }

    public string AttentivenessScore { get; set; }
  }
}
