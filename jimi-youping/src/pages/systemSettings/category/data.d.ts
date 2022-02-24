export interface TableListParams extends getOrderListRequest {
  pageSize?: number;
  current?: number;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
}

export type getOrderListRequest = {
  /** 当前页数 */ current?: number; // 默认为1
  /** 每页显示条数 */ pageSize?: number; // 默认为10
  /** 开始时间 */ start?: string;
  /** 结束时间 */ end?: string;
  /** 上级ID */ pid?: string;
  /** 状态（0正常1禁用，空不进行该字段检索） */ disabled?: 0 | 1;
  sorter?: Record<string, any>;
  keyword?: string;
  name?: string;
};
export type getOrderListResponse = {
  /** 数据总数 */ total: number;
  list: Order[];
};
export type Order = {
  /** ID */ id: number;
  /** 名称 */ name: string;
  /** 状态（0正常，1禁用 */ disabled: 0 | 1;
  /** 上级ID */ pid: number;
  /** 添加时间 */ add_time: string;
  /** 分类图（预留 */ img_url: string;
  /** 上级名称 */ p_name: string;

  sort: string;
};

export type getOrderDeliveryRequest = {
  /** 订单id */ id: number;
};
export type getOrderDeliveryResponse = {
  /** 订单号 */ order_sn: string;
  /** 总价 */ price: number;
  /** 运费 */ delivery_price: number;
  /** 物流公司id */ express_id: number;
  /** 状态（0未发货，1已发货，2拒发，3已完成） */ delivery_status: number;
  /** 物流单号 */ delivery_shipping_id: string;
  /** 物流信息 */ delivery_detail: string[];

  /** 地址信息 */
  address: {
    /** 客户名称 */ receiver_name: string;
    /** 客户电话 */ receiver_phone: string;
    /** 国家 */ nation: string;
    /** 省份 */ province: string;
    /** 市 */ city: string;
    /** 区 */ district: string;
    /** 详细地址 */ detail: string;
  }[];

  /** 商品信息 */
  product_detail: {
    /** 商品id */ id: number;
    /** 商品名称 */ name: string;
    /** 商品数量 */ num: number;
    /** 商品sku */ sku: string;
    /** 商品图片 */ thumb_url: string;
  }[];
};
