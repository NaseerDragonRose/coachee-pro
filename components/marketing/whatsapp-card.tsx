import { MessageCircle, ArrowUpRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

const WHATSAPP_NUMBER_PLACEHOLDER = "91XXXXXXXXXX"

export const WhatsappCard = () => {
  return (
    <div className="group relative flex flex-col items-start justify-between gap-5 rounded-2xl border-2 border-black bg-emerald-300 p-6 text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all sm:flex-row sm:items-center">
      
      <div className="flex items-start gap-4">
        {/* WhatsApp Icon Box */}
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-black bg-white text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <MessageCircle className="h-6 w-6 stroke-[2.5] fill-emerald-400" />
        </div>

        {/* Text Area */}
        <div>
          <div className="flex items-center gap-2">
            <p className="text-base font-black text-black">
              Prefer WhatsApp Guidance?
            </p>
            <span className="inline-flex items-center gap-1 rounded-full border-2 border-black bg-white px-2.5 py-0.5 text-[10px] font-black text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
              <Sparkles className="h-3 w-3 text-[#FF5500]" />
              Quick Support
            </span>
          </div>
          <p className="mt-1 text-xs font-bold leading-relaxed text-black/90">
            Students and parents can text our team directly to clear doubts about degree selection, assessment results, or career paths.
          </p>
        </div>
      </div>

      {/* Direct Chat CTA */}
      <Button
        size="lg"
        className="w-full shrink-0 h-11 px-6 rounded-full border-2 border-black bg-black hover:bg-slate-900 text-white text-xs font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:w-auto"
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
        <ArrowUpRight className="ml-1.5 h-4 w-4 stroke-[3]" />
      </Button>

    </div>
  )
}

export default WhatsappCard