import React, { Component } from 'react';
import { List, Modal, Button } from 'antd';
import { connect } from 'umi';

import ProForm, { ModalForm, ProFormText } from '@ant-design/pro-form';
import type { ModalFormProps } from '@ant-design/pro-form';
import type { RuleObject, RuleRender } from 'rc-field-form/lib/interface';

import { updatePassword } from '../service';
import type { queryCurrentResponse } from '../../../../services/data';
import passwordEncode from '../../../../utils/passwordEncode';

type Unpacked<T> = T extends (infer U)[] ? U : T;
// const passwordStrength = {
//   strong: <span className="strong">强</span>,
//   medium: <span className="medium">中</span>,
//   weak: <span className="weak">弱 Weak</span>,
// };

type StateProps = {
  userInfo: queryCurrentResponse;
};
type DispatchProps = {
  logout: () => void;
};
type OwnProps = {};
type OwnState = {
  /** 修改密码弹窗 */ modifyPasswordModal: boolean;
  /** 成功弹窗 */ successModal: boolean;
};

class Comp extends Component<OwnProps & StateProps & DispatchProps, OwnState> {
  state = {
    modifyPasswordModal: false,
    successModal: false,
  };

  // componentDidMount() {}

  getData = () => [
    {
      title: '账户密码',
      description: '',
      actions: [
        <a key="Modify" onClick={this.onVisibleChange.bind(null, true)}>
          修改
        </a>,
      ],
    },
    // {
    //   title: '账户密码',
    //   description: (
    //     <>
    //       '当前密码强度：'：
    //       {passwordStrength.strong}
    //     </>
    //   ),
    //   actions: [<a key="Modify">修改</a>],
    // },
    // {
    //   title: '密保手机',
    //   description: `${'已绑定手机：'}：138****8293`,
    //   actions: [<a key="Modify">修改</a>],
    // },
    // {
    //   title: '密保问题',
    //   description: '未设置密保问题，密保问题可有效保护账户安全',
    //   actions: [<a key="Set">设置</a>],
    // },
    // {
    //   title: '备用邮箱',
    //   description: `${'已绑定邮箱：'}：ant***sign.com`,
    //   actions: [<a key="Modify">修改</a>],
    // },
    // {
    //   title: 'MFA 设备',
    //   description: '未绑定 MFA 设备，绑定后，可以进行二次确认',
    //   actions: [<a key="bind">绑定</a>],
    // },
  ];

  rule: RuleObject[] = [
    {
      required: true,
      type: 'string',
      min: 6,
    },
  ];
  rules: RuleRender[] = [
    (form) => {
      const opt = { ...this.rule[0] };

      const values = form.getFieldsValue(true);
      if (values.newPW !== values.confirmPW) {
        opt.message = '两次密码输入不一致';
        opt.pattern = /^\0$/;
      }

      return opt;
    },
  ];

  /** 切换修改密码弹窗 */
  onVisibleChange: Required<ModalFormProps>['onVisibleChange'] = (visible) => {
    this.setState({
      modifyPasswordModal: visible,
    });
  };

  /** 切换成功弹窗 */
  switchSuccessModal = () => {
    this.setState((state) => ({
      successModal: !state.successModal,
    }));
  };

  onFinish: Required<ModalFormProps>['onFinish'] = (values) => {
    const passwords = passwordEncode(values);

    const data = {
      old_password: passwords.currentPW.code,
      password: passwords.newPW.code,
      en_password: passwords.confirmPW.code,
      timestamp: +passwords.time,
    };

    return updatePassword(data).then((res) => {
      if (!res) {
        this.onVisibleChange(false);
        this.switchSuccessModal();
      }

      return true;
    });
  };

  render() {
    const { modifyPasswordModal, successModal } = this.state;
    const { userInfo } = this.props;

    const data = this.getData();
    return (
      <>
        <List<Unpacked<typeof data>>
          itemLayout="horizontal"
          dataSource={data}
          renderItem={(item) => (
            <List.Item actions={item.actions}>
              <List.Item.Meta title={item.title} description={item.description} />
            </List.Item>
          )}
        />

        {/* 修改密码弹窗 */}
        <ModalForm
          title="修改账户密码"
          width={400}
          visible={modifyPasswordModal}
          onVisibleChange={this.onVisibleChange}
          onFinish={this.onFinish}
        >
          <ProForm.Item>
            <div>账号：{userInfo.username}</div>
            <div>用户名：{userInfo.name}</div>
          </ProForm.Item>

          <ProFormText.Password rules={this.rule} name="currentPW" label="当前密码" />
          <ProFormText.Password rules={this.rule} name="newPW" label="修改密码" />
          <ProFormText.Password rules={this.rules} name="confirmPW" label="确认密码" />
        </ModalForm>

        {/* 成功弹窗 */}
        <Modal
          width={250}
          closable={false}
          visible={successModal}
          onCancel={this.switchSuccessModal}
          footer={[
            <Button key="logout" onClick={this.props.logout}>
              重新登录
            </Button>,

            <Button key="confirm" type="primary" onClick={this.switchSuccessModal}>
              确定
            </Button>,
          ]}
        >
          修改账号密码成功
        </Modal>
      </>
    );
  }
}

export default connect(
  (state: any) => ({
    userInfo: state?.user?.currentUser,
  }),
  (dispatch: Function) => ({
    logout() {
      dispatch({ type: 'login/logout' });
    },
  }),
)(Comp);
