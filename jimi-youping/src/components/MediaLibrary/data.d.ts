/**
 * 快照列表项
 * @param {path} 当前目录
 * @param {id} 快照名称
 * @param {from} 来源（供应商为supplier，客服后台hub或者不传）
 
 */
export type detailData = {
  /** 当前目录 */ path: string;
  id: string | number;
  from: string;
  curr_path: string;
  crumbs: {
    name: string;
    path: string;
  }[];
  list: any[];
};

export type listData = {
  /** 内容类型（folder表示目录，file表示文件（图片暂时归类到file）） */ type: string;
  /** 文件访问路径/目录路径 */ path: string;
  /** 名称 */ name: string;
  /** 信息（type非folder是返回） */ info?: {
    /** 图片宽度 */ width: number | string;
    /** 图片高度 */ height: number | string;
    isSel?: false;
  };
};

export type idxParams = {
  path: string;
  from: string;
  id: number;
};

export type folderParams = {
  path: string;
  name: string;
};
