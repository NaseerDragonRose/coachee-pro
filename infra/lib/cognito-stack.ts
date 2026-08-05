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
