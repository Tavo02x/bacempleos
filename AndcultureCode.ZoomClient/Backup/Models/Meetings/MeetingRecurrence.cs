// Decompiled with JetBrains decompiler
// Type: AndcultureCode.ZoomClient.Models.Meetings.MeetingRecurrence
// Assembly: AndcultureCode.ZoomClient, Version=1.0.17.0, Culture=neutral, PublicKeyToken=null
// MVID: 17CE22F4-AACB-40F0-A40B-481263D3D4EF
// Assembly location: C:\Users\gustavo.solano\Downloads\AndcultureCode.ZoomClient.dll

using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;

namespace AndcultureCode.ZoomClient.Models.Meetings
{
  public class MeetingRecurrence
  {
    [JsonProperty("weekly_days")]
    private string WeeklyDaysList { get; set; }

    public MeetingRecurrenceTypes Type { get; set; }

    public int RepeatInterval { get; set; }

    public int MonthlyDay { get; set; }

    public MeetingRecurrenceWeeks MonthlyWeek { get; set; }

    public MeetingRecurrenceWeekDays MonthlyWeekDay { get; set; }

    public int EndTimes { get; set; }

    public DateTimeOffset? EndDateTime { get; set; }

    [JsonIgnore]
    public List<MeetingRecurrenceWeekDays> WeeklyDays
    {
      get
      {
        if (string.IsNullOrWhiteSpace(this.WeeklyDaysList))
          return (List<MeetingRecurrenceWeekDays>) null;
        IEnumerable<MeetingRecurrenceWeekDays> source = ((IEnumerable<string>) this.WeeklyDaysList.Split(',')).Select<string, MeetingRecurrenceWeekDays>((Func<string, MeetingRecurrenceWeekDays>) (e => (MeetingRecurrenceWeekDays) Enum.Parse(typeof (MeetingRecurrenceWeekDays), e)));
        if (source == null)
          return (List<MeetingRecurrenceWeekDays>) null;
        return source.ToList<MeetingRecurrenceWeekDays>();
      }
      set
      {
        this.WeeklyDaysList = string.Join(",", value.ToString());
      }
    }
  }
}
