"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CheckCircle2, Send, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"

const contactFormSchema = z.object({
  role: z.enum(["student", "parent", "counselor", "other"], {
    required_error: "Please select who you are",
    invalid_type_error: "Please select who you are",
  }),
  name: z.string().trim().min(1, "Name is required"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  phone: z.string().trim().min(1, "Phone number is required"),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters"),
})

type ContactFormValues = z.infer<typeof contactFormSchema>

const inputClassName =
  "w-full rounded-xl border-2 border-black bg-white px-4 py-3 text-sm font-bold text-black placeholder:text-slate-400 outline-none transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] aria-invalid:border-red-600"

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
        className="rounded-3xl border-2 border-black bg-emerald-100 p-8 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-black bg-emerald-400 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <CheckCircle2 className="h-7 w-7 stroke-[2.5]" />
        </div>
        <h3 className="mt-4 text-2xl font-black text-black">
          Message Sent Successfully
        </h3>
        <p className="mt-2 text-sm font-bold text-slate-800 max-w-md mx-auto">
          Thanks for reaching out! A career advisor will review your query and respond via email or phone within 24 hours.
        </p>
        <Button
          className="mt-6 rounded-full border-2 border-black bg-white text-black font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-slate-100"
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
      className="rounded-3xl border-2 border-black bg-white p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-6"
      noValidate
    >
      {/* Role Selection Tabs */}
      <div className="space-y-2">
        <label className="text-xs font-black uppercase tracking-wider text-black">
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
              className={`rounded-xl border-2 border-black py-2.5 px-3 text-xs font-black transition-all text-center ${
                selectedRole === role.id
                  ? "bg-[#FF5500] text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                  : "bg-[#F7F5F0] text-black hover:bg-slate-100"
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
          <label htmlFor="name" className="text-xs font-black text-black uppercase">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="e.g. Rahul Sharma"
            autoComplete="name"
            className={inputClassName}
            aria-invalid={!!errors.name}
            {...register("name")}
          />
          {errors.name && (
            <p className="text-xs text-red-600 font-bold">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <label htmlFor="phone" className="text-xs font-black text-black uppercase">
            Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            placeholder="+91 98765 43210"
            autoComplete="tel"
            className={inputClassName}
            aria-invalid={!!errors.phone}
            {...register("phone")}
          />
          {errors.phone && (
            <p className="text-xs text-red-600 font-bold">
              {errors.phone.message}
            </p>
          )}
        </div>
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <label htmlFor="email" className="text-xs font-black text-black uppercase">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          placeholder="rahul@example.com"
          autoComplete="email"
          className={inputClassName}
          aria-invalid={!!errors.email}
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs text-red-600 font-bold">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Message */}
      <div className="space-y-1.5">
        <label htmlFor="message" className="text-xs font-black text-black uppercase">
          How can we help you?
        </label>
        <textarea
          id="message"
          rows={4}
          placeholder="Ask us anything about career guidance, degree selection, or assessment results..."
          className={inputClassName}
          aria-invalid={!!errors.message}
          {...register("message")}
        />
        {errors.message && (
          <p className="text-xs text-red-600 font-bold">
            {errors.message.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <div className="flex flex-col items-center justify-between gap-4 pt-2 sm:flex-row">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800">
          <Sparkles className="h-4 w-4 text-[#FF5500]" />
          Quick response within 24 hours
        </span>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto h-12 px-8 bg-[#FF5500] hover:bg-[#E64D00] text-white font-black rounded-full border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
        >
          {isSubmitting ? "Sending..." : "Send Message"}
          <Send className="ml-2 h-4 w-4 stroke-[2.5]" />
        </Button>
      </div>
    </form>
  )
}

export default ContactForm