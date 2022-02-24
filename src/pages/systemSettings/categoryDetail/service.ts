import request from '@/utils/request';
import type { getOrderDeliveryResponse, saveParams } from './data.d';

// 获取快递列表
export async function getExpressList() {
  return request('/public/v1/express/list');
}

// 获取商品分类信息接口
export async function getCategoryInfo(id: string | number) {
  return request<getOrderDeliveryResponse>('/ctl/v1/category/info', {
    method: 'GET',
    params: {
      id,
    },
  });
}

// 获取分类列表
export async function getCategoryList(pid: string) {
  return request('/public/v1/category/list', {
    params: {
      pid,
    },
  });
}

// 保存分类接口
export async function saveCategory(data: saveParams) {
  return request('/ctl/v1/category/save', {
    method: 'POST',
    data,
  });
}

// 删除分类接口
export async function delCategory(id: string | number) {
  return request('/ctl/v1/category/del', {
    method: 'POST',
    data: {
      id,
    },
  });
}
