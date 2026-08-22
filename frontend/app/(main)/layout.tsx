"use client";

import * as React from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppNavbar } from "@/components/layout/AppNavbar";
import { MobileNav } from "@/components/layout/MobileNav";
import { AITravelAssistant } from "@/components/common/AITravelAssistant";
import { CurrencyConverterModal } from "@/components/common/CurrencyConverterModal";

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [aiAssistantOpen, setAiAssistantOpen] = React.useState(false);
  const [currencyModalOpen, setCurrencyModalOpen] = React.useState(false);

  return (
    <div className="min-h-screen flex bg-zinc-50/60 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      {/* Collapsible Desktop Sidebar */}
      <AppSidebar
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onOpenAIAssistant={() => setAiAssistantOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-6">
        <AppNavbar
          onOpenAIAssistant={() => setAiAssistantOpen(true)}
          onOpenCurrencyConverter={() => setCurrencyModalOpen(true)}
          onOpenMobileMenu={() => setSidebarCollapsed(false)}
        />

        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto animate-in fade-in-50 duration-300">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* AI Travel Assistant Drawer */}
      <AITravelAssistant
        isOpen={aiAssistantOpen}
        onClose={() => setAiAssistantOpen(false)}
      />

      {/* Live Currency Converter Modal */}
      <CurrencyConverterModal
        isOpen={currencyModalOpen}
        onClose={() => setCurrencyModalOpen(false)}
      />
    </div>
  );
}
