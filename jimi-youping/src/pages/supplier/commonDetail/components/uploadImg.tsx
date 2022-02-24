import React from 'react';
import { Upload, Modal, message } from 'antd';
import type { UploadProps } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { connect } from 'umi';
import type { ConnectState } from '@/models/connect';

import { domain } from '@/utils/request';

// 图片上传组件
function getBase64(file: any) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

class PicturesWall extends React.Component<
  {
    fileList: any[];
    setFileList: (e: any) => void;
    userId: string;
    maxLen: number;
  } & ConnectState
> {
  state = {
    previewVisible: false,
    previewImage: '',
    previewTitle: '',
  };

  handleCancel = () =>
    this.setState({
      previewVisible: false,
    });

  handlePreview = async (file: any) => {
    const p = file;
    if (!p.url && !p.preview) {
      p.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: p.url || p.preview,
      previewVisible: true,
      previewTitle: p.name || p.url.substring(p.url.lastIndexOf('/') + 1),
    });
  };

  /** 图片上传前钩子 */
  beforeUpload = (file: any) => {
    const { upload_max_size = 2097152 } = this.props.api.config;
    if (file.size <= upload_max_size) return true;

    const Mb = upload_max_size / 1048576; /* 1024*1024 */
    const limit = Number.isInteger(Mb) ? Mb : Mb.toFixed(2);
    message.error(`图片尺寸不能大于${limit}M`);
    return Upload.LIST_IGNORE;
  };

  handleChange: UploadProps['onChange'] = ({ fileList }) => {
    const arr = fileList.map((item: any, index: number) => {
      let obj = {};
      if (item.status === 'done' && item.baseUrl) {
        obj = item;
      } else if (item.status === 'done' && item.response.code === 0) {
        obj = {
          uid: index,
          name: item.name,
          status: 'done',
          url: item.response.data.url,
          baseUrl: item.response.data.base_url,
        };
      } else {
        obj = item;
      }
      return obj;
    });
    this.props.setFileList(arr);

    // this.setState({ fileList });
  };

  render() {
    const { previewVisible, previewImage, previewTitle } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
    return (
      <>
        <Upload
          action={`${domain}/images/upload`}
          listType="picture-card"
          fileList={this.props.fileList}
          maxCount={this.props.maxLen}
          multiple
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          data={{ path: `supplier/${this.props.userId}/` }}
          beforeUpload={this.beforeUpload}
        >
          {this.props.fileList.length >= this.props.maxLen ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </>
    );
  }
}

export default connect(({ api }: ConnectState) => ({ api }))(PicturesWall);
