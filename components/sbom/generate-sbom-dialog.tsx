"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { RefreshCw, CheckCircle2, Package, Shield, FileText } from "lucide-react"
import { toast } from "sonner"

const formSchema = z.object({
  format: z.enum(["cyclonedx", "spdx"]),
  includeVulnerabilities: z.boolean().default(true),
  includeLicenses: z.boolean().default(true),
})

type FormData = z.infer<typeof formSchema>

interface GenerateSbomDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function GenerateSbomDialog({ open, onOpenChange }: GenerateSbomDialogProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [generationComplete, setGenerationComplete] = useState(false)
  const [currentStep, setCurrentStep] = useState("")

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      format: "cyclonedx",
      includeVulnerabilities: true,
      includeLicenses: true,
    },
  })

  const onSubmit = async (data: FormData) => {
    setIsGenerating(true)
    setGenerationProgress(0)

    const steps = [
      "Analyzing firmware binary...",
      "Extracting components...",
      "Scanning for vulnerabilities...",
      "Validating licenses...",
      "Generating SBOM document...",
    ]

    let stepIndex = 0

    const interval = setInterval(() => {
      setGenerationProgress((prev) => {
        const newProgress = prev + 20

        if (newProgress <= 100) {
          setCurrentStep(steps[stepIndex])
          stepIndex++
        }

        if (newProgress >= 100) {
          clearInterval(interval)
          setIsGenerating(false)
          setGenerationComplete(true)
          toast.success("SBOM generated successfully", {
            description: `${data.format.toUpperCase()} format with ${data.includeVulnerabilities ? "vulnerability scanning" : "no vulnerability data"}.`,
          })
          return 100
        }
        return newProgress
      })
    }, 800)
  }

  const handleClose = () => {
    if (!isGenerating) {
      form.reset()
      setGenerationProgress(0)
      setGenerationComplete(false)
      setCurrentStep("")
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-primary" />
            Generate SBOM
          </DialogTitle>
          <DialogDescription>Create a Software Bill of Materials for the current firmware</DialogDescription>
        </DialogHeader>

        {!generationComplete ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="format"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SBOM Format</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="space-y-3"
                        disabled={isGenerating}
                      >
                        <div className="flex items-start space-x-3 rounded-lg border border-border p-3 hover:bg-accent/50 transition-colors">
                          <RadioGroupItem value="cyclonedx" id="cyclonedx" className="mt-0.5" />
                          <div className="flex-1">
                            <Label htmlFor="cyclonedx" className="font-medium cursor-pointer">
                              CycloneDX (Recommended)
                            </Label>
                            <p className="text-xs text-muted-foreground mt-1">
                              Industry standard for security-focused SBOM with vulnerability tracking
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3 rounded-lg border border-border p-3 hover:bg-accent/50 transition-colors">
                          <RadioGroupItem value="spdx" id="spdx" className="mt-0.5" />
                          <div className="flex-1">
                            <Label htmlFor="spdx" className="font-medium cursor-pointer">
                              SPDX
                            </Label>
                            <p className="text-xs text-muted-foreground mt-1">
                              Linux Foundation standard for license compliance
                            </p>
                          </div>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-3">
                <Label>Additional Options</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="vulnerabilities"
                      className="h-4 w-4 rounded border-input"
                      checked={form.watch("includeVulnerabilities")}
                      onChange={(e) => form.setValue("includeVulnerabilities", e.target.checked)}
                      disabled={isGenerating}
                    />
                    <Label htmlFor="vulnerabilities" className="text-sm font-normal cursor-pointer">
                      Include vulnerability scanning
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="licenses"
                      className="h-4 w-4 rounded border-input"
                      checked={form.watch("includeLicenses")}
                      onChange={(e) => form.setValue("includeLicenses", e.target.checked)}
                      disabled={isGenerating}
                    />
                    <Label htmlFor="licenses" className="text-sm font-normal cursor-pointer">
                      Include license information
                    </Label>
                  </div>
                </div>
              </div>

              {isGenerating && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{currentStep}</span>
                    <span className="font-medium text-foreground">{generationProgress}%</span>
                  </div>
                  <Progress value={generationProgress} />
                </div>
              )}

              <Alert>
                <Package className="h-4 w-4" />
                <AlertTitle>SBOM Generation</AlertTitle>
                <AlertDescription>
                  This process will analyze the firmware binary, extract all components, and generate a comprehensive
                  SBOM document. Estimated time: 2-3 minutes.
                </AlertDescription>
              </Alert>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleClose} disabled={isGenerating}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isGenerating}>
                  {isGenerating ? "Generating..." : "Generate SBOM"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <div className="space-y-4">
            <Alert className="border-accent bg-accent/10">
              <CheckCircle2 className="h-4 w-4 text-accent" />
              <AlertTitle className="text-accent">SBOM Generated Successfully</AlertTitle>
              <AlertDescription>
                Your Software Bill of Materials has been generated and is ready for review and export.
              </AlertDescription>
            </Alert>

            <div className="space-y-2 rounded-lg border border-border bg-muted/50 p-4">
              <h4 className="text-sm font-medium text-foreground">SBOM Summary:</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Package className="h-4 w-4" />
                    <span>Total Components</span>
                  </div>
                  <span className="font-medium text-foreground">247</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    <span>Vulnerabilities Found</span>
                  </div>
                  <span className="font-medium text-destructive">3</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    <span>License Types</span>
                  </div>
                  <span className="font-medium text-foreground">18</span>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
              <Button>Download SBOM</Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
