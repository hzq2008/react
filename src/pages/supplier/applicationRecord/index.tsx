import { Cascader, Space, DatePicker } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { history } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { TempLogItem } from './data.d';
import { queryTempLog, getCategoryList } from './service';

// 草稿

const TableList: React.FC = (props: any) => {
  /** 新建窗口的弹窗 */
  const [curSel, setCurSel] = useState<any>([]);
  const routeProp = props?.location?.query;
  const actionRef = useRef<ActionType>();
  const [options, setOptions] = useState<any>([]); // 级联选项值
  const [myParams, setMyParams] = useState<any>({});

  const checkTypeEnum = {
    1: {
      text: '内容编辑',
      status: 'live',
    },
    2: {
      text: '申请上架',
      status: 'live',
    },
    3: {
      text: '申请下架',
      status: 'live',
    },
    4: {
      text: '新建',
      status: 'live',
    },
    5: {
      text: '减少库存',
      status: 'live',
    },
    6: {
      text: '拒发申请',
      status: 'live',
    },
  };
  const resTypeEnum = {
    0: {
      text: <span style={{ color: 'red' }}>拒绝</span>,
      status: 'die',
    },
    1: {
      text: <span style={{ color: 'green' }}>通过</span>,
      status: 'live',
    },
  };
  // 分类下拉
  const onChange = (e: any) => {
    setCurSel(e);
    setMyParams({
      supplier_id: e[e.length - 1],
    });
  };

  const filter = (inputValue: string | number, path: any) => {
    return path.some(
      (option: any) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1,
    );
  };

  const columns: ProColumns<TempLogItem>[] = [
    {
      title: '供货商',
      key: 'id',
      dataIndex: 'supplier_info',
      width: 150,
      renderText: (val) => `${val.name} `,
      renderFormItem: (item, { type, defaultRender, ...rest }, form) => {
        console.log(item, { ...rest }, form);
        return (
          <Cascader
            options={options}
            onChange={onChange}
            value={curSel}
            changeOnSelect
            showSearch={{ filter }}
          />
        );
      },
    },
    {
      title: '动作',
      dataIndex: 'action',
      hideInSearch: true,
      width: 150,
      valueEnum: checkTypeEnum,
    },
    {
      title: '时间',
      dataIndex: 'add_time',
      valueType: 'dateTime',
      sorter: true,
      renderFormItem: () => <DatePicker.RangePicker showTime />,
      search: {
        transform: (value: [string, string]) => {
          const [start_time, end_time] = value;
          return {
            start: start_time,
            end: end_time,
          };
        },
      },
    },
    {
      title: '结果',
      dataIndex: 'status',
      hideInSearch: true,
      width: 150,
      valueEnum: resTypeEnum,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'right',
      width: 150,
      render: (_, record) => (
        <Space>
          <a
            onClick={() => {
              let pathname;
              let querys = {} as any;
              if (record.action < 6) {
                if (record.status === 1) {
                  pathname = '/supplier/commonDetail';
                  querys = {
                    id: record.product_id.toString(),
                    sourse: 'snapshot',
                  };
                } else {
                  pathname = '/supplier/commonDetail';
                  querys = {
                    id: record.id.toString(),
                    sourse: 'draft',
                    type: 2,
                  };
                }
              } else {
                pathname = '/supplier/ordersDetail';
                querys = {
                  id: record.sub_order_id.toString(),
                };
              }

              // 跳转
              history.push({
                pathname,
                query: {
                  ...querys,
                },
              });
            }}
            key="edit"
          >
            详情
          </a>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    getCategoryList().then((r) => {
      const arr = r.data.map((item: any) => {
        return {
          value: item.id,
          label: item.name,
        };
      });
      setOptions(arr);
    });
  }, []);
  useEffect(() => {
    setCurSel(Number(routeProp.id) ? [Number(routeProp.id)] : []);
    setMyParams({
      supplier_id: routeProp.id,
    });
  }, [routeProp]);
  return (
    <PageContainer>
      <ProTable<TempLogItem>
        headerTitle={'商品列表'}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
          span: 8,
        }}
        pagination={{
          pageSize: 10,
        }}
        scroll={{ x: 1500, y: 600 }}
        // params={myParams}
        request={(params, sorter) => queryTempLog({ ...params, sorter, ...myParams })}
        columns={columns}
        onReset={() => {
          setMyParams({});
          actionRef.current?.reload();
        }}
      />
    </PageContainer>
  );
};

export default TableList;
