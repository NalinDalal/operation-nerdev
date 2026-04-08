import React from 'react';
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    lineHeight: 1.5,
    backgroundColor: '#fafafa',
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fafafa',
    zIndex: -1,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1a1a1a',
  },
  brandHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: '#22c55e',
  },
  brandWatermark: {
    position: 'absolute',
    bottom: 30,
    right: 40,
    fontSize: 60,
    fontWeight: 'bold',
    color: '#e5e5e5',
    zIndex: 0,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 10,
  },
  paragraph: {
    marginBottom: 8,
  },
  table: {
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
    paddingVertical: 4,
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

const ContractPDF = ({ data }: { data: ContractData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.brandHeader} />
      <Text style={styles.brandWatermark}>NerDev</Text>
      
      <View style={{ zIndex: 1, position: 'relative' }}>
      <Text style={styles.header}>FREELANCE DEVELOPMENT CONTRACT</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>PARTIES</Text>
        <Text style={styles.paragraph}>This Agreement is entered into between:</Text>
        <Text style={styles.bold}>SERVICE PROVIDER:</Text>
        <Text>NerDev</Text>
        <Text>{data.providerName} · Proprietor</Text>
        <Text>{data.providerAddress}</Text>
        <Text>Email: hello@nerdev.in</Text>
        <Text style={{ marginTop: 10, fontWeight: 'bold' }}>CLIENT:</Text>
        <Text>{data.clientCompany}</Text>
        <Text>{data.clientAddress}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. PROJECT SCOPE</Text>
        <Text style={styles.bold}>Project Name: {data.projectName}</Text>
        <Text style={{ marginTop: 5 }}>Deliverables:</Text>
        {data.deliverables.map((item, index) => (
          <Text key={index}>{index + 1}. {item}</Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. TIMELINE</Text>
        <Text>Total Duration: {data.duration} weeks</Text>
        <Text>Start Date: {data.startDate}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. PAYMENT TERMS</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.bold]}>Payment</Text>
            <Text style={[styles.tableCell, styles.bold]}>Amount</Text>
            <Text style={[styles.tableCell, styles.bold]}>When</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Advance (30%)</Text>
            <Text style={styles.tableCell}>{data.currency === 'INR' ? '₹' : '$'}{data.advanceAmount}</Text>
            <Text style={styles.tableCell}>Within 3 days of signing</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Milestone 2 (40%)</Text>
            <Text style={styles.tableCell}>{data.currency === 'INR' ? '₹' : '$'}{data.milestone2Amount}</Text>
            <Text style={styles.tableCell}>Upon delivery of milestone 2</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Final (30%)</Text>
            <Text style={styles.tableCell}>{data.currency === 'INR' ? '₹' : '$'}{data.finalAmount}</Text>
            <Text style={styles.tableCell}>After final delivery</Text>
          </View>
        </View>
        <Text>Total Project Fee: {data.currency === 'INR' ? '₹' : '$'}{data.totalAmount}{data.currency === 'INR' ? ' + GST (18%)' : ''}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>4. THIRD-PARTY COSTS</Text>
        <Text>Pass-through expenses (billed at cost + 10% handling):</Text>
        <Text>- Domain registration, Hosting, Third-party APIs, Paid licenses</Text>
        <Text>All third-party costs will be disclosed in writing before purchase.</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>5. REVISIONS</Text>
        <Text>This contract includes 2 rounds of revisions per milestone.</Text>
        <Text>Additional revisions will be charged at {data.currency === 'INR' ? '₹' : '$'}{data.hourlyRate}/hour.</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>6. INTELLECTUAL PROPERTY</Text>
        <Text>Upon full payment, all deliverables become the property of the Client.</Text>
        <Text>NerDev retains the right to use the work for portfolio/showcase (with Client permission).</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>7. TERMINATION</Text>
        <Text>By Client: 14 days written notice, advance non-refundable</Text>
        <Text>By NerDev: May terminate if payment is 21+ days overdue</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>8. LIABILITY</Text>
        <Text>NerDev&apos;s liability is limited to the total amount paid under this contract.</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>9. DISPUTE RESOLUTION</Text>
        <Text>Governed by the laws of {data.jurisdiction}</Text>
      </View>

      <View style={[styles.section, { marginTop: 40 }]}>
        <Text style={styles.sectionTitle}>ACCEPTANCE</Text>
        <Text style={{ marginBottom: 20 }}>By signing below, both parties agree to the terms of this contract.</Text>
        
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            <Text style={styles.bold}>For NerDev:</Text>
            <Text>Signature: _________________</Text>
            <Text>Name: {data.providerName}</Text>
            <Text>Date: _______________</Text>
          </View>
          <View>
            <Text style={styles.bold}>For Client:</Text>
            <Text>Signature: _________________</Text>
            <Text>Name: {data.clientName}</Text>
            <Text>Date: _______________</Text>
          </View>
        </View>
      </View>
      </View>
    </Page>
  </Document>
);

interface ContractData {
  providerName: string;
  providerAddress: string;
  clientCompany: string;
  clientAddress: string;
  clientName: string;
  projectName: string;
  deliverables: string[];
  duration: string;
  startDate: string;
  currency: 'INR' | 'USD';
  advanceAmount: string;
  milestone2Amount: string;
  finalAmount: string;
  totalAmount: string;
  hourlyRate: string;
  jurisdiction: string;
}

export async function generateContractPDF(data: ContractData) {
  const blob = await pdf(<ContractPDF data={data} />).toBlob();
  return blob;
}

export default ContractPDF;
