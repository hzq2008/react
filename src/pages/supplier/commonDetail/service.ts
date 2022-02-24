import request from '@/utils/request';
import type {
  TableParams,
  minusStock,
  addStock,
  snapshotDetailsParams,
  ReviewDetail,
} from './data.d';

/**
 * 分类插件接口
 */
export async function getCategoryList() {
  return request('/public/v1/category/list', {
    method: 'GET',
  }).then((res: any) => ({
    data: res,
    success: true,
  }));
}

/**
 * 省市区接口
 */
export async function getCityList() {
  return request('/public/v1/address/list', {
    method: 'GET',
  });
}

/**
 * 标签列表接口
 */
export async function getLabelList() {
  return request('/public/v1/label/list', {
    method: 'GET',
  });
}

// 获取草稿详情
export async function getDraftDetail(id: string | number, type?: number) {
  return request('/ctl/v1/draft/info', {
    method: 'GET',
    params: {
      id,
      type,
    },
  });
}

// 修改草稿详情
export async function updateDraftDetail(params: TableParams) {
  return request('/supplier/v1/product_temp/update', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// 审核商品草稿信息接口
export async function draftReviewDetail(params: ReviewDetail) {
  return request('/ctl/v1/draft/review_detail', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// 草稿新增接口
export async function createProductTemp(params: TableParams) {
  return request('/supplier/v1/product_temp/create', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// 删除草稿
export async function removeProductTemp(ids: any[]) {
  return request('/supplier/v1/product_temp/delete', {
    method: 'POST',
    data: {
      ids,
    },
  });
}

// 申请提交发布
export async function submitProductTemp(ids: any[]) {
  return request('/supplier/v1/product_temp/submit', {
    method: 'POST',
    data: {
      ids,
    },
  });
}

// 获取快照详情
export async function getSnapShotDetail(id: string | number) {
  return request('/ctl/v1/product/info', {
    method: 'GET',
    params: {
      id,
    },
  });
}

// 保存商品信息接口
export async function updateSnapShotDetail(data: snapshotDetailsParams) {
  return request('/ctl/v1/product/update', {
    method: 'POST',
    data,
  });
}

// 快照减少库存接口
export async function minusSnapShotStock(params: minusStock) {
  return request('/ctl/v1/product/stock', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

//  快照商品取消下撤接口
export async function removeProductOutCancel(ids: any[]) {
  return request('/supplier/v1/product/out/cancel', {
    method: 'POST',
    data: {
      ids,
    },
  });
}

//  快照商品下撤/上架接口
export async function submitProductOut(ids: any[], is_out: string | number) {
  return request('/supplier/v1/product/out', {
    method: 'POST',
    data: {
      ids,
      is_out,
    },
  });
}

//  快照增加库存
export async function submitProductAddStock(params: addStock[]) {
  return request('/supplier/v1/product/add_stock', {
    method: 'POST',
    data: {
      stock_list: params,
    },
  });
}
