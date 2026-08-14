import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, SmilePlus } from 'lucide-react'
import { AppHeader } from '@/components/layout/AppHeader'

export function SelfieCaptureScreen() {
  const navigate = useNavigate()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: 'user' } })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop())
          return
        }
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play().catch(() => {})
        }
        setReady(true)
      })
      .catch(() => {
        navigate('/permission-denied', { state: { returnTo: '/verify/selfie' } })
      })

    return () => {
      cancelled = true
      streamRef.current?.getTracks().forEach((t) => t.stop())
    }
  }, [navigate])

  const handleCapture = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    ctx?.drawImage(video, 0, 0, canvas.width, canvas.height)

    canvas.toBlob((blob) => {
      if (!blob) return
      const file = new File([blob], 'selfie.jpg', { type: 'image/jpeg' })
      navigate('/verify/selfie/preview', {
        state: { previewUrl: URL.createObjectURL(blob), file },
      })
    }, 'image/jpeg', 0.92)
  }

  return (
    <div className="app-shell justify-center pt-16">
      <div className="relative flex flex-1 flex-col bg-text-primary">
        <div className="relative flex-1 overflow-hidden">
          <video
            ref={videoRef}
            muted
            playsInline
            className="absolute inset-0 size-full object-cover [transform:scaleX(-1)]"
          />
          {!ready ? (
            <div className="absolute inset-0 flex items-center justify-center bg-navy text-sm text-white/70">
              Starting camera…
            </div>
          ) : null}
          <div className="pointer-events-none absolute inset-0 bg-navy/70 [mask-image:radial-gradient(ellipse_45%_38%_at_50%_42%,transparent_60%,black_61%)]" />
          <div className="pointer-events-none absolute left-[15%] right-[15%] top-[9%] aspect-[3/4] rounded-full border-4 border-dashed border-brand/80" />
          <div className="pointer-events-none absolute inset-x-0 top-[10%] flex justify-center px-4">
            <div className="flex flex-col items-center gap-1 rounded-xl border border-border-warm/30 bg-navy/90 px-6 py-4 text-center shadow-2xl backdrop-blur-md">
              <SmilePlus className="mb-1 size-5 text-white" />
              <h2 className="text-lg font-semibold text-white">Align your face</h2>
              <p className="max-w-[200px] text-sm text-border">
                Position your face entirely within the oval frame
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center rounded-t-3xl bg-app-bg px-4 pb-6 pt-4 shadow-[0_-8px_24px_rgba(15,23,42,0.1)]">
          <div className="flex flex-col items-center justify-center pb-6 pt-4">
            <div className="relative flex size-24 items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-brand/50" />
              <div className="absolute inset-2 rounded-full border-4 border-border" />
              <button
                type="button"
                onClick={handleCapture}
                disabled={!ready}
                aria-label="Take selfie"
                className="absolute inset-4 flex items-center justify-center rounded-full bg-brand shadow-lg disabled:opacity-50"
              >
                <span className="size-12 rounded-full border border-brand/20 bg-white shadow-inner" />
              </button>
            </div>
            <div className="flex items-center gap-2 pt-2 text-xs font-medium tracking-[0.24px] text-text-secondary">
              <ShieldCheck className="size-3" />
              Your photo will be securely encrypted.
            </div>
          </div>
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
      <AppHeader
        title="Verification"
        showBack
        backTo="/verify/checklist"
        showHelp
        className="absolute inset-x-0 top-0"
      />
    </div>
  )
}
