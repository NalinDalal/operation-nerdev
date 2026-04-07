"use client";
import React, { useState } from "react";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { Header } from "@/components/header";
import { Link2, Copy, CheckCircle2 } from "lucide-react";

export default function SignatureLinksPage() {
  const [formData, setFormData] = useState({
    clientName: "",
    documentName: "",
    baseUrl: typeof window !== "undefined" ? window.location.origin : "http://localhost:3000",
  });
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);

  const generateLink = () => {
    const params = new URLSearchParams({
      token: `sig-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: "contract",
      doc: formData.documentName || "Contract",
    });
    const link = `${formData.baseUrl}/sign?${params.toString()}`;
    setGeneratedLink(link);
    setCopied(false);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header title="E-Signature Links" subtitle="Generate signing links to send to clients" active="sign-links" />

      <div className="max-w-[1600px] mx-auto px-4 lg:px-8 py-8">
        <div className="grid gap-6 max-w-2xl">
          <Card className="border-[var(--border)] shadow-sm">
            <CardHeader>
              <CardTitle>Generate Link</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Client Name</Label>
                <Input value={formData.clientName} onChange={(e) => setFormData({ ...formData, clientName: e.target.value })} placeholder="Client Company" />
              </div>
              <div>
                <Label>Document Name</Label>
                <Input value={formData.documentName} onChange={(e) => setFormData({ ...formData, documentName: e.target.value })} placeholder="Contract - Project Name" />
              </div>
              <div>
                <Label>Base URL</Label>
                <Input value={formData.baseUrl} onChange={(e) => setFormData({ ...formData, baseUrl: e.target.value })} placeholder="https://your-domain.com" />
              </div>
              <Button onClick={generateLink} className="w-full gap-2">
                <Link2 className="w-4 h-4" /> Generate Signing Link
              </Button>
            </CardContent>
          </Card>

          {generatedLink && (
            <Card className="border-[var(--border)] shadow-sm">
              <CardHeader>
                <CardTitle>Signing Link Generated</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input value={generatedLink} readOnly className="font-mono text-sm" />
                  <Button variant="outline" onClick={copyLink}>
                    {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
                <div className="bg-blue-50 p-4 rounded-md text-sm text-blue-700">
                  <p className="font-medium mb-1">How to use:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Send this link to {formData.clientName || "the client"}</li>
                    <li>Client enters their name and email</li>
                    <li>Signature is logged with timestamp and IP</li>
                    <li>You can view signatures in your CRM</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
