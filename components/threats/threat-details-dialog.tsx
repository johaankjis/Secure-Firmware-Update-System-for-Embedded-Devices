"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Shield, CheckCircle2, Target, Users } from "lucide-react"

interface ThreatDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  threatId: string | null
}

export function ThreatDetailsDialog({ open, onOpenChange, threatId }: ThreatDetailsDialogProps) {
  // Mock threat details
  const threat = {
    title: "Unauthorized Firmware Modification",
    category: "Tampering",
    categoryIcon: "T",
    severity: "critical",
    likelihood: "high",
    impact: "critical",
    status: "mitigated",
    description:
      "An attacker could intercept and modify the firmware binary during the OTA update process, potentially installing malicious code on devices. This could lead to complete device compromise, data theft, or use of devices in botnets.",
    affectedAssets: ["Firmware Binary", "Update Server", "Device Storage", "Network Communication"],
    mitigations: [
      {
        name: "Cryptographic Signature Verification",
        status: "implemented",
        description: "All firmware binaries are signed with RSA-4096 keys and verified before installation",
      },
      {
        name: "Secure Boot Implementation",
        status: "implemented",
        description: "Hardware-based secure boot ensures only signed firmware can execute",
      },
      {
        name: "Hash Validation",
        status: "implemented",
        description: "SHA-256 hash verification before and after firmware installation",
      },
      {
        name: "TLS 1.3 for Updates",
        status: "implemented",
        description: "All firmware downloads use TLS 1.3 with certificate pinning",
      },
    ],
    residualRisk: "low",
    riskRationale:
      "With all mitigations in place, the residual risk is low. An attacker would need to compromise the signing keys, which are stored in HSMs with strict access controls.",
    owner: "Security Team",
    lastUpdated: "2025-10-20",
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>
      case "high":
        return (
          <Badge variant="destructive" className="bg-destructive/80">
            High
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            Medium
          </Badge>
        )
      case "low":
        return (
          <Badge variant="outline" className="bg-muted text-muted-foreground">
            Low
          </Badge>
        )
      default:
        return <Badge variant="outline">{severity}</Badge>
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            {threat.title}
          </DialogTitle>
          <DialogDescription>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="bg-orange-500/20 text-orange-500 border-orange-500/20">
                {threat.categoryIcon} - {threat.category}
              </Badge>
              {getSeverityBadge(threat.severity)}
              <Badge variant="default" className="bg-accent text-accent-foreground">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                {threat.status}
              </Badge>
            </div>
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="mitigations">Mitigations ({threat.mitigations.length})</TabsTrigger>
            <TabsTrigger value="risk">Risk Assessment</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">Description</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{threat.description}</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Severity</p>
                  {getSeverityBadge(threat.severity)}
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Likelihood</p>
                  {getSeverityBadge(threat.likelihood)}
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Impact</p>
                  {getSeverityBadge(threat.impact)}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Affected Assets
                </h4>
                <div className="flex flex-wrap gap-2">
                  {threat.affectedAssets.map((asset) => (
                    <Badge key={asset} variant="outline" className="bg-muted">
                      {asset}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between py-2 border-t border-border">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Owner</span>
                </div>
                <span className="text-sm font-medium text-foreground">{threat.owner}</span>
              </div>

              <div className="flex items-center justify-between py-2 border-t border-border">
                <span className="text-sm text-muted-foreground">Last Updated</span>
                <span className="text-sm font-medium text-foreground">
                  {new Date(threat.lastUpdated).toLocaleDateString()}
                </span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="mitigations" className="space-y-4">
            <div className="space-y-3">
              {threat.mitigations.map((mitigation, index) => (
                <div key={index} className="rounded-lg border border-border p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-foreground">{mitigation.name}</h4>
                    <Badge variant="default" className="bg-accent text-accent-foreground">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      {mitigation.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{mitigation.description}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="risk" className="space-y-4">
            <div className="space-y-4">
              <div className="rounded-lg border border-border bg-muted/50 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="h-5 w-5 text-accent" />
                  <h4 className="text-sm font-medium text-foreground">Residual Risk Assessment</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Residual Risk Level</span>
                    {getSeverityBadge(threat.residualRisk)}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{threat.riskRationale}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-foreground">Risk Calculation</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border border-border p-3">
                    <p className="text-xs text-muted-foreground mb-1">Initial Risk</p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">Likelihood × Impact</span>
                      <Badge variant="destructive">Critical</Badge>
                    </div>
                  </div>
                  <div className="rounded-lg border border-border p-3">
                    <p className="text-xs text-muted-foreground mb-1">Current Risk</p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">After Mitigations</span>
                      <Badge variant="outline" className="bg-muted text-muted-foreground">
                        Low
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-accent/20 bg-accent/10 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                  <h4 className="text-sm font-medium text-accent">Risk Acceptance</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  The residual risk has been reviewed and accepted by the Security Team. All reasonable mitigations have
                  been implemented.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
