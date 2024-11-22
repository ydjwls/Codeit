import express from 'express';

const userRouter = express.Router();

userRouter.get('/', (req, res, next) => {
  res.json({ message: 'User 목록 보기' });
});

export default userRouter;