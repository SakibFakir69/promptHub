




import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { User } from '../../modules/users/user.model';
import { IUser } from '../../modules/users/user.interface';



passport.use(new GoogleStrategy({


  // google cloud 

    clientID:process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,

    callbackURL: "/auth/google/callback"
  },

  // handel user 
  async(accessToken, refreshToken, profile, done)=> {

    try {

      // use check 

      /// email
      // check user have email or not
      if(!profile?.emails || profile.emails.length==0) 
      {
        return done(null,false,{message:"Please provide user email"})


      }

      const userEmail = profile?.emails[0]?.value;

      const exitingUsers = await User.findOne({email:userEmail});

      // if user exit with email 
      if(exitingUsers)
      {
        return done(null, exitingUsers);
      }

      // if user not have in db
    

      // create user 

        const newUser =   User.create({
          name: profile.displayName,
          email: userEmail,
          avatar: profile.photos?.[0]?.value || null, // optional
          // provider: "google", // optional
        });

       
       return done(null, newUser);
      
    } catch (error) {
      
      return done(error)
      
    }

   
  }
));


  passport.serializeUser((user, done) => {
    done(null, (user as IUser)._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
