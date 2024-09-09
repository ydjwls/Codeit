import express from 'express';
import userService from '../services/userService.js';

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
        return res.json({ accessToken });
    } catch (error) {
        next(error);
    }
});

// 세션 로그인에 대한 컨트롤러 작성 
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

export default userController;
