import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center font-black whitespace-nowrap transition-all outline-none select-none border-2 border-black rounded-full shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-[#FF5500] hover:bg-[#E64D00] text-white",
        outline: "bg-white hover:bg-slate-100 text-black",
        secondary: "bg-black hover:bg-slate-900 text-white",
        ghost: "border-transparent bg-transparent shadow-none hover:bg-slate-200/70 hover:shadow-none hover:translate-y-0 active:translate-x-0 active:translate-y-0",
        destructive: "bg-red-500 hover:bg-red-600 text-white",
        link: "border-transparent bg-transparent shadow-none text-black underline underline-offset-4 hover:text-[#FF5500] hover:shadow-none hover:translate-y-0 active:translate-x-0 active:translate-y-0",
      },
      size: {
        default: "h-11 px-6 text-sm gap-2",
        xs: "h-8 px-3 text-xs gap-1",
        sm: "h-9 px-4 text-xs gap-1.5",
        lg: "h-13 px-8 text-base gap-2",
        icon: "size-10",
        "icon-xs": "size-8",
        "icon-sm": "size-9",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }