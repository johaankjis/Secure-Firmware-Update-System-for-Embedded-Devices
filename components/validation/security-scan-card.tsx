"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Shield, CheckCircle2, AlertTriangle, XCircle } from "lucide-react"
import { toast } from "sonner"

export function SecurityScanCard() {
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  \
  const [scanResult, setS canResult] = useState<{
    status: "clean" | "vulnerabilities" | "critical"
    vulnerabilities: number
    details: string[]
  } | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [currentScanStep, setCurrentScanStep] = useState("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setScanResult(null)
    }
  }

  const handleScan = async () => {
    if (!selectedFile) return

    setIsScanning(true)
    setScanProgress(0)
    setScanResult(null)

    const steps = [
      "Analyzing binary structure...",
      "Scanning for known vulnerabilities...",
      "Checking for malicious patterns...",
      "Validating code signatures...",
      "Generating security report...",
    ]

    let stepIndex = 0

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        const newProgress = prev + 20

        if (newProgress <= 100) {
          setCurrentScanStep(steps[stepIndex])
          stepIndex++
        }

        if (newProgress >= 100) {
          clearInterval(interval)
          setIsScanning(false)
          setScanResult({
            status: "clean",
            vulnerabilities: 0,
            details: [
              "No security vulnerabilities detected",
              "All code signatures valid",
              "No malicious patterns found",
            ],
          })
          toast.success("Security scan complete", {
            description: "No vulnerabilities detected",
          })
          return 100
        }
        return newProgress
      })
    }, 600)
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-card-foreground">
          <Shield className="h-5 w-5 text-primary" />
          Security Vulnerability Scan
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Comprehensive security analysis and vulnerability detection
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="scan-firmware-file">Firmware Binary</Label>
          <Input id="scan-firmware-file" type="file" accept=".bin,.hex,.elf" onChange={handleFileChange} />
          {selectedFile && (
            <p className="text-sm text-muted-foreground">
              Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Scan Coverage</Label>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-muted">
              CVE Database
            </Badge>
            <Badge variant="outline" className="bg-muted">
              Malware Patterns
            </Badge>
            <Badge variant="outline" className="bg-muted">
              Code Analysis
            </Badge>
            <Badge variant="outline" className="bg-muted">
              SBOM Vulnerabilities
            </Badge>
          </div>
        </div>

        {isScanning && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{currentScanStep}</span>
              <span className="font-medium text-foreground">{scanProgress}%</span>
            </div>
            <Progress value={scanProgress} />
          </div>
        )}

        {scanResult && (
          <>
            <Alert
              className={
                scanResult.status === "clean"
                  ? "border-accent bg-accent/10"
                  : scanResult.status === "vulnerabilities"
                    ? "border-primary bg-primary/10"
                    : "border-destructive"
              }
            >
              {scanResult.status === "clean" ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                  <AlertTitle className="text-accent">Security Scan Passed</AlertTitle>
                  <AlertDescription>No security vulnerabilities or threats detected in the firmware.</AlertDescription>
                </>
              ) : scanResult.status === "vulnerabilities" ? (
                <>
                  <AlertTriangle className="h-4 w-4 text-primary" />
                  <AlertTitle className="text-primary">Vulnerabilities Detected</AlertTitle>
                  <AlertDescription>
                    {scanResult.vulnerabilities} security vulnerabilities found. Review required before deployment.
                  </AlertDescription>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-destructive" />
                  <AlertTitle className="text-destructive">Critical Security Issues</AlertTitle>
                  <AlertDescription>Critical vulnerabilities detected. Do not deploy this firmware.</AlertDescription>
                </>
              )}
            </Alert>

            <div className="rounded-lg border border-border bg-muted/50 p-4 space-y-2">
              <h4 className="text-sm font-medium text-foreground">Scan Results</h4>
              <div className="space-y-1">
                {scanResult.details.map((detail, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    <span className="text-muted-foreground">{detail}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <Button onClick={handleScan} disabled={!selectedFile || isScanning} className="w-full">
          {isScanning ? "Scanning..." : "Run Security Scan"}
        </Button>
      </CardContent>
    </Card>
  )
}
