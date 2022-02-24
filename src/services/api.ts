import request from '@/utils/request';
import type { getConfigRequest, getConfigResponse } from './data.d';

export function getConfig(params: getConfigRequest): Promise<getConfigResponse> {
  return request('/public/v1/config', {
    params,
  });
}
