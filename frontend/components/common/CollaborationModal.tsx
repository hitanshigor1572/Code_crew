"use client";

import * as React from "react";
import { Users, Mail, Copy, Check, Shield, UserPlus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Collaborator } from "@/types/user";

interface CollaborationModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripTitle: string;
  collaborators: Collaborator[];
}

export function CollaborationModal({
  isOpen,
  onClose,
  tripTitle,
  collaborators: initialCollaborators,
}: CollaborationModalProps) {
  const [collaborators, setCollaborators] = React.useState<Collaborator[]>(initialCollaborators || []);
  const [emailInput, setEmailInput] = React.useState("");
  const [copied, setCopied] = React.useState(false);

  const inviteLink = `https://globetrotter.io/shared/gt-share-${Math.random().toString(36).substring(2, 6)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    toast.success("Trip invite link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    const newCollab: Collaborator = {
      id: `collab-${Date.now()}`,
      name: emailInput.split("@")[0],
      email: emailInput.trim(),
      avatar: `https://avatar.vercel.sh/${emailInput.trim()}`,
      role: "editor",
      status: "invited",
    };

    setCollaborators((prev) => [...prev, newCollab]);
    setEmailInput("");
    toast.success(`Invitation sent to ${emailInput}!`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] rounded-3xl p-6">
        <DialogHeader className="text-left">
          <div className="flex items-center gap-2 text-primary font-bold text-sm">
            <Users className="h-4 w-4" />
            <span>Group Travel</span>
          </div>
          <DialogTitle className="text-xl font-bold">Collaborate on Trip</DialogTitle>
          <DialogDescription className="text-xs">
            Invite friends & co-travelers to plan <strong className="text-zinc-800 dark:text-zinc-200">{tripTitle}</strong> together in real time.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Invite by Email */}
          <form onSubmit={handleInvite} className="flex gap-2">
            <div className="relative flex-1">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                type="email"
                placeholder="friend@example.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="pl-10 h-11 rounded-2xl text-xs"
              />
            </div>
            <Button type="submit" className="rounded-2xl gap-1.5 h-11 px-4 text-xs font-semibold">
              <UserPlus className="h-4 w-4" />
              <span>Invite</span>
            </Button>
          </form>

          {/* Active & Invited Members */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Travel Party ({collaborators.length})
            </p>
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60 max-h-52 overflow-y-auto">
              {collaborators.map((c) => (
                <div key={c.id} className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 ring-1 ring-primary/20">
                      <AvatarImage src={c.avatar} />
                      <AvatarFallback>{c.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{c.name}</p>
                      <p className="text-[11px] text-zinc-400">{c.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={c.role === "owner" ? "default" : "outline"}
                      className="text-[10px] capitalize"
                    >
                      {c.role}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Copy Share Link */}
          <div className="rounded-2xl bg-zinc-50 dark:bg-zinc-900/80 p-3.5 border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold text-zinc-500">Public Shareable Link</p>
              <p className="text-xs font-mono text-zinc-700 dark:text-zinc-300 truncate">
                {inviteLink}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="rounded-xl text-xs gap-1.5 shrink-0"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
