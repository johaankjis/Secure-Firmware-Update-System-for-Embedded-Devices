"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Shield, AlertTriangle, CheckCircle2, Clock, Download, Trash2, Play } from "lucide-react"
import { UploadDialog } from "@/components/firmware/upload-dialog"
import { DeploymentDialog } from "@/components/firmware/deployment-dialog"

// Mock firmware data
const firmwareVersions = [
  {
    id: "fw-001",
    version: "v2.4.1",
    filename: "firmware-v2.4.1.bin",
    size: "2.4 MB",
    uploadDate: "2025-10-21T10:30:00Z",
    status: "deployed",
    devices: 847,
    hash: "sha256:a3f5b2c1...",
    signature: "verified",
    vulnerabilities: 0,
    uploader: "admin@securefirmware.com",
  },
  {
    id: "fw-002",
    version: "v2.4.0",
    filename: "firmware-v2.4.0.bin",
    size: "2.3 MB",
    uploadDate: "2025-10-20T14:20:00Z",
    status: "deployed",
    devices: 1247,
    hash: "sha256:b4e6c3d2...",
    signature: "verified",
    vulnerabilities: 0,
    uploader: "admin@securefirmware.com",
  },
  {
    id: "fw-003",
    version: "v2.3.9",
    filename: "firmware-v2.3.9.bin",
    size: "2.2 MB",
    uploadDate: "2025-10-18T09:15:00Z",
    status: "rollback",
    devices: 0,
    hash: "sha256:c5f7d4e3...",
    signature: "verified",
    vulnerabilities: 2,
    uploader: "admin@securefirmware.com",
  },
  {
    id: "fw-004",
    version: "v2.3.8",
    filename: "firmware-v2.3.8.bin",
    size: "2.2 MB",
    uploadDate: "2025-10-15T16:45:00Z",
    status: "archived",
    devices: 400,
    hash: "sha256:d6g8e5f4...",
    signature: "verified",
    vulnerabilities: 1,
    uploader: "admin@securefirmware.com",
  },
]

const pendingUploads = [
  {
    id: "pending-001",
    version: "v2.5.0-beta",
    filename: "firmware-v2.5.0-beta.bin",
    size: "2.5 MB",
    uploadDate: "2025-10-21T15:00:00Z",
    status: "scanning",
    hash: "sha256:e7h9f6g5...",
    vulnerabilities: null,
    uploader: "dev@securefirmware.com",
  },
  {
    id: "pending-002",
    version: "v2.4.2",
    filename: "firmware-v2.4.2.bin",
    size: "2.4 MB",
    uploadDate: "2025-10-21T12:30:00Z",
    status: "ready",
    hash: "sha256:f8i0g7h6...",
    vulnerabilities: 0,
    uploader: "admin@securefirmware.com",
  },
]

