import userRepository from '../repositories/userRepository.js';

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

export default {
    verifySessionLogin,
}