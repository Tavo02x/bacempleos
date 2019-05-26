// Decompiled with JetBrains decompiler
// Type: AndcultureCode.ZoomClient.Models.Meetings.MeetingRegistrant
// Assembly: AndcultureCode.ZoomClient, Version=1.0.17.0, Culture=neutral, PublicKeyToken=null
// MVID: 17CE22F4-AACB-40F0-A40B-481263D3D4EF
// Assembly location: C:\Users\gustavo.solano\Downloads\AndcultureCode.ZoomClient.dll

using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace AndcultureCode.ZoomClient.Models.Meetings
{
  public class MeetingRegistrant
  {
    public string Id { get; set; }

    public string Email { get; set; }

    public string FirstName { get; set; }

    public string LastName { get; set; }

    public string Address { get; set; }

    public string City { get; set; }

    public string Country { get; set; }

    public string Zip { get; set; }

    public string State { get; set; }

    public string Phone { get; set; }

    public string Industry { get; set; }

    [JsonProperty("org")]
    public string Organization { get; set; }

    public string JobTitle { get; set; }

    public string PurchasingTimeFrame { get; set; }

    public string RoleInPurchaseProcess { get; set; }

    [JsonProperty("no_of_employees")]
    public string NumberOfEmployees { get; set; }

    public string Comments { get; set; }

    public string Status { get; set; }

    public DateTime CreateTime { get; set; }

    public string JoinUrl { get; set; }

    public List<MeetingRegistrantCustomQuestion> CustomQuestions { get; set; }
  }
}
