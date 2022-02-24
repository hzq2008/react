import request from '@/utils/request';
import type { TempLogParams } from './data.d';
/**
 * 获取供应商列表接口
 */
export async function getCategoryList() {
  return request('/ctl/v1/supplier/list', {
    method: 'GET',
  }).then((res: any) => ({
    data: res,
    success: true,
  }));
}

/**
 * 获取商品申请记录列表接口
 * @param {supplier_id} 上级ID
 * @param {status} 状态（0拒绝，1通过）
 * @param {action} 动作（-1新建，1内容编辑，2申请上架，3申请下架，4新建，5减少库存）
 * @param {start} 开始时间
 * @param {end} 结束时间
 * @returns
 */
export async function queryTempLog(params: TempLogParams) {
  return request('/ctl/v1/product/record', {
    method: 'GET',
    params,
  }).then((res: any) => ({
    data: res.list,
    success: true,
    total: res.total,
  }));
}
