"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  AlertTriangle,
  Search,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  TrendingUp,
  TrendingDown,
} from "lucide-react"
import { AddThreatDialog } from "@/components/threats/add-threat-dialog"
import { ThreatDetailsDialog } from "@/components/threats/threat-details-dialog"

// STRIDE categories
const strideCategories = [
  { id: "spoofing", name: "Spoofing", icon: "S", color: "bg-red-500/20 text-red-500 border-red-500/20" },
  { id: "tampering", name: "Tampering", icon: "T", color: "bg-orange-500/20 text-orange-500 border-orange-500/20" },
  { id: "repudiation", name: "Repudiation", icon: "R", color: "bg-yellow-500/20 text-yellow-500 border-yellow-500/20" },
  {
    id: "information",
    name: "Information Disclosure",
    icon: "I",
    color: "bg-blue-500/20 text-blue-500 border-blue-500/20",
  },
  {
    id: "denial",
    name: "Denial of Service",
    icon: "D",
    color: "bg-purple-500/20 text-purple-500 border-purple-500/20",
  },
  {
    id: "elevation",
    name: "Elevation of Privilege",
    icon: "E",
    color: "bg-pink-500/20 text-pink-500 border-pink-500/20",
  },
]

// Mock threat data
const threats = [
  {
    id: "threat-001",
    title: "Unauthorized Firmware Modification",
    category: "tampering",
    severity: "critical",
    likelihood: "high",
    impact: "critical",
    status: "mitigated",
    description: "Attacker modifies firmware binary during OTA update process",
    affectedAssets: ["Firmware Binary", "Update Server", "Device Storage"],
    mitigations: [
      "Cryptographic signature verification",
      "Secure boot implementation",
      "Hash validation before installation",
    ],
    residualRisk: "low",
    owner: "Security Team",
    lastUpdated: "2025-10-20",
  },
  {
    id: "threat-002",
    title: "Device Identity Spoofing",
    category: "spoofing",
    severity: "high",
    likelihood: "medium",
    impact: "high",
    status: "mitigated",
    description: "Attacker impersonates legitimate device to receive firmware updates",
    affectedAssets: ["Device Certificates", "Authentication System"],
    mitigations: ["X.509 certificate validation", "Mutual TLS authentication", "Device attestation"],
    residualRisk: "low",
    owner: "Security Team",
    lastUpdated: "2025-10-19",
  },
  {
    id: "threat-003",
    title: "Update Denial of Service",
    category: "denial",
    severity: "medium",
    likelihood: "medium",
    impact: "medium",
    status: "open",
    description: "Attacker floods update server to prevent legitimate devices from receiving updates",
    affectedAssets: ["Update Server", "Network Infrastructure"],
    mitigations: ["Rate limiting", "DDoS protection", "CDN distribution"],
    residualRisk: "medium",
    owner: "Infrastructure Team",
    lastUpdated: "2025-10-18",
  },
  {
    id: "threat-004",
    title: "Firmware Version Rollback Attack",
    category: "tampering",
    severity: "high",
    likelihood: "low",
    impact: "high",
    status: "in-progress",
    description: "Attacker forces device to install older vulnerable firmware version",
    affectedAssets: ["Version Control System", "Device Storage"],
    mitigations: ["Anti-rollback protection", "Version monotonicity checks"],
    residualRisk: "medium",
    owner: "Security Team",
    lastUpdated: "2025-10-17",
  },
  {
    id: "threat-005",
    title: "Sensitive Data Exposure in Logs",
    category: "information",
    severity: "medium",
    likelihood: "high",
    impact: "low",
    status: "open",
    description: "Device credentials or keys exposed in debug logs during update process",
    affectedAssets: ["Logging System", "Debug Interface"],
    mitigations: ["Log sanitization", "Disable debug in production"],
    residualRisk: "high",
    owner: "Development Team",
    lastUpdated: "2025-10-16",
  },
  {
    id: "threat-006",
    title: "Update Process Repudiation",
    category: "repudiation",
    severity: "low",
    likelihood: "low",
    impact: "medium",
    status: "mitigated",
    description: "Lack of audit trail for firmware update operations",
    affectedAssets: ["Audit System", "Update Logs"],
    mitigations: ["Comprehensive audit logging", "Immutable log storage", "Digital signatures on logs"],
    residualRisk: "low",
    owner: "Compliance Team",
    lastUpdated: "2025-10-15",
  },
]

