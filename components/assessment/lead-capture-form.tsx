"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import type { Lead } from "@/lib/assessment/types"

const leadSchema = z.object({
  name: z.string().trim().min(1, "Please tell us your name"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .pipe(z.email("Enter a valid email address")),
  phone: z.string().trim().min(1, "Phone number is required"),
  consent: z.literal(true, { error: "Please agree before we send your results" }),
})

type LeadFormValues = z.infer<typeof leadSchema>

export const LeadCaptureForm = ({ onSubmitted }: Props) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormValues>({ resolver: zodResolver(leadSchema) })

  const consent = watch("consent")

  return (
    <form
      noValidate
      onSubmit={handleSubmit((values) => onSubmitted(values as Lead))}
      className="flex flex-col gap-5"
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor="lead-name" className="text-sm font-semibold">
          Your name
        </label>
        <Input
          id="lead-name"
          autoComplete="name"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "lead-name-error" : undefined}
          {...register("name")}
        />
        {errors.name && (
          <p id="lead-name-error" role="alert" className="text-xs font-medium text-red-500">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="lead-email" className="text-sm font-semibold">
          Email
        </label>
        <Input
          id="lead-email"
          type="email"
          autoComplete="email"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "lead-email-error" : undefined}
          {...register("email")}
        />
        {errors.email && (
          <p id="lead-email-error" role="alert" className="text-xs font-medium text-red-500">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="lead-phone" className="text-sm font-semibold">
          Phone
        </label>
        <Input
          id="lead-phone"
          type="tel"
          autoComplete="tel"
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? "lead-phone-error" : undefined}
          {...register("phone")}
        />
        {errors.phone && (
          <p id="lead-phone-error" role="alert" className="text-xs font-medium text-red-500">
            {errors.phone.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="flex cursor-pointer items-start gap-3 text-xs text-muted-foreground">
          <Checkbox
            checked={consent === true}
            onCheckedChange={(checked) => setValue("consent", checked as true, { shouldValidate: true })}
            aria-invalid={!!errors.consent}
            aria-describedby={errors.consent ? "lead-consent-error" : undefined}
          />
          <span>
            I&apos;m happy for CoacheePro to email or call me about my results, and I agree
            to the{" "}
            <Link href="/privacy" className="underline underline-offset-2">
              Privacy Policy
            </Link>
            . If you&apos;re under 18, a parent or guardian may be contacted too.
          </span>
        </label>
        {errors.consent && (
          <p id="lead-consent-error" role="alert" className="text-xs font-medium text-red-500">
            {errors.consent.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-12 w-full rounded-xl bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-700"
      >
        {isSubmitting ? "Sending..." : "Send me my matches"}
      </Button>
    </form>
  )
}

type Props = {
  onSubmitted: (lead: Lead) => void
}
