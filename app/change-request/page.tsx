"use client";
import React, { useState } from "react";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { Nav } from "@/components/nav";
import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer";
import { Download } from "lucide-react";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: 'Helvetica', lineHeight: 1.5 },
  header: { fontSize: 16, fontWeight: 'bold', marginBottom: 15 },
  section: { marginBottom: 12 },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', marginBottom: 6 },
  bold: { fontWeight: 'bold' },
});

const CrPDF = ({ data }: { data: CrData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>CHANGE REQUEST FORM</Text>
      <Text>CR Number: {data.crNumber} • Date: {data.date}</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>CLIENT DETAILS</Text>
        <Text><Text style={styles.bold}>Client:</Text> {data.clientCompany}</Text>
        <Text><Text style={styles.bold}>Contact:</Text> {data.clientName}</Text>
        <Text><Text style={styles.bold}>Project:</Text> {data.projectName}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>CHANGE DESCRIPTION</Text>
        <Text><Text style={styles.bold}>Type:</Text> {data.changeType}</Text>
        <Text style={{ marginTop: 8 }}><Text style={styles.bold}>Description:</Text></Text>
        <Text>{data.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>IMPACT ASSESSMENT</Text>
        <Text>Additional hours: {data.hours}</Text>
        <Text>Additional cost: {data.currency}{data.cost}</Text>
        <Text>New end date: {data.newEndDate}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>CLIENT AUTHORIZATION</Text>
        <Text><Text style={styles.bold}>Additional Cost:</Text> {data.currency}{data.cost}</Text>
        <Text><Text style={styles.bold}>New Timeline:</Text> {data.newEndDate}</Text>
        <Text style={{ marginTop: 15 }}>Signature: _________________________</Text>
        <Text>Name: _______________ Date: _______________</Text>
      </View>

      <Text style={{ marginTop: 30, fontSize: 8, color: '#666' }}>Valid for 14 days from date of submission</Text>
    </Page>
  </Document>
);

interface CrData {
  crNumber: string;
  date: string;
  clientCompany: string;
  clientName: string;
  projectName: string;
  changeType: string;
  description: string;
  hours: string;
  cost: string;
  newEndDate: string;
  currency: string;
}

export default function ChangeRequestPage() {
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    crNumber: "CR-001",
    date: new Date().toISOString().split("T")[0],
    clientCompany: "",
    clientName: "",
    projectName: "",
    changeType: "New feature",
    description: "",
    hours: "",
    cost: "",
    newEndDate: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      const blob = await pdf(<CrPDF data={{
        ...formData,
        currency: currency === "INR" ? "₹" : "$",
      }} />).toBlob();

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `cr-${formData.crNumber}-${formData.clientCompany.replace(/\s+/g, "-").toLowerCase()}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF");
    } finally {
      setIsGenerating(false);
    }
  };

  const currencySymbol = currency === "INR" ? "₹" : "$";

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Nav 
        title="Change Request" 
        subtitle="Formalize scope changes mid-project" 
        active="change-request"
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
              <CardTitle>Request Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>CR Number</Label>
                  <Input name="crNumber" value={formData.crNumber} onChange={handleInputChange} placeholder="CR-001" />
                </div>
                <div>
                  <Label>Date</Label>
                  <Input type="date" name="date" value={formData.date} onChange={handleInputChange} />
                </div>
              </div>
              <div>
                <Label>Client Company</Label>
                <Input name="clientCompany" value={formData.clientCompany} onChange={handleInputChange} placeholder="Client Name" />
              </div>
              <div>
                <Label>Contact Person</Label>
                <Input name="clientName" value={formData.clientName} onChange={handleInputChange} placeholder="Contact Name" />
              </div>
              <div>
                <Label>Project Name</Label>
                <Input name="projectName" value={formData.projectName} onChange={handleInputChange} placeholder="Project Name" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[var(--border)] shadow-sm">
            <CardHeader>
              <CardTitle>Change Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Type of Change</Label>
                <select name="changeType" value={formData.changeType} onChange={handleInputChange} className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm">
                  <option>New feature</option>
                  <option>Modification to existing feature</option>
                  <option>Design change</option>
                  <option>Integration with new third-party</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <Label>Description</Label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Detailed description of the change..." className="w-full min-h-[120px] px-3 py-2 border border-input rounded-md bg-background text-sm" />
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 border-[var(--border)] shadow-sm">
            <CardHeader>
              <CardTitle>Impact Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <Label>Additional Hours</Label>
                  <Input name="hours" value={formData.hours} onChange={handleInputChange} placeholder="8" />
                </div>
                <div>
                  <Label>Additional Cost</Label>
                  <Input name="cost" value={formData.cost} onChange={handleInputChange} placeholder={`${currencySymbol}12000`} />
                </div>
                <div>
                  <Label>New End Date</Label>
                  <Input type="date" name="newEndDate" value={formData.newEndDate} onChange={handleInputChange} />
                </div>
                <div>
                  <Label>&nbsp;</Label>
                  <div className="text-sm text-gray-500 pt-2">
                    Per hour: {currency === "INR" ? "₹1500" : "$45"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <Button onClick={generatePDF} disabled={isGenerating} className="gap-2">
            {isGenerating ? "Generating..." : <><Download className="w-4 h-4" /> Generate CR PDF</>}
          </Button>
        </div>
      </div>
    </div>
  );
}
