import request from '@/utils/request';
import type { detailData, idxParams, folderParams } from './data.d';

/**
 * 获取目录内容接口
 
 */
export async function getImageIndex(params: idxParams) {
  return request<detailData>('/images/index', {
    method: 'GET',
    params,
  });
}

/**
 * 创建文件夹
 
 */
export async function postCreateFolder(params: folderParams) {
  return request<detailData>('/images/create/folder', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
