import React, { PureComponent } from 'react';

import { Row, Col } from 'antd';
// 媒体库
import MediaLibrary from '../../../components/MediaLibrary';
import { PageContainer } from '@ant-design/pro-layout';
// import type { ProColumns, ActionType } from '@ant-design/pro-table';
// import ProTable from '@ant-design/pro-table';
// import type { FormInstance } from 'antd';
// import { ModalForm, ProFormText, ProFormSelect } from '@ant-design/pro-form';
// import { history } from 'umi';

// import type { Order } from './data.d';
// import { getOrderList, updateExpress, getExpressList, refuseDelivery } from './service';

type StateProps = {};
type DispatchProps = {};
type OwnProps = {};
type OwnState = {};

class Comp extends PureComponent<OwnProps & StateProps & DispatchProps, OwnState> {
  // constructor(props) {
  //   super(props);
  // }

  state = {
    modalVisible: false,
    expressList: [],
    currType: 'exp',
    currRow: { id: '' },
  };

  componentDidMount() {}

  render() {
    return (
      <PageContainer
        header={{
          title: '我的媒体库',
        }}
      >
        <Row>
          <Col span={24}>
            <div style={{ background: '#fff', padding: '20px', borderRadius: '10px' }}>
              <MediaLibrary canSelImg={false}></MediaLibrary>
            </div>
          </Col>
        </Row>
      </PageContainer>
    );
  }
}

export default Comp;
