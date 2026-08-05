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
