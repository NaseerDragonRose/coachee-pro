"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type { z } from "zod"

import { completeProfile } from "@/app/actions/profile"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { profileSchema } from "@/lib/assessment/schema"

type ProfileFormValues = z.infer<typeof profileSchema>

export const ProfileCompletion = ({ name, onDone }: Props) => {
  const [failed, setFailed] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name },
  })

  const consent = watch("consent")

  const onSubmit = async (values: ProfileFormValues) => {
    setFailed(false)
    const result = await completeProfile(values)

    if (result.ok) {
      onDone?.()
      router.refresh()
      return
    }

    if (result.reason === "invalid" && result.fieldErrors) {
      for (const [field, message] of Object.entries(result.fieldErrors)) {
        setError(field as keyof ProfileFormValues, { message })
      }
      return
    }

    setFailed(true)
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="profile-name" className="text-sm font-semibold">
            Your Name
          </label>
          <Input
            id="profile-name"
            autoComplete="name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "profile-name-error" : undefined}
            {...register("name")}
          />
          {errors.name && (
            <p id="profile-name-error" role="alert" className="text-xs font-medium text-red-500">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="profile-phone" className="text-sm font-semibold">
            Phone Number
          </label>
          <Input
            id="profile-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            spellCheck={false}
            placeholder="+91 98765 43210"
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "profile-phone-error" : undefined}
            {...register("phone")}
          />
          {errors.phone && (
            <p id="profile-phone-error" role="alert" className="text-xs font-medium text-red-500">
              {errors.phone.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="flex cursor-pointer items-start gap-3 text-xs text-muted-foreground">
            <Checkbox
              checked={consent === true}
              onCheckedChange={(checked) =>
                setValue("consent", checked as true, { shouldValidate: true })
              }
              aria-invalid={!!errors.consent}
              aria-describedby={errors.consent ? "profile-consent-error" : undefined}
            />
            <span>
              I&apos;m happy for CoacheePro to email or call me about my results, and I
              agree to the{" "}
              <Link href="/privacy" className="underline underline-offset-2">
                Privacy Policy
              </Link>
              . If you&apos;re under 18, a parent or guardian may be contacted too.
            </span>
          </label>
          {errors.consent && (
            <p id="profile-consent-error" role="alert" className="text-xs font-medium text-red-500">
              {errors.consent.message}
            </p>
          )}
        </div>

        {failed && (
          <p role="alert" className="text-xs font-medium text-red-500">
            We couldn&apos;t save that just then. Check your connection and try again.
          </p>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-12 w-full rounded-xl bg-indigo-600 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          {isSubmitting ? "Saving…" : "Save Details"}
        </Button>
      </form>
    </div>
  )
}

type Props = {
  name: string
  /** Lets the host close itself once the details are saved. */
  onDone?: () => void
}
