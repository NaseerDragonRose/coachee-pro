import { MessageCircle, ArrowUpRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

// TODO: replace with the real CoacheePro WhatsApp number before going live.
const WHATSAPP_NUMBER_PLACEHOLDER = "91XXXXXXXXXX"

export const WhatsappCard = () => {
  return (
    <div className="group relative flex flex-col items-start justify-between gap-5 rounded-2xl border border-emerald-200/80 bg-emerald-50/40 p-6 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/5 sm:flex-row sm:items-center dark:border-emerald-900/40 dark:bg-emerald-950/20">
      
      <div className="flex items-start gap-4">
        {/* WhatsApp Icon Box */}
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-500/20 transition-transform group-hover:scale-105">
          <MessageCircle className="h-5 w-5 fill-current" />
        </div>

        {/* Text Area */}
        <div>
          <div className="flex items-center gap-2">
            <p className="text-base font-bold text-slate-900 dark:text-slate-100">
              Prefer WhatsApp Guidance?
            </p>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 dark:bg-emerald-900/80 dark:text-emerald-300">
              <Sparkles className="h-3 w-3" />
              Quick Support
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
            Students and parents can text our team directly to clear doubts about degree selection, assessment results, or career paths.
          </p>
        </div>
      </div>

      {/* Direct Chat CTA */}
      <Button
        size="lg"
        className="w-full shrink-0 border-emerald-300 bg-emerald-600 text-white shadow-md transition-all hover:bg-emerald-700 hover:scale-[1.01] sm:w-auto h-11 px-6 text-xs font-semibold"
        nativeButton={false}
        render={
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER_PLACEHOLDER}`}
            target="_blank"
            rel="noopener noreferrer"
          />
        }
      >
        <span>Chat on WhatsApp</span>
        <ArrowUpRight className="ml-1.5 h-4 w-4" />
      </Button>

    </div>
  )
}

// Added dual default export so both `import { WhatsappCard }` and `import WhatsappCard` work
export default WhatsappCard