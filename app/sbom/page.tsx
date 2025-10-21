"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  FileText,
  Download,
  Search,
  AlertTriangle,
  CheckCircle2,
  Package,
  Shield,
  RefreshCw,
  Filter,
} from "lucide-react"
import { GenerateSbomDialog } from "@/components/sbom/generate-sbom-dialog"
import { ComponentDetailsDialog } from "@/components/sbom/component-details-dialog"

// Mock SBOM data
const sbomData = {
  metadata: {
    format: "CycloneDX",
    version: "1.5",
    timestamp: "2025-10-21T10:30:00Z",
    firmwareVersion: "v2.4.1",
    totalComponents: 247,
    licenses: 18,
  },
  components: [
    {
      id: "comp-001",
      name: "OpenSSL",
      version: "3.0.12",
      type: "library",
      license: "Apache-2.0",
      supplier: "OpenSSL Software Foundation",
      vulnerabilities: 0,
      cpe: "cpe:2.3:a:openssl:openssl:3.0.12:*:*:*:*:*:*:*",
      purl: "pkg:generic/openssl@3.0.12",
      hash: "sha256:a1b2c3d4...",
    },
    {
      id: "comp-002",
      name: "mbedTLS",
      version: "3.5.1",
      type: "library",
      license: "Apache-2.0",
      supplier: "Arm Limited",
      vulnerabilities: 0,
      cpe: "cpe:2.3:a:arm:mbedtls:3.5.1:*:*:*:*:*:*:*",
      purl: "pkg:generic/mbedtls@3.5.1",
      hash: "sha256:b2c3d4e5...",
    },
    {
      id: "comp-003",
      name: "zlib",
      version: "1.2.11",
      type: "library",
      license: "Zlib",
      supplier: "Jean-loup Gailly and Mark Adler",
      vulnerabilities: 2,
      cpe: "cpe:2.3:a:gnu:zlib:1.2.11:*:*:*:*:*:*:*",
      purl: "pkg:generic/zlib@1.2.11",
      hash: "sha256:c3d4e5f6...",
    },
    {
      id: "comp-004",
      name: "FreeRTOS",
      version: "10.5.1",
      type: "framework",
      license: "MIT",
      supplier: "Amazon Web Services",
      vulnerabilities: 0,
      cpe: "cpe:2.3:a:freertos:freertos:10.5.1:*:*:*:*:*:*:*",
      purl: "pkg:generic/freertos@10.5.1",
      hash: "sha256:d4e5f6g7...",
    },
    {
      id: "comp-005",
      name: "lwIP",
      version: "2.1.3",
      type: "library",
      license: "BSD-3-Clause",
      supplier: "Swedish Institute of Computer Science",
      vulnerabilities: 1,
      cpe: "cpe:2.3:a:lwip_project:lwip:2.1.3:*:*:*:*:*:*:*",
      purl: "pkg:generic/lwip@2.1.3",
      hash: "sha256:e5f6g7h8...",
    },
  ],
  vulnerabilities: [
    {
      id: "CVE-2023-1234",
      component: "zlib",
      severity: "high",
      cvss: 7.5,
      description: "Buffer overflow in zlib compression",
      status: "open",
      published: "2023-08-15",
    },
    {
      id: "CVE-2023-5678",
      component: "zlib",
      severity: "medium",
      cvss: 5.3,
      description: "Memory leak in decompression routine",
      status: "open",
      published: "2023-09-20",
    },
    {
      id: "CVE-2023-9012",
      component: "lwIP",
      severity: "high",
      cvss: 8.1,
      description: "TCP/IP stack vulnerability",
      status: "patched",
      published: "2023-10-05",
    },
  ],
}

