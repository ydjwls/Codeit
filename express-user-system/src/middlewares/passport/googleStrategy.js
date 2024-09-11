import GoogleStrategy from 'passport-google-oauth20';

import userService from '../../services/userService.js';

const googleStrategyOptions = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
};

async function verify(accessToken, refreshToken, profile, done) {
  const user = await userService.oauthCreateOrUpdate(
    profile.provider,
    profile.id,
    profile.emails[0].value,
    profile.displayName
  );
  done(null, user);
}

const googleStrategy = new GoogleStrategy(googleStrategyOptions, verify);

export default googleStrategy;