/**
 * 列表项
 * @param {id} 商品ID
 * @param {name} 商品名称
 * @param {sku} 商品sku
 * @param {thumb_url} 草稿图片
 * @param {cate_id} 草稿分类
 * @param {supply_price} 供应商价
 * @param {sort} 排序
 * @param {stock} 库存
 * @param {stock_minus} 减少库存量（当check_type为5时有效）
 * @param {summary} 待确认/待扣除数量
 * @param {cate_id} 分类ID
 * @param {cate_info} 分类信息
 * @param {supplier_info} 分类信息
 * @param {update_time} 更新时间
 * @param {deliver_time_out}发货时限
 */
export type TableListItem = {
  id: number;
  name: string;
  sku: string;
  thumb_url: string;
  cate_id: string | number;
  supply_price: string;
  sort: number;
  stock: number;
  update_time: string;
  summary: number;
  deliver_time_out: number;
  cate_info: Record<string, any[]>;
  supplier_info: {
    id: string | number;
    name: string;
  };
};

/**
 * 列表param
 * @param {current} 当前页数（默认为1）
 * @param {pageSize} 每页显示条数（默认为10）
 * @param {name} 检索关键字
 * @param {supplier_id} 上级ID
 * @param {product_id} 商品ID
 * @param {cate_id} 分类ID
 * @param {allow_oversell} 是否超售
 * @param {start} 开始时间
 * @param {end} 结束时间
 * @param {check_type} 修改类型（1常规修改，2申请撤下，3申请上架，4新建商品，5减库存）
 * @returns
 */
export type TableListParams = {
  current?: number;
  pageSize?: number;
  name?: string;
  supplier_id?: string | number;
  product_id?: string | number;
  cate_id?: string | number;
  allow_oversell?: string | number;
  check_type?: string | number;
  start?: string | number;
  end?: string | number;
  sorter?: any;
  filter?: any;
};
