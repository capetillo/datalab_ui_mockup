import { createRouter, createWebHistory } from 'vue-router';
import DataSessionView from '../views/DataSessionView.vue'
import ProjectView from '../views/ProjectView.vue'



const routes = [
    {
        path: '/projects',
        name: 'Project',
        component: ProjectView
    },
    {
        path: '/datasession',
        name: 'DataSession',
        component: DataSessionView
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router;
