# Cognito Google SSO Authentication Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let a student sign up with Google (via AWS Cognito) right after finishing the free assessment, and let returning users log back in from the header.

**Architecture:** A new CDK-provisioned Cognito User Pool federates with Google. Next.js talks to it through NextAuth v4 (`next-auth@4.24.15`) with its built-in Cognito provider, wrapped behind `services/auth` for the one-off session check; `useSession`/`signIn`/`signOut` are called directly from `next-auth/react` elsewhere since they're already thin, stateless wrappers. The assessment flow gains a required "signup" stage after lead capture; because Google's OAuth consent screen can't render in an iframe, completing it is a full-page redirect, so the flow leans on localStorage (already used for drafts and the blueprint) plus a URL param to reopen the modal at the right stage on return.

**Tech Stack:** AWS CDK 2.263.0 (`aws-cdk-lib`), AWS CDK CLI 2.1135.0, `constructs` 10.8.1, `next-auth` 4.24.15, Next.js 16.2.11 App Router, React 19.2.4.

## Global Constraints

- Never commit until explicitly told to — this plan has no per-task commit steps; commits happen once, at the end, when asked.
- Don't run lint/type-check/build after every task — verify each task manually (dev server, `npx tsc --noEmit`, reading output) and save `npm run lint` / `npm run build` for the very end.
- No test framework is introduced. No automated tests for this work.
- Package manager is `npm` (`package-lock.json` present, no other lockfile).
- Pin `next-auth` to `^4.24.15` — v5 ("Auth.js") is beta-only, project convention is LTS/stable dependencies.
- Pin CDK packages to exact versions already resolved: `aws-cdk-lib@2.263.0`, `aws-cdk@2.1135.0`, `constructs@10.8.1`.
- Hand-written components follow `.claude/rules/component-conventions.md`: named `const` arrow-function export, props destructured inline, prop type named `Props` declared after the component. A component with zero props needs neither destructuring nor a `Props` type.
- All new UI follows `.claude/rules/ui-conventions.md`: mobile-first base classes, ≥44×44px touch targets on anything tappable, a `dark:` counterpart for every light class, visible focus rings, real `<label>`s.
- No secrets committed: `infra/.env` and the app's `.env.local` are both gitignored already (root `.gitignore` has a `.env*` entry; `infra/` gets its own `.gitignore` in Task 1).
- `services/auth/` follows the `services/ai/` pattern already in the repo: an interface (`auth-service.ts`) plus a swappable implementation (`cognito-auth-service.ts`) — business logic never imports Cognito or NextAuth server config directly.

---

### Task 1: CDK Cognito stack + Google Console setup docs

**Files:**
- Create: `infra/package.json`
- Create: `infra/tsconfig.json`
- Create: `infra/cdk.json`
- Create: `infra/.gitignore`
- Create: `infra/bin/app.ts`
- Create: `infra/lib/cognito-stack.ts`
- Create: `infra/README.md`

**Interfaces:**
- Produces: five CloudFormation outputs later tasks depend on — `UserPoolId`, `UserPoolClientId`, `UserPoolClientSecret`, `CognitoIssuer`, `HostedUiDomain`. Task 2 copies `UserPoolClientId` → `COGNITO_CLIENT_ID`, `UserPoolClientSecret` → `COGNITO_CLIENT_SECRET`, `CognitoIssuer` → `COGNITO_ISSUER` in the app's `.env.local`.
- Produces: a fixed, pre-computable Google OAuth redirect URI — `https://coacheepro-auth.auth.ap-south-1.amazoncognito.com/oauth2/idpresponse` — needed by the user before they can even create the Google OAuth client (see README below), since it's deterministic from the hosted-UI domain prefix and region chosen in `bin/app.ts`, not generated at deploy time.

