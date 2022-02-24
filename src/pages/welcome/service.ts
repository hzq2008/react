import request from '@/utils/request';
// import type { userHome } from './data.d';

/**
 * 后台首页接口
 */
export async function getUserhome() {
  return request('/supplier/v1/user/home', {
    method: 'GET',
  });
}
