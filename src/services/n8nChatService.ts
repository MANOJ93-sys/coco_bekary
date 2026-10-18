/**
 * Service to communicate with an external n8n webhook workflow.
 * Reads configurable URL from VITE_N8N_WEBHOOK_URL or runtime user input.
 */

export interface ChatMessage {
  id: string;
  sender: 'user' | 'coco' | 'system';
  text: string;
  timestamp: string;
  isError?: boolean;
}

export class N8nChatService {
  private customWebhookUrl: string = '';

  constructor() {
    const saved = localStorage.getItem('coco_n8n_webhook_url');
    if (saved) {
      this.customWebhookUrl = saved;
    }
  }

  public getWebhookUrl(): string {
    const envUrl = import.meta.env.VITE_N8N_WEBHOOK_URL as string | undefined;
    return this.customWebhookUrl || envUrl || '';
  }

  public setCustomWebhookUrl(url: string): void {
    this.customWebhookUrl = url.trim();
    if (this.customWebhookUrl) {
      localStorage.setItem('coco_n8n_webhook_url', this.customWebhookUrl);
    } else {
      localStorage.removeItem('coco_n8n_webhook_url');
    }
  }

  public isConfigured(): boolean {
    return Boolean(this.getWebhookUrl());
  }

  /**
   * Send user message to n8n Webhook
   */
  public async sendMessage(messageText: string, sessionId: string): Promise<string> {
    const webhookUrl = this.getWebhookUrl();

    if (!webhookUrl) {
      throw new Error('NO_WEBHOOK_CONFIGURED');
    }

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json, text/plain, */*',
        },
        body: JSON.stringify({
          message: messageText,
          sessionId,
          timestamp: new Date().toISOString(),
          source: 'coco_crumble_web',
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP_${response.status}`);
      }

      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await response.json();
        // Support common n8n webhook response shapes: { reply: "..." }, { output: "..." }, { message: "..." }, { text: "..." }
        return data.reply || data.output || data.message || data.text || JSON.stringify(data);
      } else {
        const text = await response.text();
        return text || "Coco's oven timer dinged, but no words came out!";
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw err;
      }
      throw new Error('NETWORK_FAILURE');
    }
  }

  /**
   * Offline bakery guidance when n8n is not yet configured or disconnected
   */
  public getOfflineBakeryResponse(query: string): string {
    const q = query.toLowerCase();

    if (q.includes('chaos') || q.includes('win') || q.includes('score')) {
      return "To master Cake Chaos, check the customer ticket first! Sponge base and frosting color give 50 points, and finishing quickly gives up to 50 extra speed bonus points! ⭐";
    }
    if (q.includes('whisk') || q.includes('prop')) {
      return "My wooden whisk was carved by my grandfather from a Sugarberry oak branch! It has whipped over 10,000 batches of strawberry meringue! 🥄";
    }
    if (q.includes('bake') || q.includes('today') || q.includes('recommend')) {
      return "Today is a wonderful day for a Wild Strawberry Chiffon with extra whipped cream! Or visit 'Cake for Your Mood' to let your heart pick the recipe!";
    }
    if (q.includes('secret') || q.includes('easter') || q.includes('hair') || q.includes('clip')) {
      return "Shhh! Tap my strawberry hair clips 5 times and you might discover my secret Golden Chef Toque! ✨";
    }
    if (q.includes('sponge') || q.includes('fluffy')) {
      return "The secret to fluffy sponge cake is whipping the egg whites to soft peaks and gently folding with a spatula. Never rush the fold! 🍰";
    }

    return "Grandma Hazel taught me that a little sweetness can make an ordinary day extraordinary! Try asking me about Cake Chaos tips, my special whisk, or recipe secrets!";
  }
}

export const n8nService = new N8nChatService();
