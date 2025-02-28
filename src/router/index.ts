import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import Layout from '../views/layout/index.vue';
import Home from '../views/home/index.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Layout',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: 'Home',
        component: Home
      }
    ]
  },
  // 其他路由配置
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});
router.beforeEach((to, from, next) => {
  // 在路由切换之前执行一些操作，例如检查用户是否登录
  // 如果用户未登录，则重定向到登录页面
  // 如果用户已登录，则继续执行路由切换
  console.log('beforeEach', to, from)
  next();
});

export default router;