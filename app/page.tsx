import { SidebarNav } from "@/components/sidebar-nav"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Upload, AlertTriangle, CheckCircle2, TrendingUp, TrendingDown, Activity } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="flex h-screen">
      <SidebarNav />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto bg-background p-6">
          {/* KPI Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">Firmware Integrity</CardTitle>
                <Shield className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">100%</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-accent" />
                  All signatures verified
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">Active Devices</CardTitle>
                <Activity className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">1,247</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-accent" />
                  +12% from last week
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">Risk Reduction</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">34%</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <TrendingDown className="h-3 w-3 text-accent" />
                  Pre-release vulnerabilities
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">Pending Updates</CardTitle>
                <Upload className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">3</div>
                <p className="text-xs text-muted-foreground mt-1">Ready for deployment</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Recent Firmware Updates */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Recent Firmware Updates</CardTitle>
                <CardDescription className="text-muted-foreground">Latest OTA deployments and status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { version: "v2.4.1", status: "deployed", devices: 847, date: "2 hours ago" },
                    { version: "v2.4.0", status: "deployed", devices: 1247, date: "1 day ago" },
                    { version: "v2.3.9", status: "rollback", devices: 0, date: "3 days ago" },
                  ].map((update) => (
                    <div
                      key={update.version}
                      className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                          <Upload className="h-5 w-5 text-secondary-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-card-foreground">{update.version}</p>
                          <p className="text-xs text-muted-foreground">
                            {update.devices} devices • {update.date}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={update.status === "deployed" ? "default" : "destructive"}
                        className={update.status === "deployed" ? "bg-accent text-accent-foreground" : ""}
                      >
                        {update.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Security Threats */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Active Security Threats</CardTitle>
                <CardDescription className="text-muted-foreground">
                  STRIDE analysis and mitigation status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { threat: "Spoofing", severity: "high", mitigated: true, category: "S" },
                    { threat: "Tampering", severity: "critical", mitigated: true, category: "T" },
                    { threat: "Repudiation", severity: "medium", mitigated: false, category: "R" },
                  ].map((threat) => (
                    <div
                      key={threat.threat}
                      className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-lg font-mono text-sm font-bold ${
                            threat.severity === "critical"
                              ? "bg-destructive/20 text-destructive"
                              : threat.severity === "high"
                                ? "bg-primary/20 text-primary"
                                : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {threat.category}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-card-foreground">{threat.threat}</p>
                          <p className="text-xs text-muted-foreground capitalize">{threat.severity} severity</p>
                        </div>
                      </div>
                      {threat.mitigated ? (
                        <CheckCircle2 className="h-5 w-5 text-accent" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Cryptographic Status */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Cryptographic Layer</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Certificate and signature verification
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-card-foreground">TLS Version</span>
                    <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                      TLS 1.3
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-card-foreground">OpenSSL Status</span>
                    <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-card-foreground">X.509 Certificates</span>
                    <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                      Valid
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-card-foreground">PKI Infrastructure</span>
                    <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                      Operational
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SBOM Compliance */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">SBOM Compliance</CardTitle>
                <CardDescription className="text-muted-foreground">Software Bill of Materials tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-card-foreground">Format</span>
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      CycloneDX
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-card-foreground">Total Components</span>
                    <span className="text-sm font-medium text-card-foreground">247</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-card-foreground">Vulnerabilities</span>
                    <span className="text-sm font-medium text-destructive">3 High</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-card-foreground">License Compliance</span>
                    <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                      100%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
