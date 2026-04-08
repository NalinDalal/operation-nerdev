"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Textarea } from "@/components/textarea";
import { Label } from "@/components/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { FileText, Mail, ScanLine, Send, Loader2 } from "lucide-react";
import { Nav } from "@/components/nav";

const TEMPLATES = {
  welcome: {
    name: 'Welcome',
    subject: 'Welcome aboard',
    generate: (data: Record<string, string>) => `
      <p style="font-size:22px;font-weight:500;color:#111111;margin:0 0 8px;">Welcome aboard 👋</p>
      <p style="font-size:15px;color:#555555;line-height:1.7;margin:0 0 28px;">
        Thanks for signing up — we received your request and will get back to you within 24 hours. Until then, here's what we do.
      </p>
    `,
  },
  outreach: {
    name: 'Outreach',
    subject: "Let's build something",
    generate: (data: Record<string, string>) => `
      <p style="font-size:22px;font-weight:500;color:#111111;margin:0 0 8px;">Let's build something.</p>
      <p style="font-size:15px;color:#555555;line-height:1.7;margin:0 0 16px;">Hi ${data.first_name || '[Name]'},</p>
      <p style="font-size:15px;color:#555555;line-height:1.7;margin:0 0 28px;">
        Came across ${data.company_name || '[Company]'} and had a few ideas on how we could help you scale the tech side.
      </p>
    `,
  },
  followup: {
    name: 'Follow-up',
    subject: 'Following up',
    generate: (data: Record<string, string>) => `
      <p style="font-size:22px;font-weight:500;color:#111111;margin:0 0 8px;">Just following up</p>
      <p style="font-size:15px;color:#555555;line-height:1.7;margin:0 0 16px;">Hi ${data.first_name || '[Name]'},</p>
      <p style="font-size:15px;color:#555555;line-height:1.7;margin:0 0 28px;">
        Wanted to check in on our earlier conversation about ${data.topic || 'your project'}. Let me know if you have any questions!
      </p>
    `,
  },
};

type TemplateKey = keyof typeof TEMPLATES;

export default function EmailPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateKey>('welcome');
  const [sending, setSending] = useState(false);
  const [formData, setFormData] = useState({
    to: '',
    cc: '',
    first_name: '',
    company_name: '',
    topic: '',
    body: '',
  });

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSend = async () => {
    if (!formData.to) {
      alert('Please enter recipient email');
      return;
    }

    setSending(true);

    try {
      const template = TEMPLATES[selectedTemplate];
      
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: formData.to,
          cc: formData.cc,
          subject: template.subject,
          template: selectedTemplate,
          data: formData,
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert('Email sent successfully!');
      } else {
        alert('Failed to send email: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Error sending email');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Nav 
        title="Email Sender" 
        subtitle="Send templated emails" 
        active="email"
        action={
          <Button
            onClick={handleSend}
            disabled={sending}
            className="gap-2"
            style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' }}
          >
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {sending ? 'Sending...' : 'Send'}
          </Button>
        }
      />

      <div className="max-w-[1600px] mx-auto px-4 lg:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          <div className="xl:col-span-5 space-y-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 180px)' }}>
            <Card className="border-[var(--border)] shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-medium">Template</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.keys(TEMPLATES) as TemplateKey[]).map((key) => (
                    <button
                      key={key}
                      onClick={() => setSelectedTemplate(key)}
                      className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                        selectedTemplate === key
                          ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]'
                          : 'border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--muted-foreground)]'
                      }`}
                    >
                      {TEMPLATES[key].name}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-[var(--border)] shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-medium">Recipients</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-[var(--muted-foreground)]">To</Label>
                  <Input
                    type="email"
                    value={formData.to}
                    onChange={(e) => updateField('to', e.target.value)}
                    placeholder="recipient@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-[var(--muted-foreground)]">CC</Label>
                  <Input
                    type="email"
                    value={formData.cc}
                    onChange={(e) => updateField('cc', e.target.value)}
                    placeholder="cc@example.com"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-[var(--border)] shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-medium">Variables</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-[var(--muted-foreground)]">First Name</Label>
                  <Input
                    value={formData.first_name}
                    onChange={(e) => updateField('first_name', e.target.value)}
                    placeholder="John"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-[var(--muted-foreground)]">Company</Label>
                  <Input
                    value={formData.company_name}
                    onChange={(e) => updateField('company_name', e.target.value)}
                    placeholder="Acme Corp"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-[var(--muted-foreground)]">Topic</Label>
                  <Input
                    value={formData.topic}
                    onChange={(e) => updateField('topic', e.target.value)}
                    placeholder="your project"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-[var(--border)] shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-medium">Custom Body</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.body}
                  onChange={(e) => updateField('body', e.target.value)}
                  placeholder="Additional message..."
                  className="min-h-[150px]"
                />
              </CardContent>
            </Card>
          </div>

          <div className="xl:col-span-7 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 180px)' }}>
            <div className="sticky top-0">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-[var(--muted-foreground)]">
                  Preview
                </h2>
              </div>

              <div className="bg-white shadow-xl rounded-sm overflow-hidden">
                <div className="p-8">
                  <div className="border-b border-gray-200 pb-6 mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden bg-gray-100">
                        <span className="text-lg font-bold text-gray-600">ND</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">NerDev</p>
                        <p className="text-xs text-gray-500">hello@nerdev.in</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      <p><span className="text-gray-400">To:</span> {formData.to || 'recipient@example.com'}</p>
                      {formData.cc && <p><span className="text-gray-400">CC:</span> {formData.cc}</p>}
                      <p><span className="text-gray-400">Subject:</span> {TEMPLATES[selectedTemplate].subject}</p>
                    </div>
                  </div>

                  <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ 
                    __html: TEMPLATES[selectedTemplate].generate(formData) + (formData.body ? `<p style="font-size:15px;color:#555555;line-height:1.7;margin:0;">${formData.body}</p>` : '')
                  }} />

                  <div className="border-t border-gray-200 mt-8 pt-6">
                    <p className="text-xs text-gray-400">
                      © 2026 NerDev · Indore, India<br/>
                      <span className="underline">Unsubscribe</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}