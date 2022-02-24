/**
 * 详情返回字段
 * @param {id} ID
 * @param {name} 名称
 * @param {disabled} 状态（0正常，1禁用）
 * @param {add_time} 添加时间
 * @param {supply_price_factor} 提价比
 * @param {supplier_admin_id} 账号ID
 * @param {username} 账号
 * @param {total_sale_product} 在售商品数
 * @param {total_pending_review} 待审核商品数
 * @param {total_pending_delivery} 待发货商品数
 * @returns
 */
export type Details = {
  id: string | number;
  name: string;
  disabled: string | number;
  add_time: string;
  supply_price_factor: string;
  supplier_admin_id: string;
  username: string;
  total_sale_product: string;
  total_pending_review: string;
  total_pending_delivery: string;
};

/**
 * 更新供应商params
 * @param {id} ID
 * @param {name} 名称
 * @param {disabled} 状态（0正常，1禁用）
 * @param {add_time} 添加时间
 * @param {supply_price_factor} 提价比
 * @param {supplier_admin_id} 账号ID
 * @param {username} 账号
 * @param {password} 密码
 * @param {en_password} 确认密码（必须与password字段同用）
 * @returns
 */
export type updatePramas = {
  id: string | number;
  name?: string;
  disabled?: 0 | 1;
  supply_price_factor?: string;
  supplier_admin_id?: string;
  username?: string;
  password?: string;
  en_password?: string;
};
