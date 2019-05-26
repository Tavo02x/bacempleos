// Decompiled with JetBrains decompiler
// Type: AndcultureCode.ZoomClient.Models.Meetings.CreateMeeting
// Assembly: AndcultureCode.ZoomClient, Version=1.0.17.0, Culture=neutral, PublicKeyToken=null
// MVID: 17CE22F4-AACB-40F0-A40B-481263D3D4EF
// Assembly location: C:\Users\gustavo.solano\Downloads\AndcultureCode.ZoomClient.dll

using AndcultureCode.ZoomClient.Interfaces;
using System.Collections.Generic;

namespace AndcultureCode.ZoomClient.Models.Meetings
{
  public class CreateMeeting : Meeting, ICreatable
  {
    public List<string> Validate()
    {
      List<string> stringList = new List<string>();
      if (this.Recurrence != null && this.Recurrence.RepeatInterval > 0)
      {
        if (this.Recurrence.Type == MeetingRecurrenceTypes.Daily && this.Recurrence.RepeatInterval > 90)
          stringList.Add(string.Format("{0} cannot exceed {1} when Type = {2}", (object) "RepeatInterval", (object) 90, (object) this.Type));
        else if (this.Recurrence.Type == MeetingRecurrenceTypes.Weekly && this.Recurrence.RepeatInterval > 12)
          stringList.Add(string.Format("{0} cannot exceed {1} when Type = {2}", (object) "RepeatInterval", (object) 12, (object) this.Type));
        else if (this.Recurrence.Type == MeetingRecurrenceTypes.Monthly && this.Recurrence.RepeatInterval > 3)
          stringList.Add(string.Format("{0} cannot exceed {1} when Type = {2}", (object) "RepeatInterval", (object) 3, (object) this.Type));
      }
      return stringList;
    }
  }
}
