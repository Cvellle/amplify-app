import { defineAuth } from '@aws-amplify/backend';

/**
 * Auth resource — Amazon Cognito User Pool
 * Users sign up / sign in with email + password.
 * Email verification is required before first login.
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  userAttributes: {
    preferredUsername: {
      mutable: true,
      required: false,
    },
  },
});
