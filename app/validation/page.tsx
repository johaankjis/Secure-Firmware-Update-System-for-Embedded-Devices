"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, CheckCircle2, XCircle, AlertTriangle, Key, Hash, FileCheck, Play, Clock } from "lucide-react"
import { SignatureVerificationCard } from "@/components/validation/signature-verification-card"
import { HashValidationCard } from "@/components/validation/hash-validation-card"
import { CertificateCheckCard } from "@/components/validation/certificate-check-card"
import { SecurityScanCard } from "@/components/validation/security-scan-card"

// Mock validation data
const validationHistory = [
  {
    id: "val-001",
    type: "signature",
    firmware: "v2.4.1",
    timestamp: "2025-10-21T10:30:00Z",
    status: "passed",
    details: "RSA-4096 signature verified successfully",
  },
  {
    id: "val-002",
    type: "hash",
    firmware: "v2.4.1",
    timestamp: "2025-10-21T10:29:00Z",
    status: "passed",
    details: "SHA-256 hash matches expected value",
  },
  {
    id: "val-003",
    type: "certificate",
    firmware: "v2.4.1",
    timestamp: "2025-10-21T10:28:00Z",
    status: "passed",
    details: "X.509 certificate valid and trusted",
  },
  {
    id: "val-004",
    type: "security-scan",
    firmware: "v2.4.1",
    timestamp: "2025-10-21T10:25:00Z",
    status: "passed",
    details: "No vulnerabilities detected",
  },
  {
    id: "val-005",
    type: "signature",
    firmware: "v2.4.0",
    timestamp: "2025-10-20T14:20:00Z",
    status: "passed",
    details: "RSA-4096 signature verified successfully",
  },
  {
    id: "val-006",
    type: "security-scan",
    firmware: "v2.3.9",
    timestamp: "2025-10-18T09:15:00Z",
    status: "failed",
    details: "2 high-severity vulnerabilities found",
  },
]

export default function ValidationPage() {
  const [selectedTab, setSelectedTab] = useState("signature")

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "passed":
        return (
          <Badge variant="default" className="bg-accent text-accent-foreground">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Passed
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        )
      case "warning":
        return (
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Warning
          </Badge>
        )
      case "running":
        return (
          <Badge variant="outline" className="bg-muted text-muted-foreground">
            <Clock className="h-3 w-3 mr-1 animate-spin" />
            Running
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "signature":
        return <Key className="h-4 w-4 text-primary" />
      case "hash":
        return <Hash className="h-4 w-4 text-primary" />
      case "certificate":
        return <FileCheck className="h-4 w-4 text-primary" />
      case "security-scan":
        return <Shield className="h-4 w-4 text-primary" />
      default:
        return <Shield className="h-4 w-4 text-primary" />
    }
  }

  const getTypeName = (type: string) => {
    switch (type) {
      case "signature":
        return "Signature Verification"
      case "hash":
        return "Hash Validation"
      case "certificate":
        return "Certificate Check"
      case "security-scan":
        return "Security Scan"
      default:
        return type
    }
  }

  const validationStats = {
    total: validationHistory.length,
    passed: validationHistory.filter((v) => v.status === "passed").length,
    failed: validationHistory.filter((v) => v.status === "failed").length,
    successRate: Math.round(
      (validationHistory.filter((v) => v.status === "passed").length / validationHistory.length) * 100,
    ),
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Security Validation</h1>
          <p className="text-sm text-muted-foreground mt-1">Cryptographic verification and security scanning tools</p>
        </div>
        <Button className="gap-2">
          <Play className="h-4 w-4" />
          Run Full Validation
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Total Validations</CardTitle>
            <Shield className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{validationStats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Passed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{validationStats.passed}</div>
            <p className="text-xs text-muted-foreground mt-1">Successful validations</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Failed</CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{validationStats.failed}</div>
            <p className="text-xs text-muted-foreground mt-1">Failed validations</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Success Rate</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{validationStats.successRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">Overall success rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Validation Tools */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="signature">Signature Verification</TabsTrigger>
          <TabsTrigger value="hash">Hash Validation</TabsTrigger>
          <TabsTrigger value="certificate">Certificate Check</TabsTrigger>
          <TabsTrigger value="security">Security Scan</TabsTrigger>
        </TabsList>

        <TabsContent value="signature" className="space-y-4">
          <SignatureVerificationCard />
        </TabsContent>

        <TabsContent value="hash" className="space-y-4">
          <HashValidationCard />
        </TabsContent>

        <TabsContent value="certificate" className="space-y-4">
          <CertificateCheckCard />
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <SecurityScanCard />
        </TabsContent>
      </Tabs>

      {/* Validation History */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Validation History</CardTitle>
          <CardDescription className="text-muted-foreground">Recent security validation results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {validationHistory.map((validation) => (
              <div
                key={validation.id}
                className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                    {getTypeIcon(validation.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-card-foreground">{getTypeName(validation.type)}</p>
                      <Badge variant="outline" className="text-xs">
                        {validation.firmware}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{validation.details}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">
                    {new Date(validation.timestamp).toLocaleString()}
                  </span>
                  {getStatusBadge(validation.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
