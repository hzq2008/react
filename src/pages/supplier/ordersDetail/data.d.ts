export type getOrderDeliveryResponse = {
  /** 订单id */ id: string | number;
  /** 订单号 */ order_sn: string;
  /** 总价 */ price: number;
  /** 运费 */ delivery_price: number;
  /** 物流公司id */ express_id: number;
  /** 状态（-2拒绝拒发申请，-1申请拒发，0待发货，1已发货，2拒发，3已完成） */ delivery_status: number;
  /** 物流单号 */ delivery_shipping_id: string;
  /** 物流信息 */ delivery_detail: string[];
  /** 父单号 */ father_order_sn: string;
  /** 地址信息 */
  address: {
    /** 客户名称 */ receiver_name: string;
    /** 客户电话 */ receiver_phone: string;
    /** 国家 */ nation: string;
    /** 省份 */ province: string;
    /** 市 */ city: string;
    /** 区 */ district: string;
    /** 详细地址 */ detail: string;
  };

  /** 商品信息 */
  product_detail: {
    /** 商品id */ id: number;
    /** 商品名称 */ name: string;
    /** 商品数量 */ num: number;
    /** 商品sku */ sku: string;
    /** 商品图片 */ thumb_url: string;
  }[];
};

export type refuseExp = {
  /** 拒发理由 */ reason: string;
  /** 订单id */ ids: string | string[];
};

export type refuseRew = {
  /** 拒发理由 */ remake?: string;
  /** 审核状态（0拒绝，1通过） */ status: 0 | 1;
  /** 订单id */ ids: string | string[];
};

export type invoice = {
  /** 发货单ID */ id: string | number;
  /** 快递单号 */ delivery_id?: string | number;
  /** 快递公司ID */ express_id?: string | number;
  address: {
    /** 客户名称 */ name: string;
    /** 客户电话 */ phone: string;
    /** 国家 */ nation?: string;
    /** 省份 */ province: string;
    /** 市 */ city: string;
    /** 区 */ district: string;
    /** 详细地址 */ detail: string;
  };
};
