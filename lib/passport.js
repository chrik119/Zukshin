import passport from 'passport';
import { Strategy as TwitchStrategy } from '@d-fischer/passport-twitch';
import User from '../models/User';
import Task from '../models/Task';
import jwt from 'jsonwebtoken';

passport.use(
  'twitch',
  new TwitchStrategy(
    {
      clientID: process.env.TWITCH_CLIENT_ID,
      clientSecret: process.env.TWITCH_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/api/twitch/callback',
      scope: 'user_read',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const obj = await User.findOne({ userId: profile.id });
        if (!obj) {
          // create new user
          const newUser = new User({
            userId: profile.id,
            displayName: profile.display_name,
            accessToken,
          });
          await newUser.save();
          const newUserTask = new Task({
            task: 'newUser',
            args: [profile.display_name],
          });
          await newUserTask.save();
          const token = await jwt.sign(
            {
              id: newUser._id,
              created: Date.now().toString(),
            },
            process.env.JWT_SECRET
          );
          newUser.tokens.push(token);
          await newUser.save();
          done(null, newUser, { message: 'Auth successful', token });
        } else {
          // login existing user
          const token = await jwt.sign(
            {
              id: obj._id,
              created: Date.now().toString(),
            },
            process.env.JWT_SECRET
          );
          obj.tokens.push(token);
          await obj.save();
          done(null, obj, { message: 'Auth successful', token });
        }
      } catch (err) {
        console.error(err);
        done(err, false, { message: 'Internal server error' });
      }
    }
  )
);
