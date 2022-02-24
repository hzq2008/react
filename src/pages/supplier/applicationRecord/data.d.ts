export type TempLogParams = {
  start_time?: string;
  end_time?: string;
  pageSize?: number;
  current?: number;
};

export type TempLogItem = {
  id: number;
  supplier_id: string | number;
  add_time: string;
  status: string | number;
  action: string | number;
  sub_order_id: string | number;
  product_id: string | number;
  supplier_info: {
    id: string | number;
    name: string;
  };
};
