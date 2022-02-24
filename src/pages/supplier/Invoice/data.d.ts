/**
 * 快照列表项
 * @param {id} 发货订单ID
 * @param {order_sn} 发货订单号
 * @param {order_id} 总订单ID
 * @param {total_price} 订单总金额（未扣除退款部分）
 * @param {refund_price} 退款金额
 * @param {add_time} 下单时间
 * @param {close_time} 关闭订单时间
 * @param {delivery_shipping_company} 物流名称
 * @param {delivery_shipping_id} 物流单号
 * @param {delivery_status} 发货状态（-2拒绝拒发申请，-1申请拒发，0未发货，1已发货，2拒发，3已完成）
 * @param {product_num} 商品数量
 * @param {reason} 拒发原因
 * @param {total_supplier_price} 当前发货单供应商商品总价
 * @param {total_price} 当前发货单平台商品总价
 * @param {seller_info} 销售渠道信息
 * @param {seller_info.id} 销售ID
 * @param {seller_info.name} 销售名称
 * @param {supplier_info} 供应商信息
 * @param {supplier_info.id} 供应商ID
 * @param {supplier_info.name} 供应商名称
 * @param {father_order_sn} 父单号
 */
export type TableListItem = {
  id: number;
  order_sn: string;
  order_id: string;
  total_price: string;
  refund_price: string;
  supply_price: string;
  add_time: string;
  close_time: string | number;
  delivery_shipping_company: string;
  delivery_shipping_id: string;
  delivery_status: string | number;
  product_num: number;
  reason: string;
  total_supplier_price: string | number;
  total_price: string | number;
  father_order_sn: string;
  seller_info: {
    id: number | string;
    name: string;
  };
  supplier_info: {
    id: number | string;
    name: string;
  };
};

/**
 * 列表param
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
export type TableListParams = {
  current?: number;
  pageSize?: number;
  keyword?: string;
  supplier_id?: string | number;
  delivery_status?: string | number;
  start?: string;
  end?: string;
};
