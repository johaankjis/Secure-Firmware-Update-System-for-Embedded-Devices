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
import { FileCheck, CheckCircle2, XCircle, AlertTriangle } from "lucide-react"
import { toast } from "sonner"

export function CertificateCheckCard() {
  const [isChecking, setIsChecking] = useState(false)
  const [checkProgress, setCheckProgress] = useState(0)
  const [checkResult, setCheckResult] = useState<"valid" | "expired" | "invalid" | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setCheckResult(null)
    }
  }

  const handleCheck = async () => {
    if (!selectedFile) return

    setIsChecking(true)
    setCheckProgress(0)
    setCheckResult(null)

    // Simulate certificate check
    const interval = setInterval(() => {
      setCheckProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsChecking(false)
          setCheckResult("valid")
          toast.success("Certificate validated", {
            description: "X.509 certificate is valid and trusted",
          })
          return 100
        }
        return prev + 20
      })
    }, 300)
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-card-foreground">
          <FileCheck className="h-5 w-5 text-primary" />
          X.509 Certificate Validation
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Verify digital certificates and certificate chains
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="cert-file">Certificate File</Label>
          <Input id="cert-file" type="file" accept=".pem,.crt,.cer" onChange={handleFileChange} />
          {selectedFile && (
            <p className="text-sm text-muted-foreground">
              Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Certificate Type</Label>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            X.509 v3
          </Badge>
        </div>

        {isChecking && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Validating certificate...</span>
              <span className="font-medium text-foreground">{checkProgress}%</span>
            </div>
            <Progress value={checkProgress} />
          </div>
        )}

        {checkResult && (
          <>
            <Alert
              className={
                checkResult === "valid"
                  ? "border-accent bg-accent/10"
                  : checkResult === "expired"
                    ? "border-primary bg-primary/10"
                    : "border-destructive"
              }
            >
              {checkResult === "valid" ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                  <AlertTitle className="text-accent">Certificate Valid</AlertTitle>
                  <AlertDescription>
                    The certificate is valid, trusted, and within its validity period.
                  </AlertDescription>
                </>
              ) : checkResult === "expired" ? (
                <>
                  <AlertTriangle className="h-4 w-4 text-primary" />
                  <AlertTitle className="text-primary">Certificate Expired</AlertTitle>
                  <AlertDescription>The certificate has expired and should be renewed.</AlertDescription>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-destructive" />
                  <AlertTitle className="text-destructive">Certificate Invalid</AlertTitle>
                  <AlertDescription>The certificate is not trusted or has been revoked.</AlertDescription>
                </>
              )}
            </Alert>

            {checkResult === "valid" && (
              <div className="rounded-lg border border-border bg-muted/50 p-4 space-y-2">
                <h4 className="text-sm font-medium text-foreground">Certificate Details</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Subject</span>
                    <span className="text-foreground">CN=SecureFirmware CA</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Issuer</span>
                    <span className="text-foreground">CN=Root CA</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Valid From</span>
                    <span className="text-foreground">2024-01-01</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Valid Until</span>
                    <span className="text-foreground">2026-12-31</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Serial Number</span>
                    <span className="font-mono text-foreground">0x1A2B3C4D5E6F</span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        <Button onClick={handleCheck} disabled={!selectedFile || isChecking} className="w-full">
          {isChecking ? "Checking..." : "Validate Certificate"}
        </Button>
      </CardContent>
    </Card>
  )
}