This is a self-contained CDK project (its own `package.json`, not part of the Next.js app's dependency tree or build), living alongside `app/`, `components/`, `services/` at the repo root.

- [ ] **Step 1: Create `infra/package.json`**

```json
{
  "name": "coachee-pro-infra",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "build": "tsc",
    "cdk": "cdk"
  },
  "dependencies": {
    "aws-cdk-lib": "2.263.0",
    "constructs": "10.8.1",
    "dotenv": "^16.4.5"
  },
  "devDependencies": {
    "@types/node": "^20",
    "aws-cdk": "2.1135.0",
    "ts-node": "^10.9.2",
    "typescript": "^5"
  }
}
```

- [ ] **Step 2: Create `infra/tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "declaration": true,
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": false,
    "inlineSourceMap": true,
    "inlineSources": true,
    "experimentalDecorators": true,
    "strictPropertyInitialization": false,
    "typeRoots": ["./node_modules/@types"],
    "esModuleInterop": true,
    "moduleResolution": "node",
    "skipLibCheck": true
  },
  "exclude": ["node_modules", "cdk.out"]
}
```

- [ ] **Step 3: Create `infra/cdk.json`**

```json
{
  "app": "npx ts-node --prefer-ts-exts bin/app.ts",
  "watch": {
    "include": ["**"],
    "exclude": [
      "README.md",
      "cdk*.json",
      "**/*.d.ts",
      "**/*.js",
      "tsconfig.json",
      "package*.json",
      "node_modules",
      ".env"
    ]
  }
}
```

- [ ] **Step 4: Create `infra/.gitignore`**

```
*.js
*.d.ts
node_modules
cdk.out
.env
*.tsbuildinfo
```

- [ ] **Step 5: Create `infra/lib/cognito-stack.ts`**

```ts
import { CfnOutput, RemovalPolicy, SecretValue, Stack, StackProps } from "aws-cdk-lib"
import {
  OAuthScope,
  ProviderAttribute,
  UserPool,
  UserPoolClient,
  UserPoolClientIdentityProvider,
  UserPoolIdentityProviderGoogle,
} from "aws-cdk-lib/aws-cognito"
import { Construct } from "constructs"

export type CognitoStackProps = StackProps & {
  googleClientId: string
  googleClientSecret: string
  callbackUrls: string[]
  logoutUrls: string[]
  hostedUiDomainPrefix: string
}

export class CognitoStack extends Stack {
  constructor(scope: Construct, id: string, props: CognitoStackProps) {
    super(scope, id, props)

    const userPool = new UserPool(this, "CoacheeProUserPool", {
      userPoolName: "coachee-pro-users",
      selfSignUpEnabled: false,
      signInAliases: { email: true },
      standardAttributes: {
        email: { required: true, mutable: true },
        fullname: { required: false, mutable: true },
      },
      removalPolicy: RemovalPolicy.RETAIN,
    })

    const googleProvider = new UserPoolIdentityProviderGoogle(this, "GoogleIdentityProvider", {
      userPool,
      clientId: props.googleClientId,
      clientSecretValue: SecretValue.unsafePlainText(props.googleClientSecret),
      scopes: ["openid", "email", "profile"],
      attributeMapping: {
        email: ProviderAttribute.GOOGLE_EMAIL,
        fullname: ProviderAttribute.GOOGLE_NAME,
      },
    })

    const userPoolClient = new UserPoolClient(this, "CoacheeProUserPoolClient", {
      userPool,
      generateSecret: true,
      oAuth: {
        flows: { authorizationCodeGrant: true },
        scopes: [OAuthScope.OPENID, OAuthScope.EMAIL, OAuthScope.PROFILE],
        callbackUrls: props.callbackUrls,
        logoutUrls: props.logoutUrls,
      },
      supportedIdentityProviders: [UserPoolClientIdentityProvider.GOOGLE],
    })
    // The client must not be created before Google is registered as a
    // provider, or Cognito rejects GOOGLE as a supported identity provider.
    userPoolClient.node.addDependency(googleProvider)

    const domain = userPool.addDomain("CoacheeProUserPoolDomain", {
      cognitoDomain: { domainPrefix: props.hostedUiDomainPrefix },
    })

    new CfnOutput(this, "UserPoolId", { value: userPool.userPoolId })
    new CfnOutput(this, "UserPoolClientId", { value: userPoolClient.userPoolClientId })
    new CfnOutput(this, "UserPoolClientSecret", {
      // Intentionally exposed in plaintext stack output for local copy into
      // .env.local — this is a single-developer MVP with no CI/CD reading
      // stack outputs yet. Revisit if that changes.
      value: userPoolClient.userPoolClientSecret.unsafeUnwrap(),
    })
    new CfnOutput(this, "CognitoIssuer", {
      value: `https://cognito-idp.${this.region}.amazonaws.com/${userPool.userPoolId}`,
    })
    new CfnOutput(this, "HostedUiDomain", { value: domain.baseUrl() })
  }
}
```

- [ ] **Step 6: Create `infra/bin/app.ts`**

```ts
#!/usr/bin/env node
import "dotenv/config"
import { App } from "aws-cdk-lib"

import { CognitoStack } from "../lib/cognito-stack"

const googleClientId = process.env.GOOGLE_CLIENT_ID
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET

if (!googleClientId || !googleClientSecret) {
  throw new Error(
    "GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set in infra/.env before deploying. See infra/README.md."
  )
}

const app = new App()

new CognitoStack(app, "CoacheeProCognitoStack", {
  googleClientId,
  googleClientSecret,
  callbackUrls: [
    "http://localhost:3000/api/auth/callback/cognito",
    "https://coacheepro.com/api/auth/callback/cognito",
  ],
  logoutUrls: ["http://localhost:3000", "https://coacheepro.com"],
  hostedUiDomainPrefix: "coacheepro-auth",
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION ?? "ap-south-1",
  },
})
```

- [ ] **Step 7: Create `infra/README.md`**

```markdown
# CoacheePro auth infrastructure

Provisions the Cognito User Pool + Google federation behind sign-in. See
`docs/superpowers/specs/2026-08-05-cognito-google-sso-auth-design.md` for
the full design.

## 1. Create the Google OAuth client

1. Go to https://console.cloud.google.com and create (or select) a project
   named "CoacheePro".
2. **APIs & Services → OAuth consent screen**: choose "External", fill in
   app name "CoacheePro", your support email, and developer contact email.
   Leave scopes at the default (openid, email, profile — these are
   non-sensitive and don't require Google's full verification review).
   You can leave publishing status as "Testing" for development (up to 100
   test users, no review needed); switch to "In production" before real
   launch — that's a lighter review than sensitive-scope apps get, but
   plan for a few days' turnaround.
3. **APIs & Services → Credentials → Create Credentials → OAuth client ID**:
   - Application type: **Web application**
   - Name: "CoacheePro Cognito"
   - Authorized redirect URIs — add exactly this (it's deterministic from
     the domain prefix and region set in `bin/app.ts`, so you can compute
     it before ever deploying):
     ```
     https://coacheepro-auth.auth.ap-south-1.amazoncognito.com/oauth2/idpresponse
     ```
