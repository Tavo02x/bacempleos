// Decompiled with JetBrains decompiler
// Type: AndcultureCode.ZoomClient.Models.Account.Account
// Assembly: AndcultureCode.ZoomClient, Version=1.0.17.0, Culture=neutral, PublicKeyToken=null
// MVID: 17CE22F4-AACB-40F0-A40B-481263D3D4EF
// Assembly location: C:\Users\gustavo.solano\Downloads\AndcultureCode.ZoomClient.dll

namespace AndcultureCode.ZoomClient.Models.Account
{
  public class Account : BaseObject
  {
    public string FirstName { get; set; }

    public string LastName { get; set; }

    public string Email { get; set; }

    public string Password { get; set; }

    public AccountOptions Options { get; set; }
  }
}
