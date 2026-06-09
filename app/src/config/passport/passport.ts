import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../../modules/users/user.model';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: 'https://prompthub-2.onrender.com/api/v1/auth/google/callback',
    },

    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if profile has an email
        if (!profile?.emails || profile.emails.length === 0) {
          return done(null, false, { message: 'No email associated with this Google account' });
        }

        const userEmail = profile.emails[0].value;

        // Check if user already exists
        const existingUser = await User.findOne({ email: userEmail });

        if (existingUser) {
          return done(null, existingUser.toObject({ virtuals: true }));
        }

        
        const newUser = await User.create({
          name: profile.displayName,
          email: userEmail,
          avatar: profile.photos?.[0]?.value || null,
          googleId: profile.id,
        });

        return done(null, newUser.toObject({ virtuals: true }));

      } catch (error) {
        return done(error as Error);
      }
    }
  )
);