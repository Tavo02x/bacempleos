// Decompiled with JetBrains decompiler
// Type: AndcultureCode.ZoomClient.Models.Groups.ListGroups
// Assembly: AndcultureCode.ZoomClient, Version=1.0.17.0, Culture=neutral, PublicKeyToken=null
// MVID: 17CE22F4-AACB-40F0-A40B-481263D3D4EF
// Assembly location: C:\Users\gustavo.solano\Downloads\AndcultureCode.ZoomClient.dll

using System.Collections.Generic;

namespace AndcultureCode.ZoomClient.Models.Groups
{
  public class ListGroups
  {
    public int TotalRecords { get; set; }

    public List<Group> Groups { get; set; }
  }
}