export default function ThreatsPage() {
  const [addThreatDialogOpen, setAddThreatDialogOpen] = useState(false)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [selectedThreat, setSelectedThreat] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const handleViewDetails = (threatId: string) => {
    setSelectedThreat(threatId)
    setDetailsDialogOpen(true)
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return (
          <Badge variant="destructive" className="font-medium">
            Critical
          </Badge>
        )
      case "high":
        return (
          <Badge variant="destructive" className="bg-destructive/80 font-medium">
            High
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 font-medium">
            Medium
          </Badge>
        )
      case "low":
        return (
          <Badge variant="outline" className="bg-muted text-muted-foreground font-medium">
            Low
          </Badge>
        )
      default:
        return <Badge variant="outline">{severity}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "mitigated":
        return (
          <Badge variant="default" className="bg-accent text-accent-foreground">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Mitigated
          </Badge>
        )
      case "in-progress":
        return (
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            <Clock className="h-3 w-3 mr-1" />
            In Progress
          </Badge>
        )
      case "open":
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Open
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const filteredThreats = threats.filter((threat) => {
    const matchesSearch =
      threat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      threat.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || threat.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const threatStats = {
    total: threats.length,
    critical: threats.filter((t) => t.severity === "critical").length,
    high: threats.filter((t) => t.severity === "high").length,
    mitigated: threats.filter((t) => t.status === "mitigated").length,
    open: threats.filter((t) => t.status === "open").length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Threat Modeling</h1>
          <p className="text-sm text-muted-foreground mt-1">STRIDE-based threat analysis and mitigation tracking</p>
        </div>
        <Button onClick={() => setAddThreatDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Threat
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Total Threats</CardTitle>
            <AlertTriangle className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{threatStats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">Identified threats</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Critical/High</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{threatStats.critical + threatStats.high}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <TrendingDown className="h-3 w-3 text-accent" />
              Requires immediate attention
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Mitigated</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{threatStats.mitigated}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round((threatStats.mitigated / threatStats.total) * 100)}% of total
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Open Threats</CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{threatStats.open}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-destructive" />
              Needs mitigation
            </p>
          </CardContent>
        </Card>
      </div>

      {/* STRIDE Categories */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">STRIDE Threat Categories</CardTitle>
          <CardDescription className="text-muted-foreground">
            Microsoft STRIDE methodology for systematic threat identification
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            {strideCategories.map((category) => {
              const categoryThreats = threats.filter((t) => t.category === category.id)
              const mitigatedCount = categoryThreats.filter((t) => t.status === "mitigated").length

              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                  className={`flex items-center justify-between rounded-lg border p-4 transition-all hover:bg-accent/50 ${
                    selectedCategory === category.id ? "border-primary bg-accent/50" : "border-border"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg font-mono text-sm font-bold ${category.color}`}
                    >
                      {category.icon}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-card-foreground">{category.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {categoryThreats.length} threats ({mitigatedCount} mitigated)
                      </p>
                    </div>
                  </div>
                  {categoryThreats.length > 0 && (
                    <Badge variant="outline" className="ml-2">
                      {categoryThreats.length}
                    </Badge>
                  )}
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Threats Table */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Threats ({threats.length})</TabsTrigger>
          <TabsTrigger value="open">Open ({threatStats.open})</TabsTrigger>
          <TabsTrigger value="mitigated">Mitigated ({threatStats.mitigated})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-card-foreground">Threat Inventory</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Complete list of identified security threats
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search threats..."
                      className="pl-8 w-[250px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Threat</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Residual Risk</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredThreats.map((threat) => {
                    const category = strideCategories.find((c) => c.id === threat.category)

                    return (
                      <TableRow key={threat.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-foreground">{threat.title}</p>
                            <p className="text-xs text-muted-foreground line-clamp-1">{threat.description}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div
                              className={`flex h-6 w-6 items-center justify-center rounded font-mono text-xs font-bold ${category?.color}`}
                            >
                              {category?.icon}
                            </div>
                            <span className="text-sm text-foreground">{category?.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getSeverityBadge(threat.severity)}</TableCell>
                        <TableCell>{getStatusBadge(threat.status)}</TableCell>
                        <TableCell>{getSeverityBadge(threat.residualRisk)}</TableCell>
                        <TableCell className="text-muted-foreground">{threat.owner}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleViewDetails(threat.id)}>
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="open" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">Open Threats</CardTitle>
              <CardDescription className="text-muted-foreground">
                Threats requiring mitigation or in progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Threat</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {threats
                    .filter((t) => t.status === "open" || t.status === "in-progress")
                    .map((threat) => {
                      const category = strideCategories.find((c) => c.id === threat.category)

                      return (
                        <TableRow key={threat.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium text-foreground">{threat.title}</p>
                              <p className="text-xs text-muted-foreground line-clamp-1">{threat.description}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div
                                className={`flex h-6 w-6 items-center justify-center rounded font-mono text-xs font-bold ${category?.color}`}
                              >
                                {category?.icon}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{getSeverityBadge(threat.severity)}</TableCell>
                          <TableCell>{getStatusBadge(threat.status)}</TableCell>
                          <TableCell className="text-muted-foreground">{threat.owner}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => handleViewDetails(threat.id)}>
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mitigated" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">Mitigated Threats</CardTitle>
              <CardDescription className="text-muted-foreground">
                Successfully addressed security threats
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Threat</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Original Severity</TableHead>
                    <TableHead>Residual Risk</TableHead>
                    <TableHead>Mitigations</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {threats
                    .filter((t) => t.status === "mitigated")
                    .map((threat) => {
                      const category = strideCategories.find((c) => c.id === threat.category)

                      return (
                        <TableRow key={threat.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium text-foreground">{threat.title}</p>
                              <p className="text-xs text-muted-foreground line-clamp-1">{threat.description}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div
                                className={`flex h-6 w-6 items-center justify-center rounded font-mono text-xs font-bold ${category?.color}`}
                              >
                                {category?.icon}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{getSeverityBadge(threat.severity)}</TableCell>
                          <TableCell>{getSeverityBadge(threat.residualRisk)}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{threat.mitigations.length} controls</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => handleViewDetails(threat.id)}>
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AddThreatDialog open={addThreatDialogOpen} onOpenChange={setAddThreatDialogOpen} />
      <ThreatDetailsDialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen} threatId={selectedThreat} />
    </div>
  )
}
