import request from '@/utils/request';
import type { queryCurrentResponse } from './data.d';

export async function query(): Promise<any> {
  return request('/api/users');
}

export async function queryCurrent(): Promise<queryCurrentResponse> {
  return request('/ctl/v1/info', {
    method: 'POST',
  }).then((res) => ({
    ...res,
    userid: res.admin_id,
  }));
}

export async function queryMenuList(): Promise<any> {
  return request('/ctl/v1/menu/list').then((res) => [...res]);
}

export async function queryNotices(): Promise<any> {
  return request('/api/notices');
}
