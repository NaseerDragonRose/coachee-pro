// Shared by the profile form and the server action behind it. A server action
// is a public HTTP endpoint — whatever the form enforces in the browser has to
// be enforced again here, against the same rules, or the two drift.
import { z } from "zod"

// No email field: Google supplies a verified address at sign-in, and asking
// again would only let someone type a different one.
export const profileSchema = z.object({
  name: z.string().trim().min(1, "Please tell us your name").max(120, "That name is too long"),
  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .max(20, "That phone number is too long"),
  consent: z.literal(true, { error: "Please agree before we continue" }),
})

// Upper bounds exist to stop an unbounded payload landing in JSONB, not to
// validate meaning — toQuestionnaire() already discards anything that doesn't
// match a real question, so unknown keys never reach the database.
const answerValueSchema = z.union([
  z.string().max(2_000),
  z.array(z.string().max(200)).max(50),
  z.number().finite(),
])

export const answersSchema = z.record(z.string().max(100), answerValueSchema)
