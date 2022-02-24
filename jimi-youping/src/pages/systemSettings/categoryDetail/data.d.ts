export type getOrderDeliveryResponse = {
  /** ID */ id: string | number;
  /** 名称 */ name: string;
  /** 状态（0正常，1禁用） */ disabled: 0 | 1;
  /** 排序 */ sort: number;
  /** 分类图（预留）） */ img_url: string;
  /** 上级ID */ pid: string;
  /** 上级名称 */ p_name: string;
  cate_id: string[];
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

export type saveParams = {
  /** 分类ID（更新时必须） */ id?: number;
  /** 名称 */ name?: string;
  /** 状态（0正常，1禁用 */ disabled: 0 | 1;
  /** 上级ID */ pid: number;
  sort?: string;
};
