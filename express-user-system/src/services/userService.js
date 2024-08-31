async function createUser(user) {
  // 1. 유저가 입력받은 이메일이 사용중인지 확인 
  const existedUser = await userRepository.findByEmail(user.email);

  // 만약 이메일이 사용 중이라면 회원가입 X 
  if (existedUser) {
    const error = new Error('User alrady exists');
    error.code = 422;
    error.data = { email: user.email };
    throw error; 
  }

  // 해싱 과정 추가 
  const hashedPassword = await hashingPassword(user.password); 
  // 2. 이메일이 사용중이 아니라면 입력받은 유저를 데이터베이스에 저장  
  // password 추가 
  const createdUser = await userRepository.save({ ...user, password: hashedPassword });
  // 새로 가입된 유저정보를 생성된 id와 함께 반환 
  // 이때, password와 같은 유저의 민감 정보는 반환 X => filterSensitiveUserData 
  return filterSensitiveUserData(createdUser);   
}

function filterSensitiveUserData(user) {
  const { password, ...rest } = user;
  return rest; 
}

// 로그인을 위해 이메일과 비밀번호로 유저를 찾는 메소드 정의 
async function getUser(email, password) {
  // 1. 유저가 입력한 email로 데이터베이스의 유저 데이터를 찾아온다. 
  const user = await userRepository.findByEmail(email);
  // 만일 유저가 존재하지 않는다면 401 Unauthorized 상태 코드와 함께 빈 리스폰스 반환
  if (!user) {
    const error = new Error('Unauthorized');
    error.code = 401;
    throw error;
  }
  // 2. 데이터베이스에 저장된 password와 입력받은 password 비교 - verifyPassword 
  verifyPassword(password, user.password);
  // 일치하면 찾은 유저 반환 (민감한 정보 반환 X)
  return filterSensitiveUserData(user);  
}

// 해싱된 비밀번호를 고려한 로그인 시도를 구현 
async function verifyPassword(inputPassword, savedpassword) {
  const isValid = await bcrypt.compare(inputPassword, savedpassword);  // 변경 
  // 일치하지 않는다면 401 Unauthorized 상태 코드와 함께 빈 리스폰스 반환 
  if (!isValid) {
    const error = new Error('Unauthorized');
    error.code = 401;
    throw error; 
  }
}

export default {
  createUser,
  getUser,
};
