"use client";

import * as React from "react";
import {
  Sparkles,
  Send,
  Bot,
  User,
  MapPin,
  Calendar,
  CheckCircle2,
  ListTodo,
  Compass,
  Zap,
} from "lucide-react";
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
import { toast } from "sonner";
import { api } from "@/lib/api";

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

export function AITravelAssistant({ isOpen, onClose }: AITravelAssistantProps) {
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      id: "msg-0",
      sender: "ai",
      text: "Hello Alexandre! I'm your GlobeTrotter AI Copilot. I can build personalized multi-city itineraries, suggest secret foodie spots in Tokyo or Paris, optimize transit routes, or calculate budget estimates. What's on your travel mind today?",
      timestamp: "Just now",
      suggestions: [
        "Plan a 3-day Paris food & wine trail",
        "What should I pack for Tokyo in October?",
        "Find budget-friendly romantic stays in Rome",
        "Compare costs: Bali vs Goa for 5 days",
      ],
    },
  ]);
  const [inputValue, setInputValue] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: text.trim(),
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue("");
    setIsTyping(true);
    try {
      const history = [...messages, userMsg].map((item) => ({ role: item.sender === "ai" ? "assistant" : "user", content: item.text }));
      const result = await api<{ text: string }>("/ai/chat", { method: "POST", body: JSON.stringify({ message: text.trim(), history }) });
      setMessages((prev) => [...prev, { id: `ai-${Date.now()}`, sender: "ai", text: result.text, timestamp: "Just now" }]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Copilot is temporarily unavailable");
    } finally { setIsTyping(false); }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0 rounded-l-3xl">
        <SheetHeader className="p-5 pb-3 border-b border-zinc-100 dark:border-zinc-800 bg-gradient-to-r from-primary/10 via-secondary/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-primary via-secondary to-accent flex items-center justify-center text-white shadow-md shadow-primary/20">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <SheetTitle className="text-base font-bold flex items-center gap-2">
                GlobeTrotter AI Copilot
                <Badge variant="success" className="text-[10px] h-4">Online</Badge>
              </SheetTitle>
              <SheetDescription className="text-xs">
                Personalized itineraries, packing & local secrets
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {/* Chat Stream */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.sender === "ai" && (
                <div className="h-8 w-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="h-4 w-4" />
                </div>
              )}
              <div
                className={`max-w-[82%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-primary text-white shadow-md shadow-primary/20 rounded-tr-sm"
                    : "bg-zinc-100/90 dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-tl-sm whitespace-pre-line"
                }`}
              >
                {msg.text}

                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-zinc-200/50 dark:border-zinc-800 flex flex-wrap gap-1.5">
                    {msg.suggestions.map((s, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          if (s.startsWith("Add this to my")) {
                            toast.success("Added suggestions to Paris Explorer itinerary!");
                          } else {
                            handleSend(s);
                          }
                        }}
                        className="text-[11px] font-medium px-2.5 py-1 rounded-xl bg-white dark:bg-zinc-800 border border-primary/20 text-primary hover:bg-primary/10 transition-colors flex items-center gap-1"
                      >
                        <Zap className="h-3 w-3" /> {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 justify-start items-center text-zinc-400">
              <div className="h-8 w-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Bot className="h-4 w-4" />
              </div>
              <div className="bg-zinc-100 dark:bg-zinc-900 px-3.5 py-2.5 rounded-2xl text-xs flex gap-1.5 items-center">
                <span className="h-2 w-2 rounded-full bg-primary animate-bounce" />
                <span className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:0.2s]" />
                <span className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-zinc-100 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <Input
              type="text"
              placeholder="Ask Copilot anything..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="h-10 text-xs rounded-xl"
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
        </div>
      </SheetContent>
    </Sheet>
  );
}