4. Save. Copy the **Client ID** and **Client secret** — you'll need both next.

## 2. Configure local secrets

Create `infra/.env` (gitignored, never commit this):

```
GOOGLE_CLIENT_ID=<paste from step 1>
GOOGLE_CLIENT_SECRET=<paste from step 1>
```

## 3. Install and deploy

Uses your personal `coachee-pro` AWS profile — never the machine's default
credentials.

```bash
cd infra
npm install
npx cdk bootstrap --profile <your-coachee-pro-profile>   # first time only
npx cdk deploy --profile <your-coachee-pro-profile>
```

If deploy fails with a domain-prefix conflict (Cognito hosted-UI domain
prefixes are globally unique across all AWS accounts), change
`hostedUiDomainPrefix` in `bin/app.ts` to something else, update the Google
redirect URI in step 1 to match, and redeploy.

## 4. Wire the outputs into the app

After deploy, `cdk deploy` prints five outputs. Copy them into the Next.js
app's `.env.local` (see `services/auth/` in the main README/spec for which
env var each one maps to): `UserPoolClientId` → `COGNITO_CLIENT_ID`,
`UserPoolClientSecret` → `COGNITO_CLIENT_SECRET`, `CognitoIssuer` →
`COGNITO_ISSUER`.
```

- [ ] **Step 8: Verify the stack synthesizes**

```bash
cd infra && npm install && npx cdk synth --profile <your-coachee-pro-profile> > /dev/null
```

Note: this step needs real `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` values in `infra/.env` (even placeholder strings work for `synth`, since it only needs to type-check and render CloudFormation, not talk to Google) and valid AWS credentials for the account/region lookup. If you don't have the Google values yet, use any placeholder string — `synth` doesn't validate them, only `cdk deploy` and the eventual live login do.

Expected: CDK prints the synthesized CloudFormation template with no errors, ending in a stack summary. If `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` are unset entirely, `app.ts`'s guard throws before synth even starts — that's the expected failure mode for a genuinely missing `.env`.

Actual deploy (`cdk deploy`) and the real Google Console setup are the user's steps per the spec's division of labor — this task's job is to leave the stack ready to deploy, not to deploy it.

---

### Task 2: NextAuth v4 wiring — services/auth, route handler, SessionProvider

**Files:**
- Modify: `package.json` (add `next-auth` dependency)
- Create: `services/auth/auth-service.ts`
- Create: `services/auth/auth-options.ts`
- Create: `services/auth/cognito-auth-service.ts`
- Create: `types/next-auth.d.ts`
- Create: `app/api/auth/[...nextauth]/route.ts`
- Modify: `app/layout.tsx`
- Create: `.env.local.example`

**Interfaces:**
- Consumes: nothing from earlier tasks (env var names only — `COGNITO_CLIENT_ID`, `COGNITO_CLIENT_SECRET`, `COGNITO_ISSUER` — match Task 1's README mapping).
- Produces: `AuthService` interface + `Session` type (`services/auth/auth-service.ts`), `cognitoAuthService: AuthService` (`services/auth/cognito-auth-service.ts`) — Task 4 calls `cognitoAuthService.getSession()`. `authOptions: NextAuthOptions` (`services/auth/auth-options.ts`) — consumed only by the route handler in this task. `SessionProvider` now wraps the app, so `useSession`/`signIn`/`signOut` from `next-auth/react` work in any client component — Tasks 3, 4, 5 depend on this.

- [ ] **Step 1: Add `next-auth` to `package.json`**

Add to the `dependencies` block (alphabetical, matching the existing list):

```json
    "next-auth": "^4.24.15",
```

Then run:

```bash
npm install
```

- [ ] **Step 2: Create `services/auth/auth-service.ts`**

```ts
export type Session = {
  id: string
  email: string
  name: string
}

export interface AuthService {
  getSession(): Promise<Session | null>
}
```

- [ ] **Step 3: Create `types/next-auth.d.ts`**

```ts
import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
    } & DefaultSession["user"]
  }
}
```

This augments NextAuth's built-in `Session` type so `session.user.id` type-checks — without it, `user.id` doesn't exist on the default type even though the `session` callback in Step 4 sets it at runtime.

- [ ] **Step 4: Create `services/auth/auth-options.ts`**

```ts
import type { NextAuthOptions } from "next-auth"
import CognitoProvider from "next-auth/providers/cognito"

export const authOptions: NextAuthOptions = {
  providers: [
    CognitoProvider({
      clientId: process.env.COGNITO_CLIENT_ID!,
      clientSecret: process.env.COGNITO_CLIENT_SECRET!,
      issuer: process.env.COGNITO_ISSUER!,
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
      }
      return session
    },
  },
}
```

`token.sub` is set automatically by NextAuth to the OAuth provider's user id (Cognito's `sub` claim) on first sign-in — no custom `jwt` callback needed to populate it.

- [ ] **Step 5: Create `services/auth/cognito-auth-service.ts`**

```ts
"use client"

import { getSession } from "next-auth/react"

import type { AuthService, Session } from "./auth-service"

export const cognitoAuthService: AuthService = {
  async getSession(): Promise<Session | null> {
    const session = await getSession()
    if (!session?.user) return null

    return {
      id: session.user.id,
      email: session.user.email ?? "",
      name: session.user.name ?? "",
    }
  },
}
```

- [ ] **Step 6: Create `app/api/auth/[...nextauth]/route.ts`**

```ts
import NextAuth from "next-auth"

