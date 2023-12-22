import {passport} from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import config from '../config';

passport.use(
  new GoogleStrategy(
    {
      clientID: config.googleClientID || '',
      clientSecret: config.googleClientSecret || '',
      callbackURL: 'http://localhost:3500/auth/google/callback',
    },
    (accessToken, refreshToken, profile, cb) => {
        console.log(profile);
    }
  )
);
