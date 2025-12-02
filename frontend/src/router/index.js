import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue')
                },
                {
                    path: 'wa',
                    name: 'wa',
                    component: () => import('@/views/Whatsapp.vue')
                },
                {
                    path: 'wa/numbers',
                    name: 'wa-numbers',
                    component: () => import('@/views/NumberList.vue')   // <--- BARU
                }
            ]
        },

        // fallback
        {
            path: '/pages/notfound',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        },
        {
            path: '/:pathMatch(.*)*',
            redirect: '/pages/notfound'
        }
    ]
});

export default router;
