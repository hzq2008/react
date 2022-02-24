export type queryCurrentResponse = {
  /** 用户id */ id: number;
  /** 用户名称 */ name: string;
  /** 账号 */ username: string;
  /** 菜单信息 */ auth_list: string[];
};

export type getConfigRequest = {
  /** 相应的系统配置 */ field: string;
};
export type getConfigResponse = {
  /** 图片上传最大尺寸（单位B） */ upload_max_size?: number;
};
