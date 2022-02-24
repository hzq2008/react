import React from 'react';
import E from 'wangeditor';

import { connect } from 'umi';
import type { ConnectState } from '@/models/connect';

import { domain } from '@/utils/request';

class Editor extends React.Component<
  {
    preDetail: string;
    getInputData: (e: any) => void;
  } & ConnectState
> {
  state = {
    editorContent: '',
  };

  editor?: E;

  componentDidMount() {
    const editor = new E('#editorElemMenu', '#editorElemBody');
    this.editor = editor;

    editor.i18next = window.i18next;
    // 使用 onchange 函数监听内容的变化，并实时更新到 state 中
    editor.config.onchange = () => {
      this.setState({
        // editorContent: editor.txt.text()
        editorContent: editor.txt.html(),
      });
      this.props.getInputData(editor.txt.html());
    };
    editor.config.menus = [
      'head', // 标题
      'bold', // 粗体
      'fontSize', // 字号
      'fontName', // 字体
      'italic', // 斜体
      'underline', // 下划线
      'strikeThrough', // 删除线
      'foreColor', // 文字颜色
      'backColor', // 背景颜色
      'link', // 插入链接
      'list', // 列表
      'justify', // 对齐方式
      'quote', // 引用
      'emoticon', // 表情
      'image', // 插入图片
      'table', // 表格
      'video', // 插入视频
      'code', // 插入代码
      'undo', // 撤销
      'redo', // 重复
    ];

    editor.config.uploadImgServer = `${domain}/images/upload`; // 上传图片到服务器

    // 限制最大上传尺寸
    const { upload_max_size } = this.props.api.config;
    editor.config.uploadImgMaxSize = upload_max_size || 2097152; /* 1024*1024*2 */

    // 限制一次最多上传 5 张图片
    editor.config.uploadImgMaxLength = 1;

    // 自定义文件名
    editor.config.uploadFileName = 'editor_img';

    // 将 timeout 时间改为 5s
    editor.config.uploadImgTimeout = 5000;

    editor.config.uploadImgHooks = {
      // 上传图片之前
      before() {
        // console.log(xhr)
        // 可阻止图片上传
        // return {
        //   prevent: true,
        //   msg: '需要提示给用户的错误信息'
        // }
      },
      // 图片上传并返回了结果，图片插入已成功
      success() {
        // console.log('success', xhr)
      },
      // 图片上传并返回了结果，但图片插入时出错了
      fail() {
        // console.log('fail', xhr, edit, resData)
      },
      // 上传图片出错，一般为 http 请求的错误
      error() {
        // console.log('error', xhr, edit, resData)
      },
      // 上传图片超时
      timeout() {
        // console.log('timeout',xhr)
      },
      // 图片上传并返回了结果，想要自己把图片插入到编辑器中
      // 例如服务器端返回的不是 { errno: 0, data: [...] } 这种格式，可使用 customInsert
      customInsert(insertImgFn, result) {
        // result 即服务端返回的接口
        console.log('customInsert', result);

        // insertImgFn 可把图片插入到编辑器，传入图片 src ，执行函数即可
        insertImgFn(result.data.url);
      },
    };
    editor.config.uploadImgShowBase64 = true;
    editor.create();
  }

  shouldComponentUpdate(nextProps: any) {
    if (nextProps.preDetail !== this.props.preDetail) {
      this.editor?.txt.html(nextProps.preDetail);
      this.setState({
        editorContent: nextProps.preDetail,
      });
      return true;
    }

    return false;
  }

  componentWillUnmount() {
    this.editor?.destroy();
  }

  render() {
    return (
      <div className="shop">
        <div
          className="text-area"
          style={{
            position: 'relative',
            zIndex: 999,
          }}
        >
          <div
            id="editorElemMenu"
            style={{
              backgroundColor: '#f1f1f1',
              border: '1px solid #ccc',
            }}
            className="editorElem-menu"
          ></div>
          <div
            style={{
              padding: '0 10px',
              overflowY: 'scroll',
              height: 300,
              border: '1px solid #ccc',
              borderTop: 'none',
            }}
            id="editorElemBody"
            className="editorElem-body"
          ></div>
        </div>
      </div>
    );
  }
}

export default connect(({ api }: ConnectState) => ({ api }))(Editor);
