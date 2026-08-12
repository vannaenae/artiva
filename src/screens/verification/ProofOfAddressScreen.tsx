import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, FileText, Home, Landmark } from 'lucide-react'
import { AppHeader } from '@/components/layout/AppHeader'
import { Button } from '@/components/ui/Button'
import { UploadBox } from '@/components/verification/UploadBox'
import { cn } from '@/lib/utils'
import { useApp } from '@/context/AppContext'
import type { UserProfile } from '@/types'

const DOCUMENT_TYPES: {
  type: NonNullable<UserProfile['proofOfAddressType']>
  icon: React.ReactNode
  title: string
  description: string
}[] = [
  {
    type: 'bank_statement',
    icon: <Landmark className="size-5 text-text-primary" />,
    title: 'Bank Statement',
    description: 'Issued within last 3 months',
  },
  {
    type: 'utility_bill',
    icon: <FileText className="size-[18px] text-text-primary" />,
    title: 'Utility Bill',
    description: 'Water, electricity, or gas',
  },
  {
    type: 'rental_agreement',
    icon: <Home className="size-[18px] text-text-primary" />,
    title: 'Rental Agreement',
    description: 'Current and signed',
  },
]

export function ProofOfAddressScreen() {
  const navigate = useNavigate()
  const { updateProfile, uploadFile, profile } = useApp()
  const [docType, setDocType] = useState<UserProfile['proofOfAddressType']>('bank_statement')
  const [selection, setSelection] = useState<{ preview: string; file: File } | null>(null)
  const [uploading, setUploading] = useState(false)

  const handleSelect = (file: File) => {
    setSelection({ file, preview: URL.createObjectURL(file) })
  }

  const handleNext = async () => {
    if (!selection || uploading) return
    setUploading(true)
    try {
      const url = await uploadFile('proof-of-address', selection.file)
      await updateProfile({
        proofOfAddressUrl: url,
        proofOfAddressType: docType,
        steps: { ...profile!.steps, proofOfAddress: 'complete' },
      })
      navigate('/verify/background-check')
    } catch {
      navigate('/upload-failed', { state: { returnTo: '/verify/address' } })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="app-shell">
      <AppHeader title="Artiva" showBack backTo="/verify/checklist" showHelp />
      <div className="flex flex-1 flex-col gap-6 px-4 pb-8 pt-6">
        <div>
          <h1 className="text-[32px] font-bold leading-10 tracking-[-0.64px] text-text-primary">
            Proof of Address
          </h1>
          <p className="pt-2 text-base text-text-muted">
            To verify your account, please upload a recent document showing your full name and current
            address.
          </p>
        </div>

        <div>
          <h3 className="pb-2 text-sm font-semibold tracking-[0.14px] text-text-primary">
            Accepted Documents
          </h3>
          <div className="flex flex-col gap-2">
            {DOCUMENT_TYPES.map((doc) => {
              const isSelected = docType === doc.type
              return (
                <button
                  key={doc.type}
                  type="button"
                  onClick={() => setDocType(doc.type)}
                  className={cn(
                    'relative flex w-full items-center gap-4 rounded-xl border bg-white p-[17px] text-left shadow-[0_1px_1px_rgba(0,0,0,0.05)]',
                    isSelected ? 'border-brand' : 'border-border-warm',
                  )}
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-chip-blue">
                    {doc.icon}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold tracking-[0.14px] text-text-primary">
                      {doc.title}
                    </span>
                    <span className="block text-xs font-medium tracking-[0.24px] text-text-muted">
                      {doc.description}
                    </span>
                  </span>
                  <span
                    className={cn(
                      'absolute right-4 top-4 flex size-5 items-center justify-center rounded-full border-2',
                      isSelected ? 'border-brand bg-brand' : 'border-border-warm',
                    )}
                  >
                    {isSelected ? <span className="size-1.5 rounded-full bg-white" /> : null}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <h3 className="pb-2 text-sm font-semibold tracking-[0.14px] text-text-primary">
            Upload Document
          </h3>
          <UploadBox
            variant="dashed"
            title="Tap to upload or drag & drop"
            subtitle="PDF, PNG, or JPG up to 10MB."
            hint="Ensure all edges are visible and text is clear."
            previewUrl={selection?.preview}
            status={uploading ? 'uploading' : 'idle'}
            accept="image/*,.pdf"
            onSelect={handleSelect}
          />
        </div>

        <div className="mt-auto pt-2">
          <Button onClick={handleNext} disabled={!selection} loading={uploading} icon={<ArrowRight className="size-4" />}>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
