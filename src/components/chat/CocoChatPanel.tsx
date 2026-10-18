import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Settings, Sparkles, AlertCircle, RefreshCw, Bot, HelpCircle } from 'lucide-react';
import { n8nService, ChatMessage } from '../../services/n8nChatService';
import { sound } from '../../services/soundEngine';

interface CocoChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'intro-1',
    sender: 'coco',
    text: "Hiii! I'm Coco! Welcome to my Sugarberry Lane kitchen! What would you like to chat about or bake today? 🍓",
    timestamp: 'Just now',
  },
];

const SUGGESTIONS = [
  "What should I bake today?",
  "How do I win Cake Chaos?",
  "Tell me about your whisk!",
  "What's the secret to fluffy sponge cake?",
];

export const CocoChatPanel: React.FC<CocoChatPanelProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [webhookInput, setWebhookInput] = useState(n8nService.getWebhookUrl());
  const [sessionId] = useState(() => `session_${Math.random().toString(36).substring(2, 9)}`);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    sound.playPop();

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    if (n8nService.isConfigured()) {
      try {
        const reply = await n8nService.sendMessage(text, sessionId);
        sound.playChime();
        const botMsg: ChatMessage = {
          id: `coco-${Date.now()}`,
          sender: 'coco',
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, botMsg]);
      } catch (err: unknown) {
        sound.playOops();
        const errorDetail = err instanceof Error ? err.message : 'Network error';
        const errorMsg: ChatMessage = {
          id: `err-${Date.now()}`,
          sender: 'system',
          text: `⚠️ Webhook connection failed (${errorDetail}). Using Coco's offline kitchen guide below.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isError: true,
        };

        const offlineReply: ChatMessage = {
          id: `coco-offline-${Date.now()}`,
          sender: 'coco',
          text: n8nService.getOfflineBakeryResponse(text),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages((prev) => [...prev, errorMsg, offlineReply]);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Offline mode with clear indicator
      setTimeout(() => {
        sound.playChime();
        const offlineReply: ChatMessage = {
          id: `coco-offline-${Date.now()}`,
          sender: 'coco',
          text: n8nService.getOfflineBakeryResponse(text),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, offlineReply]);
        setIsLoading(false);
      }, 500);
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playSprinkles();
    n8nService.setCustomWebhookUrl(webhookInput);
    setShowSettings(false);

    const confMsg: ChatMessage = {
      id: `sys-${Date.now()}`,
      sender: 'system',
      text: webhookInput
        ? `✅ Webhook updated to: ${webhookInput}`
        : 'ℹ️ Webhook cleared. Switched to offline recipe assistant mode.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, confMsg]);
  };

  return (
    <div
      className="fixed inset-y-0 right-0 sm:inset-y-auto sm:bottom-6 sm:right-6 w-full sm:w-96 sm:max-h-[580px] bg-white border-l sm:border-2 border-[#FFD1DC] sm:rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden animate-in slide-in-from-right-4 duration-200"
      role="dialog"
      aria-label="Chat with Coco"
    >
      {/* Top Header */}
      <div className="bg-gradient-to-r from-[#FFE4E9] to-[#FFF0E6] px-4 py-3 border-b border-[#FFCCD5] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-lg shadow-2xs">
            🍓
          </span>
          <div>
            <h3 className="font-extrabold text-xs sm:text-sm text-[#3D2314] leading-tight flex items-center gap-1.5">
              <span>Coco the Baker</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" title="Online" />
            </h3>
            <span className="text-[10px] text-[#8C7A70] block">
              {n8nService.isConfigured() ? 'Connected via n8n Webhook' : 'Sugarberry Assistant (Local)'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              sound.playPop();
              setShowSettings(!showSettings);
            }}
            className="p-1.5 rounded-lg text-[#664635] hover:bg-white/60 transition-colors"
            title="Configure n8n Webhook URL"
          >
            <Settings size={16} />
          </button>
          <button
            onClick={() => {
              sound.playPop();
              onClose();
            }}
            className="p-1.5 rounded-lg text-[#664635] hover:bg-white/60 transition-colors"
            aria-label="Close chat"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Settings Panel Accordion */}
      {showSettings && (
        <form onSubmit={handleSaveSettings} className="bg-[#FFF9F2] p-3.5 border-b border-[#FDE68A] space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#78350F] flex items-center gap-1">
              <Settings size={12} />
              <span>n8n Webhook Settings</span>
            </span>
            <span className="text-[10px] text-[#B45309]">Optional</span>
          </div>
          <p className="text-[11px] text-[#92400E] leading-normal">
            Enter your custom n8n Webhook URL (POST). If left blank, Coco uses her built-in bakery guidance.
          </p>
          <input
            type="url"
            value={webhookInput}
            onChange={(e) => setWebhookInput(e.target.value)}
            placeholder="https://your-n8n.instance/webhook/..."
            className="w-full px-2.5 py-1.5 rounded-lg border border-[#EADBCE] bg-white text-xs font-mono text-[#3D2314] focus:outline-none focus:border-[#D81159]"
          />
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowSettings(false)}
              className="px-2.5 py-1 rounded-lg text-[#664635] hover:bg-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 rounded-lg bg-[#D81159] text-white font-bold text-xs shadow-2xs"
            >
              Save Endpoint
            </button>
          </div>
        </form>
      )}

      {/* Chat Messages Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#FFFDF9] text-xs">
        {messages.map((msg) => {
          if (msg.sender === 'system') {
            return (
              <div
                key={msg.id}
                className={`p-2 rounded-xl text-[11px] text-center font-medium ${
                  msg.isError
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}
              >
                {msg.text}
              </div>
            );
          }

          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-2xl shadow-2xs leading-relaxed ${
                  isUser
                    ? 'bg-[#D81159] text-white rounded-br-xs'
                    : 'bg-white text-[#3D2314] border border-[#FFE4E9] rounded-bl-xs'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[9px] text-[#8C7A70] mt-0.5 px-1 tabular-nums">
                {msg.timestamp}
              </span>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 p-3 bg-white border border-[#FFE4E9] rounded-2xl w-24">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D81159] animate-bounce" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#D81159] animate-bounce [animation-delay:0.2s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#D81159] animate-bounce [animation-delay:0.4s]" />
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="px-3 py-2 bg-[#FFFDF7] border-t border-[#F2E5D3] flex gap-1.5 overflow-x-auto whitespace-nowrap text-[11px] scrollbar-none">
        {SUGGESTIONS.map((sugg, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(sugg)}
            className="px-2.5 py-1 rounded-full bg-[#FFE4E9]/60 hover:bg-[#FFE4E9] text-[#D81159] border border-[#FFCCD5] transition-colors shrink-0"
          >
            {sugg}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="p-3 bg-white border-t border-[#FFCCD5] flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask Coco a question..."
          className="flex-1 px-3 py-2 rounded-xl border border-[#EADBCE] bg-[#FFFDF9] text-xs text-[#3D2314] focus:outline-none focus:border-[#D81159]"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="p-2.5 rounded-xl bg-[#D81159] hover:bg-[#B50E49] disabled:opacity-40 disabled:pointer-events-none text-white transition-colors"
          aria-label="Send message"
        >
          <Send size={15} />
        </button>
      </form>
    </div>
  );
};
