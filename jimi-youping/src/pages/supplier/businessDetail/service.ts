import request from '@/utils/request';
import type { updatePramas } from './data.d';

/**
 * 编辑供应商接口（非超管只返回绑定相关数据）
 */
export async function supplierUpdate(data: updatePramas) {
  return request('/ctl/v1/supplier/update', {
    method: 'POST',
    data,
  });
}

/**
 * 获取供应商详情接口（非超管只返回绑定相关数据）
 * @param {id} 供应商ID
 * @returns
 */
export async function queryBusinessInfo(id: string) {
  return request('/ctl/v1/supplier/info', {
    method: 'GET',
    params: {
      id,
    },
  });
}
