import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
// import chartsRouter from './modules/charts'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/signin',
    component: () => import('@/views/login/signin'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: 'home',
    children: [
      {
        path: 'home',
        component: () => import('@/views/home/index'),
        name: 'Home',
        meta: { title: '首页', icon: 'dashboard', noCache: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  /** when your routing map is too long, you can split it into small modules **/
  // chartsRouter,
  {
    path: '/jx_xjx',
    component: Layout,
    redirect: 'jd_xjx/list',
    meta: {
      title: '京东竞销',
      icon: 'jd'
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/jd_xjx/list'),
        name: '竞销列表',
        meta: { title: '竞销列表' }
      },
      {
        path: 'my-auction',
        component: () => import('@/views/jd_xjx/my_auction'),
        name: '我的委托',
        meta: { title: '我的委托' }
      },
      {
        path: 'jingxiao',
        component: () => import('@/views/jd_xjx/jingxiao'),
        name: '我的竞销',
        meta: { title: '我的竞销' }
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    redirect: 'system/users',
    meta: {
      title: '系统管理',
      icon: 'user'
    },
    children: [
      {
        path: 'users',
        component: () => import('@/views/system/users'),
        name: '用户',
        meta: { title: '用户', icon: 'user' }
      },
      {
        path: 'other',
        component: () => import('@/views/system/other'),
        name: '其他',
        meta: { title: '其他', icon: 'user' }
      }
    ]
  },

  {
    path: '/clipboard',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/clipboard/index'),
        name: 'ClipboardDemo',
        meta: { title: 'Clipboard', icon: 'clipboard' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
