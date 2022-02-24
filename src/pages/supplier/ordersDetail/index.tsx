import { InfoCircleOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Input,
  Form,
  Timeline,
  Cascader,
  Tooltip,
  Avatar,
  Tag,
  Divider,
  message,
  Space,
} from 'antd';
import React, { PureComponent } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import {
  getExpressList,
  getOrderDeliveryDetail,
  refuseDelivery,
  invoiceDelivery,
  getCityList,
  refuseReview,
} from './service';
import styles from './style.less';
import type { FormInstance } from 'antd';
import type { getOrderDeliveryResponse } from './data.d';
import { history } from 'umi';

const FormItem = Form.Item;
const { Meta } = Card;
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
    routeProp: {},
    modalVisible: false,
    citys: [],
    refuseType: 0, // 区分拒发与审核拒发 0拒发 1审核拒发
  };

  componentDidMount() {
    document.title = '发货单详情';
    const routeProp = this.props?.location?.query;
    this.setState({
      routeProp,
    });
    this.getExpressList();
    this.getDetailData(routeProp);
    getCityList().then((r) => {
      this.setState({
        citys: r,
      });
    });
  }

  // 获取快递列表
  getExpressList() {
    getExpressList().then((res) => {
      if (res) {
        const arr = res.map((item) => {
          return {
            label: item.name,
            value: item.id,
          };
        });
        this.setState({
          expressList: arr,
        });
      }
    });
  }

  // 获取详情
  getDetailData(routeProp) {
    getOrderDeliveryDetail(routeProp.id).then((res) => {
      this.formRef?.current.setFieldsValue({
        order_sn: res.order_sn,
        father_order_sn: res.father_order_sn,
        address: `${res.address.province} ${res.address.city} ${res.address.district} ${res.address.detail}
        ${res.address.receiver_name} ${res.address.receiver_phone}`,
        price: `￥${res.price ?? '0.00'}`,
        delivery_price: `￥${res.delivery_price ?? '0.00'}`,
        express_id: [res.express_id],
        delivery_shipping_id: res.delivery_shipping_id,
        shengshiqu: [res.address.province, res.address.city, res.address.district],
        address_details: res.address.detail,
        receiver_name: res.address.receiver_name,
        receiver_phone: res.address.receiver_phone,
      });
      this.setState({
        details: res,
      });
    });
  }

  // 拒发快递
  refuseExp() {
    this.setState({
      modalVisible: true,
      refuseType: 0,
    });
  }
  // 审核拒发快递
  refuseRew() {
    this.setState({
      modalVisible: true,
      refuseType: 1,
    });
  }

  // 确认拒发理由
  updataExpMsg(e) {
    const { expReason } = e;
    if (this.state.refuseType === 0) {
      const data = {
        reason: expReason,
        ids: this.state.details.id.toString(),
      };
      refuseDelivery(data).then((res) => {
        if (res && res.code === 400) return;
        message.success('提交成功');
        // 刷新列表
        this.modalFormRef?.current?.resetFields();
        this.setState({
          modalVisible: false,
        });
        this.getDetailData(this.state.routeProp);
      });
    } else {
      const data = {
        remake: expReason,
        ids: this.state.details.id.toString(),
        status: 0,
      };
      this.postRefuseReview(data);
    }
  }

  // 审核拒发接口
  postRefuseReview(data) {
    refuseReview(data).then((res) => {
      if (res && res.code === 400) return;
      message.success('提交成功');
      // 刷新列表
      this.modalFormRef?.current?.resetFields();
      this.setState({
        modalVisible: false,
      });
      this.getDetailData(this.state.routeProp);
    });
  }

  // 允许拒发
  passReview() {
    const data = {
      ids: this.state.details.id.toString(),
      status: 1,
    };
    this.postRefuseReview(data);
  }
  onFinish(values: Record<string, any>) {
    const {
      shengshiqu,
      address_details: detail,
      receiver_name: name,
      receiver_phone,
      express_id,
      delivery_shipping_id,
    } = values;
    const data = {
      id: this.state.details.id,
      delivery_id: delivery_shipping_id,
      express_id: express_id[0],
      address_data: {
        name,
        phone: receiver_phone,
        detail,
        province: shengshiqu[0],
        city: shengshiqu[1],
        district: shengshiqu[2],
      },
    };
    invoiceDelivery(data).then((res) => {
      if (res && res.code === 400) return;
      message.success('更改成功');
      this.getDetailData(this.state.routeProp);
    });
  }

  onFinishFailed = (errorInfo: any) => {
    // eslint-disable-next-line no-console
    console.log('Failed:', errorInfo);
  };

  onValuesChange = (changedValues: Record<string, any>) => {
    const { publicType } = changedValues;
    if (publicType) {
      this.setState({
        showPublicUsers: publicType === '2',
      });
    }
  };

  onChange = (e: any) => {
    console.log(e);
  };

  getStatus = (s) => {
    switch (s) {
      case -1:
        return <Tag color="#cd201f"> 供应商申请拒发</Tag>;
      case 0:
        return <Tag color="#cd201f"> 未发货</Tag>;
      case 2:
        return <Tag color="#cd201f"> 已拒发</Tag>;
      default:
        return <Tag> 已发货· 等待物流更新</Tag>;
    }
  };

  cityFilter = (inputValue: string, path: any) => {
    return path.some((option: any) => option.label.indexOf(inputValue) > -1);
  };
  formRef = React.createRef();
  modalFormRef = React.createRef<FormInstance>();
  render() {
    const { submitting, details, expressList, modalVisible, citys } = this.state;
    return (
      <PageContainer
        header={{
          title: '发货单详情',
          onBack: () => {
            history.goBack();
          },
        }}
        content=""
      >
        <Card bordered={false}>
          <Form
            ref={this.formRef}
            hideRequiredMark
            style={{
              marginTop: 8,
            }}
            name="basic"
            initialValues={{
              public: '1',
            }}
            onFinish={this.onFinish.bind(this)}
            onFinishFailed={this.onFinishFailed}
            onValuesChange={this.onValuesChange}
          >
            <FormItem
              {...formItemLayout}
              label="发货单号"
              name="order_sn"
              rules={[
                {
                  required: true,
                  message: '请输入发货单号',
                },
              ]}
            >
              <Input placeholder="请输入发货单号" readOnly />
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="父单号"
              name="father_order_sn"
              rules={[
                {
                  required: true,
                  message: '请输入父单号',
                },
              ]}
            >
              <Input placeholder="请输入父单号" readOnly />
            </FormItem>

            {details.address ? (
              <FormItem {...formItemLayout} label="收货地址">
                <div>
                  <FormItem name="shengshiqu">
                    <Cascader
                      name="shengshiqu"
                      options={citys}
                      placeholder="省/市/区"
                      showSearch={{ filter: this.cityFilter }}
                    />
                  </FormItem>
                </div>
                <div>
                  <FormItem name="address_details">
                    <Input
                      style={{
                        minHeight: 32,
                      }}
                      placeholder="详细地址"
                      allowClear
                    />
                  </FormItem>
                </div>
                <div className={styles.flex}>
                  <Space>
                    <FormItem name="receiver_name">
                      <Input
                        style={{
                          minHeight: 32,
                        }}
                        placeholder="客户名"
                        allowClear
                      />
                    </FormItem>
                    <FormItem name="receiver_phone">
                      <Input
                        style={{
                          minHeight: 32,
                        }}
                        placeholder="客户手机号"
                        allowClear
                      />
                    </FormItem>
                  </Space>
                </div>
              </FormItem>
            ) : null}

            <FormItem {...formItemLayout} label="商品" name="standard">
              {details.product_detail ? (
                <Card>
                  {details.product_detail.map((item, index) => (
                    <div key={item.sku}>
                      <div className={[styles.flex, styles.mrBottom].join(' ')}>
                        <Meta
                          style={{ width: '85%' }}
                          avatar={<Avatar src={item.thumb_url} shape="square" />}
                          title={item.name}
                          description={item.sku}
                        />
                        <span className={[styles.mainColor, styles.mr_left].join(' ')}>
                          x {item.num}
                        </span>
                      </div>
                      {index !== details.product_detail.length - 1 ? <Divider></Divider> : ''}
                    </div>
                  ))}
                </Card>
              ) : null}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={
                <span>
                  商品总值
                  <em className={styles.optional}>
                    <Tooltip title="商品总值">
                      <InfoCircleOutlined
                        style={{
                          marginRight: 4,
                        }}
                      />
                    </Tooltip>
                  </em>
                </span>
              }
              name="price"
            >
              <Input placeholder="商品总值" readOnly />
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={
                <span>
                  附加运费
                  <em className={styles.optional}>
                    <Tooltip title="附加运费">
                      <InfoCircleOutlined
                        style={{
                          marginRight: 4,
                        }}
                      />
                    </Tooltip>
                  </em>
                </span>
              }
              name="delivery_price"
            >
              <Input placeholder="附加运费" readOnly />
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="物流单号"
              style={{
                marginBottom: 0,
              }}
              name="publicUsers"
            >
              {details.delivery_status !== 2 && details.delivery_detail ? (
                <>
                  <div className={styles.flex}>
                    <FormItem style={{ width: '40%', marginRight: '20px' }} name="express_id">
                      <Cascader
                        className={''}
                        placeholder={'请选择对应的快递公司'}
                        options={expressList}
                        onChange={this.onChange}
                      />
                    </FormItem>
                    <FormItem name="delivery_shipping_id" style={{ width: '60%' }}>
                      <Input placeholder=" 请填写运单号" />
                    </FormItem>
                  </div>
                  {details.delivery_detail.length > 0 ? (
                    <div className={styles.pt30}>
                      <Timeline>
                        <Timeline.Item color="green">{details.delivery_detail[0]}</Timeline.Item>
                        {details.delivery_detail.length > 1 ? (
                          <Timeline.Item color="red">
                            {details.delivery_detail.map((item, index) => {
                              return index > 0 ? <p key={item}>{item}</p> : null;
                            })}
                          </Timeline.Item>
                        ) : null}
                      </Timeline>
                    </div>
                  ) : null}
                </>
              ) : (
                <div>{this.getStatus(details.delivery_status)}</div>
              )}
            </FormItem>
            {details.delivery_status !== -1 ? (
              <FormItem
                {...submitFormLayout}
                style={{
                  marginTop: 32,
                }}
              >
                {details.delivery_status < 2 ? (
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={submitting}
                    style={{ background: 'rgb(51, 166, 76)', border: '1px solid rgb(51, 166, 76)' }}
                  >
                    确认保存
                  </Button>
                ) : null}

                {details.delivery_status === 0 || details.delivery_status === -2 ? (
                  <Button
                    type="primary"
                    style={{
                      marginLeft: 8,
                    }}
                    danger
                    onClick={() => this.refuseExp()}
                  >
                    拒发
                  </Button>
                ) : null}

                {details.delivery_status === 1 && details.delivery_shipping_id ? (
                  <Button
                    type="primary"
                    style={{
                      marginLeft: 8,
                      background: 'rgb(255, 188, 38)',
                      border: '1px solid rgb(255, 188, 38)',
                    }}
                    onClick={() => this.refuseExp()}
                  >
                    改为已拒发
                  </Button>
                ) : null}
              </FormItem>
            ) : (
              <FormItem
                {...submitFormLayout}
                style={{
                  marginTop: 32,
                }}
              >
                <Button
                  type="primary"
                  style={{
                    marginLeft: 8,
                    background: 'rgb(255, 188, 38)',
                    border: '1px solid rgb(255, 188, 38)',
                  }}
                  onClick={() => this.passReview()}
                >
                  允许拒发
                </Button>

                <Button
                  type="primary"
                  danger
                  style={{
                    marginLeft: 8,
                  }}
                  onClick={() => this.refuseRew()}
                >
                  不允许
                </Button>
                {/* <Input placeholder="拒绝理由" /> */}
              </FormItem>
            )}
          </Form>
        </Card>

        <ModalForm
          title="信息完善"
          formRef={this.modalFormRef}
          visible={modalVisible}
          onVisibleChange={(value) => {
            this.setState({
              modalVisible: value,
            });
          }}
          submitter={{
            render: (p, defaultDoms) => {
              return [...defaultDoms];
            },
          }}
          onFinish={async (values) => {
            this.updataExpMsg(values);
          }}
          destroyOnClose
          preserve={false}
        >
          <ProFormText
            width="md"
            name="expReason"
            label="拒绝理由"
            placeholder="请输入拒绝理由"
            rules={[{ required: true, message: '请输入拒绝理由' }]}
          />
        </ModalForm>
      </PageContainer>
    );
  }
}

export default BasicForm;
