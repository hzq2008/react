import request from '@/utils/request';
import type { getOrderDeliveryResponse, refuseExp, refuseRew, invoice } from './data.d';

// 获取快递列表
export async function getExpressList() {
  return request('/public/v1/express/list');
}

// 获取发货详情接口
export async function getOrderDeliveryDetail(id: string | number) {
  return request<getOrderDeliveryResponse>('/ctl/v1/invoice/info', {
    method: 'GET',
    params: {
      id,
    },
  });
}

// 拒绝发货接口
export async function refuseDelivery(params: refuseExp) {
  return request('/ctl/v1/invoice/refuse/delivery', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// 审核拒绝发货接口
export async function refuseReview(params: refuseRew) {
  return request('/ctl/v1/invoice/refuse/review', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
// 修改发货单接口
export async function invoiceDelivery(params: invoice) {
  return request('/ctl/v1/invoice/delivery', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
/**
 * 省市区接口
 */
export async function getCityList() {
  return request('/public/v1/address/list', {
    method: 'GET',
  });
}