import { authOptions } from "@/services/auth/auth-options"

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
```

- [ ] **Step 7: Wrap `app/layout.tsx` with `SessionProvider`**

Current relevant section (`app/layout.tsx:1-4` and the body's provider nesting):

```tsx
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { SmoothScroll } from "@/components/smooth-scroll";
import "./globals.css";
```

Add the import:

```tsx
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/theme-provider";
import { SmoothScroll } from "@/components/smooth-scroll";
import "./globals.css";
```

Current body:

```tsx
      <body className="min-h-screen flex flex-col bg-background text-foreground overflow-x-clip selection:bg-indigo-500/20 selection:text-indigo-600 dark:selection:text-indigo-400">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <SmoothScroll>{children}</SmoothScroll>
        </ThemeProvider>
      </body>
```

New body — `SessionProvider` wraps at the same global level as `ThemeProvider`, since future non-marketing routes (dashboard, sub-projects #3/#4) will need session state too, not just the marketing layout that currently owns `AssessmentProvider`:

```tsx
      <body className="min-h-screen flex flex-col bg-background text-foreground overflow-x-clip selection:bg-indigo-500/20 selection:text-indigo-600 dark:selection:text-indigo-400">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <SessionProvider>
            <SmoothScroll>{children}</SmoothScroll>
          </SessionProvider>
        </ThemeProvider>
      </body>
```

- [ ] **Step 8: Create `.env.local.example`**

A committed template (not the real secrets) documenting what a working `.env.local` needs — there's no existing `.env.local.example` in the repo, so this is the first one:

```
# NextAuth
NEXTAUTH_SECRET=   # generate with: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000

# Cognito (from `infra/` CDK stack outputs — see infra/README.md)
COGNITO_CLIENT_ID=
COGNITO_CLIENT_SECRET=
COGNITO_ISSUER=
```

- [ ] **Step 9: Verify it compiles**

```bash
npx tsc --noEmit
```

Expected: no errors. This doesn't need real Cognito values — TypeScript only checks that the `!`-asserted env reads and the module wiring type-check, not that they hold real values at runtime.

---

### Task 3: Assessment flow signup step

**Files:**
- Modify: `components/assessment/assessment-flow.tsx`
- Create: `components/assessment/signup-screen.tsx`

**Interfaces:**
- Consumes: `next-auth/react`'s `signIn`, `useSession` (from Task 2's `SessionProvider` wiring).
- Produces: exports `type Stage = "welcome" | "questions" | "teaser" | "capture" | "signup" | "done"` from `assessment-flow.tsx` — Task 4 imports this type for `assessment-provider.tsx`'s deep-link state.

- [ ] **Step 1: Create `components/assessment/signup-screen.tsx`**

Visual style matches `TeaserScreen` (`components/assessment/teaser-screen.tsx`). No props — it triggers sign-in directly.

```tsx
"use client"

import { UserPlus } from "lucide-react"
import { signIn } from "next-auth/react"

import { Button } from "@/components/ui/button"

export const SignupScreen = () => (
  <div className="flex flex-col gap-6">
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300">
      <UserPlus className="h-6 w-6" />
    </div>

    <div className="flex flex-col gap-3">
      <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-slate-100">
        Create your free account
      </h2>
      <p className="text-sm text-muted-foreground">
        One more step — sign up with Google to unlock your career matches. It takes a
        few seconds and there&apos;s no password to remember.
      </p>
    </div>

    <Button
      onClick={() => signIn("cognito", { callbackUrl: "/?assessment=done" })}
      className="h-12 w-full rounded-xl bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-700"
    >
      Continue with Google
    </Button>
  </div>
)
```

- [ ] **Step 2: Update `assessment-flow.tsx`'s imports and `Stage` type**

Current (`assessment-flow.tsx:1-20`):

```tsx
"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { isScreenComplete, pruneAnswers, screenIndexOf, visibleScreens } from "@/lib/assessment/flow"
import { clearDraft, loadDraft, saveDraft } from "@/lib/assessment/storage"
import type { AnswerValue, Answers, AssessmentSubmission, Lead } from "@/lib/assessment/types"
import { saveBlueprint } from "@/lib/blueprint/storage"
import { mockBlueprintService } from "@/services/ai/mock-blueprint-service"

import { ConfirmationScreen } from "./confirmation-screen"
import { LeadCaptureForm } from "./lead-capture-form"
import { QuestionScreen } from "./question-screen"
import { TeaserScreen } from "./teaser-screen"
import { WelcomeScreen } from "./welcome-screen"

type Stage = "welcome" | "questions" | "teaser" | "capture" | "done"
```

Replace with:

```tsx
"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useSession } from "next-auth/react"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { isScreenComplete, pruneAnswers, screenIndexOf, visibleScreens } from "@/lib/assessment/flow"
import { clearDraft, loadDraft, saveDraft } from "@/lib/assessment/storage"
import type { AnswerValue, Answers, AssessmentSubmission, Lead } from "@/lib/assessment/types"
import { saveBlueprint } from "@/lib/blueprint/storage"
import { mockBlueprintService } from "@/services/ai/mock-blueprint-service"

