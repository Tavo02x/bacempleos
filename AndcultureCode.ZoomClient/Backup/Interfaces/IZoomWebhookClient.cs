// Decompiled with JetBrains decompiler
// Type: AndcultureCode.ZoomClient.Interfaces.IZoomWebhookClient
// Assembly: AndcultureCode.ZoomClient, Version=1.0.17.0, Culture=neutral, PublicKeyToken=null
// MVID: 17CE22F4-AACB-40F0-A40B-481263D3D4EF
// Assembly location: C:\Users\gustavo.solano\Downloads\AndcultureCode.ZoomClient.dll

using AndcultureCode.ZoomClient.Models.Webhooks;

namespace AndcultureCode.ZoomClient.Interfaces
{
  public interface IZoomWebhookClient
  {
    ListWebhooks GetWebhooks();

    Webhook CreateWebhook(CreateWebhook createWebhook);

    Webhook GetWebhook(string webhookId);

    bool UpdateWebhook(string webhookId, UpdateWebhook webhook);

    bool DeleteWebhook(string webhookId);
  }
}
