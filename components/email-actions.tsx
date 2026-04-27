"use client";
import { Button } from "@/components/button";
import { Send, Loader2 } from "lucide-react";

interface EmailActionsProps {
  onSend: () => void;
  sending: boolean;
}

export function EmailActions({ onSend, sending }: EmailActionsProps) {
  return (
    <Button onClick={onSend} disabled={sending} variant="primary" className="gap-2">
      {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
      {sending ? 'Sending...' : 'Send'}
    </Button>
  );
}