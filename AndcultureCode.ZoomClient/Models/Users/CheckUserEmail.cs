// Decompiled with JetBrains decompiler
// Type: AndcultureCode.ZoomClient.Models.Users.CheckUserEmail
// Assembly: AndcultureCode.ZoomClient, Version=1.0.17.0, Culture=neutral, PublicKeyToken=null
// MVID: 17CE22F4-AACB-40F0-A40B-481263D3D4EF
// Assembly location: C:\Users\gustavo.solano\Downloads\AndcultureCode.ZoomClient.dll

using Newtonsoft.Json;

namespace AndcultureCode.ZoomClient.Models.Users
{
  public class CheckUserEmail
  {
    [JsonProperty("existed_email")]
    public bool EmailExists { get; set; }
  }
}
