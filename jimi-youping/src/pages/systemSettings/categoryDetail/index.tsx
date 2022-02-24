import { Button, Card, Input, Form, Cascader, Space, Popconfirm, message, Spin } from 'antd';
import React, { PureComponent } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { ProFormRadio } from '@ant-design/pro-form';
import { getCategoryInfo, getCategoryList, saveCategory, delCategory } from './service';
import type { getOrderDeliveryResponse } from './data.d';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { history } from 'umi';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 3,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 12,
    },
    md: {
      span: 10,
    },
  },
};
const submitFormLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 10,
      offset: 3,
    },
  },
};

type StateProps = {};
type DispatchProps = {};
type OwnProps = {};
type OwnState = {};

class BasicForm extends PureComponent<OwnProps & StateProps & DispatchProps, OwnState> {
  state = {
    submitting: false,
    details: {} as getOrderDeliveryResponse,
    expressList: [],
    showPublicUsers: false,
    routeProp: {
      id: null,
      type: null,
    },
    modalVisible: false,
    options: [],
    isLoading: false,
  };

  componentDidMount() {
    const routeProp = this.props?.location?.query;
    this.setState({
      routeProp,
    });
    if (routeProp.type === 'edit') {
      this.getDetailData(routeProp);
    } else {
      this.getCateList('0');
    }
  }

  // 获取详情
  getDetailData(routeProp) {
    this.setState({
      isLoading: true,
    });
    getCategoryInfo(routeProp.id).then((res) => {
      this.setState({
        isLoading: false,
      });
      if (res && res.code) return;

      this.formRef?.current.setFieldsValue({
        name: res.name,
        pid: res.cate_id || [],
        disabled: res.disabled,
      });

      this.getCateList(res.pid);
      this.setState({
        details: res,
      });
    });
  }

  getCateList(pid: string) {
    this.setState({
      isLoading: true,
    });
    getCategoryList(pid).then((r) => {
      if (r && r.code) return;
      // 过滤二级以后的分类，同时过滤掉当前分类所在的数据
      // 利用浅拷贝解决eslint检测报告错误
      r.forEach((e) => {
        if (e.children) {
          e.children.forEach((k, i) => {
            const items = k;
            if (items.value.toString() === this.state.routeProp.id) {
              e.children.splice(i, 1);
            }
            if (items.children) {
              delete items.children;
            }
          });
        }
      });

      this.setState({
        isLoading: false,
        options: r,
      });
    });
  }

  onFinish(values: Record<string, any>) {
    const { routeProp } = this.state;
    const { name, pid, disabled } = values;
    const data = {
      name,
      pid: pid.length > 0 ? pid[pid.length - 1] : 0,
      disabled,
    };
    if (routeProp.type === 'edit') {
      data.id = routeProp.id;
    }
    this.setState({
      isLoading: true,
    });
    saveCategory(data).then((res) => {
      this.setState({
        isLoading: false,
      });
      if (res && res.code) return;
      message.success('保存成功');
      if (routeProp.type === 'edit') {
        this.getDetailData(routeProp);
      } else {
        history.goBack();
      }
    });
  }

  onFinishFailed = (errorInfo: any) => {
    // eslint-disable-next-line no-console
    console.log('Failed:', errorInfo);
  };

  // 删除分类
  delCate() {
    const { routeProp } = this.state;
    this.setState({
      isLoading: true,
    });
    delCategory(routeProp.id).then((res) => {
      this.setState({
        isLoading: false,
      });
      if (res && res.code) return;
      message.success('已删除');
      history.goBack();
    });
  }

  onValuesChange = (changedValues: Record<string, any>) => {
    const { publicType } = changedValues;
    if (publicType) {
      this.setState({
        showPublicUsers: publicType === '2',
      });
    }
  };

  formRef = React.createRef();
  render() {
    const { submitting, options, routeProp, isLoading } = this.state;
    return (
      <PageContainer
        header={{
          title: '分类详情',
          onBack: () => {
            history.goBack();
          },
        }}
        content=""
      >
        <Spin tip="加载中..." spinning={isLoading}>
          <Card bordered={false}>
            <Form
              ref={this.formRef}
              hideRequiredMark
              style={{
                marginTop: 8,
              }}
              name="basic"
              onFinish={this.onFinish.bind(this)}
              onFinishFailed={this.onFinishFailed}
              onValuesChange={this.onValuesChange}
            >
              <FormItem
                {...formItemLayout}
                label="名称"
                name="name"
                rules={[
                  {
                    required: true,
                    message: '请输入分类名称',
                  },
                ]}
              >
                <Input placeholder="请输入分类名称" style={{ width: 438 }} />
              </FormItem>

              {options.length > 0 ? (
                <FormItem {...formItemLayout} label="上级" name="pid">
                  <Cascader options={options} changeOnSelect style={{ width: 438 }} />
                </FormItem>
              ) : null}
              <FormItem
                name="disabled"
                rules={[
                  {
                    required: true,
                    message: '请选择状态',
                  },
                ]}
              >
                <ProFormRadio.Group
                  {...formItemLayout}
                  label="状态"
                  options={[
                    {
                      label: '可用',
                      value: 0,
                    },
                    {
                      label: '禁用',
                      value: 1,
                    },
                  ]}
                />
              </FormItem>
              <FormItem
                {...submitFormLayout}
                style={{
                  marginTop: 32,
                }}
              >
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={submitting}
                    style={{ background: 'rgb(51, 166, 76)', border: '1px solid rgb(51, 166, 76)' }}
                  >
                    保存
                  </Button>
                  {routeProp.id ? (
                    <Popconfirm
                      title="是否确定删除？"
                      icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                      onConfirm={this.delCate.bind(this)}
                      okText="确认"
                      cancelText="取消"
                    >
                      <Button type="primary" danger loading={submitting}>
                        删除
                      </Button>
                    </Popconfirm>
                  ) : null}
                </Space>
              </FormItem>
            </Form>
          </Card>
        </Spin>
      </PageContainer>
    );
  }
}

export default BasicForm;
