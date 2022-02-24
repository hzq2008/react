import { Button, Upload, Image, Space, message, Modal, Tooltip, Breadcrumb } from 'antd';
import { FolderFilled, PlusSquareFilled, UploadOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import { connect } from 'umi';
import type { ConnectState } from '@/models/connect';

import { getImageIndex, postCreateFolder } from './service';
import { domain } from '@/utils/request';

import styles from './style.less';

const BasicForm = (props: any) => {
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false); // 新建文件夹控制
  const [imgVisible, setImgVisible] = useState<boolean>(false); // 新建图片弹窗控制
  const userInfo = props.supplier_id;
  const [mediaData, setMediaData] = useState<any>({
    list: [],
    crumbs: [],
    curr_path: '',
  }); // 媒体库数据

  // 获取媒体库
  const getMediaData = (sonPath = '') => {
    const d = {
      path: sonPath,
      from: 'hub', // 来源（供应商为supplier，客服后台hub或者不传）
      id: userInfo, // ID（from为supplier时表示供应商ID，from为hub是可不传或传客服ID）
    };
    getImageIndex(d).then((res) => {
      const datas = res;
      if (datas?.list?.length > 0) {
        datas.list = datas.list.map((item) => {
          const obj = item;
          obj.isSel = false;
          return obj;
        });
      }

      setMediaData(datas);
    });
  };

  /** 图片上传前钩子 */
  const beforeUpload = (file: any) => {
    const { upload_max_size = 2097152 } = props.api.config;
    if (file.size <= upload_max_size) return true;

    const Mb = upload_max_size / 1048576; /* 1024*1024 */
    const limit = Number.isInteger(Mb) ? Mb : Mb.toFixed(2);
    message.error(`图片尺寸不能大于${limit}M`);
    return Upload.LIST_IGNORE;
  };

  // 刷新加载媒体库
  const reloadMedia = () => {
    getMediaData(mediaData.curr_path);
  };

  // 勾选图片
  const choosedImg = (e) => {
    if (!props.canSelImg) return;
    const d = mediaData;
    d.list = d.list.map((item) => {
      const o = item;
      if (e === o.path) {
        o.isSel = !o.isSel;
      }
      return o;
    });
    const a: any[] = [];
    d.list.forEach((item) => {
      if (item.isSel === true) {
        a.push(item.path);
      }
    });
    props.getImgs(a);
    setMediaData({ ...d });
  };

  // 返回上一级
  const backLevel = () => {
    const len = mediaData.crumbs.length;
    let path = null;
    if (len > 1) {
      path = mediaData.crumbs[len - 2].path;
    } else {
      path = '';
    }
    getMediaData(path);
  };

  useEffect(() => {
    if (userInfo) {
      getMediaData();
    }
  }, [userInfo]);
  return (
    <div>
      <div className={[styles.flex_between, styles.flex].join(' ')}>
        <Breadcrumb>
          <Breadcrumb.Item>我的媒体库</Breadcrumb.Item>
          {mediaData?.crumbs.length > 0
            ? mediaData?.crumbs.map((item) => (
                <Breadcrumb.Item key={item.path} onClick={() => getMediaData(item.path)}>
                  <a href="">{item.name}</a>
                </Breadcrumb.Item>
              ))
            : null}
        </Breadcrumb>
        <div>
          {mediaData.crumbs.length > 0 ? (
            <Button type="link" onClick={() => backLevel()}>
              返回上一级
            </Button>
          ) : null}
          <Button type="link" onClick={reloadMedia}>
            刷新
          </Button>
        </div>
      </div>

      {/* 媒体库内容 */}
      <div className={[styles.flex_wrap, styles.flex].join(' ')}>
        {mediaData?.list.length > 0 ? (
          <>
            {mediaData?.list.map((item) => {
              if (item.type === 'folder') {
                return (
                  <div
                    className={[styles.contentItem].join(' ')}
                    key={item.path}
                    onClick={() => getMediaData(item.path)}
                  >
                    <FolderFilled
                      style={{ fontSize: '100px', color: '#1890ff', cursor: 'pointer' }}
                    />
                    <Tooltip title={item.name}>
                      <div className={styles.file_name}>{item.name}</div>
                    </Tooltip>
                  </div>
                );
              }

              return (
                <div
                  className={[styles.contentItem, item.isSel ? styles.choosed : ''].join(' ')}
                  key={item.path}
                >
                  <Image
                    width={120}
                    height={120}
                    src={item.path}
                    fallback="data:image/png;base64,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"
                  />
                  <Tooltip title={item.name}>
                    <div className={styles.file_name}>{item.name}</div>
                  </Tooltip>
                  {props.canSelImg ? (
                    <Button type="link" onClick={() => choosedImg(item.path)}>
                      {item.isSel ? '已添加' : '添加'}
                    </Button>
                  ) : null}
                </div>
              );
            })}
          </>
        ) : (
          <div>暂无数据</div>
        )}
      </div>

      {/* 功能块 上传 新增 */}
      <div className={[styles.flex_wrap, styles.flex, styles.menuArea].join(' ')}>
        <Space size={10}>
          <Button
            ghost
            type="primary"
            shape="round"
            icon={<PlusSquareFilled />}
            size={'middle'}
            onClick={() => {
              setCreateModalVisible(true);
            }}
          >
            新增文件夹
          </Button>
          <Button
            type="primary"
            shape="round"
            icon={<UploadOutlined />}
            size={'middle'}
            onClick={() => setImgVisible(true)}
          >
            上传文件
          </Button>
        </Space>
      </div>

      {/* 新增文件夹 */}
      <ModalForm
        title={'新增文件夹'}
        width="400px"
        visible={createModalVisible}
        onVisibleChange={setCreateModalVisible}
        onFinish={async (value: any) => {
          postCreateFolder({ path: mediaData.curr_path, name: value.folder }).then(() => {
            getMediaData();
            setCreateModalVisible(false);
          });
        }}
        preserve={false}
        modalProps={{
          destroyOnClose: true,
          // zIndex: 10012,
        }}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: '请输入文件夹名称',
            },
          ]}
          name="folder"
          label="文件夹名称"
          placeholder="请输入文件夹名称"
        />
      </ModalForm>

      {/* 图片上传 */}
      <Modal
        title={'添加图片'}
        visible={imgVisible}
        onCancel={() => {
          setImgVisible(false);
          getMediaData();
        }}
        footer={null}
        bodyStyle={{ height: '500px', overflowY: 'scroll', padding: '20px' }}
        destroyOnClose
        // zIndex={10011}
      >
        <Upload
          action={`${domain}/images/upload`}
          listType="picture"
          multiple
          beforeUpload={beforeUpload}
          data={{
            path: mediaData.curr_path,
          }}
        >
          <Button icon={<UploadOutlined />}>点击上传</Button>
        </Upload>
      </Modal>
    </div>
  );
};

export default connect(({ settings, user, api }: ConnectState) => ({ ...settings, user, api }))(
  BasicForm,
);
