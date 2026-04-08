"use client";
import React, { useState } from "react";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { generateProposalPDF } from "@/lib/proposals/proposal-pdf";
import { Nav } from "@/components/nav";
import { Download } from "lucide-react";

interface Phase {
  name: string;
  description: string;
  duration: string;
}

export default function ProposalsPage() {
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    clientCompany: "",
    clientName: "",
    clientDesignation: "",
    clientAddress: "",
    clientCountry: "",
    providerName: "",
    date: new Date().toISOString().split("T")[0],
    validUntil: "",
    understanding: "",
    advanceAmount: "",
    milestone2Amount: "",
    finalAmount: "",
    totalAmount: "",
  });
  const [components, setComponents] = useState<string[]>([""]);
  const [techStack, setTechStack] = useState<string[]>(["Frontend: React/Next.js"]);
  const [phases, setPhases] = useState<Phase[]>([
    { name: "Phase 1", description: "Discovery & Planning", duration: "1 week" },
    { name: "Phase 2", description: "Design & Development", duration: "3 weeks" },
    { name: "Phase 3", description: "QA & Launch", duration: "1 week" },
  ]);
  const [included, setIncluded] = useState<string[]>([
    "Source code ownership (after full payment)",
    "2 rounds of revisions per phase",
    "Post-launch support"
  ]);
  const [notIncluded, setNotIncluded] = useState<string[]>([
    "Third-party licenses (paid separately)",
    "Ongoing marketing/content"
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCurrencyChange = (curr: "INR" | "USD") => {
    setCurrency(curr);
    const validDate = new Date();
    validDate.setDate(validDate.getDate() + 14);
    setFormData({ ...formData, validUntil: validDate.toISOString().split("T")[0] });
  };

  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      const validIncluded = included.filter(i => i.trim());
      const validNotIncluded = notIncluded.filter(n => n.trim());
      
      const blob = await generateProposalPDF({
        clientCompany: formData.clientCompany,
        clientName: formData.clientName,
        clientDesignation: formData.clientDesignation,
        clientAddress: formData.clientAddress,
        clientCountry: formData.clientCountry || undefined,
        providerName: formData.providerName || "NerDev",
        date: formData.date,
        validUntil: formData.validUntil,
        understanding: formData.understanding || "To build a solution that meets your business needs.",
        components: components.filter(c => c.trim()),
        techStack: techStack.filter(t => t.trim()),
        phases,
        totalDuration: `${phases.reduce((acc, p) => acc + parseInt(p.duration) || 0, 0)} weeks`,
        currency,
        advanceAmount: formData.advanceAmount,
        milestone2Amount: formData.milestone2Amount,
        finalAmount: formData.finalAmount,
        totalAmount: formData.totalAmount,
        included: validIncluded,
        notIncluded: validNotIncluded,
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `proposal-${formData.clientCompany.replace(/\s+/g, "-").toLowerCase()}-${currency}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const currencySymbol = currency === "INR" ? "₹" : "$";

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Nav 
        title="Proposal Generator" 
        subtitle="Create professional project proposals" 
        active="proposals"
        action={
          <div className="flex gap-2">
            <Button variant={currency === "INR" ? "default" : "outline"} onClick={() => setCurrency("INR")}>INR</Button>
            <Button variant={currency === "USD" ? "default" : "outline"} onClick={() => setCurrency("USD")}>USD</Button>
          </div>
        }
      />

      <div className="max-w-[1600px] mx-auto px-4 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-[var(--border)] shadow-sm">
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="clientCompany">Company Name</Label>
                <Input id="clientCompany" name="clientCompany" value={formData.clientCompany} onChange={handleInputChange} placeholder="Client Company" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="clientName">Contact Person</Label>
                  <Input id="clientName" name="clientName" value={formData.clientName} onChange={handleInputChange} placeholder="Name" />
                </div>
                <div>
                  <Label htmlFor="clientDesignation">Designation</Label>
                  <Input id="clientDesignation" name="clientDesignation" value={formData.clientDesignation} onChange={handleInputChange} placeholder="CEO" />
                </div>
              </div>
              <div>
                <Label htmlFor="clientAddress">Address</Label>
                <Input id="clientAddress" name="clientAddress" value={formData.clientAddress} onChange={handleInputChange} placeholder="Client Address" />
              </div>
              <div>
                <Label htmlFor="clientCountry">Country</Label>
                <Input id="clientCountry" name="clientCountry" value={formData.clientCountry} onChange={handleInputChange} placeholder="Country (for international)" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[var(--border)] shadow-sm">
            <CardHeader>
              <CardTitle>Your Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="providerName">Your Name</Label>
                <Input id="providerName" name="providerName" value={formData.providerName} onChange={handleInputChange} placeholder="Your Name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" name="date" type="date" value={formData.date} onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="validUntil">Valid Until</Label>
                  <Input id="validUntil" name="validUntil" type="date" value={formData.validUntil} onChange={handleInputChange} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 border-[var(--border)] shadow-sm">
            <CardHeader>
              <CardTitle>Understanding & Solution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="understanding">Understanding Your Needs</Label>
                <textarea id="understanding" name="understanding" value={formData.understanding} onChange={handleInputChange} placeholder="You need a solution that helps..." className="w-full min-h-[80px] px-3 py-2 border border-input rounded-md bg-background text-sm resize-y" />
              </div>
              <div>
                <Label>Components (one per line)</Label>
                <textarea value={components.join("\n")} onChange={(e) => setComponents(e.target.value.split("\n"))} placeholder="Landing page with lead capture&#10;User authentication" className="w-full min-h-[80px] px-3 py-2 border border-input rounded-md bg-background text-sm resize-y" />
              </div>
              <div>
                <Label>Technology Stack (one per line)</Label>
                <textarea value={techStack.join("\n")} onChange={(e) => setTechStack(e.target.value.split("\n"))} placeholder="Frontend: React/Next.js&#10;Backend: Node.js" className="w-full min-h-[80px] px-3 py-2 border border-input rounded-md bg-background text-sm resize-y" />
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 border-[var(--border)] shadow-sm">
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {phases.map((phase, index) => (
                  <div key={index} className="grid grid-cols-3 gap-3 items-end">
                    <div>
                      <Label>Phase Name</Label>
                      <Input value={phase.name} onChange={(e) => { const arr = [...phases]; arr[index].name = e.target.value; setPhases(arr); }} placeholder="Phase 1" />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Input value={phase.description} onChange={(e) => { const arr = [...phases]; arr[index].description = e.target.value; setPhases(arr); }} placeholder="Discovery" />
                    </div>
                    <div>
                      <Label>Duration</Label>
                      <Input value={phase.duration} onChange={(e) => { const arr = [...phases]; arr[index].duration = e.target.value; setPhases(arr); }} placeholder="1 week" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 border-[var(--border)] shadow-sm">
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="advanceAmount">Advance (30%)</Label>
                  <Input id="advanceAmount" name="advanceAmount" value={formData.advanceAmount} onChange={handleInputChange} placeholder={`${currencySymbol}30000`} />
                </div>
                <div>
                  <Label htmlFor="milestone2Amount">Milestone 2 (40%)</Label>
                  <Input id="milestone2Amount" name="milestone2Amount" value={formData.milestone2Amount} onChange={handleInputChange} placeholder={`${currencySymbol}40000`} />
                </div>
                <div>
                  <Label htmlFor="finalAmount">Final (30%)</Label>
                  <Input id="finalAmount" name="finalAmount" value={formData.finalAmount} onChange={handleInputChange} placeholder={`${currencySymbol}30000`} />
                </div>
                <div>
                  <Label htmlFor="totalAmount">Total</Label>
                  <Input id="totalAmount" name="totalAmount" value={formData.totalAmount} onChange={handleInputChange} placeholder={`${currencySymbol}100000`} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 border-[var(--border)] shadow-sm">
            <CardHeader>
              <CardTitle>What&apos;s Included / Not Included</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Included</Label>
                <textarea value={included.join("\n")} onChange={(e) => setIncluded(e.target.value.split("\n"))} placeholder="Source code ownership" className="w-full min-h-[80px] px-3 py-2 border border-input rounded-md bg-background text-sm resize-y" />
              </div>
              <div>
                <Label>Not Included</Label>
                <textarea value={notIncluded.join("\n")} onChange={(e) => setNotIncluded(e.target.value.split("\n"))} placeholder="Third-party licenses" className="w-full min-h-[80px] px-3 py-2 border border-input rounded-md bg-background text-sm resize-y" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <Button onClick={generatePDF} disabled={isGenerating} className="gap-2">
            {isGenerating ? "Generating..." : <><Download className="w-4 h-4" /> Generate PDF Proposal</>}
          </Button>
        </div>
      </div>
    </div>
  );
}