import { ConfirmationScreen } from "./confirmation-screen"
import { LeadCaptureForm } from "./lead-capture-form"
import { QuestionScreen } from "./question-screen"
import { SignupScreen } from "./signup-screen"
import { TeaserScreen } from "./teaser-screen"
import { useAssessment } from "./assessment-provider"
import { WelcomeScreen } from "./welcome-screen"

export type Stage = "welcome" | "questions" | "teaser" | "capture" | "signup" | "done"
```

- [ ] **Step 3: Consume the provider's `initialStage` on mount, and read the session**

Current (`assessment-flow.tsx:29-39`, the component body start):

```tsx
export const AssessmentFlow = ({ onClose }: Props) => {
  const [stage, setStage] = useState<Stage>("welcome")
  const [answers, setAnswers] = useState<Answers>({})
  const [index, setIndex] = useState(0)
  const [showErrors, setShowErrors] = useState(false)
  const [hasDraft, setHasDraft] = useState(false)
  const [lead, setLead] = useState<Lead | null>(null)

  const [maxScreenCount, setMaxScreenCount] = useState(0)

  const headingRef = useRef<HTMLDivElement>(null)
```

Replace with:

```tsx
export const AssessmentFlow = ({ onClose }: Props) => {
  const [stage, setStage] = useState<Stage>("welcome")
  const [answers, setAnswers] = useState<Answers>({})
  const [index, setIndex] = useState(0)
  const [showErrors, setShowErrors] = useState(false)
  const [hasDraft, setHasDraft] = useState(false)
  const [lead, setLead] = useState<Lead | null>(null)

  const [maxScreenCount, setMaxScreenCount] = useState(0)

  const headingRef = useRef<HTMLDivElement>(null)

  const { initialStage, consumeInitialStage } = useAssessment()
  const { data: session } = useSession()

  useEffect(() => {
    // The post-signup OAuth redirect lands the browser back here with no
    // in-memory stage — assessment-provider.tsx figures out where to
    // resume (done vs. signup) and hands it over via context; this effect
    // applies it once, then clears it so a later open() starts fresh.
    if (!initialStage) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStage(initialStage)
    consumeInitialStage()
  }, [initialStage, consumeInitialStage])
```

- [ ] **Step 4: Route `submit()` to the new `signup` stage instead of `done`**

Current (`assessment-flow.tsx:120-138`):

```tsx
  const submit = async (captured: Lead) => {
    const submission: AssessmentSubmission = {
      answers: pruneAnswers(answers),
      lead: captured,
      completedAt: new Date().toISOString(),
    }
    // TODO(ADR-003): replace with a real SES or API endpoint send once configured.
    console.log("Assessment Submission:", submission)

    const blueprint = await mockBlueprintService.generate({
      answers: submission.answers,
      studentName: captured.name,
    })
    saveBlueprint(blueprint)

    clearDraft()
    setLead(captured)
    setStage("done")
  }
```

Replace the last three lines:

```tsx
  const submit = async (captured: Lead) => {
    const submission: AssessmentSubmission = {
      answers: pruneAnswers(answers),
      lead: captured,
      completedAt: new Date().toISOString(),
    }
    // TODO(ADR-003): replace with a real SES or API endpoint send once configured.
    console.log("Assessment Submission:", submission)

    const blueprint = await mockBlueprintService.generate({
      answers: submission.answers,
      studentName: captured.name,
    })
    saveBlueprint(blueprint)

    clearDraft()
    setLead(captured)
    setStage("signup")
  }
```

- [ ] **Step 5: Add the `signup` stage render branch, and fall back to the session name on `done`**

Current (`assessment-flow.tsx:156-170`):

```tsx
  if (stage === "capture") {
    return (
      <div ref={headingRef} tabIndex={-1} className="overflow-y-auto px-5 py-6 outline-none" data-lenis-prevent>
        <LeadCaptureForm onSubmitted={submit} />
      </div>
    )
  }

  if (stage === "done") {
    return (
      <div ref={headingRef} tabIndex={-1} className="overflow-y-auto px-5 py-6 outline-none" data-lenis-prevent>
        <ConfirmationScreen name={lead?.name} onClose={onClose} />
      </div>
    )
  }
```

Replace with:

```tsx
  if (stage === "capture") {
    return (
      <div ref={headingRef} tabIndex={-1} className="overflow-y-auto px-5 py-6 outline-none" data-lenis-prevent>
        <LeadCaptureForm onSubmitted={submit} />
      </div>
    )
  }

  if (stage === "signup") {
    return (
      <div ref={headingRef} tabIndex={-1} className="overflow-y-auto px-5 py-6 outline-none" data-lenis-prevent>
        <SignupScreen />
      </div>
    )
  }

  if (stage === "done") {
    return (
      <div ref={headingRef} tabIndex={-1} className="overflow-y-auto px-5 py-6 outline-none" data-lenis-prevent>
        <ConfirmationScreen name={lead?.name ?? session?.user?.name ?? undefined} onClose={onClose} />
      </div>
    )
  }
```

`lead?.name` still wins when it's available (the normal, non-redirected path through `capture` → `signup` → Google → back keeps `lead` in memory only if React never unmounted — which it doesn't on the happy path, since the redirect only leaves the page after the user clicks "Continue with Google"). The session fallback matters for the one case where memory *is* gone: reopening via the `?assessment=done` deep link after the full-page round trip.

- [ ] **Step 6: Verify manually**

```bash
npm run dev
```

Open the assessment (`?assessment=1`), click through to the lead capture form, submit it, and confirm the modal now shows the new "Create your free account" screen instead of jumping straight to the thank-you screen. Cannot verify the "Continue with Google" click itself yet — Task 2's env vars aren't populated with real Cognito values until Task 1 is deployed by the user.

---

### Task 4: Post-OAuth deep-link resume

**Files:**
- Modify: `components/assessment/assessment-provider.tsx`

**Interfaces:**
- Consumes: `type Stage` from `./assessment-flow` (Task 3), `cognitoAuthService.getSession()` from `@/services/auth/cognito-auth-service` (Task 2), `loadBlueprint` from `@/lib/blueprint/storage` (already exists, from the sub-project #1 work).
- Produces: extends `AssessmentContextValue` with `initialStage: Stage | null` and `consumeInitialStage: () => void` — Task 3's `AssessmentFlow` already consumes these (Step 3 above).

- [ ] **Step 1: Replace `assessment-provider.tsx` in full**

Current file:

```tsx
"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import type { ReactNode } from "react"

import { AssessmentDialog } from "./assessment-dialog"

const AssessmentContext = createContext<AssessmentContextValue | null>(null)

export const AssessmentProvider = ({ children }: Props) => {
  const [isOpen, setIsOpen] = useState(false)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])

  useEffect(() => {
    // Campaign links can deep-link straight into the assessment. This reads
    // the URL, which is only reliably available client-side after mount, not
    // during render.
    if (new URLSearchParams(window.location.search).get("assessment") === "1") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsOpen(true)
    }
  }, [])

  const value = useMemo(() => ({ isOpen, open, close }), [isOpen, open, close])

  return (
    <AssessmentContext.Provider value={value}>
      {children}
      <AssessmentDialog />
    </AssessmentContext.Provider>
  )
}

