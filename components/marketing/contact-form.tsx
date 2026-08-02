"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CheckCircle2, Send, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"

const contactFormSchema = z.object({
  role: z.enum(["student", "parent", "counselor", "other"], {
    error: "Please select who you are",
  }),
  name: z.string().trim().min(1, "Name is required"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .pipe(z.email("Enter a valid email address")),
  phone: z.string().trim().min(1, "Phone number is required"),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters"),
})

type ContactFormValues = z.infer<typeof contactFormSchema>

const inputClassName =
  "w-full rounded-xl border border-slate-200/80 bg-white/80 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 aria-invalid:border-red-500 aria-invalid:ring-red-500/10 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-100 dark:focus:border-indigo-400"

export const ContactForm = () => {
  const [submitted, setSubmitted] = useState(false)
  const confirmationRef = useRef<HTMLDivElement>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      role: "student",
    },
  })

  const selectedRole = watch("role")

  const onSubmit = async (values: ContactFormValues) => {
    // TODO(ADR-003): replace with a real SES or API endpoint send once configured.
    console.log("Contact Form Submission:", values)
    setSubmitted(true)
  }

  useEffect(() => {
    if (submitted) {
      confirmationRef.current?.focus()
    }
  }, [submitted])

  if (submitted) {
    return (
      <div
        ref={confirmationRef}
        tabIndex={-1}
        role="status"
        className="rounded-2xl border border-emerald-200/80 bg-emerald-50/50 p-8 text-center backdrop-blur-md dark:border-emerald-900/40 dark:bg-emerald-950/20"
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-300">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-slate-100">
          Message Sent Successfully
        </h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
          Thanks for reaching out! A career advisor will review your query and respond via email or phone within 24 hours.
        </p>
        <Button
          variant="outline"
          className="mt-6 border-emerald-200 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-800 dark:text-emerald-300 dark:hover:bg-emerald-900/50"
          onClick={() => setSubmitted(false)}
        >
          Send Another Message
        </Button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-2xl border border-slate-200/80 bg-white/70 p-6 shadow-xl shadow-indigo-500/5 backdrop-blur-md space-y-6 sm:p-8 dark:border-slate-800 dark:bg-slate-950/60"
      noValidate
    >
      {/* Role Selection Tabs */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          I am a:
        </label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            { id: "student", label: "Student (11/12)" },
            { id: "parent", label: "Parent" },
            { id: "counselor", label: "School Counselor" },
            { id: "other", label: "Other" },
          ].map((role) => (
            <button
              key={role.id}
              type="button"
              onClick={() => setValue("role", role.id as ContactFormValues["role"])}
              className={`rounded-xl border py-2 px-3 text-xs font-medium transition-all text-center ${
                selectedRole === role.id
                  ? "border-indigo-600 bg-indigo-50 text-indigo-700 font-bold dark:border-indigo-500 dark:bg-indigo-950/80 dark:text-indigo-300"
                  : "border-slate-200/80 bg-slate-50/50 text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400"
              }`}
            >
              {role.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Name */}
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="e.g. Rahul Sharma"
            autoComplete="name"
            className={inputClassName}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            {...register("name")}
          />
          {errors.name && (
            <p id="name-error" role="alert" className="text-xs text-red-500 font-medium">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <label htmlFor="phone" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            placeholder="+91 98765 43210"
            autoComplete="tel"
            className={inputClassName}
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            {...register("phone")}
          />
          {errors.phone && (
            <p id="phone-error" role="alert" className="text-xs text-red-500 font-medium">
              {errors.phone.message}
            </p>
          )}
        </div>
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <label htmlFor="email" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          placeholder="rahul@example.com"
          autoComplete="email"
          className={inputClassName}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          {...register("email")}
        />
        {errors.email && (
          <p id="email-error" role="alert" className="text-xs text-red-500 font-medium">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Message */}
      <div className="space-y-1.5">
        <label htmlFor="message" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          How can we help you?
        </label>
        <textarea
          id="message"
          rows={4}
          placeholder="Ask us anything about career guidance, degree selection, or assessment results..."
          className={inputClassName}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          {...register("message")}
        />
        {errors.message && (
          <p id="message-error" role="alert" className="text-xs text-red-500 font-medium">
            {errors.message.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <div className="flex flex-col items-center justify-between gap-4 pt-2 sm:flex-row">
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
          Quick response within 24 hours
        </span>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto h-11 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-md transition-all hover:scale-[1.01]"
        >
          {isSubmitting ? "Sending..." : "Send Message"}
          <Send className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  )
}

export default ContactForm