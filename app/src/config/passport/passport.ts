/* eslint-disable no-undef */



import dotenv from 'dotenv'
dotenv.config();

import passport from 'passport';

import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { User } from '../../modules/users/user.model';

console.log(process.env.GOOGLE_CLIENT_SECRET)
console.log(process.env.GOOGLE_CLIENT_ID)

passport.use(new GoogleStrategy({


  // google cloud 

    clientID:process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,

    callbackURL: "http://localhost:5000/api/v1/auth/google/callback"

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
      console.log(exitingUsers ," user ")

      // if user exit with email 
      if(exitingUsers)
      {
        return done(null, exitingUsers.toObject({virtuals:true}));
        // virtual true add for req.user , create vitula ( id )
      }

      // if user not have in db
    

      // create user 

        const newUser = await  User.create({
          name: profile.displayName,
          email: userEmail,
          avatar: profile.photos?.[0]?.value || null, // optional
          // provider: "google", // optional
          googleId:profile.id
        });
        console.log(newUser , " new user")

       
       return done(null, newUser);
      
    } catch (error) {
      
      return done(error)
      
    }

   
  }
));


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  passport.serializeUser((user:any, done) => {
    done(null, user?._id );
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
