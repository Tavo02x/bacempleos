// Decompiled with JetBrains decompiler
// Type: AndcultureCode.ZoomClient.Models.Users.UpdateUser
// Assembly: AndcultureCode.ZoomClient, Version=1.0.17.0, Culture=neutral, PublicKeyToken=null
// MVID: 17CE22F4-AACB-40F0-A40B-481263D3D4EF
// Assembly location: C:\Users\gustavo.solano\Downloads\AndcultureCode.ZoomClient.dll

using AndcultureCode.ZoomClient.Interfaces;
using Newtonsoft.Json;
using System.Collections.Generic;

namespace AndcultureCode.ZoomClient.Models.Users
{
  public class UpdateUser : ICreatable
  {
    public UserTypes Type { get; set; }

    public string FirstName { get; set; }

    public string LastName { get; set; }

    [JsonProperty("pmi")]
    public string PersonalMeetingId { get; set; }

    public string Timezone { get; set; }

    [JsonProperty("dept")]
    public string Department { get; set; }

    public string VanityName { get; set; }

    public string HostKey { get; set; }

    public string CmsUserId { get; set; }

    public List<string> Validate()
    {
      List<string> stringList = new List<string>();
      if (!string.IsNullOrWhiteSpace(this.FirstName) && this.FirstName.Length > 64)
        stringList.Add(string.Format("{0} property max length is {1} characters", (object) "FirstName", (object) 64));
      if (!string.IsNullOrWhiteSpace(this.LastName) && this.LastName.Length > 64)
        stringList.Add(string.Format("{0} property max length is {1} characters", (object) "LastName", (object) 64));
      if (!string.IsNullOrWhiteSpace(this.PersonalMeetingId) && this.PersonalMeetingId.Length != 10)
        stringList.Add(string.Format("{0} property length must equal {1} characters", (object) "PersonalMeetingId", (object) 10));
      if (!string.IsNullOrWhiteSpace(this.HostKey) && this.HostKey.Length != 6)
        stringList.Add(string.Format("{0} property length must equal {1} characters", (object) "HostKey", (object) 6));
      return stringList;
    }
  }
}
