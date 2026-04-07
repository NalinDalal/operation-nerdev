"use client";
import React, { useState } from "react";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { Header } from "@/components/header";
import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer";
import { Download, Plus } from "lucide-react";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: 'Helvetica', lineHeight: 1.5 },
  header: { fontSize: 16, fontWeight: 'bold', marginBottom: 15 },
  section: { marginBottom: 15 },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', marginBottom: 8, marginTop: 10 },
  table: { marginBottom: 10 },
  tableRow: { flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: '#ccc', paddingVertical: 4 },
  tableCell: { flex: 1, fontSize: 9 },
  bold: { fontWeight: 'bold' },
  mb10: { marginBottom: 10 },
});

const SowPDF = ({ data }: { data: SowData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>SCOPE OF WORK (SoW)</Text>
      <Text style={{ marginBottom: 15 }}>Version 1.0 • Date: {data.date}</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. PROJECT OVERVIEW</Text>
        <Text><Text style={styles.bold}>Purpose:</Text> {data.purpose}</Text>
        <Text><Text style={styles.bold}>Client:</Text> {data.clientCompany}</Text>
        <Text><Text style={styles.bold}>Service Provider:</Text> NerDev</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. DELIVERABLES</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.bold]}>#</Text>
            <Text style={[styles.tableCell, styles.bold]}>Deliverable</Text>
            <Text style={[styles.tableCell, styles.bold]}>Description</Text>
            <Text style={[styles.tableCell, styles.bold]}>Acceptance Criteria</Text>
          </View>
          {data.deliverables.map((d, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.tableCell}>{i + 1}</Text>
              <Text style={styles.tableCell}>{d.name}</Text>
              <Text style={styles.tableCell}>{d.description}</Text>
              <Text style={styles.tableCell}>{d.criteria}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. OUT OF SCOPE</Text>
        {data.outOfScope.map((item, i) => <Text key={i}>- {item}</Text>)}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>4. TECHNOLOGY STACK</Text>
        {data.techStack.map((t, i) => <Text key={i}>- {t}</Text>)}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>5. MILESTONES</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.bold]}>Milestone</Text>
            <Text style={[styles.tableCell, styles.bold]}>Description</Text>
            <Text style={[styles.tableCell, styles.bold]}>Due Date</Text>
          </View>
          {data.milestones.map((m, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.tableCell}>{m.name}</Text>
              <Text style={styles.tableCell}>{m.description}</Text>
              <Text style={styles.tableCell}>{m.date}</Text>
            </View>
          ))}
        </View>
        <Text>Total Duration: {data.duration} weeks</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>6. ACCEPTANCE CRITERIA</Text>
        {data.acceptanceCriteria.map((c, i) => <Text key={i}>- {c}</Text>)}
      </View>

      <View style={[styles.section, { marginTop: 40 }]}>
        <Text style={styles.sectionTitle}>APPROVAL</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            <Text style={styles.bold}>For Client:</Text>
            <Text>Signature: _________________</Text>
            <Text>Name: _______________</Text>
            <Text>Date: _______________</Text>
          </View>
          <View>
            <Text style={styles.bold}>For NerDev:</Text>
            <Text>Signature: _________________</Text>
            <Text>Name: {data.providerName}</Text>
            <Text>Date: _______________</Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

interface Deliverable {
  name: string;
  description: string;
  criteria: string;
}

interface Milestone {
  name: string;
  description: string;
  date: string;
}

interface SowData {
  date: string;
  providerName: string;
  clientCompany: string;
  purpose: string;
  deliverables: Deliverable[];
  outOfScope: string[];
  techStack: string[];
  milestones: Milestone[];
  duration: string;
  acceptanceCriteria: string[];
}

