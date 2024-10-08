import express from 'express';
import userService from '../services/userService.js';

import passport from '../config/passport.js';

const userController = express.Router();

// 유저 생성인, POST 메소드에 경로는 /users
userController.post('/users', async (req, res, next) => {
    try {
        // createUser 메소드를 실행하여 반환하는 유저 정보를 리스폰스로 돌려주기 
        const user = await userService.createUser(req.body);
        return res.status(201).json(user);
    } catch (error) {
        next(error);
    }
});

// 로그인 POST 메소드에 경로는 /login 
userController.post('/login', async (req, res, next) => {
    const { email, password } = req.body;
    try {
        // getUser 메소드를 실행하여 반환하는 유저 정보를 리스폰스로 돌려주기 
        const user = await userService.getUser(email, password);
        const accessToken = userService.createToken(user);
        const refreshToken = userService.createToken(user, 'refresh'); // 추가
        await userService.updateUser(user.id, { refreshToken }); // 추가 
        // Cookie를 통해 브라우저로 Refresh Token 전달하기 
        res.cookie('refreshToken', refreshToken, { // 추가 
            httpOnly: true,
            sameSite: 'none',
            secure: true
        });
        return res.json({ accessToken, refreshToken });  // 변경
    } catch (error) {
        next(error);
    }
});

// 세션 로그인에 대한 컨트롤러 작성 

/*
userController.post('/session-login', async (req, res, next) => {
    const { email, password } = req.body

    try {
        const user = await userService.getUser(email, password);
        req.session.userId = user.id;
        return res.json(user);
    } catch (error) {
        next(error);
    }
});
*/

userController.post('/session-login',
    passport.authenticate('local'),
    async (req, res, next) => {
      const user = req.user;
      return res.json(user);
});

userController.post('/token/refresh',
    auth.verifyRefreshToken,
    async (req, res, next) => {
        try {
            const { refreshToken } = req.cookies;
            const { userId } = req.auth;
            const { accessToken, newRefreshToken } = await userService.refreshToken(userId, refreshToken); // 변경 
            await userService.updateUser(userId, { refreshToken: newRefreshToken }); // 추가
            res.cookie('refreshToken', newRefreshToken, { // 추가 
                httpOnly: true,
                sameSite: 'none',
                secure: true,
            });
            return res.json({ accessToken });
        } catch (error) {
            return next(error); 
        }
    }
);

userController.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

userController.get('/auth/google/callback',
    passport.authenticate('google'),
    (req, res, next) => {
      const { id } = req.user;
      const accessToken = userService.createToken(id);
      const refreshToken = userService.createToken(id, 'refresh');
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      });
      return res.json({ accessToken });
    }
);

export default userController;
