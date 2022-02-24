import { Image, Space } from 'antd';
import React, { useState, useRef } from 'react';
import { history } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { TableListItem } from './data.d';
import { queryProductTempList } from './service';
import Css from './style.less';

// 草稿

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [myParams, setMyParams] = useState<any>({});

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '企业名称',
      dataIndex: 'name',
      tip: '名称是唯一的 key',
      ellipsis: true,
      width: 550,
      fixed: 'left',
      render: (dom: any, entity: any) => {
        return (
          <a className={[Css.flex, Css.flexCenter].join(' ')}>
            {entity.thumb_url ? <Image src={entity.thumb_url} className={Css.avatar} /> : null}
            {dom}
          </a>
        );
      },
    },

    {
      title: '在售商品',
      dataIndex: 'total_sale_product',
      // sorter: true,
      width: 150,
      hideInSearch: true,
      // renderText: (val: string) => `${val} `,
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
                pathname: '/supplier/businessDetail',
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

  return (
    <PageContainer>
      <ProTable<TableListItem>
        headerTitle={''}
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
        request={(params, sorter) => queryProductTempList({ ...params, sorter, ...myParams })}
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
