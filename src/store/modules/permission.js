import { constantRoutes } from '@/router'
import { getRouters } from '@/api/menu'


const permission = {
  state: {
    routes: [],
    addRoutes: [],
    addMapRoutes:[],
  },
  mutations: {
    SET_ROUTES: (state, routes) => {
      state.addRoutes = routes;
      state.routes = constantRoutes.concat(routes)
    },
  },
  actions: {
    // 生成路由
    GenerateRoutes({ commit }) {
      return new Promise(resolve => {
        // 向后端请求路由数据
        getRouters().then(res => {
          const accessedRoutes = filterAsyncRouter(res.data)
          accessedRoutes.push({ path: '*', redirect: '/404', hidden: true })
          commit('SET_ROUTES', accessedRoutes)
          resolve(accessedRoutes)
        })
      })
    },
  }
}

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap,parentsPath,parentPath) {
  return asyncRouterMap.filter(route => {
    const routePath = route.path?route.path:'';
    route.meta.parentsPath = parentsPath?parentsPath:routePath;
    route.meta.parentPath = parentPath?parentPath:routePath;

    if (route.component) {
      // Layout组件特殊处理
      if (route.component === 'Layout') {
        //route.component = Layout
      } else {
        const packName = route.meta.parentsPath +'-'+routePath;
        route.component = loadView(route.component, packName);
       /* route.component = {
          default: routePath,
          main: loadView(route.component, packName)
        }*/
      }
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children,route.meta.parentsPath,route.meta.parentPath)
    }
    return true
  })
}

export const loadView = (view,packName) => { // 路由懒加载
  return (resolve) =>  require([`@/views/${view}`], resolve)
/*  return (resolve) => import(
    /!* webpackChunkName: "[packName]" *!/
    `@/views/${view}.vue`)*/
}

export default permission
