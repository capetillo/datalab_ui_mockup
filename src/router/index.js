import { createRouter, createWebHistory } from 'vue-router';
import DataSession from '@/views/DataSession.vue';

const routes = [
  {
    path: '/datasession',
    name: 'DataSession',
    component: DataSession
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
