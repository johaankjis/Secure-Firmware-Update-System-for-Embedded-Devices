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
import { Key, CheckCircle2, XCircle } from "lucide-react"
import { toast } from "sonner"

export function SignatureVerificationCard() {
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationProgress, setVerificationProgress] = useState(0)
  const [verificationResult, setVerificationResult] = useState<"passed" | "failed" | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setVerificationResult(null)
    }
  }

  const handleVerify = async () => {
    if (!selectedFile) return

    setIsVerifying(true)
    setVerificationProgress(0)
    setVerificationResult(null)

    // Simulate verification process
    const interval = setInterval(() => {
      setVerificationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsVerifying(false)
          setVerificationResult("passed")
          toast.success("Signature verification passed", {
            description: "RSA-4096 signature is valid and trusted",
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
          <Key className="h-5 w-5 text-primary" />
          Cryptographic Signature Verification
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Verify firmware binary signatures using RSA-4096 public key cryptography
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="firmware-file">Firmware Binary</Label>
          <Input id="firmware-file" type="file" accept=".bin,.hex,.elf" onChange={handleFileChange} />
          {selectedFile && (
            <p className="text-sm text-muted-foreground">
              Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Signature Algorithm</Label>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            RSA-4096 with SHA-256
          </Badge>
        </div>

        {isVerifying && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Verifying signature...</span>
              <span className="font-medium text-foreground">{verificationProgress}%</span>
            </div>
            <Progress value={verificationProgress} />
          </div>
        )}

        {verificationResult && (
          <Alert className={verificationResult === "passed" ? "border-accent bg-accent/10" : "border-destructive"}>
            {verificationResult === "passed" ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-accent" />
                <AlertTitle className="text-accent">Signature Verified</AlertTitle>
                <AlertDescription>
                  The firmware binary signature is valid and matches the trusted public key. The firmware has not been
                  tampered with.
                </AlertDescription>
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 text-destructive" />
                <AlertTitle className="text-destructive">Signature Verification Failed</AlertTitle>
                <AlertDescription>
                  The signature could not be verified. The firmware may have been modified or corrupted.
                </AlertDescription>
              </>
            )}
          </Alert>
        )}

        {verificationResult === "passed" && (
          <div className="rounded-lg border border-border bg-muted/50 p-4 space-y-2">
            <h4 className="text-sm font-medium text-foreground">Verification Details</h4>
            <div className="space-y-1 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Algorithm</span>
                <span className="font-mono text-foreground">RSA-4096</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Hash Function</span>
                <span className="font-mono text-foreground">SHA-256</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Key ID</span>
                <span className="font-mono text-foreground">0x1A2B3C4D</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Signer</span>
                <span className="text-foreground">SecureFirmware CA</span>
              </div>
            </div>
          </div>
        )}

        <Button onClick={handleVerify} disabled={!selectedFile || isVerifying} className="w-full">
          {isVerifying ? "Verifying..." : "Verify Signature"}
        </Button>
      </CardContent>
    </Card>
  )
}
