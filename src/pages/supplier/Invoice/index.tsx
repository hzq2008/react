import { Cascader, Space } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { history } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { TableListItem } from './data.d';
import { queryInvoiceList, getCategoryList } from './service';

// 发货单

const TableList: React.FC = (props: any) => {
  const [curSel, setCurSel] = useState<any>([]);
  const actionRef = useRef<ActionType>();
  const [options, setOptions] = useState<any>([]); // 级联选项值
  const [myParams, setMyParams] = useState<any>({});
  const routeProp = props?.location?.query;
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

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '内部单号',
      dataIndex: 'order_sn',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '父单号',
      dataIndex: 'father_order_sn',
      ellipsis: true,
      hideInSearch: true,
    },
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
      title: '商品价值',
      dataIndex: 'total_price',
      hideInSearch: true,
      renderText: (val) => `￥ ${val} `,
    },
    {
      title: '商品数量',
      dataIndex: 'product_num',
      hideInSearch: true,
      renderText: (val) => `${val} `,
    },
    {
      title: '物流单号',
      dataIndex: 'delivery_shipping_id',
      hideInSearch: true,
      renderText: (val, recode) => {
        switch (recode.delivery_status) {
          case -2:
            return <span style={{ color: 'red' }}>拒绝拒发申请</span>;
          case -1:
            return <span style={{ color: 'red' }}>申请拒发</span>;
          case 0:
            return <span style={{ color: '#40a9ff' }}>未发货</span>;
          case 1:
            return `${val} `;
          case 2:
            return <span style={{ color: 'red' }}>拒发</span>;
          default:
            return `${val} `;
        }
      },
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
              // 跳转
              history.push({
                pathname: '/supplier/ordersDetail',
                query: {
                  id: record.id.toString(),
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
      <ProTable<TableListItem>
        headerTitle={'发货单列表'}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        pagination={{
          pageSize: 10,
        }}
        scroll={{ x: 1500, y: 600 }}
        // params={myParams}
        request={(params, sorter) => queryInvoiceList({ ...params, sorter, ...myParams })}
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