export const useAssessment = (): AssessmentContextValue => {
  const context = useContext(AssessmentContext)
  if (!context) {
    throw new Error("useAssessment must be used inside an AssessmentProvider")
  }
  return context
}

type AssessmentContextValue = {
  isOpen: boolean
  open: () => void
  close: () => void
}

type Props = {
  children: ReactNode
}
```

Replace with:

```tsx
"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import type { ReactNode } from "react"

import { loadBlueprint } from "@/lib/blueprint/storage"
import { cognitoAuthService } from "@/services/auth/cognito-auth-service"

import { AssessmentDialog } from "./assessment-dialog"
import type { Stage } from "./assessment-flow"

const AssessmentContext = createContext<AssessmentContextValue | null>(null)

export const AssessmentProvider = ({ children }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const [initialStage, setInitialStage] = useState<Stage | null>(null)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const consumeInitialStage = useCallback(() => setInitialStage(null), [])

  useEffect(() => {
    // Campaign links can deep-link straight into the assessment, and the
    // post-signup Google redirect lands back here too — both read the URL,
    // which is only reliably available client-side after mount, not
    // during render.
    const assessment = new URLSearchParams(window.location.search).get("assessment")

    if (assessment === "1") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsOpen(true)
      return
    }

    if (assessment === "done") {
      // No saved blueprint means this isn't a real post-assessment
      // redirect (stale/bookmarked link) — ignore it.
      if (!loadBlueprint()) return

      cognitoAuthService.getSession().then((session) => {
        // Signup can fail to complete (denied consent, refresh mid-flow);
        // land back on the signup screen to retry rather than a broken
        // "done" state with no session.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setInitialStage(session ? "done" : "signup")
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsOpen(true)
      })
    }
  }, [])

  const value = useMemo(
    () => ({ isOpen, open, close, initialStage, consumeInitialStage }),
    [isOpen, open, close, initialStage, consumeInitialStage]
  )

  return (
    <AssessmentContext.Provider value={value}>
      {children}
      <AssessmentDialog />
    </AssessmentContext.Provider>
  )
}

export const useAssessment = (): AssessmentContextValue => {
  const context = useContext(AssessmentContext)
  if (!context) {
    throw new Error("useAssessment must be used inside an AssessmentProvider")
  }
  return context
}

type AssessmentContextValue = {
  isOpen: boolean
  open: () => void
  close: () => void
  initialStage: Stage | null
  consumeInitialStage: () => void
}

