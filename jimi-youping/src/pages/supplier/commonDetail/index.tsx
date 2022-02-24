import { Button, Card, Form, Space, Cascader, message, Modal, Spin } from 'antd';
import React, { useEffect, useState, useRef } from 'react';
import { connect, history } from 'umi';
import type { ConnectState } from '@/models/connect';
import { PageContainer } from '@ant-design/pro-layout';
import ProForm, {
  ProFormRadio,
  ProFormList,
  ProFormText,
  ProFormDigit,
  ProFormSelect,
  ProFormGroup,
  ProFormTextArea,
} from '@ant-design/pro-form';
import {
  getCategoryList,
  getLabelList,
  getCityList,
  getDraftDetail,
  getSnapShotDetail,
  minusSnapShotStock,
  updateSnapShotDetail,
  draftReviewDetail,
} from './service';
// 图片上传组件
import PicturesWall from './components/uploadImg';
// 媒体库
import MediaLibrary from '../../../components/MediaLibrary';

// 富文本编辑器
import RichEditor from './components/richEditor';
import styles from './style.less';
import type { Details } from './data.d';

const FormItem = Form.Item;
const d = {
  id: 0,
  name: '',
  sku: '',
  thumb_url: 'string',
  cate_id: [''],
  stock: 0,
  product_id: 0,
  allow_oversell: 0,
  check_status: 0,
  description: '',
  supply_price: '0',
  summary: '',
  gallery_urls: [],
  product_label: [],
  category: [],
  delivery_address: [],
  deliver_time_out: 0,
  product_sale: [],
  pending_confirm_count: 0,
  pending_deliver_count: 0,
  on_shelf: 0,
}; // 详情初始值
const BasicForm = (props: any) => {
  document.title = '详情';
  // 获取路由参数
  const [loading, setLoading] = useState<boolean>(false);
  const formBox = useRef<any>(null);
  const routeProp = props?.location?.query;
  const [userInfo, setUserInfo] = useState<string | number>('');
  const [putType, setPutType] = useState<string>('sendSave');
  const [details, setDetails] = useState<Details>(d); // 详情
  const [fileList, setFileList] = useState<any>([]); // 缩略图
  const [mainFileList, setMainFileList] = useState<any>([]); // 主图
  const [richData, setRichData] = useState<any>(''); // 富文本内容
  const [snapShot, setSnapShot] = useState<any>(1); // 快照库存数
  const [mediaImg, setMediaImg] = useState<any>([]); // 媒体库选中的图片
  const [selFrom, setSelFrom] = useState<any>('mainImg'); // 判断是从哪里触发选择媒体库文件 mainImg主图   swiperImg轮播图

  const [deliveryAddress, setDeliveryAddress] = useState<any>([
    {
      shengshiqu: ['北京市', '北京市', '东城区'],
      freight_data: 1,
      num: 0,
      price: 0,
    },
  ]); // 物流
  // 级联选项值
  const [options, setOptions] = useState<any>([]);
  // 省市区级联
  const [cityOptions, setCityOptions] = useState<any>([]);
  // 媒体库控制
  const [mediaVisible, setMediaVisible] = useState<boolean>(false);
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
      lg: {
        span: 8,
      },
    },
  };

  // 限制输入框小数点位数
  const limitDecimalsF = (value: any) => {
    const reg = /^(-)*(\d+)\.(\d\d).*$/;
    return `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',').replace(reg, '$1$2.$3');
  };

  // 限制输入框小数点位数
  const limitDecimalsP = (value: any) => {
    const reg = /^(-)*(\d+)\.(\d\d).*$/;
    return value.replace(/￥\s?|(,*)/g, '').replace(reg, '$1$2.$3');
  };

  const cityFilter = (inputValue: string, path: any) => {
    return path.some((option: any) => option.label.indexOf(inputValue) > -1);
  };

  // 获取标签数据
  const labelOpt = async () => {
    const res = await getLabelList();
    const arr = res.map((item: any) => {
      return {
        label: item.name,
        value: item.id,
      };
    });
    return arr;
  };

  // 获取草稿详情
  const getDraft = async () => {
    setLoading(true);
    // 根据sourse 走不同的请求
    const res =
      routeProp.sourse === 'draft'
        ? await getDraftDetail(routeProp.id, routeProp.type ? 2 : 1)
        : await getSnapShotDetail(routeProp.id);
    setUserInfo(res.supplier_id);
    setLoading(false);
    // 设置轮播
    if (res.gallery_urls && res.gallery_urls.length > 0) {
      const arr = res.gallery_urls.map((item, index) => {
        return {
          uid: index,
          name: `轮播图${index}`,
          status: 'done',
          url: item,
          baseUrl: item,
        };
      });
      if (res.gallery_result) {
        res.gallery_result.forEach((item, index) => {
          arr[index].url = item;
        });
      }

      setFileList(arr);
    }
    if (res.thumb_url) {
      // 设置主图
      const obj = {
        uid: 1,
        name: '主图',
        status: 'done',
        url: res.thumb_result,
        baseUrl: res.thumb_url,
      };
      // 设置默认主图
      setMainFileList([obj]);
    }

    // 设置默认富文本
    setRichData(res.description);
    setDetails(res);

    let address;
    if (res.delivery_address && res.delivery_address.data.length > 0) {
      address = res.delivery_address.data.map((item) => {
        return {
          shengshiqu: [item.province, item.city, item.area],
          freight_data: item.freight_data.is_deliver,
          num: item.freight_data.num,
          price: item.freight_data.price,
        };
      });
    } else {
      address = [];
    }

    setDeliveryAddress(address);
    // 动态初始化表单
    formBox?.current.setFieldsValue({
      name: res.name,
      sku: res.sku,
      stock: res.stock,
      summary: res.summary,
      allow_oversell: res.allow_oversell.toString(),
      supply_price: res.supply_price,
      product_label: res.product_label && res.product_label.length > 0 ? res.product_label : [],
      deliver_time_out: res.deliver_time_out,
      rule: res.delivery_address && res.delivery_address.rule ? res.delivery_address.rule : 0,
      product_sale: res.product_sale,
      delivery_address: address,
      cate_id: res.cate_id,
    });

    if (routeProp.sourse === 'snapshot') {
      formBox?.current.setFieldsValue({
        snapshotStock: res.stock,
        snapshotConfirm: res.pending_confirm_count,
        snapshotDeliver: res.pending_deliver_count,
      });
    }
  };

  // 获取富文本内容
  const getRichData = (e) => {
    setRichData(e);
  };

  // 快照库存申请更新(减少)
  const minusStock = (t: number) => {
    const p = {
      id: routeProp.id,
      stock: snapShot,
      type: t,
    };
    setLoading(true);
    minusSnapShotStock(p).then((res) => {
      setLoading(false);
      console.log(res);
      // if (res.code === 0) {
      //   message.info('操作成功');
      // }
    });
  };

  // 获取提交表单类型
  const getFormType = (e: any) => {
    const {
      name,
      sku,
      stock,
      supply_price,
      summary,
      product_label,
      allow_oversell,
      deliver_time_out,
      rule,
      delivery_address,
      product_sale,
      remake,
    } = e;
    const deliverData = delivery_address.map((item: any) => {
      return {
        province: item.shengshiqu[0],
        city: item.shengshiqu[1],
        area: item.shengshiqu[2],
        freight_data: {
          is_deliver: item.freight_data,
          num: item.num || '0.00',
          price: item.price || '0.00',
        },
      };
    });

    const gallery_urls = fileList.map((item: any) => {
      return item.baseUrl;
    });
    let cateId = '';
    if (e?.cate_id) {
      cateId = e.cate_id[e.cate_id.length - 1];
    } else {
      cateId = '';
    }
    const datas = {
      id: routeProp.id || null,
      name,
      sku,
      thumb_url: mainFileList[0]?.baseUrl || '',
      cate_id: cateId || '',
      stock,
      product_id: details?.product_id || 0,
      allow_oversell,
      check_status: 0, // 草稿，保存传0（未发布状态）申请发布（传1）
      description: richData, // 富文本详情
      supply_price,
      summary,
      gallery_urls,
      product_label,
      delivery_address: {
        rule,
        data: deliverData,
      },
      product_sale,
      deliver_time_out,
      status: 1,
      remake,
    };

    switch (putType) {
      //  tips：今日做到这
      case 'passReview':
        if (routeProp.sourse === 'draft') {
          datas.status = 1; // 审核状态（1通过，2未通过）
          datas.remake = '';
          draftReviewDetail(datas).then(() => {
            message.info('操作成功');
            getDraft();
          });
        }
        break;
      case 'unpassReview':
        if (routeProp.sourse === 'draft') {
          if (!remake) {
            message.error('请输入不通过的原因');
            return;
          }
          datas.status = 0; // 审核状态（1通过，2未通过）
          datas.remake = remake;
          datas.supplier_id = userInfo;

          draftReviewDetail(datas).then(() => {
            message.info('操作成功');
            history.goBack();
            // getDraft();
          });
        }
        break;
      case 'sendSave':
        datas.on_shelf = 1; // 商品上下架（0下架，1上架）
        datas.stock = details.stock;
        datas.supplier_id = userInfo;
        updateSnapShotDetail(datas).then(() => {
          message.info('操作成功');
          getDraft();
        });

        break;
      default:
        datas.on_shelf = !details.on_shelf; // 商品上下架（0下架，1上架）
        datas.stock = details.stock;
        datas.supplier_id = userInfo;
        updateSnapShotDetail(datas).then(() => {
          message.info('操作成功');
          getDraft();
          // history.goBack();
        });
        break;
    }
  };

  // 媒体库弹窗事件确定监听
  const mediahandleOk = () => {
    setMediaVisible(false);
    if (selFrom === 'mainImg') {
      // 设置主图
      const obj = {
        uid: 1,
        name: '主图',
        status: 'done',
        url: mediaImg[0],
        baseUrl: mediaImg[0],
      };
      // 设置默认主图
      setMainFileList([obj]);
    } else {
      const arr = mediaImg.map((item, index) => {
        return {
          uid: index,
          name: `轮播图${index}`,
          status: 'done',
          url: item,
          baseUrl: item,
        };
      });

      setFileList(arr);
    }
  };

  // 媒体库弹窗事件取消监听
  const mediahandleCancel = () => {
    setMediaVisible(false);
    setMediaImg([]);
  };

  // 获取媒体库选中的图片
  const getImgs = (e) => {
    setMediaImg(e);
  };

  useEffect(() => {
    getCategoryList().then((r) => {
      setOptions(r.data);
    });
    getCityList().then((r) => {
      setCityOptions(r);
    });
  }, []);

  useEffect(() => {
    if (routeProp.sourse && routeProp.id) {
      getDraft();
    }
  }, [routeProp]);

  return (
    <PageContainer
      header={{
        title: '详情',
        onBack: () => {
          history.goBack();
        },
      }}
    >
      <Spin size="large" spinning={loading}>
        <Card bordered={false}>
          <ProForm
            formRef={formBox}
            submitter={{
              // 配置按钮的属性
              resetButtonProps: {
                style: {
                  // 隐藏重置按钮
                  display: 'none',
                },
              },
              submitButtonProps: {
                style: {
                  // 隐藏提交按钮
                  display: 'false',
                },
              },
              render: (p) => {
                let arr: any[] = [];
                if (routeProp.sourse === 'draft') {
                  if (
                    details.check_type === 1 ||
                    details.check_type === 2 ||
                    details.check_type === 4
                  ) {
                    arr = [
                      <Button
                        type={'primary'}
                        key="passReview"
                        onClick={() => {
                          p.form?.submit?.();
                          // setPutType('sendSave');
                          setPutType(() => {
                            return 'passReview';
                          });
                        }}
                      >
                        审核通过
                      </Button>,
                      <Button
                        type={'primary'}
                        key="unpassReview"
                        className={styles.bgGreen}
                        onClick={() => {
                          p.form?.submit?.();
                          // setPutType('sendPut');
                          setPutType(() => {
                            return 'unpassReview';
                          });
                        }}
                      >
                        审核不通过
                      </Button>,
                    ];
                  } else if (details.check_type === 3) {
                    arr = [
                      <Button
                        type={'primary'}
                        key="passReview"
                        onClick={() => {
                          p.form?.submit?.();
                          // setPutType('unpassReview');
                          setPutType(() => {
                            return 'passReview';
                          });
                        }}
                      >
                        允许下架
                      </Button>,
                      <Button
                        type={'primary'}
                        key="unpassReview"
                        className={styles.bgGreen}
                        onClick={() => {
                          p.form?.submit?.();
                          // setPutType('unpassReview');
                          setPutType(() => {
                            return 'unpassReview';
                          });
                        }}
                      >
                        不允许下架
                      </Button>,
                    ];
                  }
                } else {
                  arr = [
                    <Button
                      type={'primary'}
                      key="sendSave"
                      onClick={() => {
                        p.form?.submit?.();
                        // setPutType('sendSave');
                        setPutType(() => {
                          return 'sendSave';
                        });
                      }}
                    >
                      保存修改
                    </Button>,
                    <Button
                      type={'primary'}
                      key="sendDown"
                      className={styles.bgYellow}
                      onClick={() => {
                        p.form?.submit?.();
                        // setPutType('sendDown');
                        setPutType(() => {
                          return 'sendDown';
                        });
                      }}
                    >
                      {details.on_shelf === 1 ? '下架' : '上架'}
                    </Button>,
                  ];
                }
                return arr;
              },
            }}
            onFinish={async (e: any) => {
              console.log('onFinish', e);
              getFormType(e);
            }}
          >
            <ProFormText
              width="lg"
              name="name"
              label="名称"
              initialValue={details.name || ''}
              rules={[
                {
                  required: true,
                  message: '请输入名称',
                },
              ]}
            />
            <ProFormTextArea
              name="summary"
              width="lg"
              label="简述"
              placeholder="请输入简述"
              initialValue={details.summary || ''}
              rules={[
                {
                  required: true,
                  message: '请输入简述',
                },
              ]}
            />
            <ProFormText
              width="lg"
              name="sku"
              label="SKU"
              initialValue={details.sku || ''}
              rules={[
                {
                  required: true,
                  message: '请输入SKU',
                },
              ]}
            />
            <FormItem {...formItemLayout} label="分类" name="cate_id">
              <Cascader
                options={options}
                changeOnSelect
                defaultValue={details.cate_id}
                style={{ width: 438, marginTop: 24 }}
                name="cate_id"
              />
            </FormItem>
            <ProFormSelect
              width="lg"
              name="product_label"
              label="标签"
              mode="multiple"
              request={labelOpt}
              placeholder="请选择标签"
              initialValue={details.product_label}
            />
            <ProFormDigit
              label="供货价"
              width="lg"
              name="supply_price"
              min={1}
              fieldProps={{
                formatter: limitDecimalsF,
                parser: limitDecimalsP,
              }}
              rules={[
                {
                  required: true,
                  message: '请输入价格',
                },
              ]}
              initialValue={details.supply_price || 1}
            />

            <ProFormList
              name="product_sale"
              initialValue={details.product_sale}
              creatorButtonProps={{
                position: 'bottom',
                creatorButtonText: '添加',
              }}
              // 新建一行默认值
              creatorRecord={{
                num: 0,
                price: 0,
              }}
            >
              <Card className={styles.marginBottomXs}>
                <ProFormGroup>
                  <Space>
                    <div>
                      <div className={styles.marginBottomXs}>每单满</div>
                    </div>
                    <ProFormDigit
                      label=""
                      name="num"
                      min={1}
                      // fieldProps={{
                      //   formatter: limitDecimalsF,
                      //   parser: limitDecimalsP,
                      // }}
                      rules={[
                        {
                          required: true,
                          type: 'integer',
                          message: '请填写数量',
                        },
                      ]}
                    />
                    <div>
                      <div className={styles.marginBottomXs}>件时价格为</div>
                    </div>
                    <ProFormDigit
                      name="price"
                      min={1}
                      fieldProps={{
                        formatter: limitDecimalsF,
                        parser: limitDecimalsP,
                      }}
                      rules={[
                        {
                          required: true,
                          message: '请填写价格',
                        },
                      ]}
                    />
                  </Space>
                </ProFormGroup>
              </Card>
            </ProFormList>

            <div className={styles.marginBottomXs}>
              <label htmlFor="selFilter">库存</label>
            </div>

            {routeProp.sourse === 'draft' ? (
              <ProFormDigit
                width="lg"
                label=""
                placeholder="请输入库存"
                initialValue={details.stock || 1}
                name="stock"
                min={1}
                rules={[
                  {
                    required: true,
                    message: '请完善库存',
                  },
                ]}
              />
            ) : null}

            {/* 修改库存时展现 */}
            {routeProp.id && routeProp.sourse === 'snapshot' ? (
              <Card style={{ marginBottom: '24px' }}>
                <ProFormGroup>
                  <ProFormText
                    label="当前"
                    fieldProps={{ type: 'text', value: details.stock ?? 0, disabled: true }}
                    width="sm"
                    name="snapshotStock"
                  />
                  <ProFormText
                    label="待确定"
                    fieldProps={{
                      type: 'text',
                      defaultValue: details.pending_confirm_count ?? 0,
                      disabled: true,
                    }}
                    width="sm"
                    name="snapshotConfirm"
                  />
                  <ProFormText
                    label="待发货"
                    fieldProps={{
                      type: 'text',
                      defaultValue: details.pending_deliver_count ?? 0,
                      disabled: true,
                    }}
                    width="sm"
                    name="snapshotDeliver"
                  />
                </ProFormGroup>
                <ProFormGroup>
                  <Button
                    type="primary"
                    danger
                    className={styles.marginBottomXs}
                    onClick={() => {
                      minusStock(2);
                    }}
                  >
                    申请更新
                  </Button>
                  <ProFormDigit
                    width="lg"
                    label=""
                    placeholder="请输入库存"
                    initialValue="1"
                    name="setStock"
                    min={1}
                    rules={[
                      {
                        required: true,
                        message: '请填写库存',
                      },
                    ]}
                    fieldProps={{
                      onChange: (e) => {
                        setSnapShot(e);
                      },
                    }}
                  />
                  <Button
                    type="primary"
                    className={styles.marginBottomXs}
                    onClick={() => {
                      addStock(1);
                    }}
                  >
                    确认增加
                  </Button>
                </ProFormGroup>
              </Card>
            ) : null}
            <div className={styles.marginBottomXs}>
              <label htmlFor="rule">发货地限制</label>
            </div>
            <ProFormGroup>
              <Space>
                <div>
                  <div className={styles.marginBottomXs}>除以下区域外，均默认</div>
                </div>
                <ProFormSelect
                  name="rule"
                  showSearch
                  style={{ width: 200 }}
                  placeholder="可以/不可以"
                  initialValue={details?.delivery_address?.rule || '1'}
                  request={async () => [
                    { label: '可以', value: '1' },
                    { label: '不可以', value: '0' },
                  ]}
                  fieldProps={{
                    optionFilterProp: 'children',
                  }}
                  // rules={[
                  //   {
                  //     required: true,
                  //   },
                  // ]}
                ></ProFormSelect>
                <div>
                  <div className={styles.marginBottomXs}>发货</div>
                </div>
              </Space>
            </ProFormGroup>
            <ProFormList
              name="delivery_address"
              initialValue={deliveryAddress}
              creatorButtonProps={{
                position: 'bottom',
                creatorButtonText: '添加',
              }}
              // 新建一行默认值
              creatorRecord={{
                shengshiqu: ['北京市', '北京市', '东城区'],
                freight_data: 1,
                num: '0',
                price: '0',
              }}
              itemRender={({ listDom, action }, listMeta) => {
                return (
                  <Card className={styles.marginBottomXs}>
                    {listDom}
                    {action}
                    <ProForm.Item name="shengshiqu">
                      <Cascader
                        name="shengshiqu"
                        options={cityOptions}
                        placeholder="省/市/区"
                        showSearch={{ filter: cityFilter }}
                        style={{ width: 438, marginBottom: 10 }}
                        defaultValue={listMeta.record.shengshiqu}
                      />
                    </ProForm.Item>
                    <ProFormGroup>
                      <ProFormRadio.Group
                        name="freight_data"
                        options={[
                          {
                            label: '(与默认设置相反)',
                            value: 1,
                          },
                          {
                            label: (
                              <Space>
                                <div>
                                  <div className={styles.marginBottomXs}>每</div>
                                </div>
                                <ProFormDigit
                                  label=""
                                  name="num"
                                  min={1}
                                  fieldProps={{
                                    formatter: limitDecimalsF,
                                    parser: limitDecimalsP,
                                  }}
                                />
                                <div>
                                  <div className={styles.marginBottomXs}>件加运费</div>
                                </div>
                                <ProFormDigit
                                  name="price"
                                  min={1}
                                  fieldProps={{
                                    formatter: limitDecimalsF,
                                    parser: limitDecimalsP,
                                  }}
                                />
                              </Space>
                            ),
                            value: 0,
                          },
                        ]}
                      ></ProFormRadio.Group>
                    </ProFormGroup>
                  </Card>
                );
              }}
            ></ProFormList>

            <ProFormRadio.Group
              name="allow_oversell"
              label="是否允许超售"
              required={true}
              initialValue={details.allow_oversell || '1'}
              rules={[
                {
                  required: true,
                  message: '请选择',
                },
              ]}
              options={[
                {
                  label: '允许',
                  value: '1',
                },
                {
                  label: '不允许',
                  value: '0',
                },
              ]}
            />
            <div className={styles.marginBottomXs}>
              <label htmlFor="deadTime">发货时限</label>
            </div>
            <ProFormGroup>
              <Space>
                <div>
                  <div className={styles.marginBottomXs}>收到订单后</div>
                </div>
                <ProFormDigit
                  width="lg"
                  label=""
                  placeholder="限时n小时内"
                  initialValue={details.deliver_time_out || 48}
                  name="deliver_time_out"
                  min={1}
                  rules={[
                    {
                      required: true,
                      message: '请完善',
                    },
                  ]}
                />
                <div>
                  <div className={styles.marginBottomXs}>小时内发货</div>
                </div>
              </Space>
            </ProFormGroup>

            <div className={styles.marginBottomXs}>
              <Space>
                <label htmlFor="thumbImg">商品主图</label>
                {mainFileList.length < 1 ? (
                  <Button
                    type={'primary'}
                    onClick={() => {
                      setMediaVisible(true);
                      setSelFrom('mainImg');
                    }}
                  >
                    媒体库中选择
                  </Button>
                ) : null}
              </Space>
            </div>
            {/* 图片上传组件 */}
            <PicturesWall
              fileList={mainFileList}
              setFileList={(val) => {
                setMainFileList(val);
              }}
              userId={userInfo}
              maxLen={1}
            ></PicturesWall>

            <div className={styles.marginBottomXs}>
              <Space>
                <label htmlFor="thumbImg">缩略图</label>
                {fileList.length < 8 ? (
                  <Button
                    type={'primary'}
                    onClick={() => {
                      setMediaVisible(true);
                      setSelFrom('swiperImg');
                    }}
                  >
                    媒体库中选择
                  </Button>
                ) : null}
              </Space>
            </div>
            {/* 图片上传组件 */}
            <PicturesWall
              fileList={fileList}
              setFileList={(val) => {
                setFileList(val);
              }}
              userId={userInfo}
              maxLen={8}
            ></PicturesWall>

            <Card className={styles.marginBottomXs}>
              <div className={styles.marginBottomXs}>详情</div>
              <RichEditor preDetail={richData} getInputData={getRichData}></RichEditor>
            </Card>

            {/* 不通过的理由 */}
            {details.check_type < 5 ? (
              <ProFormTextArea name="remake" label="理由" placeholder="请输入不通过的原因" />
            ) : null}
          </ProForm>
        </Card>
      </Spin>

      {/* 媒体库弹窗 */}
      <Modal
        visible={mediaVisible}
        title="我的媒体库"
        width={'70%'}
        onOk={mediahandleOk}
        onCancel={mediahandleCancel}
        // zIndex={10010}
        destroyOnClose
      >
        <MediaLibrary
          selFrom={selFrom}
          canSelImg={true}
          supplier_id={userInfo}
          getImgs={(e) => getImgs(e)}
        ></MediaLibrary>
      </Modal>
    </PageContainer>
  );
};

export default connect(({ settings, user }: ConnectState) => ({ ...settings, user }))(BasicForm);
