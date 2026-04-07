"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { Plus, Trash2, Edit2, Save, X, Users, Search, ArrowUp, ArrowDown, DollarSign } from "lucide-react";

interface Client {
  id: string;
  name: string;
  contact: string;
  email: string;
  country: "INR" | "USD";
  status: "lead" | "active" | "delivered" | "retainer";
  totalBilled: number;
  projectName: string;
  createdAt: string;
}

const defaultClients: Client[] = [
  { id: "1", name: "Demo Client", contact: "John", email: "john@demo.com", country: "INR", status: "delivered", totalBilled: 150000, projectName: "E-commerce Site", createdAt: "2026-01-15" },
];

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [newClient, setNewClient] = useState<Partial<Client>>({
    name: "",
    contact: "",
    email: "",
    country: "INR",
    status: "lead",
    totalBilled: 0,
    projectName: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("nerdev-clients");
    if (saved) {
      setClients(JSON.parse(saved));
    } else {
      setClients(defaultClients);
    }
  }, []);

  const saveClients = (newClients: Client[]) => {
    setClients(newClients);
    localStorage.setItem("nerdev-clients", JSON.stringify(newClients));
  };

  const addClient = () => {
    if (!newClient.name) return;
    const client: Client = {
      id: Date.now().toString(),
      name: newClient.name,
      contact: newClient.contact || "",
      email: newClient.email || "",
      country: newClient.country || "INR",
      status: newClient.status || "lead",
      totalBilled: newClient.totalBilled || 0,
      projectName: newClient.projectName || "",
      createdAt: new Date().toISOString().split("T")[0],
    };
    saveClients([...clients, client]);
    setNewClient({ name: "", contact: "", email: "", country: "INR", status: "lead", totalBilled: 0, projectName: "" });
    setShowAddForm(false);
  };

  const deleteClient = (id: string) => {
    if (confirm("Delete this client?")) {
      saveClients(clients.filter(c => c.id !== id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "lead": return "bg-yellow-100 text-yellow-800";
      case "active": return "bg-blue-100 text-blue-800";
      case "delivered": return "bg-green-100 text-green-800";
      case "retainer": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredClients = clients.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.projectName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === "all" || c.status === filter;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: clients.length,
    leads: clients.filter(c => c.status === "lead").length,
    active: clients.filter(c => c.status === "active").length,
    revenue: clients.reduce((acc, c) => acc + (c.totalBilled || 0), 0),
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Client CRM</h1>
            <p className="text-gray-600 mt-1">Track your clients and pipeline</p>
          </div>
          <Button onClick={() => setShowAddForm(true)} className="gap-2">
            <Plus className="w-4 h-4" /> Add Client
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-gray-500">Total Clients</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-yellow-600">{stats.leads}</div>
              <div className="text-sm text-gray-500">Leads</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-blue-600">{stats.active}</div>
              <div className="text-sm text-gray-500">Active Projects</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-green-600">₹{stats.revenue.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Total Billed</div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <Input 
                  placeholder="Search clients..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-input rounded-md bg-background text-sm"
              >
                <option value="all">All Status</option>
                <option value="lead">Lead</option>
                <option value="active">Active</option>
                <option value="delivered">Delivered</option>
                <option value="retainer">Retainer</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {showAddForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Add New Client</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label>Company Name *</Label>
                  <Input value={newClient.name} onChange={(e) => setNewClient({ ...newClient, name: e.target.value })} placeholder="Company Name" />
                </div>
                <div>
                  <Label>Contact Person</Label>
                  <Input value={newClient.contact} onChange={(e) => setNewClient({ ...newClient, contact: e.target.value })} placeholder="Name" />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input value={newClient.email} onChange={(e) => setNewClient({ ...newClient, email: e.target.value })} placeholder="email@company.com" />
                </div>
                <div>
                  <Label>Country</Label>
                  <select value={newClient.country} onChange={(e) => setNewClient({ ...newClient, country: e.target.value as "INR" | "USD" })} className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm">
                    <option value="INR">India (INR)</option>
                    <option value="USD">International (USD)</option>
                  </select>
                </div>
                <div>
                  <Label>Status</Label>
                  <select value={newClient.status} onChange={(e) => setNewClient({ ...newClient, status: e.target.value as any })} className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm">
                    <option value="lead">Lead</option>
                    <option value="active">Active</option>
                    <option value="delivered">Delivered</option>
                    <option value="retainer">Retainer</option>
                  </select>
                </div>
                <div>
                  <Label>Total Billed</Label>
                  <Input type="number" value={newClient.totalBilled} onChange={(e) => setNewClient({ ...newClient, totalBilled: parseInt(e.target.value) })} placeholder="0" />
                </div>
                <div className="md:col-span-3">
                  <Label>Project Name</Label>
                  <Input value={newClient.projectName} onChange={(e) => setNewClient({ ...newClient, projectName: e.target.value })} placeholder="Project Name" />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={addClient} className="gap-2"><Save className="w-4 h-4" /> Save</Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-0">
            <table className="w-full">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-gray-500">Client</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500">Project</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-right p-4 text-sm font-medium text-gray-500">Total Billed</th>
                  <th className="text-right p-4 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">No clients found</td>
                  </tr>
                ) : filteredClients.map((client) => (
                  <tr key={client.id} className="border-b">
                    <td className="p-4">
                      <div className="font-medium">{client.name}</div>
                      <div className="text-sm text-gray-500">{client.contact} • {client.email}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">{client.projectName}</div>
                      <div className="text-xs text-gray-400">{client.country}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
                        {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-4 text-right font-medium">
                      {client.country === "INR" ? "₹" : "$"}{client.totalBilled.toLocaleString()}
                    </td>
                    <td className="p-4 text-right">
                      <Button variant="ghost" size="sm" onClick={() => deleteClient(client.id)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