type Props = {
  children: ReactNode
}
```

- [ ] **Step 2: Verify manually**

```bash
npm run dev
```

With devtools open, manually seed a fake blueprint in localStorage (`localStorage.setItem("coacheepro.blueprint.v1", JSON.stringify({version:1,generatedAt:new Date().toISOString(),studentName:"Test",profile:{archetype:"x",narrative:"x",strengths:[],watchOuts:[],signalMap:{}},careers:[]}))` in the browser console) and visit `/?assessment=done`. Expected: the modal opens directly on the `signup` stage (no real session exists yet, so it can't reach `done`) — confirming the fallback path works. The `done` branch of this logic can't be verified end-to-end until Task 1 is deployed and a real Google sign-in exists.

---

### Task 5: Header login state

**Files:**
- Modify: `components/marketing/header.tsx`

**Interfaces:**
- Consumes: `useSession`, `signIn`, `signOut` from `next-auth/react` (Task 2's `SessionProvider`).

- [ ] **Step 1: Add the import and session hook**

Current (`header.tsx:1-22`):

```tsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { 
  ArrowRight, 
  Menu, 
  X, 
  Sparkles, 
  ChevronRight, 
  Compass, 
  BookOpen, 
  GraduationCap, 
  HelpCircle,
  PhoneCall,
  Sun,
  Moon
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { useAssessment } from "@/components/assessment/assessment-provider"
```

Add the import:

```tsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { signIn, signOut, useSession } from "next-auth/react"
import { 
  ArrowRight, 
  Menu, 
  X, 
  Sparkles, 
  ChevronRight, 
  Compass, 
  BookOpen, 
  GraduationCap, 
  HelpCircle,
  PhoneCall,
  Sun,
  Moon
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { useAssessment } from "@/components/assessment/assessment-provider"
```

Current (`header.tsx:31-36`):

```tsx
export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const { open } = useAssessment()
```

Replace with:

```tsx
export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const { open } = useAssessment()
  const { data: session, status } = useSession()
```

- [ ] **Step 2: Add desktop login state**

Current (`header.tsx:126-152`, the desktop actions block):

```tsx
          {/* Actions & Primary CTA */}
          <div className="hidden items-center gap-2.5 md:flex">
            {/* Dark / Light Theme Switcher */}
            <button
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 bg-slate-100/80 text-slate-700 transition-colors hover:bg-slate-200/80 dark:border-slate-800/80 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Toggle light/dark theme"
            >
              {mounted && (theme === "dark" ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4 text-slate-600 dark:text-slate-400" />
              ))}
            </button>

            {/* CTA Button */}
            <Button
              size="sm"
              onClick={open}
              className="relative h-9 overflow-hidden rounded-xl bg-indigo-600 px-4 text-xs font-semibold text-white shadow-md shadow-indigo-500/25 transition-all duration-300 hover:bg-indigo-700 hover:shadow-indigo-500/40 hover:scale-[1.02]"
            >
              <span className="relative z-10 flex items-center gap-1.5">
                Start Free Test
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Button>
          </div>
```

Replace with (login state inserted between the theme toggle and the CTA):

```tsx
          {/* Actions & Primary CTA */}
          <div className="hidden items-center gap-2.5 md:flex">
            {/* Dark / Light Theme Switcher */}
            <button
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 bg-slate-100/80 text-slate-700 transition-colors hover:bg-slate-200/80 dark:border-slate-800/80 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Toggle light/dark theme"
            >
              {mounted && (theme === "dark" ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4 text-slate-600 dark:text-slate-400" />
              ))}
            </button>

            {/* Login state */}
            {mounted && (
              status === "authenticated" ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {session?.user?.name?.split(" ")[0]}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="h-9 rounded-xl px-2.5 text-xs font-semibold"
                  >
                    Sign out
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => signIn("cognito", { callbackUrl: "/" })}
                  className="h-9 rounded-xl px-2.5 text-xs font-semibold"
                >
                  Log in
                </Button>
              )
            )}

            {/* CTA Button */}
            <Button
              size="sm"
              onClick={open}
              className="relative h-9 overflow-hidden rounded-xl bg-indigo-600 px-4 text-xs font-semibold text-white shadow-md shadow-indigo-500/25 transition-all duration-300 hover:bg-indigo-700 hover:shadow-indigo-500/40 hover:scale-[1.02]"
            >
              <span className="relative z-10 flex items-center gap-1.5">
                Start Free Test
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Button>
          </div>
```

The `mounted` gate matches the existing theme-icon pattern immediately above it — `useSession()`'s status differs between server render (always unauthenticated-looking) and client hydration, so gating behind the same client-only-ready flag avoids a hydration mismatch.

- [ ] **Step 3: Add mobile drawer login state**

Current (`header.tsx:208-222`, inside the mobile sheet):

```tsx
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <Button
                  size="sm"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    open()
                  }}
                  className="w-full h-11 rounded-xl bg-indigo-600 text-xs font-bold text-white shadow-lg shadow-indigo-500/20"
                >
                  Start Free Assessment (10 Mins)
                </Button>
                <p className="text-center text-[11px] font-medium text-slate-400">
                  No credit card · Free preview included
                </p>
              </div>
```

Replace with (login state inserted above the assessment CTA, each state stacked full-width so both stay ≥44px tall):

```tsx
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                {mounted && (
                  status === "authenticated" ? (
                    <div className="flex flex-col gap-2">
                      <p className="px-1 text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Signed in as {session?.user?.name?.split(" ")[0]}
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setMobileMenuOpen(false)
                          signOut({ callbackUrl: "/" })
                        }}
                        className="h-11 w-full rounded-xl text-sm font-semibold"
                      >
                        Sign out
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setMobileMenuOpen(false)
                        signIn("cognito", { callbackUrl: "/" })
                      }}
                      className="h-11 w-full rounded-xl text-sm font-semibold"
                    >
                      Log in
                    </Button>
                  )
                )}
                <Button
                  size="sm"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    open()
                  }}
                  className="w-full h-11 rounded-xl bg-indigo-600 text-xs font-bold text-white shadow-lg shadow-indigo-500/20"
                >
                  Start Free Assessment (10 Mins)
                </Button>
                <p className="text-center text-[11px] font-medium text-slate-400">
                  No credit card · Free preview included
                </p>
              </div>
