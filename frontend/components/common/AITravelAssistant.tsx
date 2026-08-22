"use client";

import * as React from "react";
import { Sparkles, Send, Bot, Zap, Copy, Check, RefreshCw, Mic } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MarkdownMessage } from "@/components/common/MarkdownMessage";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { getCurrentUser } from "@/lib/services/user.service";

interface AITravelAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: "ai" | "user";
  text: string;
  timestamp: string;
  suggestions?: string[];
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = React.useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      type="button"
      onClick={handleCopy}
      title="Copy message"
      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
    >
      {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
    </button>
  );
}

const QUICK_PROMPTS = [
  "Plan a 7-day India adventure with budget estimates",
  "Plan a 3-day Paris food & wine trail",
  "What should I pack for Tokyo in October?",
  "Compare costs: Bali vs Goa for 5 days",
];

export function AITravelAssistant({ isOpen, onClose }: AITravelAssistantProps) {
  const [userName, setUserName] = React.useState("Traveler");
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);
  const [showQuickPrompts, setShowQuickPrompts] = React.useState(true);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!isOpen) return;
    getCurrentUser()
      .then((user) => {
        const firstName = user.name.split(" ")[0] || "Traveler";
        setUserName(firstName);
        setMessages([
          {
            id: "msg-0",
            sender: "ai",
            text: `Hello **${firstName}**! I'm your **GlobeTrotter AI Copilot**. I can build personalized multi-city itineraries, suggest local foodie spots, optimize transit routes, or calculate budget estimates.\n\nWhat's on your travel mind today?`,
            timestamp: "Just now",
            suggestions: QUICK_PROMPTS,
          },
        ]);
        setShowQuickPrompts(true);
      })
      .catch(() => {
        setMessages([
          {
            id: "msg-0",
            sender: "ai",
            text: "Hello! I'm your **GlobeTrotter AI Copilot**. Ask me to plan itineraries, estimate budgets, or suggest destinations.",
            timestamp: "Just now",
            suggestions: QUICK_PROMPTS,
          },
        ]);
        setShowQuickPrompts(true);
      });
  }, [isOpen]);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    setShowQuickPrompts(false);

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue("");
    setIsTyping(true);
    try {
      const history = [...messages, userMsg].map((item) => ({
        role: item.sender === "ai" ? "assistant" : "user",
        content: item.text,
      }));
      const result = await api<{ text: string }>("/ai/chat", {
        method: "POST",
        body: JSON.stringify({ message: text.trim(), history }),
      });
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: result.text,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Copilot is temporarily unavailable");
    } finally {
      setIsTyping(false);
    }
  };

  const handleReset = () => {
    setMessages([]);
    setShowQuickPrompts(true);
    setInputValue("");
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-lg flex flex-col p-0 rounded-l-3xl gap-0">
        {/* Header */}
        <SheetHeader className="p-5 pb-3 border-b border-zinc-100 dark:border-zinc-800 bg-gradient-to-r from-primary/10 via-secondary/10 to-transparent shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-primary via-secondary to-accent flex items-center justify-center text-white shadow-md shadow-primary/20">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>
            <div className="flex-1">
              <SheetTitle className="text-base font-bold flex items-center gap-2">
                GlobeTrotter AI Copilot
                <Badge variant="success" className="text-[10px] h-4">Online</Badge>
              </SheetTitle>
              <SheetDescription className="text-xs">
                Personalized itineraries, packing & local secrets
              </SheetDescription>
            </div>
            <button
              type="button"
              onClick={handleReset}
              title="New conversation"
              className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </SheetHeader>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 scroll-smooth">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 group ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.sender === "ai" && (
                <div className="h-7 w-7 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 text-primary flex items-center justify-center shrink-0 mt-1 border border-primary/10">
                  <Bot className="h-3.5 w-3.5" />
                </div>
              )}

              <div className="max-w-[88%] flex flex-col gap-1">
                <div
                  className={`rounded-2xl p-3.5 text-xs leading-relaxed shadow-sm ${
                    msg.sender === "user"
                      ? "bg-gradient-to-br from-primary to-primary/80 text-white rounded-tr-sm whitespace-pre-line"
                      : "bg-white dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-tl-sm"
                  }`}
                >
                  {msg.sender === "ai" ? (
                    <MarkdownMessage text={msg.text} />
                  ) : (
                    msg.text
                  )}
                </div>

                {/* Timestamp + Copy */}
                <div className={`flex items-center gap-1.5 px-1 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <span className="text-[10px] text-zinc-400">{msg.timestamp}</span>
                  {msg.sender === "ai" && <CopyButton text={msg.text} />}
                </div>

                {/* Quick suggestion chips (only on first AI msg) */}
                {msg.suggestions && msg.suggestions.length > 0 && showQuickPrompts && (
                  <div className="mt-1.5 flex flex-col gap-1.5">
                    {msg.suggestions.map((s, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSend(s)}
                        className="text-[11px] font-medium px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-primary/20 text-primary hover:bg-primary hover:text-white dark:hover:bg-primary transition-all text-left flex items-center gap-1.5 shadow-sm"
                      >
                        <Zap className="h-3 w-3 shrink-0" />
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex gap-2.5 justify-start items-center">
              <div className="h-7 w-7 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 text-primary flex items-center justify-center shrink-0 border border-primary/10">
                <Bot className="h-3.5 w-3.5" />
              </div>
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex gap-1.5 items-center">
                <span className="h-2 w-2 rounded-full bg-primary animate-bounce" />
                <span className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:0.15s]" />
                <span className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:0.3s]" />
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-3 border-t border-zinc-100 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <Input
              type="text"
              placeholder={`Ask Copilot anything, ${userName}...`}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="h-10 text-xs rounded-xl flex-1"
              disabled={isTyping}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!inputValue.trim() || isTyping}
              className="h-10 w-10 shrink-0 rounded-xl"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
          <p className="text-[10px] text-zinc-400 text-center mt-2">
            AI estimates only — verify costs before booking
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
