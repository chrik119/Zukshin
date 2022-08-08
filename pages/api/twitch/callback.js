import { setCookie } from 'cookies-next';
import passport from 'passport';
import connect from '../../../lib/database';
import '../../../lib/passport';

export default async (req, res, next) => {
  try {
    await connect();
    passport.authenticate('twitch', (err, user, info) => {
      if (err || !user) {
        console.error(err);
        res.redirect(`${process.env.BASE_URL}/?a=auth_fail`);
      }

      setCookie('token', info.token, { req, res });
      res.redirect(`${process.env.BASE_URL}/dashboard`);
    })(req, res, next);
  } catch (err) {
    console.log(`Callback Error: ${err}`);
    res.redirect('/');
  }
};
