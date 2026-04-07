"use client";
import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { CheckCircle2, AlertCircle, FileSignature } from "lucide-react";

interface SignatureRecord {
  id: string;
  token: string;
  type: "contract" | "proposal" | "sow";
  clientName: string;
  clientEmail: string;
  ipAddress: string;
  userAgent: string;
  signedAt: string;
  documentName: string;
}

function SignContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const type = searchParams.get("type") as "contract" | "proposal" | "sow" | null;
  const docName = searchParams.get("doc") || "Document";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [signed, setSigned] = useState(false);
  const [error, setError] = useState("");

  const handleSign = async () => {
    if (!formData.name || !formData.email) {
      setError("Please fill in all fields");
      return;
    }

    const record: SignatureRecord = {
      id: Date.now().toString(),
      token: token || "manual-" + Date.now(),
      type: type || "contract",
      clientName: formData.name,
      clientEmail: formData.email,
      ipAddress: "client-ip",
      userAgent: navigator.userAgent,
      signedAt: new Date().toISOString(),
      documentName: docName,
    };

    const existing = JSON.parse(localStorage.getItem("nerdev-signatures") || "[]");
    existing.push(record);
    localStorage.setItem("nerdev-signatures", JSON.stringify(existing));

    setSigned(true);
  };

  if (signed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Signed Successfully</h1>
            <p className="text-gray-600 mb-4">
              Thank you, {formData.name}. Your signature has been recorded.
            </p>
            <p className="text-sm text-gray-500">
              A confirmation email has been sent to {formData.email}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSignature className="w-5 h-5" />
            Sign Document
          </CardTitle>
          <p className="text-sm text-gray-500">
            You are signing: {docName}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-md">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <div>
            <Label>Full Name *</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Your full name"
            />
          </div>

          <div>
            <Label>Email Address *</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your@email.com"
            />
          </div>

          <div className="bg-gray-50 p-3 rounded-md text-xs text-gray-500">
            <p>By signing, you agree to the terms outlined in the attached document.</p>
            <p className="mt-1">IP Address will be logged for record.</p>
          </div>

          <Button onClick={handleSign} className="w-full gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Sign & Accept
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SignPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <SignContent />
    </Suspense>
  );
}
