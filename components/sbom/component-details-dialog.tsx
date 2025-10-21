"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, Shield, Hash, AlertTriangle, CheckCircle2 } from "lucide-react"

interface ComponentDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  componentId: string | null
}

export function ComponentDetailsDialog({ open, onOpenChange, componentId }: ComponentDetailsDialogProps) {
  // Mock component details
  const component = {
    name: "OpenSSL",
    version: "3.0.12",
    type: "library",
    license: "Apache-2.0",
    supplier: "OpenSSL Software Foundation",
    description: "Cryptography and SSL/TLS toolkit",
    homepage: "https://www.openssl.org",
    cpe: "cpe:2.3:a:openssl:openssl:3.0.12:*:*:*:*:*:*:*",
    purl: "pkg:generic/openssl@3.0.12",
    hash: "sha256:a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6",
    vulnerabilities: 0,
    dependencies: ["zlib", "libcrypto"],
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            {component.name} v{component.version}
          </DialogTitle>
          <DialogDescription>{component.description}</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="identifiers">Identifiers</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Component Type</span>
                <Badge variant="outline" className="capitalize">
                  {component.type}
                </Badge>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">License</span>
                <Badge variant="outline" className="bg-muted text-muted-foreground">
                  {component.license}
                </Badge>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Supplier</span>
                <span className="text-sm font-medium text-foreground">{component.supplier}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Homepage</span>
                <a
                  href={component.homepage}
                  className="text-sm text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {component.homepage}
                </a>
              </div>
              <div className="flex items-start justify-between py-2">
                <span className="text-sm text-muted-foreground">Dependencies</span>
                <div className="flex flex-wrap gap-1 justify-end">
                  {component.dependencies.map((dep) => (
                    <Badge key={dep} variant="outline" className="text-xs">
                      {dep}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <div className="rounded-lg border border-border bg-muted/50 p-4">
              <div className="flex items-center gap-2 mb-3">
                {component.vulnerabilities === 0 ? (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-accent" />
                    <h4 className="text-sm font-medium text-accent">No Known Vulnerabilities</h4>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    <h4 className="text-sm font-medium text-destructive">
                      {component.vulnerabilities} Vulnerabilities Found
                    </h4>
                  </>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                This component has been scanned against the National Vulnerability Database (NVD) and other security
                sources.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-foreground">Security Verification</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                  <span className="text-muted-foreground">Cryptographic hash verified</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                  <span className="text-muted-foreground">Digital signature validated</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                  <span className="text-muted-foreground">License compliance verified</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="identifiers" className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">CPE (Common Platform Enumeration)</span>
                </div>
                <code className="block text-xs bg-muted p-2 rounded border border-border font-mono text-muted-foreground break-all">
                  {component.cpe}
                </code>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">PURL (Package URL)</span>
                </div>
                <code className="block text-xs bg-muted p-2 rounded border border-border font-mono text-muted-foreground break-all">
                  {component.purl}
                </code>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">SHA-256 Hash</span>
                </div>
                <code className="block text-xs bg-muted p-2 rounded border border-border font-mono text-muted-foreground break-all">
                  {component.hash}
                </code>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
