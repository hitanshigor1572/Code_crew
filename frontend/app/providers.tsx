"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
    >
      <TooltipProvider delayDuration={200}>
        {children}
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            duration: 4000,
            className: "rounded-2xl border backdrop-blur-xl shadow-xl",
          }}
        />
      </TooltipProvider>
    </NextThemesProvider>
  );
}
