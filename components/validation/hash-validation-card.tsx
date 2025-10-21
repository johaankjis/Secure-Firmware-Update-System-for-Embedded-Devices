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
import { Hash, CheckCircle2, XCircle } from "lucide-react"
import { toast } from "sonner"

export function HashValidationCard() {
  const [isValidating, setIsValidating] = useState(false)
  const [validationProgress, setValidationProgress] = useState(0)
  const [validationResult, setValidationResult] = useState<"passed" | "failed" | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [expectedHash, setExpectedHash] = useState("")
  const [calculatedHash, setCalculatedHash] = useState("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setValidationResult(null)
      setCalculatedHash("")
    }
  }

  const handleValidate = async () => {
    if (!selectedFile || !expectedHash) return

    setIsValidating(true)
    setValidationProgress(0)
    setValidationResult(null)

    // Simulate hash calculation
    const mockHash = "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2"

    const interval = setInterval(() => {
      setValidationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsValidating(false)
          setCalculatedHash(mockHash)
          const matches = mockHash === expectedHash
          setValidationResult(matches ? "passed" : "failed")
          if (matches) {
            toast.success("Hash validation passed", {
              description: "SHA-256 hash matches expected value",
            })
          } else {
            toast.error("Hash validation failed", {
              description: "Hash mismatch detected",
            })
          }
          return 100
        }
        return prev + 25
      })
    }, 300)
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-card-foreground">
          <Hash className="h-5 w-5 text-primary" />
          Cryptographic Hash Validation
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Calculate and verify SHA-256 hash of firmware binaries
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="hash-firmware-file">Firmware Binary</Label>
          <Input id="hash-firmware-file" type="file" accept=".bin,.hex,.elf" onChange={handleFileChange} />
          {selectedFile && (
            <p className="text-sm text-muted-foreground">
              Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="expected-hash">Expected SHA-256 Hash</Label>
          <Input
            id="expected-hash"
            placeholder="Enter expected hash value..."
            value={expectedHash}
            onChange={(e) => setExpectedHash(e.target.value)}
            className="font-mono text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label>Hash Algorithm</Label>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            SHA-256
          </Badge>
        </div>

        {isValidating && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Calculating hash...</span>
              <span className="font-medium text-foreground">{validationProgress}%</span>
            </div>
            <Progress value={validationProgress} />
          </div>
        )}

        {calculatedHash && (
          <div className="space-y-2">
            <Label>Calculated Hash</Label>
            <code className="block text-xs bg-muted p-3 rounded border border-border font-mono text-muted-foreground break-all">
              {calculatedHash}
            </code>
          </div>
        )}

        {validationResult && (
          <Alert className={validationResult === "passed" ? "border-accent bg-accent/10" : "border-destructive"}>
            {validationResult === "passed" ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-accent" />
                <AlertTitle className="text-accent">Hash Validated</AlertTitle>
                <AlertDescription>
                  The calculated hash matches the expected value. The firmware integrity is confirmed.
                </AlertDescription>
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 text-destructive" />
                <AlertTitle className="text-destructive">Hash Mismatch</AlertTitle>
                <AlertDescription>
                  The calculated hash does not match the expected value. The firmware may have been modified.
                </AlertDescription>
              </>
            )}
          </Alert>
        )}

        <Button onClick={handleValidate} disabled={!selectedFile || !expectedHash || isValidating} className="w-full">
          {isValidating ? "Validating..." : "Validate Hash"}
        </Button>
      </CardContent>
    </Card>
  )
}
