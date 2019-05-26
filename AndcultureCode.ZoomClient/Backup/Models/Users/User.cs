// Decompiled with JetBrains decompiler
// Type: AndcultureCode.ZoomClient.Models.Users.User
// Assembly: AndcultureCode.ZoomClient, Version=1.0.17.0, Culture=neutral, PublicKeyToken=null
// MVID: 17CE22F4-AACB-40F0-A40B-481263D3D4EF
// Assembly location: C:\Users\gustavo.solano\Downloads\AndcultureCode.ZoomClient.dll

using Newtonsoft.Json;
using System;

namespace AndcultureCode.ZoomClient.Models.Users
{
  public class User : BaseObject
  {
    public string FirstName { get; set; }

    public string LastName { get; set; }

    public string Email { get; set; }

    public UserTypes Type { get; set; }

    [JsonProperty("pmi")]
    public string PersonalMeetingId { get; set; }

    public string Timezone { get; set; }

    [JsonProperty("dept")]
    public string Department { get; set; }

    [JsonProperty("created_at")]
    public DateTimeOffset? CreatedTime { get; set; }

    public DateTimeOffset? LastLoginTime { get; set; }

    public string LastClientVersion { get; set; }
  }
}
