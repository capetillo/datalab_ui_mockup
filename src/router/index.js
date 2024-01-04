import { createRouter, createWebHistory } from 'vue-router';
import DataSessions from '../views/DataSessionsView.vue'
import ProjectView from '../views/ProjectView.vue'
import Home from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
      path: '/projects',
      name: 'ProjectView',
      component: ProjectView
  },
  {
    path: '/datasessions/',
    name: 'DataSessions',
    component: DataSessions,
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
