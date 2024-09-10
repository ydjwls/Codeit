import passport from 'passport';
import localStrategy from '../middlewares/passport/localStrategy.js';
import userRepository from '../repositories/userRepository.js';

passport.use(localStrategy);

passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id, done) => {
    try {
      // id를 이용해 사용자 정보를 조회
      const user = await userRepository.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

export default passport;