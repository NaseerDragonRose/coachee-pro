import { Button } from "@/components/ui/button"

// TODO: replace with the real CoacheePro WhatsApp number before this page goes live.
const WHATSAPP_NUMBER_PLACEHOLDER = "91XXXXXXXXXX"

export const WhatsappCard = () => {
  return (
    <div className="flex flex-col items-start gap-4 rounded-xl border border-border bg-muted/40 p-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-semibold">Prefer WhatsApp?</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Message us directly and we&apos;ll get back to you.
        </p>
      </div>
      <Button
        variant="outline"
        nativeButton={false}
        className="shrink-0"
        render={
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER_PLACEHOLDER}`}
            target="_blank"
            rel="noopener noreferrer"
          />
        }
      >
        Chat on WhatsApp
      </Button>
    </div>
  )
}
