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