export default function FirmwarePage() {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [deployDialogOpen, setDeployDialogOpen] = useState(false)
  const [selectedFirmware, setSelectedFirmware] = useState<string | null>(null)

  const handleDeploy = (firmwareId: string) => {
    setSelectedFirmware(firmwareId)
    setDeployDialogOpen(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "deployed":
        return (
          <Badge variant="default" className="bg-accent text-accent-foreground">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Deployed
          </Badge>
        )
      case "ready":
        return (
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            <Clock className="h-3 w-3 mr-1" />
            Ready
          </Badge>
        )
      case "scanning":
        return (
          <Badge variant="outline" className="bg-muted text-muted-foreground">
            <Shield className="h-3 w-3 mr-1" />
            Scanning
          </Badge>
        )
      case "rollback":
        return (
          <Badge variant="destructive">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Rollback
          </Badge>
        )
      case "archived":
        return (
          <Badge variant="outline" className="text-muted-foreground">
            Archived
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Firmware Update Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Upload, validate, and deploy firmware updates securely</p>
        </div>
        <Button onClick={() => setUploadDialogOpen(true)} className="gap-2">
          <Upload className="h-4 w-4" />
          Upload Firmware
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Total Versions</CardTitle>
            <Upload className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{firmwareVersions.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Across all statuses</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Active Deployments</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">
              {firmwareVersions.filter((f) => f.status === "deployed").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Currently in production</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Pending Updates</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{pendingUploads.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Ready for deployment</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Security Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">
              {firmwareVersions.reduce((sum, f) => sum + f.vulnerabilities, 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Total vulnerabilities</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Versions</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingUploads.length})</TabsTrigger>
          <TabsTrigger value="deployed">Deployed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">Firmware Version History</CardTitle>
              <CardDescription className="text-muted-foreground">
                Complete history of all firmware uploads and deployments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Version</TableHead>
                    <TableHead>Filename</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Devices</TableHead>
                    <TableHead>Security</TableHead>
                    <TableHead>Upload Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {firmwareVersions.map((firmware) => (
                    <TableRow key={firmware.id}>
                      <TableCell className="font-medium text-foreground">{firmware.version}</TableCell>
                      <TableCell className="text-muted-foreground">
                        <div className="flex flex-col">
                          <span className="text-sm">{firmware.filename}</span>
                          <span className="text-xs text-muted-foreground">{firmware.size}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(firmware.status)}</TableCell>
                      <TableCell className="text-foreground">{firmware.devices.toLocaleString()}</TableCell>
                      <TableCell>
                        {firmware.vulnerabilities === 0 ? (
                          <div className="flex items-center gap-1 text-accent">
                            <CheckCircle2 className="h-4 w-4" />
                            <span className="text-sm">Secure</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <span className="text-sm">{firmware.vulnerabilities} issues</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{formatDate(firmware.uploadDate)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon-sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          {firmware.status === "deployed" && (
                            <Button variant="ghost" size="icon-sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">Pending Firmware Updates</CardTitle>
              <CardDescription className="text-muted-foreground">
                Firmware awaiting security validation or deployment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Version</TableHead>
                    <TableHead>Filename</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Security Scan</TableHead>
                    <TableHead>Upload Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingUploads.map((firmware) => (
                    <TableRow key={firmware.id}>
                      <TableCell className="font-medium text-foreground">{firmware.version}</TableCell>
                      <TableCell className="text-muted-foreground">
                        <div className="flex flex-col">
                          <span className="text-sm">{firmware.filename}</span>
                          <span className="text-xs text-muted-foreground">{firmware.size}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(firmware.status)}</TableCell>
                      <TableCell>
                        {firmware.status === "scanning" ? (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Shield className="h-4 w-4 animate-pulse" />
                            <span className="text-sm">In progress...</span>
                          </div>
                        ) : firmware.vulnerabilities === 0 ? (
                          <div className="flex items-center gap-1 text-accent">
                            <CheckCircle2 className="h-4 w-4" />
                            <span className="text-sm">Passed</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <span className="text-sm">{firmware.vulnerabilities} issues</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{formatDate(firmware.uploadDate)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {firmware.status === "ready" && (
                            <Button size="sm" onClick={() => handleDeploy(firmware.id)} className="gap-2">
                              <Play className="h-3 w-3" />
                              Deploy
                            </Button>
                          )}
                          <Button variant="ghost" size="icon-sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deployed" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">Active Deployments</CardTitle>
              <CardDescription className="text-muted-foreground">
                Firmware versions currently deployed to devices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Version</TableHead>
                    <TableHead>Devices</TableHead>
                    <TableHead>Security</TableHead>
                    <TableHead>Signature</TableHead>
                    <TableHead>Deploy Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {firmwareVersions
                    .filter((f) => f.status === "deployed")
                    .map((firmware) => (
                      <TableRow key={firmware.id}>
                        <TableCell className="font-medium text-foreground">{firmware.version}</TableCell>
                        <TableCell className="text-foreground">{firmware.devices.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-accent">
                            <CheckCircle2 className="h-4 w-4" />
                            <span className="text-sm">Verified</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="bg-accent/10 text-accent border-accent/20 font-mono text-xs"
                          >
                            {firmware.signature}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{formatDate(firmware.uploadDate)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon-sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <UploadDialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen} />
      <DeploymentDialog open={deployDialogOpen} onOpenChange={setDeployDialogOpen} firmwareId={selectedFirmware} />
    </div>
  )
}
