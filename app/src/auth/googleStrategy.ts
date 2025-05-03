import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

const clientID = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (!clientID || !clientSecret) {
  console.warn('⚠️ Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET — Google OAuth will not work');
} else {
  passport.use(new GoogleStrategy(
    {
      clientID,
      clientSecret,
      callbackURL: '/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => done(null, profile)
  ));
}
