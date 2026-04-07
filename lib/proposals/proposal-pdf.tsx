import React from 'react';
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    lineHeight: 1.5,
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subHeader: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 6,
    marginTop: 8,
  },
  paragraph: {
    marginBottom: 6,
  },
  table: {
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
    paddingVertical: 3,
  },
  tableCell: {
    flex: 1,
    fontSize: 9,
  },
  bold: {
    fontWeight: 'bold',
  },
  mb10: {
    marginBottom: 10,
  },
  mb20: {
    marginBottom: 20,
  },
});

const ProposalPDF = ({ data }: { data: ProposalData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>PROJECT PROPOSAL</Text>
      
      <View style={styles.section}>
        <Text style={styles.subHeader}>Prepared For</Text>
        <Text>{data.clientCompany}</Text>
        <Text>{data.clientName} · {data.clientDesignation}</Text>
        <Text>{data.clientAddress}</Text>
        {data.clientCountry && <Text>{data.clientCountry}</Text>}
      </View>

      <View style={styles.section}>
        <Text style={styles.subHeader}>Prepared By</Text>
        <Text>NerDev</Text>
        <Text>{data.providerName}</Text>
        <Text>hello@nerdev.in · nerdev.in</Text>
        <Text>Date: {data.date}</Text>
        <Text>Valid Until: {data.validUntil}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. UNDERSTANDING YOUR NEEDS</Text>
        <Text style={styles.paragraph}>{data.understanding}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. PROPOSED SOLUTION</Text>
        <Text style={styles.bold}>What We'll Build:</Text>
        {data.components.map((item, index) => (
          <Text key={index}>- {item}</Text>
        ))}
        
        <Text style={{ marginTop: 10, fontWeight: 'bold' }}>Technology Stack:</Text>
        {data.techStack.map((item, index) => (
          <Text key={index}>- {item}</Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. TIMELINE</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.bold]}>Phase</Text>
            <Text style={[styles.tableCell, styles.bold]}>Description</Text>
            <Text style={[styles.tableCell, styles.bold]}>Duration</Text>
          </View>
          {data.phases.map((phase, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{phase.name}</Text>
              <Text style={styles.tableCell}>{phase.description}</Text>
              <Text style={styles.tableCell}>{phase.duration}</Text>
            </View>
          ))}
        </View>
        <Text>Total Duration: {data.totalDuration}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>4. INVESTMENT</Text>
        <Text style={styles.bold}>Development Cost:</Text>
        <Text>{data.currency === 'INR' ? '₹' : '$'}{data.totalAmount}</Text>
        {data.currency === 'INR' && <Text>+ GST (18%)</Text>}
        
        <Text style={{ marginTop: 10, fontWeight: 'bold' }}>Payment Schedule:</Text>
        <Text>Advance (30%): {data.currency === 'INR' ? '₹' : '$'}{data.advanceAmount}</Text>
        <Text>Milestone 2 (40%): {data.currency === 'INR' ? '₹' : '$'}{data.milestone2Amount}</Text>
        <Text>Final (30%): {data.currency === 'INR' ? '₹' : '$'}{data.finalAmount}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>5. WHAT'S INCLUDED</Text>
        {data.included.map((item, index) => (
          <Text key={index}>- {item}</Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>6. WHAT'S NOT INCLUDED</Text>
        {data.notIncluded.map((item, index) => (
          <Text key={index}>- {item}</Text>
        ))}
      </View>

      <View style={[styles.section, { marginTop: 30 }]}>
        <Text style={styles.sectionTitle}>NEXT STEPS</Text>
        <Text>1. Review this proposal</Text>
        <Text>2. Answer any questions</Text>
        <Text>3. Sign contract & pay advance (30%)</Text>
        <Text>4. Kickoff call within 3 days</Text>
        <Text>5. Project starts</Text>
      </View>

      <View style={[styles.section, { marginTop: 40 }]}>
        <Text style={styles.sectionTitle}>ACCEPTANCE</Text>
        <Text style={{ marginBottom: 15 }}>By signing below, you authorize NerDev to proceed with this project.</Text>
        
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

      <Text style={{ marginTop: 30, fontSize: 9, color: '#666' }}>
        Thank you for considering NerDev. Let's build something great.
      </Text>
    </Page>
  </Document>
);

interface Phase {
  name: string;
  description: string;
  duration: string;
}

interface ProposalData {
  clientCompany: string;
  clientName: string;
  clientDesignation: string;
  clientAddress: string;
  clientCountry?: string;
  providerName: string;
  date: string;
  validUntil: string;
  understanding: string;
  components: string[];
  techStack: string[];
  phases: Phase[];
  totalDuration: string;
  currency: 'INR' | 'USD';
  advanceAmount: string;
  milestone2Amount: string;
  finalAmount: string;
  totalAmount: string;
  included: string[];
  notIncluded: string[];
}

export async function generateProposalPDF(data: ProposalData) {
  const blob = await pdf(<ProposalPDF data={data} />).toBlob();
  return blob;
}

export default ProposalPDF;
