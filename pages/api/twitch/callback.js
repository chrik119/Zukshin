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
        res.redirect('http://localhost:3000/?a=auth_fail');
      }

      setCookie('token', info.token, { req, res });
      console.log(`Set Cookie`);
      res.redirect('http://localhost:3000/dashboard');
    })(req, res, next);
  } catch (err) {
    console.log(`Callback Error: ${err}`);
    res.redirect('/');
  }
};
