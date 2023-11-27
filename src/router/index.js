import { createRouter, createWebHistory } from 'vue-router';
import DataSession from '../views/DataSessionView.vue'
import ProjectView from '../views/ProjectView.vue'

const routes = [
    {
        path: '/projects',
        name: 'ProjectView',
        component: ProjectView
    },
  {
    path: '/datasession/:selectedImages',
    name: 'DataSession',
    component: DataSession,
    props: route => ({ selectedImages: route.params.selectedImages ? JSON.parse(route.params.selectedImages) : [] })
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
