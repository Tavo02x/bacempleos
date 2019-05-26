// Decompiled with JetBrains decompiler
// Type: AndcultureCode.ZoomClient.Models.Users.CreateUser
// Assembly: AndcultureCode.ZoomClient, Version=1.0.17.0, Culture=neutral, PublicKeyToken=null
// MVID: 17CE22F4-AACB-40F0-A40B-481263D3D4EF
// Assembly location: C:\Users\gustavo.solano\Downloads\AndcultureCode.ZoomClient.dll

using AndcultureCode.ZoomClient.Interfaces;
using System.Collections.Generic;

namespace AndcultureCode.ZoomClient.Models.Users
{
  public class CreateUser : ICreatable
  {
    public string Email { get; set; }

    public UserTypes Type { get; set; }

    public string FirstName { get; set; }

    public string LastName { get; set; }

    public string Password { get; set; }

    public List<string> Validate()
    {
      List<string> stringList = new List<string>();
      if (string.IsNullOrWhiteSpace(this.Email))
        stringList.Add("Email property is required for creating user");
      if (!string.IsNullOrWhiteSpace(this.FirstName) && this.FirstName.Length > 64)
        stringList.Add(string.Format("{0} property max length is {1} characters", (object) "FirstName", (object) 64));
      if (!string.IsNullOrWhiteSpace(this.LastName) && this.LastName.Length > 64)
        stringList.Add(string.Format("{0} property max length is {1} characters", (object) "LastName", (object) 64));
      return stringList;
    }
  }
}
