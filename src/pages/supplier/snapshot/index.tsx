import { Image, Cascader, Space } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { history } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { TableListItem } from './data.d';
import { queryProductTempList, getCategoryList } from './service';
import Css from './style.less';

const TableList: React.FC = (props: any) => {
  const routeProp = props?.location?.query;
  const [curSel, setCurSel] = useState<any>([]);
  const actionRef = useRef<ActionType>();
  const [options, setOptions] = useState<any>([]); // 级联选项值
  const [myParams, setMyParams] = useState<any>({});

  const checkTypeEnum = {
    0: {
      text: '否',
      status: 'die',
    },
    1: {
      text: '是',
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

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '商品名称',
      dataIndex: 'name',
      tip: '名称是唯一的 key',
      ellipsis: true,
      width: 350,
      fixed: 'left',
      render: (dom: any, entity: any) => {
        return (
          <a className={[Css.flex, Css.flexCenter].join(' ')}>
            {/* <Space > */}
            {entity.thumb_url ? <Image src={entity.thumb_url} className={Css.avatar} /> : null}

            {dom}
            {/* </Space> */}
          </a>
        );
      },
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
      title: '库存',
      dataIndex: 'stock',
      hideInSearch: true,
      sorter: true,
      width: 150,
    },
    {
      title: '申请状态',
      dataIndex: 'on_shelf',
      hideInSearch: true,
      width: 150,
      valueEnum: checkTypeEnum,
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
                pathname: '/supplier/commonDetail',
                query: {
                  id: record.id.toString(),
                  sourse: 'snapshot',
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
        headerTitle={'商品列表'}
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
