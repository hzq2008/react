import request from '@/utils/request';

import passwordEncode from '../utils/passwordEncode';

export type LoginParamsType = {
  userName: string;
  password: string;
  mobile: string;
  captcha: string;
};

export async function fakeAccountLogin(params: LoginParamsType) {
  const obj = passwordEncode(params.password);

  return request('/ctl/v1/login', {
    method: 'POST',
    data: {
      /** 登录类型（account表示账号 */ type: 'account',
      /** 账号 */ account: params.userName,
      /** 登录密码 */ password: obj.code,
      /** 加密时间 */ timestamp: obj.time,
    },
  });
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
