/**
 * 草稿列表项
 * @param {name} 用户名称
 * @param {product_count} 上架商品数量
 * @param {product_min_count} 库存少于100的上架商品数量
 * @param {product_temp_count} 正在审批的商品数量
 * @param {order_count} 等待发货的商品数量
 
 */
export type userHome = {
  name: string;
  product_count: number;
  product_min_count: number;
  product_temp_count: number;
  order_count: number;
};
