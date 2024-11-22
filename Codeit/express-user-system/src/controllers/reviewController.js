import express from 'express';

import reviewService from '../services/reviewService.js';

const reviewController = express.Router();

reviewController.post('/', async (req, res, next) => {
  const { userId } = req.user;
  try {
    const createdReview = await reviewService.create({
      ...req.body,
      authorId: userId,
    });
    return res.status(201).json(createdReview);
  } catch (error) {
    return next(error);
  }
});

reviewController.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const review = await reviewService.getById(id);
    return res.json(review);
  } catch (error) {
    return next(error);
  }
});

reviewController.get('/', async (req, res, next) => {
  try {
    const reviews = await reviewService.getAll();
    return res.json(reviews);
  } catch (error) {
    return next(error);
  }
});

// 리뷰 수정 
reviewController.put('/:id', 
  // authMiddleware.verifyAccessToken,
  passport.authenticate('access-token', { session: false }), // 추가 
  authMiddleware.verifyReviewAuth,
  async (req, res, next) => {
    const { id: userId } = req.user; // 변경 
    try {
      const updatedReview = await reviewService.update(
        req.params.id,
        req.body,
      );
      return res.json(updatedReview);
    } catch (error) {
      return next(error);
    }
});

// 리뷰 삭제 
reviewController.delete('/:id', 
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyReviewAuth,
  async (req, res, next) => {
    try {
      const deletedReview = await reviewService.deleteById(req.params.id);
      return res.json(deletedReview);
    } catch (error) {
      return next(error);
    }
});

export default reviewController;
