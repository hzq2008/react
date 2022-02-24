import request from '@/utils/request';
import type { TableListParams } from './data.d';

/**
 * 列表param
 * @param {current} 当前页数（默认为1）
 * @param {pageSize} 每页显示条数（默认为10）
 * @param {service_id} 客服ID
 * @param {keyword} 检索关键字
 * @param {start} 开始时间
 * @param {end} 结束时间
 * @param {disabled} 状态（0正常，1禁用，不传则全部）
 * @returns
 */
export async function queryProductTempList(arg: TableListParams) {
  const params: TableListParams = {
    current: arg.current,
    pageSize: arg.pageSize,
    service_id: arg.service_id,
    name: arg.name,
    start: arg.start,
    end: arg.end,
    disabled: arg.disabled,
    sorter: arg.sorter,
    filter: arg.filter,
  };

  return request('/ctl/v1/supplier/search', {
    method: 'GET',
    params,
  }).then((res: any) => {
    return {
      data: res?.list,
      success: true,
      total: res.total,
    };
  });
}
