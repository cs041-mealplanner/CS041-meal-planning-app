import { defineAuth, secret } from '@aws-amplify/backend';

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
    externalProviders: {
      google: {
        clientId: secret('GOOGLE_CLIENT_ID'),
        clientSecret: secret('GOOGLE_CLIENT_SECRET'),
      },
      facebook: {
        clientId: secret('FACEBOOK_CLIENT_ID'),
        clientSecret: secret('FACEBOOK_CLIENT_SECRET'),
      },
      callbackUrls: [
        'http://localhost:5173/login',
        'https://main.d2hvbdc7xxhqmv.amplifyapp.com/login',
      ],
      logoutUrls: [
        'http://localhost:5173/',
        'https://main.d2hvbdc7xxhqmv.amplifyapp.com/',
      ],
    },
  },
});
