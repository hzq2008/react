import { getDvaApp } from 'umi';

export const render = (oldRender: any) => {
  oldRender();

  // 获取应用配置
  /* eslint no-underscore-dangle: ["error", { "allow": ["_store"] }] */
  getDvaApp()._store.dispatch({
    type: 'api/getConfig',
    payload: [/* 图片上传最大尺寸（单位B） */ 'upload_max_size'],
  });
};
