"use client";

import * as React from "react";
import {
  Users,
  Mail,
  Copy,
  Check,
  UserPlus,
  Link as LinkIcon,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
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
import { inviteTripCollaborator } from "@/lib/services/trip.service";

interface CollaborationModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripId: string;
  shareId?: string;
  tripTitle: string;
  collaborators: Collaborator[];
  onCollaboratorsChange?: (collaborators: Collaborator[]) => void;
}

type InviteState = "idle" | "loading" | "success" | "error";

export function CollaborationModal({
  isOpen,
  onClose,
  tripId,
  shareId,
  tripTitle,
  collaborators: initialCollaborators,
  onCollaboratorsChange,
}: CollaborationModalProps) {
  const [collaborators, setCollaborators] = React.useState<Collaborator[]>(
    initialCollaborators || []
  );
  const [emailInput, setEmailInput] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
  const [inviteRole, setInviteRole] = React.useState<"editor" | "viewer">("editor");
  const [inviteState, setInviteState] = React.useState<InviteState>("idle");
  const [lastInvitedEmail, setLastInvitedEmail] = React.useState("");
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    setCollaborators(initialCollaborators || []);
  }, [initialCollaborators, isOpen]);

  // Reset invite state when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setInviteState("idle");
      setEmailInput("");
      setEmailError("");
      setLastInvitedEmail("");
    }
  }, [isOpen]);

  const inviteLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/shared/${shareId || ""}`
      : `https://globetrotter.io/shared/${shareId || ""}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    toast.success("Trip invite link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const validateEmail = (email: string) => {
    if (!email.trim()) return "Email address is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return "Please enter a valid email address.";
    const already = collaborators.find(
      (c) => c.email?.toLowerCase() === email.trim().toLowerCase()
    );
    if (already?.status === "active") return "This traveler already has access.";
    return "";
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = emailInput.trim().toLowerCase();
    const error = validateEmail(email);
    if (error) {
      setEmailError(error);
      return;
    }
    setEmailError("");
    setInviteState("loading");
    try {
      const result = await inviteTripCollaborator(tripId, email, inviteRole);
      setCollaborators(result.collaborators);
      onCollaboratorsChange?.(result.collaborators);
      setLastInvitedEmail(email);
      setEmailInput("");
      setInviteState("success");
      toast.success(`✈️ Invitation sent to ${email}`);
      // Auto-reset success state after 5s
      setTimeout(() => setInviteState("idle"), 5000);
    } catch (error) {
      setInviteState("error");
      const msg = error instanceof Error ? error.message : "Failed to send invitation";
      setEmailError(msg);
      toast.error(msg);
      setTimeout(() => setInviteState("idle"), 4000);
    }
  };

  const statusBadge = (collaborator: Collaborator) => {
    const status = (collaborator as any).status || "active";
    if (status === "invited") {
      return (
        <Badge className="text-[10px] bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800">
          Invited
        </Badge>
      );
    }
    return (
      <Badge className="text-[10px] bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800">
        Active
      </Badge>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] rounded-3xl p-6">
        <DialogHeader className="text-left">
          <div className="flex items-center gap-2 text-primary font-bold text-sm">
            <Users className="h-4 w-4" />
            <span>Group Travel</span>
          </div>
          <DialogTitle className="text-xl font-bold">Collaborate on Trip</DialogTitle>
          <DialogDescription className="text-xs">
            Invite friends & co-travelers to plan{" "}
            <strong className="text-zinc-800 dark:text-zinc-200">{tripTitle}</strong> together in
            real time.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* ─── Invite by Email ─────────────────────────────────────────── */}
          {inviteState === "success" ? (
            // Success state
            <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 p-4 flex flex-col items-center text-center gap-2">
              <CheckCircle2 className="h-8 w-8 text-emerald-500" />
              <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                Invitation sent!
              </p>
              <p className="text-xs text-emerald-600 dark:text-emerald-500">
                An email with the trip link was sent to{" "}
                <strong>{lastInvitedEmail}</strong>.
              </p>
              <p className="text-[11px] text-zinc-400 mt-1">
                They can also use the shareable link below to join.
              </p>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="rounded-xl text-xs mt-1"
                onClick={() => setInviteState("idle")}
              >
                Invite Another Person
              </Button>
            </div>
          ) : (
            <form onSubmit={handleInvite} className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <Input
                    type="email"
                    placeholder="friend@example.com"
                    value={emailInput}
                    onChange={(e) => {
                      setEmailInput(e.target.value);
                      if (emailError) setEmailError("");
                    }}
                    className={`pl-10 h-11 rounded-2xl text-xs ${
                      emailError
                        ? "border-red-400 focus-visible:ring-red-400"
                        : ""
                    }`}
                    disabled={inviteState === "loading"}
                  />
                </div>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as "editor" | "viewer")}
                  className="h-11 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 text-xs font-semibold text-zinc-600 dark:text-zinc-300"
                  disabled={inviteState === "loading"}
                >
                  <option value="editor">✏️ Editor</option>
                  <option value="viewer">👁 Viewer</option>
                </select>
                <Button
                  type="submit"
                  className="rounded-2xl gap-1.5 h-11 px-4 text-xs font-semibold shrink-0"
                  disabled={inviteState === "loading"}
                >
                  {inviteState === "loading" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  <span>{inviteState === "loading" ? "Sending…" : "Send Invite"}</span>
                </Button>
              </div>

              {emailError && (
                <div className="flex items-center gap-1.5 text-[11px] text-red-600 dark:text-red-400">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {emailError}
                </div>
              )}
            </form>
          )}

          {/* ─── Travel Party List ────────────────────────────────────────── */}
          {collaborators.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Travel Party ({collaborators.length})
              </p>
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60 max-h-48 overflow-y-auto rounded-2xl border border-zinc-200 dark:border-zinc-800">
                {collaborators.map((c) => (
                  <div key={c.id} className="py-2.5 px-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 ring-1 ring-primary/20">
                        <AvatarImage src={c.avatar} />
                        <AvatarFallback className="text-xs font-bold">
                          {c.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                          {c.name}
                        </p>
                        <p className="text-[11px] text-zinc-400">{c.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {statusBadge(c)}
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
          )}

          {/* ─── Copy Share Link ──────────────────────────────────────────── */}
          <div className="rounded-2xl bg-zinc-50 dark:bg-zinc-900/80 p-3.5 border border-zinc-200/80 dark:border-zinc-800">
            <p className="text-[11px] font-semibold text-zinc-500 mb-1.5 flex items-center gap-1.5">
              <LinkIcon className="h-3.5 w-3.5" />
              Public Shareable Link
            </p>
            <div className="flex items-center gap-2">
              <p className="text-xs font-mono text-zinc-700 dark:text-zinc-300 truncate flex-1 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2">
                {inviteLink}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyLink}
                className="rounded-xl text-xs gap-1.5 shrink-0"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                <span>{copied ? "Copied!" : "Copy"}</span>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
