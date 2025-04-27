"use client"

import { useRef, useEffect, useState } from "react"
import SignaturePadCanvas from "react-signature-canvas"
import type { ReactNode } from "react"
import { Button } from "./button"
import { cn } from "@/lib/utils"
import "@/styles/signature-pad.css"

interface SignaturePadProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function SignaturePad({ value, onChange, className }: SignaturePadProps) {
  const signaturePadRef = useRef<SignaturePadCanvas>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Handle value restoration
  useEffect(() => {
    if (signaturePadRef.current && value) {
      const img = new Image()
      img.src = value
      img.onload = () => {
        const canvas = signaturePadRef.current?.getCanvas()
        if (canvas) {
          const ctx = canvas.getContext("2d")
          if (ctx) {
            ctx.drawImage(img, 0, 0)
          }
        }
      }
    }
  }, [value])

  // Handle canvas resizing
  useEffect(() => {
    const resizeCanvas = () => {
      if (signaturePadRef.current && containerRef.current) {
        const canvas = signaturePadRef.current
        const container = containerRef.current
        const ratio = Math.max(window.devicePixelRatio || 1, 1)

        canvas.clear()
        canvas.getCanvas().width = container.offsetWidth * ratio
        canvas.getCanvas().height = 200 * ratio
        canvas.getCanvas().getContext("2d")?.scale(ratio, ratio)
      }
    }

    window.addEventListener("resize", resizeCanvas)
    resizeCanvas()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  const handleClear = () => {
    signaturePadRef.current?.clear()
    onChange("")
  }

  const handleEnd = () => {
    const signaturePad = signaturePadRef.current
    if (signaturePad && !signaturePad.isEmpty()) {
      const dataUrl = signaturePad.toDataURL()
      onChange(dataUrl)
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div ref={containerRef} className="signature-pad-container">
        <SignaturePadCanvas
          ref={signaturePadRef}
          onEnd={handleEnd}
          canvasProps={{
            className: "signature-pad-canvas",
            style: {
              width: "100%",
              height: "200px"
            }
          }}
          dotSize={1}
          minWidth={1}
          maxWidth={2.5}
          throttle={16}
          velocityFilterWeight={0.5}
          penColor="black"
        />
      </div>
      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={handleClear}
        >
          Clear Signature
        </Button>
      </div>
    </div>
  )
}
