import { message, Card, Row, Col, List, Button, Divider } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import { history } from 'umi';
import type { Details, updatePramas } from './data.d';
import { queryBusinessInfo, supplierUpdate } from './service';
// import Css from './style.less';
import ProForm, { ProFormText } from '@ant-design/pro-form';

// 发货单

const TableList: React.FC = (props: any) => {
  const d = {
    id: '',
    name: '',
    disabled: 0,
    add_time: '',
    supply_price_factor: '',
    supplier_admin_id: '',
    username: '',
    total_sale_product: '',
    total_pending_review: '',
    total_pending_delivery: '',
  };
  const formBox = useRef<any>(null);
  document.title = '商家详情';
  const routeProp = props?.location?.query;
  const [detailsData, setDetailsData] = useState<Details>(d); // 详情
  const data = [
    {
      name: '在售商品',
      num: detailsData.total_sale_product,
      url: '/supplier/snapshot',
    },
    {
      name: '待审商品',
      num: detailsData.total_pending_review,
      url: '/supplier/draftReview',
    },
    {
      name: '代发货数',
      num: detailsData.total_pending_delivery,
      url: '/supplier/Invoice',
    },
  ];

  // 编辑供应商接口
  const postSupplierUpdate = (p: updatePramas) => {
    supplierUpdate(p)
      .then((res) => {
        if (res && res.code !== 0) {
          message.error(res.msg);
        } else {
          message.success('重置成功');
          formBox.current.resetFields();
          queryBusinessInfo(routeProp.id)
            .then((resolve) => {
              setDetailsData(resolve);
              formBox?.current.setFieldsValue({
                name: resolve.name,
                username: resolve.username,
                add_time: resolve.add_time,
              });
            })
            .catch(() => {});
        }
      })
      .catch((err) => {
        message.error(err.msg);
      });
  };

  useEffect(() => {
    queryBusinessInfo(routeProp.id)
      .then((res) => {
        setDetailsData(res);
        formBox?.current.setFieldsValue({
          name: res.name,
          username: res.username,
          add_time: res.add_time,
        });
      })
      .catch(() => {});
  }, [routeProp.id]);

  return (
    <div>
      <Row gutter={16} justify={'center'}>
        <Col span={16}>
          <Card
            title="商家详情"
            bordered={false}
            extra={
              <a
                href="#"
                onClick={() => {
                  history.goBack();
                }}
              >
                返回上级
              </a>
            }
          >
            <ProForm
              formRef={formBox}
              onFinish={async (values) => {
                const p = {
                  id: detailsData.id,
                  password: values.resetPwd,
                  en_password: values.confrimPwd,
                };
                postSupplierUpdate(p);
              }}
              submitter={{
                searchConfig: {
                  resetText: '重置',
                  submitText: '确认重置',
                },
                // 配置按钮的属性
                resetButtonProps: {
                  style: {
                    // 隐藏重置按钮
                    display: 'none',
                  },
                },
              }}
            >
              <ProForm.Group>
                <ProFormText
                  width="lg"
                  name="name"
                  label="企业名称"
                  placeholder="请输入企业名称"
                  readonly
                />
              </ProForm.Group>
              <ProForm.Group>
                <ProFormText
                  name="username"
                  width="lg"
                  label="用户名"
                  placeholder="请输入用户名"
                  readonly
                />
              </ProForm.Group>
              <ProForm.Group>
                <ProFormText
                  name="add_time"
                  width="lg"
                  label="注册时间"
                  placeholder="请输入注册时间"
                  readonly
                />
              </ProForm.Group>
              <ProFormText
                width="lg"
                name="resetPwd"
                label="重置密码"
                rules={[
                  {
                    required: true,
                    message: '请输入密码',
                  },
                ]}
              />
              <ProFormText
                width="lg"
                name="confrimPwd"
                label="确认密码"
                rules={[
                  {
                    required: true,
                    message: '请再次输入密码',
                  },
                ]}
              />
            </ProForm>
            <Divider orientation="right" plain>
              商户相关信息
            </Divider>
            <List
              bordered
              dataSource={data}
              renderItem={(item) => (
                <List.Item>
                  <div>{item.name}</div>
                  <div>{item.num}</div>
                  <Button
                    type="link"
                    onClick={() => {
                      history.push({
                        pathname: item.url,
                        query: {
                          id: routeProp.id.toString(),
                        },
                      });
                    }}
                  >
                    查看
                  </Button>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TableList;
