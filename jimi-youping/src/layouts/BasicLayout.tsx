/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 *
 * @see You can view component api by: https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout, { DefaultFooter, WaterMark } from '@ant-design/pro-layout';
import type {
  MenuDataItem,
  BasicLayoutProps as ProLayoutProps,
  Settings,
} from '@ant-design/pro-layout';

import React, { useEffect, useState } from 'react';
import type { Dispatch } from 'umi';
import { Link, connect, history } from 'umi';
// import { GithubOutlined } from '@ant-design/icons';
import { Result, Button } from 'antd';

import { getAuthority } from '@/utils/authority';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import type { ConnectState } from '@/models/connect';
import { getMatchMenu } from '@umijs/route-utils';
import logo from '../assets/logo-wide.png';

const noMatch = (
  <Result
    status={403}
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button type="primary">
        <Link to="/user/login">登录</Link>
      </Button>
    }
  />
);
export type BasicLayoutProps = {
  breadcrumbNameMap: Record<string, MenuDataItem>;
  route: ProLayoutProps['route'] & {
    authority: string[];
  };
  settings: Settings;
  dispatch: Dispatch;
} & ProLayoutProps;
export type BasicLayoutContext = { [K in 'location']: BasicLayoutProps[K] } & {
  breadcrumbNameMap: Record<string, MenuDataItem>;
};

/** Use Authorized check all menu item */
const menuDataRender = (menuList: MenuDataItem[]): MenuDataItem[] => {
  return menuList.map((item) => {
    const localItem = {
      ...item,
      children: item.children ? menuDataRender(item.children) : undefined,
      onTitleClick: () => {
        // 判断是否含有子菜单，有子菜单的可以点击一级菜单跳转
        if (item?.children) {
          // 跳转
          history.push({
            pathname: item.path,
            query: {},
          });
        }
      },
    };
    const i = Authorized.check(item.authority, localItem, null) as MenuDataItem;
    return i;
  });
};

const defaultFooterDom = (
  <DefaultFooter
    copyright={`${new Date().getFullYear()} 极米优品技术支持`}
    links={[
      {
        key: '极米优品',
        title: '极米优品',
        href: '',
        blankTarget: true,
      },
      // {
      //   key: 'github',
      //   title: <GithubOutlined />,
      //   href: 'https://github.com/ant-design/ant-design-pro',
      //   blankTarget: true,
      // },
      // {
      //   key: 'Ant Design Pro',
      //   title: 'Ant Design Pro',
      //   href: 'https://pro.ant.design',
      //   blankTarget: true,
      // },
    ]}
  />
);

let menuDataRef: MenuDataItem[] = [];
const BasicLayout: React.FC<BasicLayoutProps> = (props) => {
  const {
    dispatch,
    children,
    settings,
    location = {
      pathname: '/',
    },
  } = props;

  const [isReady, setIsReady] = useState(false);

  // get children authority
  const [authority, setAuthority] = useState();
  const setAuthorityBefore = (pathname?: string) => {
    const matchMenus = getMatchMenu(pathname || '/', menuDataRef);
    const matchMenu = matchMenus.pop();

    if (!matchMenu) return;
    setAuthority(matchMenu.authority);
    setIsReady(true);
  };
  useEffect(() => setAuthorityBefore(location.pathname), [location.pathname]);

  const menu: Settings['menu'] = {
    request(params, defaultMenuDat) {
      const userAuthority = getAuthority();
      const userInfo = dispatch({
        type: 'user/fetchCurrent',
      });
      console.log('userInfo', userInfo);

      if (userAuthority?.length) return Promise.resolve(defaultMenuDat);
      return userInfo.then(() => defaultMenuDat);
    },
  };

  /** Init variables */
  const handleMenuCollapse = (payload: boolean): void => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  };

  return (
    <>
      <ProLayout
        loading={!isReady}
        logo={logo}
        {...props}
        {...settings}
        iconfontUrl="//at.alicdn.com/t/font_1292640_v86sfljn3kk.css"
        onCollapse={handleMenuCollapse}
        onMenuHeaderClick={() => history.push('/')}
        menu={menu}
        menuItemRender={(menuItemProps, defaultDom) => {
          if (
            menuItemProps.isUrl ||
            !menuItemProps.path ||
            location.pathname === menuItemProps.path
          ) {
            return defaultDom;
          }

          return <Link to={menuItemProps.path}>{defaultDom}</Link>;
        }}
        breadcrumbRender={(routers = []) => [
          {
            path: '/',
            breadcrumbName: '首页',
          },
          ...routers,
        ]}
        itemRender={(route, params, routes, paths) => {
          const first = routes.indexOf(route) === 0;
          return first ? (
            <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
          ) : (
            <span>{route.breadcrumbName}</span>
          );
        }}
        footerRender={() => {
          if (settings.footerRender || settings.footerRender === undefined) {
            return defaultFooterDom;
          }

          return null;
        }}
        menuDataRender={menuDataRender}
        rightContentRender={() => <RightContent />}
        postMenuData={(menuData) => {
          /* 为防止控制台报错, 进行异步处理 */
          setTimeout(() => setAuthorityBefore(location.pathname));
          console.log(1234564564, menuData);
          menuDataRef = menuData || [];
          return menuData || [];
        }}
      >
        <WaterMark content="极米优品">
          <Authorized authority={authority || []} noMatch={noMatch}>
            {children}
          </Authorized>
        </WaterMark>
      </ProLayout>

      {/* <SettingDrawer
       settings={settings}
       onSettingChange={(config) =>
         dispatch({
           type: 'settings/changeSetting',
           payload: config,
         })
       }
      /> */}
    </>
  );
};

export default connect((state: ConnectState) => {
  return {
    collapsed: state.global.collapsed,
    settings: state.settings,
  };
})(BasicLayout);
