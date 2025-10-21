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
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Play, CheckCircle2, Zap } from "lucide-react"
import { toast } from "sonner"

const formSchema = z.object({
  deploymentType: z.enum(["immediate", "staged", "scheduled"]),
  targetDevices: z.string().min(1, "Target devices is required"),
  rollbackEnabled: z.boolean().default(true),
})

type FormData = z.infer<typeof formSchema>

interface DeploymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  firmwareId: string | null
}

export function DeploymentDialog({ open, onOpenChange, firmwareId }: DeploymentDialogProps) {
  const [isDeploying, setIsDeploying] = useState(false)
  const [deploymentProgress, setDeploymentProgress] = useState(0)
  const [deploymentComplete, setDeploymentComplete] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      deploymentType: "staged",
      targetDevices: "all",
      rollbackEnabled: true,
    },
  })

  const onSubmit = async (data: FormData) => {
    setIsDeploying(true)
    setDeploymentProgress(0)

    // Simulate deployment progress
    const interval = setInterval(() => {
      setDeploymentProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsDeploying(false)
          setDeploymentComplete(true)
          toast.success("Deployment initiated successfully", {
            description: "Firmware is being rolled out to target devices.",
          })
          return 100
        }
        return prev + 5
      })
    }, 400)
  }

  const handleClose = () => {
    if (!isDeploying) {
      form.reset()
      setDeploymentProgress(0)
      setDeploymentComplete(false)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Play className="h-5 w-5 text-primary" />
            Deploy Firmware Update
          </DialogTitle>
          <DialogDescription>Configure deployment settings for firmware v2.4.2</DialogDescription>
        </DialogHeader>

        {!deploymentComplete ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="deploymentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deployment Strategy</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="space-y-3"
                        disabled={isDeploying}
                      >
                        <div className="flex items-start space-x-3 rounded-lg border border-border p-3 hover:bg-accent/50 transition-colors">
                          <RadioGroupItem value="immediate" id="immediate" className="mt-0.5" />
                          <div className="flex-1">
                            <Label htmlFor="immediate" className="font-medium cursor-pointer">
                              Immediate Deployment
                            </Label>
                            <p className="text-xs text-muted-foreground mt-1">
                              Deploy to all devices immediately (higher risk)
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3 rounded-lg border border-border p-3 hover:bg-accent/50 transition-colors">
                          <RadioGroupItem value="staged" id="staged" className="mt-0.5" />
                          <div className="flex-1">
                            <Label htmlFor="staged" className="font-medium cursor-pointer">
                              Staged Rollout (Recommended)
                            </Label>
                            <p className="text-xs text-muted-foreground mt-1">
                              Gradual deployment: 10% → 25% → 50% → 100%
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3 rounded-lg border border-border p-3 hover:bg-accent/50 transition-colors">
                          <RadioGroupItem value="scheduled" id="scheduled" className="mt-0.5" />
                          <div className="flex-1">
                            <Label htmlFor="scheduled" className="font-medium cursor-pointer">
                              Scheduled Deployment
                            </Label>
                            <p className="text-xs text-muted-foreground mt-1">Deploy at a specific date and time</p>
                          </div>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="targetDevices"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Devices</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="all, device-group-1, or specific device IDs"
                        {...field}
                        disabled={isDeploying}
                      />
                    </FormControl>
                    <FormDescription>Specify device groups or IDs (comma-separated)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isDeploying && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Initiating deployment...</span>
                    <span className="font-medium text-foreground">{deploymentProgress}%</span>
                  </div>
                  <Progress value={deploymentProgress} />
                </div>
              )}

              <Alert>
                <Zap className="h-4 w-4" />
                <AlertTitle>Automatic Rollback</AlertTitle>
                <AlertDescription>
                  If more than 5% of devices report failures, the deployment will automatically rollback to the previous
                  version.
                </AlertDescription>
              </Alert>

              <div className="rounded-lg border border-border bg-muted/50 p-4 space-y-2">
                <h4 className="text-sm font-medium text-foreground">Pre-Deployment Checklist</h4>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    <span className="text-muted-foreground">Security scan passed (0 vulnerabilities)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    <span className="text-muted-foreground">Cryptographic signature verified</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    <span className="text-muted-foreground">SBOM generated and validated</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    <span className="text-muted-foreground">Rollback mechanism enabled</span>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleClose} disabled={isDeploying}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isDeploying}>
                  {isDeploying ? "Deploying..." : "Start Deployment"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <div className="space-y-4">
            <Alert className="border-accent bg-accent/10">
              <CheckCircle2 className="h-4 w-4 text-accent" />
              <AlertTitle className="text-accent">Deployment Initiated</AlertTitle>
              <AlertDescription>
                Firmware deployment has started. You can monitor progress in real-time from the deployment dashboard.
              </AlertDescription>
            </Alert>

            <div className="space-y-2 rounded-lg border border-border bg-muted/50 p-4">
              <h4 className="text-sm font-medium text-foreground">Deployment Status:</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                  Stage 1: Deploying to 10% of devices (estimated 5 minutes)
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                  Stage 2: Deploying to 25% of devices
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                  Stage 3: Deploying to 50% of devices
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                  Stage 4: Deploying to 100% of devices
                </li>
              </ul>
            </div>

            <DialogFooter>
              <Button onClick={handleClose}>Close</Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
