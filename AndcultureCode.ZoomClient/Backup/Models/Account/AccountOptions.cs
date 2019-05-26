// Decompiled with JetBrains decompiler
// Type: AndcultureCode.ZoomClient.Models.Account.AccountOptions
// Assembly: AndcultureCode.ZoomClient, Version=1.0.17.0, Culture=neutral, PublicKeyToken=null
// MVID: 17CE22F4-AACB-40F0-A40B-481263D3D4EF
// Assembly location: C:\Users\gustavo.solano\Downloads\AndcultureCode.ZoomClient.dll

using Newtonsoft.Json;

namespace AndcultureCode.ZoomClient.Models.Account
{
  public class AccountOptions
  {
    [JsonProperty("share_rc")]
    public bool EnableShareVirtualRoomConnector { get; set; }

    [JsonProperty("room_connectors")]
    public string VirtualRoomConnectors { get; set; }

    [JsonProperty("share_mc")]
    public bool EnableShareMeetingConnector { get; set; }

    public string MeetingConnectors { get; set; }

    [JsonProperty("pay_mode")]
    public string PaymentMode { get; set; }
  }
}
