import request from '@/utils/request';

import type { getOrderListRequest, getOrderListResponse, getOrderDeliveryRequest } from './data.d';

export async function getOrderList(arg: getOrderListRequest /* sorter, filter */) {
  const params: getOrderListRequest = {
    current: arg.current,
    pageSize: arg.pageSize,
    pid: arg.pid,
    start: arg.start,
    end: arg.end,
    sorter: arg.sorter,
    keyword: arg.keyword,
    name: arg.name,
  };

  return request<getOrderListResponse>('/ctl/v1/category/search', {
    params,
  }).then((res) => {
    return {
      success: true,
      data: res.list,
      total: res.total,
    };
  });
}

export async function getOrderDelivery(params: getOrderDeliveryRequest) {
  return request('/supplier/v1/order/delivery', {
    params,
  });
}
