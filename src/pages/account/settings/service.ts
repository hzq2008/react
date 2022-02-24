import request from '@/utils/request';
import type { updatePasswordRequest } from './data.d';

export async function queryCurrent() {
  return request('/api/currentUser');
}

export async function queryProvince() {
  return request('/api/geographic/province');
}

export async function queryCity(province: string) {
  return request(`/api/geographic/city/${province}`);
}

export async function query() {
  return request('/api/users');
}

/** 修改密码接口 */
export async function updatePassword(data: updatePasswordRequest) {
  return request('/supplier/v1/admin/update/password', {
    method: 'POST',
    data,
  });
}
