import passport from 'passport';
import connect from '../../../lib/database';
import '../../../lib/passport';

export default async (req, res, next) => {
  await connect();
  passport.authenticate('twitch')(req, res, next);
};
