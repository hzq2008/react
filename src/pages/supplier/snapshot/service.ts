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
 * 列表接口
 * @param {current} 当前页数（默认为1）
 * @param {pageSize} 每页显示条数（默认为10）
 * @param {name} 检索关键字
 * @param {supplier_id} 上级ID
 * @param {cate_id} 分类ID
 * @param {allow_oversell} 是否超售
 * @param {start} 开始时间
 * @param {end} 结束时间
 * @param {on_shelf} 状态（0下架1上架，空不进行该字段检索）
 * @returns
 */
export async function queryProductTempList(arg: TableListParams) {
  const params: TableListParams = {
    current: arg.current,
    pageSize: arg.pageSize,
    name: arg.name,
    cate_id: arg.cate_id,
    supplier_id: arg.supplier_id,
    start: arg.start,
    end: arg.end,
    allow_oversell: arg.allow_oversell,
    on_shelf: arg.on_shelf,
    sorter: arg.sorter,
    filter: arg.filter,
  };
  return request('/ctl/v1/product/search', {
    method: 'GET',
    params,
  }).then((res: any) => {
    // const arr = res?.list.map((item: any) => {
    //   const a = item;
    //   if (a.category.length > 0) {
    //     a.category = a.category[a.category.length - 1];
    //   }
    //   return a;
    // });
    return {
      data: res?.list,
      success: true,
      total: res.total,
    };
  });
}
