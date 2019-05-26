// Decompiled with JetBrains decompiler
// Type: AndcultureCode.ZoomClient.Interfaces.IZoomClient
// Assembly: AndcultureCode.ZoomClient, Version=1.0.17.0, Culture=neutral, PublicKeyToken=null
// MVID: 17CE22F4-AACB-40F0-A40B-481263D3D4EF
// Assembly location: C:\Users\gustavo.solano\Downloads\AndcultureCode.ZoomClient.dll

namespace AndcultureCode.ZoomClient.Interfaces
{
  public interface IZoomClient
  {
    IZoomGroupsClient Groups { get; }

    IZoomMeetingsClient Meetings { get; }

    IZoomReportsClient Reports { get; }

    IZoomUsersClient Users { get; }

    IZoomWebhookClient Webhooks { get; }
  }
}
