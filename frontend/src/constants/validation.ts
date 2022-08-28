export const NICKNAME = {
  ERROR_MESSAGE: '첫자 영문, 숫자 조합 10자 이하로 입력해주세요.',
  REGEX: /^[a-zA-Z]{1}[a-z0-9]{1,9}$/,
};

export const PASSWORD = {
  ERROR_MESSAGE: '영문/특문/숫자 조합 16자 이하로 입력해주세요.',
  REGEX: /^[a-zA-Z\\d`~!@#$%^&*()-_=+]{1,16}$/,
};
