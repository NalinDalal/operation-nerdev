"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Textarea } from "@/components/textarea";
import { Label } from "@/components/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { FileText, Mail, ScanLine, Send, Loader2 } from "lucide-react";
import { SidebarLayout } from "@/components/sidebar";
import { EmailActions } from "@/components/email-actions";

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
    generate: (data: Record<string, string>) => {
      const firstName = data.first_name?.trim() || "there";
      const companyName = data.company_name?.trim() || "your company";
      return `
        <p style="font-size:22px;font-weight:500;color:#111111;margin:0 0 8px;">Let's build something.</p>
        <p style="font-size:15px;color:#555555;line-height:1.7;margin:0 0 16px;">Hi ${firstName},</p>
        <p style="font-size:15px;color:#555555;line-height:1.7;margin:0 0 28px;">
          Came across ${companyName} and had a few ideas on how we could help you scale the tech side.
        </p>
      `;
    },
  },
  followup: {
    name: 'Follow-up',
    subject: 'Following up',
    generate: (data: Record<string, string>) => {
      const firstName = data.first_name?.trim() || "there";
      const topic = data.topic?.trim() || "your project";
      return `
        <p style="font-size:22px;font-weight:500;color:#111111;margin:0 0 8px;">Just following up</p>
        <p style="font-size:15px;color:#555555;line-height:1.7;margin:0 0 16px;">Hi ${firstName},</p>
        <p style="font-size:15px;color:#555555;line-height:1.7;margin:0 0 28px;">
          Wanted to check in on our earlier conversation about ${topic}. Let me know if you have any questions!
        </p>
      `;
    },
  },
};

type TemplateKey = keyof typeof TEMPLATES;

export default function EmailPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateKey>('welcome');
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
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
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.to) {
      newErrors.to = 'Recipient email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.to)) {
      newErrors.to = 'Please enter a valid email address';
    }

    if (selectedTemplate === 'outreach') {
      if (!formData.first_name?.trim()) {
        newErrors.first_name = 'First name is required for outreach';
      }
      if (!formData.company_name?.trim()) {
        newErrors.company_name = 'Company name is required for outreach';
      }
    }

    if (selectedTemplate === 'followup' && !formData.first_name?.trim()) {
      newErrors.first_name = 'First name is required for follow-up';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSend = async () => {
    if (!validateForm()) {
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
    <SidebarLayout title="Email" action={<EmailActions onSend={handleSend} sending={sending} />}>
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
                  <Label className="text-xs uppercase tracking-wider text-[var(--muted-foreground)]">To *</Label>
                  <Input
                    type="email"
                    value={formData.to}
                    onChange={(e) => updateField('to', e.target.value)}
                    placeholder="recipient@example.com"
                    className={errors.to ? 'border-[var(--destructive)]' : ''}
                  />
                  {errors.to && <p className="text-xs text-[var(--destructive)]">{errors.to}</p>}
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
                  <Label className={`text-xs uppercase tracking-wider text-[var(--muted-foreground)]`}>
                    First Name {selectedTemplate !== 'welcome' && '*'}
                  </Label>
                  <Input
                    value={formData.first_name}
                    onChange={(e) => updateField('first_name', e.target.value)}
                    placeholder="John"
                    className={errors.first_name ? 'border-[var(--destructive)]' : ''}
                  />
                  {errors.first_name && <p className="text-xs text-[var(--destructive)]">{errors.first_name}</p>}
                </div>
                <div className="space-y-2">
                  <Label className={`text-xs uppercase tracking-wider text-[var(--muted-foreground)]`}>
                    Company {selectedTemplate === 'outreach' && '*'}
                  </Label>
                  <Input
                    value={formData.company_name}
                    onChange={(e) => updateField('company_name', e.target.value)}
                    placeholder="Acme Corp"
                    className={errors.company_name ? 'border-[var(--destructive)]' : ''}
                  />
                  {errors.company_name && <p className="text-xs text-[var(--destructive)]">{errors.company_name}</p>}
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

              <div className="bg-[var(--card)] shadow-xl rounded-sm overflow-hidden">
                <div className="p-8">
                  <div className="border-b border-[var(--border)] pb-6 mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden bg-gray-100">
                        <span className="text-lg font-bold text-[var(--muted-foreground)]">ND</span>
                      </div>
                      <div>
                        <p className="font-semibold text-[var(--foreground)]">NerDev</p>
                        <p className="text-xs text-[var(--muted-foreground)]">hello@nerdev.in</p>
                      </div>
                    </div>
                    <div className="text-sm text-[var(--muted-foreground)]">
                      <p><span className="text-[var(--muted-foreground)]">To:</span> {formData.to || 'recipient@example.com'}</p>
                      {formData.cc && <p><span className="text-[var(--muted-foreground)]">CC:</span> {formData.cc}</p>}
                      <p><span className="text-[var(--muted-foreground)]">Subject:</span> {TEMPLATES[selectedTemplate].subject}</p>
                    </div>
                  </div>

                  <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ 
                    __html: TEMPLATES[selectedTemplate].generate(formData) + (formData.body ? `<p style="font-size:15px;color:#555555;line-height:1.7;margin:0;">${formData.body}</p>` : '')
                  }} />

                  <div className="border-t border-[var(--border)] mt-8 pt-6">
                    <p className="text-xs text-[var(--muted-foreground)]">
                      © 2026 NerDev · Indore, India<br/>
                      <span className="underline">Unsubscribe</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </SidebarLayout>
  );
}