export default function SbomPage() {
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const handleViewDetails = (componentId: string) => {
    setSelectedComponent(componentId)
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

  const filteredComponents = sbomData.components.filter(
    (comp) =>
      comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.version.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.license.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">SBOM Manager</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Software Bill of Materials generation and component tracking
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Export SBOM
          </Button>
          <Button onClick={() => setGenerateDialogOpen(true)} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Generate SBOM
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Total Components</CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{sbomData.metadata.totalComponents}</div>
            <p className="text-xs text-muted-foreground mt-1">Tracked dependencies</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Vulnerabilities</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{sbomData.vulnerabilities.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {sbomData.vulnerabilities.filter((v) => v.status === "open").length} open issues
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">License Types</CardTitle>
            <Shield className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{sbomData.metadata.licenses}</div>
            <p className="text-xs text-muted-foreground mt-1">Unique licenses</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Compliance</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">98%</div>
            <p className="text-xs text-muted-foreground mt-1">License compliance</p>
          </CardContent>
        </Card>
      </div>

      {/* SBOM Metadata */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">SBOM Metadata</CardTitle>
          <CardDescription className="text-muted-foreground">
            Current SBOM information and format details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Format</p>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                {sbomData.metadata.format} v{sbomData.metadata.version}
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Firmware Version</p>
              <p className="text-sm font-medium text-foreground">{sbomData.metadata.firmwareVersion}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Last Generated</p>
              <p className="text-sm font-medium text-foreground">
                {new Date(sbomData.metadata.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="components" className="space-y-4">
        <TabsList>
          <TabsTrigger value="components">Components ({sbomData.components.length})</TabsTrigger>
          <TabsTrigger value="vulnerabilities">Vulnerabilities ({sbomData.vulnerabilities.length})</TabsTrigger>
          <TabsTrigger value="licenses">Licenses</TabsTrigger>
        </TabsList>

        <TabsContent value="components" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-card-foreground">Component Inventory</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    All software components and dependencies
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search components..."
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
                    <TableHead>Component</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>License</TableHead>
                    <TableHead>Security</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredComponents.map((component) => (
                    <TableRow key={component.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-primary" />
                          <div>
                            <p className="font-medium text-foreground">{component.name}</p>
                            <p className="text-xs text-muted-foreground">{component.supplier}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm text-foreground">{component.version}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {component.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-muted text-muted-foreground">
                          {component.license}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {component.vulnerabilities === 0 ? (
                          <div className="flex items-center gap-1 text-accent">
                            <CheckCircle2 className="h-4 w-4" />
                            <span className="text-sm">Secure</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <span className="text-sm">{component.vulnerabilities} CVEs</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleViewDetails(component.id)}>
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vulnerabilities" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">Vulnerability Report</CardTitle>
              <CardDescription className="text-muted-foreground">
                Known security vulnerabilities in components
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>CVE ID</TableHead>
                    <TableHead>Component</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>CVSS Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Published</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sbomData.vulnerabilities.map((vuln) => (
                    <TableRow key={vuln.id}>
                      <TableCell className="font-mono text-sm text-foreground">{vuln.id}</TableCell>
                      <TableCell className="font-medium text-foreground">{vuln.component}</TableCell>
                      <TableCell>{getSeverityBadge(vuln.severity)}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            vuln.cvss >= 7
                              ? "bg-destructive/10 text-destructive border-destructive/20"
                              : "bg-primary/10 text-primary border-primary/20"
                          }
                        >
                          {vuln.cvss}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {vuln.status === "patched" ? (
                          <Badge variant="default" className="bg-accent text-accent-foreground">
                            Patched
                          </Badge>
                        ) : (
                          <Badge variant="destructive">Open</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(vuln.published).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="licenses" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">License Distribution</CardTitle>
              <CardDescription className="text-muted-foreground">
                Open source licenses used across components
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Apache-2.0", count: 89, compliance: "compliant" },
                  { name: "MIT", count: 67, compliance: "compliant" },
                  { name: "BSD-3-Clause", count: 45, compliance: "compliant" },
                  { name: "GPL-3.0", count: 23, compliance: "review" },
                  { name: "Zlib", count: 12, compliance: "compliant" },
                  { name: "ISC", count: 11, compliance: "compliant" },
                ].map((license) => (
                  <div
                    key={license.name}
                    className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                        <FileText className="h-5 w-5 text-secondary-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-card-foreground">{license.name}</p>
                        <p className="text-xs text-muted-foreground">{license.count} components</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {license.compliance === "compliant" ? (
                        <Badge variant="default" className="bg-accent text-accent-foreground">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Compliant
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Review Required
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <GenerateSbomDialog open={generateDialogOpen} onOpenChange={setGenerateDialogOpen} />
      <ComponentDetailsDialog
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        componentId={selectedComponent}
      />
    </div>
  )
}
