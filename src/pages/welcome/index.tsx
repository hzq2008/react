// import { Card } from 'antd';
import React from 'react';
// import type { userHome } from './data.d';
// import { getUserhome } from './service';
import Css from './index.less';
import { connect } from 'umi';
import type { ConnectState } from '@/models/connect';
//  欢迎页

const TableList: React.FC = (props) => {
  // const [userData, setUserData] = useState<userHome>({});
  // useEffect(() => {
  //   getUserhome().then((res) => {
  //     setUserData(res);
  //   });
  // }, []);
  const {
    currentUser = {
      avatar: '',
      nickname: '',
    },
  } = props;
  return (
    <div className={Css.container}>
      <div className={Css.header}>欢迎回来~ 亲爱的{currentUser.nickname}</div>
      {/* 上架商品数 */}
      {/* <Card
        style={{ marginTop: 16 }}
        type="inner"
        title="在架商品监控"
        extra={<a href="/goods/snapshot">立即查看</a>}
      >
        <div className="">
          你的在架商品目前数量为
          <span className={Css.success_color}>{userData.product_count ?? 0} </span>件
        </div>
        {userData.product_min_count > 0 ? (
          <div className={Css.danger_color}>
            <span>注意：</span>有<span>{userData.product_min_count ?? 0}</span>
            件库存低于100
          </div>
        ) : null}
      </Card> */}
      {/* 申请待审核 */}
      {/* <Card
        style={{ marginTop: 16 }}
        type="inner"
        title="申请进度监控"
        extra={<a href="/goods/draft">立即查看</a>}
      >
        <div className="">
          你有 <span className={Css.success_color}>{userData.product_temp_count ?? 0} </span>
          申请待审核
        </div>
      </Card> */}
      {/* 发货单待处理 */}
      {/* <Card
        style={{ marginTop: 16 }}
        type="inner"
        title="发货单监控"
        extra={<a href="/orders/index">立即查看</a>}
      >
        <div className="">
          你有 <span className={Css.success_color}>{userData.order_count ?? 0} </span>发货单待处理
        </div>
      </Card> */}
    </div>
  );
};

export default connect(({ user }: ConnectState) => ({ currentUser: user.currentUser }))(TableList);
