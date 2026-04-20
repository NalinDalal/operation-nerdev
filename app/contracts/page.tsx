"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { generateContractPDF } from "@/lib/contracts/contract-pdf";
import { Nav } from "@/components/nav";
import { DollarSign, Download } from "lucide-react";

export default function ContractsPage() {
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    providerName: "",
    providerAddress: "",
    clientCompany: "",
    clientAddress: "",
    clientName: "",
    projectName: "",
    deliverables: "",
    duration: "",
    startDate: "",
    advanceAmount: "",
    milestone2Amount: "",
    finalAmount: "",
    totalAmount: "",
    hourlyRate: "",
    jurisdiction: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCurrencyChange = (curr: "INR" | "USD") => {
    setCurrency(curr);
    if (curr === "USD") {
      setFormData(prev => ({
        ...prev,
        jurisdiction: prev.jurisdiction || "India",
        hourlyRate: prev.hourlyRate || "45",
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        jurisdiction: prev.jurisdiction || "Madhya Pradesh, India",
        hourlyRate: prev.hourlyRate || "1500",
      }));
    }
  };

  useEffect(() => {
    const settings = localStorage.getItem("companySettings");
    if (settings) {
      const s = JSON.parse(settings);
      setFormData(prev => ({
        ...prev,
        providerName: s.name || "",
        providerAddress: s.address || "",
        jurisdiction: s.jurisdiction || (currency === "USD" ? "India" : "Madhya Pradesh, India"),
        hourlyRate: s.hourlyRate || (currency === "USD" ? "45" : "1500"),
      }));
    }
  }, [currency]);

  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      const deliverables = formData.deliverables.split("\n").filter((d) => d.trim());
      const blob = await generateContractPDF({
        providerName: formData.providerName || "NerDev",
        providerAddress: formData.providerAddress || "Indore, Madhya Pradesh, India",
        clientCompany: formData.clientCompany,
        clientAddress: formData.clientAddress,
        clientName: formData.clientName,
        projectName: formData.projectName,
        deliverables,
        duration: formData.duration,
        startDate: formData.startDate,
        currency,
        advanceAmount: formData.advanceAmount,
        milestone2Amount: formData.milestone2Amount,
        finalAmount: formData.finalAmount,
        totalAmount: formData.totalAmount,
        hourlyRate: formData.hourlyRate,
        jurisdiction: formData.jurisdiction,
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `contract-${formData.clientCompany.replace(/\s+/g, "-").toLowerCase()}-${currency}.pdf`;
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
        title="Contract Generator" 
        subtitle="Generate freelance development contracts" 
        active="contracts"
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
              <CardTitle>Provider Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="providerName">Your Name</Label>
                <Input id="providerName" name="providerName" value={formData.providerName} onChange={handleInputChange} placeholder="Your Name" />
              </div>
              <div>
                <Label htmlFor="providerAddress">Address</Label>
                <Input id="providerAddress" name="providerAddress" value={formData.providerAddress} onChange={handleInputChange} placeholder="Indore, Madhya Pradesh, India" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[var(--border)] shadow-sm">
            <CardHeader>
              <CardTitle>Client Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="clientCompany">Company Name</Label>
                <Input id="clientCompany" name="clientCompany" value={formData.clientCompany} onChange={handleInputChange} placeholder="Client Company" />
              </div>
              <div>
                <Label htmlFor="clientName">Contact Person</Label>
                <Input id="clientName" name="clientName" value={formData.clientName} onChange={handleInputChange} placeholder="Client Name" />
              </div>
              <div>
                <Label htmlFor="clientAddress">Address</Label>
                <Input id="clientAddress" name="clientAddress" value={formData.clientAddress} onChange={handleInputChange} placeholder="Client Address" />
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 border-[var(--border)] shadow-sm">
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="projectName">Project Name</Label>
                  <Input id="projectName" name="projectName" value={formData.projectName} onChange={handleInputChange} placeholder="Project Name" />
                </div>
                <div>
                  <Label htmlFor="duration">Duration (weeks)</Label>
                  <Input id="duration" name="duration" value={formData.duration} onChange={handleInputChange} placeholder="4" />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input id="startDate" name="startDate" type="date" value={formData.startDate} onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="hourlyRate">Hourly Rate ({currency})</Label>
                  <Input id="hourlyRate" name="hourlyRate" value={formData.hourlyRate} onChange={handleInputChange} placeholder="1500" />
                </div>
              </div>
              <div>
                <Label htmlFor="deliverables">Deliverables (one per line)</Label>
                <textarea id="deliverables" name="deliverables" value={formData.deliverables} onChange={handleInputChange} placeholder="1. Website with 5 pages&#10;2. Contact form with email&#10;3. Admin dashboard" className="w-full min-h-[120px] px-3 py-2 border border-input rounded-md bg-background text-sm resize-y" />
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 border-[var(--border)] shadow-sm">
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
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
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <Button onClick={generatePDF} disabled={isGenerating} className="gap-2">
            {isGenerating ? "Generating..." : <><Download className="w-4 h-4" /> Generate PDF Contract</>}
          </Button>
        </div>
      </div>
    </div>
  );
}