```

- [ ] **Step 4: Verify manually**

```bash
npm run dev
```

At 375px width, open the mobile menu and confirm "Log in" renders full-width above the assessment CTA. At desktop width, confirm "Log in" renders between the theme toggle and "Start Free Test". Signed-in states can't be triggered yet without a real session (Task 1 not yet deployed) — the logged-out branch is what's verifiable now.

---

### Task 6: ADR and architecture doc updates

**Files:**
- Modify: `reference/ADRS.md`
- Modify: `reference/ARCHITECTURE.md`
- Modify: `CLAUDE.md`

**Interfaces:**
- Consumes: nothing — pure documentation, no code dependency on other tasks.

- [ ] **Step 1: Update ADR-001 in `reference/ADRS.md`**

Current:

```markdown
## ADR-001 — Authentication

**Status:** Pending — decide at start of Phase 2 (User Accounts)
```

Replace the status line and add a Decision section. Find:

```markdown
**Decision:** TBD at Phase 2 kickoff. Current lean is Cognito given the AWS-first principle and multi-role roadmap (Student/Parent/Mentor/Admin), but not locked.
```

Replace with:

```markdown
**Decision:** Decided (2026-08-05) — AWS Cognito, with a Cognito User Pool federated to Google as the only identity provider for v1 (no native Cognito email/password sign-in yet — that's a separate future decision if needed). Next.js integrates via NextAuth v4 (`next-auth@4.24.15`; v5/"Auth.js" was considered but is still beta-only, and this project only takes stable dependencies) as a thin integration layer — Cognito remains the actual identity provider. Provisioned via a CDK stack (`infra/`), consistent with ADR-002. Sessions are JWT-only; no database was introduced for this (see ADR-005 note below) since nothing in this phase's scope needs to look up a user by ID yet.
```

- [ ] **Step 2: Add a note to ADR-005 in `reference/ADRS.md`**

Current:

```markdown
## ADR-005 — Database hosting

**Status:** Pending — decide before Phase 2 (first persistent user data)
```

Find the Decision line:

```markdown
**Decision:** TBD before Phase 2. Given MVP traffic will start near zero, Aurora Serverless v2 is worth pricing out against a small RDS instance at implementation time rather than assuming either now.
```

Add a line immediately after it:

```markdown
**Decision:** TBD before Phase 2. Given MVP traffic will start near zero, Aurora Serverless v2 is worth pricing out against a small RDS instance at implementation time rather than assuming either now.

**Note (2026-08-05):** ADR-001's Cognito integration deliberately avoided needing this — sessions are JWT-only with no Users table. This ADR is still genuinely pending; it wasn't resolved by the auth work, just not forced by it. It'll actually be needed once a Users table, Blueprint persistence, or payments require server-side storage.
```

- [ ] **Step 3: Update the Auth row in `reference/ARCHITECTURE.md`**

Current:

```markdown
| Auth | AWS Cognito (leaning) vs. Clerk vs. Auth.js | **Pending** | See ADR-001 — deliberately not locked until Phase 2 implementation |
```

Replace with:

```markdown
| Auth | AWS Cognito + NextAuth v4 | Confirmed | See ADR-001 — Google federation only in v1, JWT sessions, no database |
```

- [ ] **Step 4: Update `CLAUDE.md`'s tech stack table and current-status paragraph**

Current tech stack row:

```markdown
| Auth | AWS Cognito (leaning) vs Clerk vs Auth.js | Pending — ADR-001 |
```

Replace with:

```markdown
| Auth | AWS Cognito + NextAuth v4 | Confirmed — ADR-001 |
```

Current status paragraph ends with:

```markdown
Phase 1 (marketing website) is underway. The Next.js scaffold is live with dark/light theming (`next-themes`) and smooth scroll (Lenis); Home, About, Technology Careers, Contact, FAQ, Privacy, and Terms pages are built and styled. The free career assessment opens as a modal from every marketing CTA (18 questions with conditional branching, client-side only); submissions are logged, not delivered, until ADR-003 is wired. See `/reference/PRODUCT.md` roadmap section for the full Phase 1 page list and what's still outstanding.
```

Add a sentence after it:

```markdown
Phase 1 (marketing website) is underway. The Next.js scaffold is live with dark/light theming (`next-themes`) and smooth scroll (Lenis); Home, About, Technology Careers, Contact, FAQ, Privacy, and Terms pages are built and styled. The free career assessment opens as a modal from every marketing CTA (18 questions with conditional branching, client-side only); submissions are logged, not delivered, until ADR-003 is wired. See `/reference/PRODUCT.md` roadmap section for the full Phase 1 page list and what's still outstanding. A mock AI blueprint-generation service produces a full career-match data contract (`lib/blueprint/`, `services/ai/mock/`) after the assessment completes, and Google sign-in via Cognito (`services/auth/`, `infra/`) is required immediately after — the assessment flow's `signup` stage, before the confirmation screen.
```

- [ ] **Step 5: Verify by reading the diffs**

```bash
git diff reference/ADRS.md reference/ARCHITECTURE.md CLAUDE.md
```

Expected: only the intended lines changed, no stray formatting breaks in the surrounding markdown tables.

---

## Final verification (after all tasks)

When told to commit:

```bash
npx tsc --noEmit
npm run lint
npm run build
git status --short
```

Fix anything that surfaces, then stage and commit as one unit, same as sub-project #1. The live Google sign-in click-through still needs the user to have completed Task 1's external setup (Google Console + `cdk deploy`) and populated `.env.local` from the real stack outputs — that verification happens after this plan's code is done, not as part of any task here.
