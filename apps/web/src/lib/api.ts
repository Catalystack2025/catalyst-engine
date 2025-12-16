const API_BASE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:8000";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const headers = new Headers(options.headers || {});

  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}

export type MessageType = "text" | "image" | "audio" | "document" | "sticker" | "video";

export interface WhatsAppMessagePayload {
  to: string;
  type: MessageType;
  text?: string;
  media_id?: string;
  media_link?: string;
  caption?: string;
}

export interface WhatsAppMessageResponse {
  messages?: { id: string }[];
}

export interface MessageStatusResponse {
  message_id: string;
  latest: Record<string, unknown> | null;
  history: Record<string, unknown>[];
}

export const sendWhatsAppMessage = (payload: WhatsAppMessagePayload) =>
  request<WhatsAppMessageResponse>("/whatsapp/messages", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const getMessageStatus = (messageId: string) =>
  request<MessageStatusResponse>(`/whatsapp/messages/${messageId}/status`);

export const uploadMedia = (file: File, mediaType: MessageType) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("media_type", mediaType);

  return request<{ id: string }>("/whatsapp/media", {
    method: "POST",
    body: formData,
  });
};

export const getTemplateStatus = (templateId: string) =>
  request<{ id: string; status?: string }>(`/whatsapp/templates/${templateId}/status`);

export const apiBaseUrl = API_BASE_URL;
