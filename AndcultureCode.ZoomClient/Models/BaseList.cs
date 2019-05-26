// Decompiled with JetBrains decompiler
// Type: AndcultureCode.ZoomClient.Models.BaseList
// Assembly: AndcultureCode.ZoomClient, Version=1.0.17.0, Culture=neutral, PublicKeyToken=null
// MVID: 17CE22F4-AACB-40F0-A40B-481263D3D4EF
// Assembly location: C:\Users\gustavo.solano\Downloads\AndcultureCode.ZoomClient.dll

namespace AndcultureCode.ZoomClient.Models
{
  public abstract class BaseList
  {
    public int PageCount { get; set; }

    public int PageNumber { get; set; }

    public int PageSize { get; set; }

    public int TotalRecords { get; set; }
  }
}
