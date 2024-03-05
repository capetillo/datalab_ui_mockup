import { createRouter, createWebHistory } from 'vue-router'
import DataSessions from '../views/DataSessionsView.vue'
import ProjectView from '../views/ProjectView.vue'
import Registration from '../views/RegistrationView.vue'

const routes = [
  {
    path: '/',
    name: 'Registration',
    component: Registration
  },
  {
    path: '/projects',
    name: 'ProjectView',
    component: ProjectView
  },
  {
    path: '/datasessions/:sessionId?',
    name: 'DataSessionDetails',
    component: DataSessions,
    props: true
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