export default function ScopeOfWorkPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    providerName: "NerDev",
    clientCompany: "",
    purpose: "",
  });
  const [deliverables, setDeliverables] = useState<Deliverable[]>([
    { name: "Website", description: "Complete website with 5 pages", criteria: "All pages load without errors" }
  ]);
  const [outOfScope, setOutOfScope] = useState<string[]>(["Content creation", "SEO"]);
  const [techStack, setTechStack] = useState<string[]>(["Frontend: React/Next.js", "Backend: Node.js", "Database: PostgreSQL"]);
  const [milestones, setMilestones] = useState<Milestone[]>([
    { name: "Milestone 1", description: "Setup & Design", date: "" },
    { name: "Milestone 2", description: "Development", date: "" },
    { name: "Milestone 3", description: "Testing & Launch", date: "" }
  ]);
  const [duration, setDuration] = useState("4");
  const [acceptanceCriteria, setAcceptanceCriteria] = useState<string[]>(["All features work as specified", "Responsive on mobile"]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const updateArray = (arr: string[], index: number, value: string) => {
    const newArr = [...arr];
    newArr[index] = value;
    return newArr;
  };

  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      const blob = await pdf(<SowPDF data={{
        ...formData,
        deliverables,
        outOfScope: outOfScope.filter(o => o.trim()),
        techStack: techStack.filter(t => t.trim()),
        milestones,
        duration,
        acceptanceCriteria: acceptanceCriteria.filter(a => a.trim()),
      }} />).toBlob();

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `sow-${formData.clientCompany.replace(/\s+/g, "-").toLowerCase()}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header title="Scope of Work" subtitle="Create detailed SoW to attach to contracts" active="scope-of-work" />

      <div className="max-w-[1600px] mx-auto px-4 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-[var(--border)] shadow-sm">
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Client Company</Label>
                <Input value={formData.clientCompany} name="clientCompany" onChange={handleInputChange} placeholder="Client Name" />
              </div>
              <div>
                <Label>Purpose</Label>
                <textarea name="purpose" value={formData.purpose} onChange={handleInputChange} placeholder="What this project aims to achieve" className="w-full min-h-[80px] px-3 py-2 border border-input rounded-md bg-background text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Date</Label>
                  <Input type="date" name="date" value={formData.date} onChange={handleInputChange} />
                </div>
                <div>
                  <Label>Duration (weeks)</Label>
                  <Input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[var(--border)] shadow-sm">
            <CardHeader>
              <CardTitle>Deliverables</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {deliverables.map((d, i) => (
                <div key={i} className="grid grid-cols-3 gap-2">
                  <Input value={d.name} placeholder="Name" onChange={(e) => {
                    const arr = [...deliverables]; arr[i].name = e.target.value; setDeliverables(arr);
                  }} />
                  <Input value={d.description} placeholder="Description" onChange={(e) => {
                    const arr = [...deliverables]; arr[i].description = e.target.value; setDeliverables(arr);
                  }} />
                  <Input value={d.criteria} placeholder="Acceptance criteria" onChange={(e) => {
                    const arr = [...deliverables]; arr[i].criteria = e.target.value; setDeliverables(arr);
                  }} />
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => setDeliverables([...deliverables, { name: "", description: "", criteria: "" }])}>
                <Plus className="w-4 h-4 mr-2" /> Add Deliverable
              </Button>
            </CardContent>
          </Card>

          <Card className="border-[var(--border)] shadow-sm">
            <CardHeader>
              <CardTitle>Out of Scope</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea value={outOfScope.join("\n")} onChange={(e) => setOutOfScope(e.target.value.split("\n"))} placeholder="One per line" className="w-full min-h-[100px] px-3 py-2 border border-input rounded-md bg-background text-sm" />
            </CardContent>
          </Card>

          <Card className="border-[var(--border)] shadow-sm">
            <CardHeader>
              <CardTitle>Tech Stack</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea value={techStack.join("\n")} onChange={(e) => setTechStack(e.target.value.split("\n"))} placeholder="One per line" className="w-full min-h-[100px] px-3 py-2 border border-input rounded-md bg-background text-sm" />
            </CardContent>
          </Card>

          <Card className="border-[var(--border)] shadow-sm">
            <CardHeader>
              <CardTitle>Milestones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {milestones.map((m, i) => (
                <div key={i} className="grid grid-cols-3 gap-2">
                  <Input value={m.name} placeholder="Milestone name" onChange={(e) => {
                    const arr = [...milestones]; arr[i].name = e.target.value; setMilestones(arr);
                  }} />
                  <Input value={m.description} placeholder="Description" onChange={(e) => {
                    const arr = [...milestones]; arr[i].description = e.target.value; setMilestones(arr);
                  }} />
                  <Input type="date" value={m.date} onChange={(e) => {
                    const arr = [...milestones]; arr[i].date = e.target.value; setMilestones(arr);
                  }} />
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => setMilestones([...milestones, { name: "", description: "", date: "" }])}>
                <Plus className="w-4 h-4 mr-2" /> Add Milestone
              </Button>
            </CardContent>
          </Card>

          <Card className="border-[var(--border)] shadow-sm">
            <CardHeader>
              <CardTitle>Acceptance Criteria</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea value={acceptanceCriteria.join("\n")} onChange={(e) => setAcceptanceCriteria(e.target.value.split("\n"))} placeholder="One per line" className="w-full min-h-[100px] px-3 py-2 border border-input rounded-md bg-background text-sm" />
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={generatePDF} disabled={isGenerating} className="gap-2">
            {isGenerating ? "Generating..." : <><Download className="w-4 h-4" /> Generate SoW PDF</>}
          </Button>
        </div>
      </div>
    </div>
  );
}
