// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';

const { REACT_APP_ENV, NODE_ENV } = process.env;
export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  history: {
    type: 'browser',
  },
  base: NODE_ENV === 'production' ? '/operating_panel/' : '/',
  publicPath: NODE_ENV === 'production' ? '/operating_panel/' : '/',
  // locale: {
  //   default: 'zh-CN',
  //   antd: true,
  //   // default true, when it is true, will use `navigator.language` overwrite default
  //   baseNavigator: true,
  // },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/',
      component: '../layouts/BlankLayout',
      routes: [
        {
          path: '/',
          redirect: '/welcome',
        },
        {
          path: '/user',
          component: '../layouts/UserLayout',
          routes: [
            {
              path: '/user',
              redirect: '/user/login',
            },
            {
              name: 'login',
              path: '/user/login',
              component: './User/login',
            },
            {
              name: 'register',
              icon: 'smile',
              path: '/user/register',
              component: './user/register',
            },
            {
              name: 'register-result',
              icon: 'smile',
              path: '/user/register-result',
              component: './user/register-result',
            },
            {
              component: '404',
            },
          ],
        },
        {
          path: '/detail',
          component: '../layouts/BlankLayout',
          routes: [
            // {
            //   name: '商家详情',
            //   // icon: 'smile',
            //   path: '/detail/businessDetail',
            //   component: './supplier/businessDetail',
            // },
            // {
            //   name: '商品详情',
            //   // icon: 'smile',
            //   path: '/detail/commonDetail',
            //   component: './supplier/commonDetail',
            // },
            // {
            //   name: '发货单详情',
            //   // icon: 'smile',
            //   path: '/detail/ordersDetail',
            //   component: './supplier/ordersDetail',
            // },
            // {
            //   name: '分类详情',
            //   // icon: 'smile',
            //   path: '/detail/categoryDetail',
            //   component: './systemSettings/categoryDetail',
            // },
            {
              component: '404',
            },
          ],
        },
        {
          path: '/',
          component: '../layouts/BasicLayout',
          // authority: [''],
          Routes: ['src/pages/Authorized'],
          routes: [
            // {
            //   path: '/',
            //   redirect: '/account',
            // },
            {
              path: '/welcome',
              name: '欢迎',
              authority: ['common'],
              component: './welcome/index',
              // hideInMenu:true
            },
            {
              name: '供货商',
              path: '/supplier',
              icon: 'table',
              authority: ['supplier/index'],
              routes: [
                {
                  path: '/supplier',
                  redirect: '/supplier/index',
                },
                {
                  name: '商家列表',
                  // icon: 'smile',
                  path: '/supplier/index',
                  component: './supplier/index',
                  authority: ['supplier/index'],
                  hideInMenu: true,
                },

                {
                  name: '商品',
                  // icon: 'smile',
                  path: '/supplier/snapshot',
                  component: './supplier/snapshot',
                  authority: ['supplier/prod'],
                },
                {
                  name: '草稿审核',
                  // icon: 'smile',
                  path: '/supplier/draftReview',
                  component: './supplier/draftReview',
                  authority: ['supplier/draftReview'],
                },
                {
                  name: '发货单',
                  // icon: 'smile',
                  path: '/supplier/Invoice',
                  component: './supplier/Invoice',
                  authority: ['supplier/invoice'],
                },
                {
                  name: '申请记录',
                  // icon: 'smile',
                  path: '/supplier/applicationRecord',
                  component: './supplier/applicationRecord',
                  authority: ['supplier/applicationRecord'],
                },
                {
                  name: '商品详情',
                  // icon: 'smile',
                  path: '/supplier/commonDetail',
                  component: './supplier/commonDetail',
                  authority: ['supplier/commonDetail'],
                },
                {
                  name: '商家详情',
                  // icon: 'smile',
                  path: '/supplier/businessDetail',
                  component: './supplier/businessDetail',
                  authority: ['supplier/businessDetail'],
                },
                {
                  name: '发货单详情',
                  // icon: 'smile',
                  path: '/supplier/ordersDetail',
                  component: './supplier/ordersDetail',
                  authority: ['supplier/ordersDetail'],
                },
                {
                  name: '分类详情',
                  // icon: 'smile',
                  path: '/supplier/categoryDetail',
                  component: './systemSettings/categoryDetail',
                  authority: ['supplier/categoryDetail'],
                },

                {
                  component: '404',
                },
              ],
            },

            {
              name: '系统设置',
              path: '/systemSettings',
              icon: 'table',
              authority: ['systemSettings'],
              routes: [
                {
                  path: '/systemSettings',
                  redirect: '/systemSettings/category',
                },
                {
                  name: '分类',
                  path: '/systemSettings/category',
                  // icon: 'table',
                  component: './systemSettings/category',
                  authority: ['systemSettings/category'],
                },

                {
                  component: '404',
                },
              ],
            },

            // {
            //   name: '媒体库',
            //   path: '/mediaGroup',
            //   icon: 'table',
            //   component: './mediaGroup/index',
            //   authority: ['supplier'],
            // },

            // {
            //   path: '/dashboard',
            //   name: 'dashboard',
            //   icon: 'dashboard',
            //   routes: [
            //     {
            //       path: '/',
            //       redirect: '/dashboard/analysis',
            //     },
            //     {
            //       name: 'analysis',
            //       icon: 'smile',
            //       path: '/dashboard/analysis',
            //       component: './dashboard/analysis',
            //       authority: ['orders'],
            //     },
            //     {
            //       name: 'monitor',
            //       icon: 'smile',
            //       path: '/dashboard/monitor',
            //       component: './dashboard/monitor',
            //       authority: ['orders'],
            //     },
            //     {
            //       name: 'workplace',
            //       icon: 'smile',
            //       path: '/dashboard/workplace',
            //       component: './dashboard/workplace',
            //       authority: ['orders'],
            //     },
            //   ],
            // },

            // {
            //   path: '/form',
            //   icon: 'form',
            //   name: 'form',
            //   routes: [
            //     {
            //       path: '/',
            //       redirect: '/form/basic-form',
            //     },
            //     {
            //       name: 'basic-form',
            //       icon: 'smile',
            //       path: '/form/basic-form',
            //       component: './form/basic-form',
            //       authority: ['orders'],
            //     },
            //     {
            //       name: 'step-form',
            //       icon: 'smile',
            //       path: '/form/step-form',
            //       component: './form/step-form',
            //       authority: ['orders'],
            //     },
            //     {
            //       name: 'advanced-form',
            //       icon: 'smile',
            //       path: '/form/advanced-form',
            //       component: './form/advanced-form',
            //       authority: ['orders'],
            //     },
            //   ],
            // },

            // {
            //   path: '/list',
            //   icon: 'table',
            //   name: 'list',
            //   routes: [
            //     {
            //       path: '/list/search',
            //       name: 'search-list',
            //       component: './list/search',
            //       routes: [
            //         {
            //           path: '/list/search',
            //           redirect: '/list/search/articles',
            //         },
            //         {
            //           name: 'articles',
            //           icon: 'smile',
            //           path: '/list/search/articles',
            //           component: './list/search/articles',
            //           authority: ['orders'],
            //         },
            //         {
            //           name: 'projects',
            //           icon: 'smile',
            //           path: '/list/search/projects',
            //           component: './list/search/projects',
            //           authority: ['orders'],
            //         },
            //         {
            //           name: 'applications',
            //           icon: 'smile',
            //           path: '/list/search/applications',
            //           component: './list/search/applications',
            //           authority: ['orders'],
            //         },
            //       ],
            //     },
            //     {
            //       path: '/',
            //       redirect: '/list/table-list',
            //     },
            //     {
            //       name: 'table-list',
            //       icon: 'smile',
            //       path: '/list/table-list',
            //       component: './list/table-list',
            //       authority: ['orders'],
            //     },
            //     {
            //       name: 'basic-list',
            //       icon: 'smile',
            //       path: '/list/basic-list',
            //       component: './list/basic-list',
            //       authority: ['orders'],
            //     },
            //     {
            //       name: 'card-list',
            //       icon: 'smile',
            //       path: '/list/card-list',
            //       component: './list/card-list',
            //       authority: ['orders'],
            //     },
            //   ],
            // },

            // {
            //   path: '/profile',
            //   name: 'profile',
            //   icon: 'profile',
            //   routes: [
            //     {
            //       path: '/',
            //       redirect: '/profile/basic',
            //     },
            //     {
            //       name: 'basic',
            //       icon: 'smile',
            //       path: '/profile/basic',
            //       component: './profile/basic',
            //       authority: ['orders'],
            //     },
            //     {
            //       name: 'advanced',
            //       icon: 'smile',
            //       path: '/profile/advanced',
            //       component: './profile/advanced',
            //       authority: ['orders'],
            //     },
            //   ],
            // },

            // {
            //   name: 'result',
            //   icon: 'CheckCircleOutlined',
            //   path: '/result',
            //   routes: [
            //     {
            //       path: '/',
            //       redirect: '/result/success',
            //     },
            //     {
            //       name: 'success',
            //       icon: 'smile',
            //       path: '/result/success',
            //       component: './result/success',
            //       authority: ['orders'],
            //     },
            //     {
            //       name: 'fail',
            //       icon: 'smile',
            //       path: '/result/fail',
            //       component: './result/fail',
            //       authority: ['orders'],
            //     },
            //   ],
            // },

            // {
            //   name: 'exception',
            //   icon: 'warning',
            //   path: '/exception',
            //   routes: [
            //     {
            //       path: '/',
            //       redirect: '/exception/403',
            //     },
            //     {
            //       name: '403',
            //       icon: 'smile',
            //       path: '/exception/403',
            //       component: './exception/403',
            //       authority: ['orders'],
            //     },
            //     {
            //       name: '404',
            //       icon: 'smile',
            //       path: '/exception/404',
            //       component: './exception/404',
            //       authority: ['orders'],
            //     },
            //     {
            //       name: '500',
            //       icon: 'smile',
            //       path: '/exception/500',
            //       component: './exception/500',
            //       authority: ['orders'],
            //     },
            //   ],
            // },

            // {
            //   name: '用户',
            //   path: '/account',
            //   icon: 'user',
            //   authority: ['user'],
            //   routes: [
            //     {
            //       path: '/account',
            //       redirect: '/account/settings',
            //     },
            //     // {
            //     //   name: '个人中心',
            //     //   icon: 'smile',
            //     //   path: '/account/center',
            //     //   component: './account/center',
            //     //   authority: ['user'],
            //     // },
            //     {
            //       name: '个人设置',
            //       icon: 'smile',
            //       path: '/account/settings',
            //       component: './account/settings',
            //       authority: ['user'],
            //     },
            //   ],
            // },

            // {
            //   name: 'editor',
            //   icon: 'highlight',
            //   path: '/editor',
            //   routes: [
            //     {
            //       path: '/',
            //       redirect: '/editor/flow',
            //     },
            //     {
            //       name: 'flow',
            //       icon: 'smile',
            //       path: '/editor/flow',
            //       component: './editor/flow',
            //       authority: ['orders'],
            //     },
            //     {
            //       name: 'mind',
            //       icon: 'smile',
            //       path: '/editor/mind',
            //       component: './editor/mind',
            //       authority: ['orders'],
            //     },
            //     {
            //       name: 'koni',
            //       icon: 'smile',
            //       path: '/editor/koni',
            //       component: './editor/koni',
            //       authority: ['orders'],
            //     },
            //   ],
            // },

            {
              component: '404',
            },
          ],
        },
      ],
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor,
  },
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  esbuild: {},
});
