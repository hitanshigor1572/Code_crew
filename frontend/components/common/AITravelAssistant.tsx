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

  const handleSend = (textToSend?: string) => {
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

    setTimeout(() => {
      let aiResponseText = "";
      let suggestions: string[] = [];

      if (text.toLowerCase().includes("paris") || text.toLowerCase().includes("food")) {
        aiResponseText = `Here is a curated 3-Day Paris Epicurean Trail:\n\n🥖 **Day 1: Classic Marais & Saint-Germain**\n• Morning: Flaky croissants at Du Pain et des Idées\n• Afternoon: Wine & Comté cheese tasting in Latin Quarter cellar\n• Evening: 4-course Seine gourmet sunset cruise\n\n🍷 **Day 2: Montmartre Bohemian Bites**\n• Morning: Artisanal eclair tasting at Place du Tertre\n• Evening: Traditional duck confit at Le Relais de Venise\n\nWould you like me to insert this directly into your **Paris Explorer** itinerary?`;
        suggestions = ["Add this to my Paris Trip", "Find wine bars near Le Marais"];
      } else if (text.toLowerCase().includes("pack") || text.toLowerCase().includes("tokyo")) {
        aiResponseText = `🎒 **Tokyo October Packing Checklist:**\n\n✅ **Clothing (Average 18°C–22°C):** Lightweight layers, trench coat or windbreaker, comfortable walking sneakers (expect 15k+ steps/day), slip-on shoes for temples.\n✅ **Tech:** Suica/Pasmo IC card in Apple/Google Wallet, pocket Wi-Fi or eSIM, 2-prong Type A power adapter.\n✅ **Etiquette essentials:** Small handkerchief (many restrooms lack dryers), coin pouch for 100/500 yen coins.`;
        suggestions = ["Add packing list to notes", "Check Tokyo subway tips"];
      } else if (text.toLowerCase().includes("bali") || text.toLowerCase().includes("goa")) {
        aiResponseText = `📊 **Cost & Vibe Comparison (5 Days):**\n\n• **Bali ($425 total avg):** Tropical wellness, emerald rice terraces, luxury private pool villas ($70/night), world-class surf.\n• **Goa ($290 total avg):** Portuguese heritage architecture, fiery seafood curries, beach shacks, vibrant night markets.\n\n*Verdict:* Choose **Bali** for exotic luxury and wellness, or **Goa** for high-energy coastal relaxation on a tighter budget!`;
        suggestions = ["Create a Bali Itinerary", "Create a Goa Itinerary"];
      } else {
        aiResponseText = `Great question! Based on your travel preferences (moderate pace, boutique stays, culinary highlights), I recommend exploring our multi-city itinerary builder. You can easily add stops, balance daily budgets, and visualize connecting trains or flights with one click.`;
        suggestions = ["Show trending cities", "Optimize my current trip"];
      }

      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: aiResponseText,
          timestamp: "Just now",
          suggestions,
        },
      ]);
    }, 900);
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
