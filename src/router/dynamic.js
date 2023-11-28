/* Layout */
//import Layout from '@/layout_new'
export default (parentPath,childrenList,parentsPath,title) => {
  return {
    path: '/'+parentPath,
  //  component: Layout,
    hidden: true,
    redirect: "noRedirect",
    children: filterAsyncRouterChildren(childrenList,parentsPath,parentPath),
    //meta: {title: title,}
  }
};
// 遍历数组，动态生成路由子列表
function filterAsyncRouterChildren(asyncRouterMap,parentsPath,parentPath) {
  return asyncRouterMap.filter(route => {
    route.meta={ title: route.title, icon: route.icon,parentsPath: parentsPath,parentPath:parentPath };
    route.hidden = true;
    route.component = loadViewLazy(route.component);
    return true
  })
}
export const loadViewLazy = (view) => { // 路由懒加载
  return (resolve) =>  require([`@/views/${view}`], resolve)
}
