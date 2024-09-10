import userRepository from '../repositories/userRepository.js';

import { expressjwt } from 'express-jwt';
import reviewRepository from '../repositories/reviewRepository.js';

const verifyAccessToken = expressjwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
});

const verifyRefreshToken = expressjwt({
    secret: process.env.JWT_SECRET, 
    algorithms: ['HS256'],
    getToken: (req) => req.cookies.refreshToken,
});

function throwUnauthorizedError() {
    // 인증되지 않은 경우 401 에러를 발생시키는 함수 
    const error = new Error('Unauthorized');
    error.code = 401;
    throw error;
}

async function verifySessionLogin(req, res, next) {
    // 세션에서 사용자 정보를 읽어옴 
    try {
        const { userId } = req.session;

        if (!userId) {
            // 로그인되어있지 않으면 인증 실패 
            throwUnauthorizedError();
        }

        const user = await userRepository.findById(req.session.userId);

        if (!user) {
            throwUnauthorizedError();
        }

        // 이후 편리성을 위한 유저 정보 전달 
        req.user = {
            id: req.session.userId,
            email: user.email,
            name: user.name,
            provider: user.provider,
            providerId: user.providerId,
        };
        // 사용자가 로그인되어 있다면 다음 미들웨어 처리 
        next();
    } catch (error) {
        next(error);
    }
}

async function verifyReviewAuth(req, res, next) {
    const { id: reviewId } = req.params;
    try {
        const review = await reviewRepository.getById(reviewId);

        if (!review) {
            const error = new Error('Review not found');
            error.code = 404;
            throw error;
        }

        if (review.authorId !== req.auth.userId) {
            const error = new Error('Forbidden');
            error.code = 403;
            throw error;
        }

        return next();
    } catch (error) {
        return next(error);
    }
}

export default {
    verifySessionLogin,
    verifyAccessToken,
}