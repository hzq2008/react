import React, { PureComponent } from 'react';
import { Button } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { FormInstance } from 'antd';
import { history } from 'umi';
import { PlusOutlined } from '@ant-design/icons';
import { getOrderList } from './service';

type StateProps = {};
type DispatchProps = {};
type OwnProps = {};
type OwnState = {};

// 系统设置---分类
class Comp extends PureComponent<OwnProps & StateProps & DispatchProps, OwnState> {
  // constructor(props) {
  //   super(props);
  // }

  state = {
    modalVisible: false,
    currRow: { id: '' },
    myParams: {},
  };

  componentDidMount() {}
  // componentWillUnmount() {}

  toDetail(t: string, id?: string | number) {
    const param = {
      type: t,
    };
    if (id) {
      param.id = id.toString();
    }
    history.push({
      pathname: '/supplier/categoryDetail',
      query: param,
    });
  }

  columns: ProColumns<any>[] = [
    {
      title: '名称',
      dataIndex: 'name',
    },

    {
      title: '操作',
      hideInSearch: true,
      width: 200,
      render: (_, record) => {
        return (
          <>
            <Button
              type="text"
              style={{ color: '#40a9ff' }}
              onClick={() => this.toDetail('edit', record.id)}
            >
              详情
            </Button>
          </>
        );
      },
    },
  ];

  actionRef = React.createRef<ActionType>();
  formRef = React.createRef<FormInstance>();

  render() {
    return (
      <PageHeaderWrapper
        header={{
          title: '发货单详情',
        }}
      >
        <ProTable
          // headerTitle="查询表格"
          actionRef={this.actionRef}
          rowKey="id"
          request={(params, sorter) => getOrderList({ ...params, sorter, ...this.state.myParams })}
          columns={this.columns}
          // rowSelection={{}}
          onReset={() => {
            this.setState({
              myParams: {},
            });
            this.actionRef.current?.reload();
          }}
          toolBarRender={() => [
            <Button
              key="button"
              icon={<PlusOutlined />}
              type="primary"
              onClick={() => this.toDetail('create')}
            >
              新建
            </Button>,
          ]}
        />
      </PageHeaderWrapper>
    );
  }
}

export default Comp;
// export default connect<StateProps, DispatchProps, OwnProps, {}>(
//   (state) => ({}),
//   (dispatch) => ({}),
// )(Comp);
