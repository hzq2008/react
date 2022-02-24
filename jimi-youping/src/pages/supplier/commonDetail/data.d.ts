// 草稿新增接口
/**
 * name: 草稿名称;
 * sku: 草稿sku;
 * thumb_url: 草稿图片;
 * cate_id?: 商品分类（最下级id）;
 * stock: 库存;
 * product_id?: 商品id（新建商品id为0 商品修改时传入）;
 * sort?: 排序（值越大越靠前）;
 * allow_oversell: 是否允许超售（0不允许 1允许）;
 * check_status: 审核状态（0未发布 1发布）;
 * description?: 富文本详情;
 * supply_price: 供货价;
 * summary?: 草稿简介;
 * gallery_urls?: 轮播图;
 * product_label?: 标签;
 * delivery_address?:限制地址
 * product_sale?: 满减活动
 * deliver_time_out?:限时发货
 */
export interface TableParams {
  name: string;
  sku: string | number;
  thumb_url: string;
  cate_id?: string | number;
  stock: number;
  product_id?: string | number;
  sort?: number;
  allow_oversell: number;
  check_status: number;
  description?: string;
  supply_price: number | string;
  summary?: string;
  gallery_urls?: string[];
  product_label?: string[];
  delivery_address?: any;
  product_sale?: any[];
  deliver_time_out: string | number;
}

// 审核商品草稿信息接口
/**
 * id：草稿id
 * status: 审核状态（1通过，0未通过）
 * remake: 未通过原因（status为0时必须）
 * name: 草稿名称;
 * sku: 草稿sku;
 * thumb_url: 草稿图片;
 * cate_id?: 商品分类（最下级id）;
 * stock: 库存;
 * product_id?: 商品id（新建商品id为0 商品修改时传入）;
 * sort?: 排序（值越大越靠前）;
 * allow_oversell: 是否允许超售（0不允许 1允许）;
 * description?: 富文本详情;
 * supply_price: 供货价;
 * summary?: 草稿简介;
 * gallery_urls?: 轮播图;
 * product_label?: 标签;
 * delivery_address?:限制地址
 * product_sale?: 满减活动
 * deliver_time_out?:限时发货
 */
export interface ReviewDetail {
  id: number;
  status: string | number;
  remake?: string;
  name: string;
  sku: string | number;
  thumb_url: string;
  cate_id?: string | number;
  stock: number;
  product_id?: string | number;
  sort?: number;
  allow_oversell: number;
  check_status: number;
  description?: string;
  supply_price: number | string;
  summary?: string;
  gallery_urls?: string[];
  product_label?: string[];
  delivery_address?: any[];
  product_sale?: any[];
  deliver_time_out?: number | string;
}

// 草稿详情
/**
 * id：草稿id
 * name: 草稿名称;
 * sku: 草稿sku;
 * thumb_url: 草稿图片;
 * cate_id?: 商品分类（最下级id）;
 * stock: 库存;
 * product_id?: 商品id（新建商品id为0 商品修改时传入）;
 * sort?: 排序（值越大越靠前）;
 * allow_oversell: 是否允许超售（0不允许 1允许）;
 * check_status: 审核状态（0未发布 1发布）;
 * description?: 富文本详情;
 * supply_price: 供货价;
 * summary?: 草稿简介;
 * gallery_urls?: 轮播图;
 * product_label?: 标签;
 * delivery_address?:限制地址
 * product_sale?: 满减活动
 * deliver_time_out?:限时发货
 * check_type :提交类型（1内容编辑，2申请上架，3申请下架，4新建，5减少库存）
 */
export interface Details {
  id: number;
  name: string;
  sku: string;
  thumb_url: string;
  cate_id: string[];
  stock: number;
  product_id?: number;
  sort?: number;
  allow_oversell: number;
  check_status?: number;
  description: string;
  supply_price: string;
  summary: string;
  gallery_urls: string[];
  product_label: string[];
  category: any[];
  check_type: string | number;
  delivery_address: any[];
  deliver_time_out: string | number;
  product_sale: any[];
  pending_confirm_count?: string | number;
  pending_deliver_count?: string | number;
}

// 快照删减库存 操作类型（0表示直接更改stock，1表示添加stock，2表示减少stock，默认0）
export interface minusStock {
  id: number | string;
  stock: number | string;
  type: 0 | 1 | 2;
}

// 快照增加库存
export type addStock = {
  id: number | string;
  stock: number | string;
};

// 快照修改接口
/**
 * id：商品ID（更新时必须）
 * name: 草稿名称;
 * supplier_id: 供应商ID（更新时必须）
 * sku: 草稿sku;
 * thumb_url: 草稿图片;
 * cate_id?: 商品分类（最下级id）;
 * stock: 库存;
 * allow_oversell: 是否允许超售（0不允许 1允许）;
 * description?: 富文本详情;
 * supply_price: 供货价;
 * summary?: 草稿简介;
 * gallery_urls?: 轮播图;
 * product_label?: 标签;
 * delivery_address?:限制地址
 * product_sale?: 满减活动
 * deliver_time_out?:限时发货
 * on_shelf :商品上下架（0下架，1上架）
 *
 */
export interface snapshotDetailsParams {
  id: number;
  name?: string;
  sku?: string;
  supplier_id?: string;
  thumb_url?: string;
  cate_id?: string[];
  stock?: number;
  product_id?: number;
  on_shelf?: 0 | 1;
  allow_oversell?: number;
  description?: string;
  supply_price?: string;
  summary?: string;
  gallery_urls?: string[];
  product_label?: string[];
  category?: any[];
  delivery_address?: any[];
  deliver_time_out?: string | number;
  product_sale?: any[];
  // pending_confirm_count?: string | number;
  // pending_deliver_count?: string | number;
}
