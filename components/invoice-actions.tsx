"use client";
import { Button } from "@/components/button";
import { Printer, Download, Save, Send } from "lucide-react";

interface InvoiceActionsProps {
  onPrint: () => void;
  onDownload: () => void;
  onSave: () => void;
  onSend: () => void;
  sending: boolean;
}

export function InvoiceActions({ onPrint, onDownload, onSave, onSend, sending }: InvoiceActionsProps) {
  return (
    <>
      <Button onClick={onPrint} variant="primary" className="gap-2">
        <Printer className="w-4 h-4" />
        Print
      </Button>
      <Button onClick={onDownload} variant="secondary" className="gap-2">
        <Download className="w-4 h-4" />
        Download
      </Button>
      <Button onClick={onSave} variant="ghost" className="gap-2">
        <Save className="w-4 h-4" />
        Save
      </Button>
      <Button onClick={onSend} disabled={sending} variant="primary" className="gap-2">
        <Send className="w-4 h-4" />
        {sending ? 'Sending...' : 'Send'}
      </Button>
    </>
  );
}