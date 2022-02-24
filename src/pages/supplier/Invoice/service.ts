import request from '@/utils/request';
import type { TableListParams } from './data.d';

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
 * 获取发货单列表接口
 * @param {current} 当前页数（默认为1）
 * @param {pageSize} 每页显示条数（默认为10）
 * @param {keyword} 检索关键字
 * @param {supplier_id} 供货商ID
 * @param {delivery_status} 订单状态（-2拒绝拒发申请，-1申请拒发，0未发货，1已发货，2拒发，3已完成）
 * @param {start} 开始时间
 * @param {end} 结束时间
 * @param {sorter} 排序规则
 * @returns
 */
export async function queryInvoiceList(params: TableListParams) {
  return request('/ctl/v1/invoice/search', {
    method: 'GET',
    params,
  }).then((res: any) => {
    return {
      data: res.list,
      success: true,
      total: res.total,
    };
  });
}
