/**
 * 草稿列表项
 * @param {id} 草稿id
 * @param {name} 草稿名称
 * @param {sku} 草稿sku
 * @param {thumb_url} 草稿图片
 * @param {cate_id} 草稿分类
 * @param {supply_price} 供货价
 * @param {add_time} 申请时间
 * @param {update_time} 修改时间
 * @param {check_status} 审核状态（0未提交审核 1已提交）
 * @param {check_type} 审核类型（1常规 2下撤 3恢复 4新建）
 * @param {category} 分类数据
 */
export type TableListItem = {
  id: number;
  name: string;
  sku: string;
  thumb_url: string;
  cate_id: string;
  supply_price: string;
  add_time: string;
  update_time: string;
  check_status: number;
  check_type: number;
  category: Record<string, any[]>;
};

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
export type TableListParams = {
  current?: number;
  pageSize?: number;
  service_id?: number;
  keyword?: string;
  start?: string;
  end?: string;
  disabled?: string | number;
  sorter?: any;
  filter?: any;
  name?: string;
};
