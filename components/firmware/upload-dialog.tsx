"use client"

import type React from "react"

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
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Upload, FileCheck, AlertTriangle, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

const formSchema = z.object({
  version: z
    .string()
    .min(1, "Version is required")
    .regex(/^v?\d+\.\d+\.\d+/, "Invalid version format (e.g., v2.4.1)"),
  file: z.any().refine((file) => file?.length > 0, "Firmware file is required"),
  releaseNotes: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

interface UploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UploadDialog({ open, onOpenChange }: UploadDialogProps) {
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadComplete, setUploadComplete] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      version: "",
      releaseNotes: "",
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      form.setValue("file", e.target.files)
    }
  }

  const onSubmit = async (data: FormData) => {
    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          setUploadComplete(true)
          toast.success("Firmware uploaded successfully", {
            description: `${data.version} is now being scanned for security vulnerabilities.`,
          })
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  const handleClose = () => {
    if (!isUploading) {
      form.reset()
      setUploadProgress(0)
      setUploadComplete(false)
      setSelectedFile(null)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            Upload New Firmware
          </DialogTitle>
          <DialogDescription>Upload a new firmware binary for security validation and deployment</DialogDescription>
        </DialogHeader>

        {!uploadComplete ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="version"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Version Number</FormLabel>
                    <FormControl>
                      <Input placeholder="v2.4.1" {...field} disabled={isUploading} />
                    </FormControl>
                    <FormDescription>Semantic version format (e.g., v2.4.1)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="file"
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormLabel>Firmware Binary</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <Input
                          type="file"
                          accept=".bin,.hex,.elf"
                          onChange={handleFileChange}
                          disabled={isUploading}
                          {...field}
                        />
                        {selectedFile && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <FileCheck className="h-4 w-4 text-accent" />
                            <span>
                              {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                            </span>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>Supported formats: .bin, .hex, .elf</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="releaseNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Release Notes (Optional)</FormLabel>
                    <FormControl>
                      <textarea
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Bug fixes, new features, security patches..."
                        disabled={isUploading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Uploading firmware...</span>
                    <span className="font-medium text-foreground">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} />
                </div>
              )}

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Security Validation</AlertTitle>
                <AlertDescription>
                  Uploaded firmware will be automatically scanned for vulnerabilities, signature verification, and SBOM
                  analysis before deployment.
                </AlertDescription>
              </Alert>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleClose} disabled={isUploading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isUploading}>
                  {isUploading ? "Uploading..." : "Upload Firmware"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <div className="space-y-4">
            <Alert className="border-accent bg-accent/10">
              <CheckCircle2 className="h-4 w-4 text-accent" />
              <AlertTitle className="text-accent">Upload Successful</AlertTitle>
              <AlertDescription>
                Firmware {form.getValues("version")} has been uploaded and is now being scanned for security
                vulnerabilities. You'll be notified when the scan is complete.
              </AlertDescription>
            </Alert>

            <div className="space-y-2 rounded-lg border border-border bg-muted/50 p-4">
              <h4 className="text-sm font-medium text-foreground">Next Steps:</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Security vulnerability scan (2-5 minutes)
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Cryptographic signature verification
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  SBOM generation and analysis
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Ready for deployment
                </li>
              </ul>
            </div>

            <DialogFooter>
              <Button onClick={handleClose}>Done</Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
