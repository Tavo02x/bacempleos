// Decompiled with JetBrains decompiler
// Type: AndcultureCode.ZoomClient.Models.Meetings.MeetingSettings
// Assembly: AndcultureCode.ZoomClient, Version=1.0.17.0, Culture=neutral, PublicKeyToken=null
// MVID: 17CE22F4-AACB-40F0-A40B-481263D3D4EF
// Assembly location: C:\Users\gustavo.solano\Downloads\AndcultureCode.ZoomClient.dll

using Newtonsoft.Json;

namespace AndcultureCode.ZoomClient.Models.Meetings
{
  public class MeetingSettings
  {
    [JsonProperty("host_video")]
    public bool EnableHostVideo { get; set; }

    [JsonProperty("participant_video")]
    public bool EnableParticipantVideo { get; set; }

    [JsonProperty("cn_meeting")]
    public bool EnableChinaHost { get; set; }

    [JsonProperty("in_meeting")]
    public bool EnableIndiaHost { get; set; }

    [JsonProperty("join_before_host")]
    public bool EnableJoinBeforeHost { get; set; }

    [JsonProperty("mute_upon_entry")]
    public bool EnableMuteOnEntry { get; set; }

    [JsonProperty("watermark")]
    public bool EnableWatermark { get; set; }

    [JsonProperty("use_pmi")]
    public bool UsePersonalMeetingId { get; set; }

    public MeetingApprovalTypes ApprovalType { get; set; }

    public MeetingRegistrationTypes RegistrationType { get; set; }

    public string Audio { get; set; }

    public string AutoRecording { get; set; }

    [JsonProperty("enforce_login")]
    public bool EnableEnforceLogin { get; set; }

    [JsonProperty("enforce_login_domains")]
    public string EnableEnforceLoginDomains { get; set; }

    public string AlternativeHosts { get; set; }
  }
}
