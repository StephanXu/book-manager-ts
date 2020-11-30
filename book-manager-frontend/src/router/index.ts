import Vue from 'vue'
import VueRouter from 'vue-router'
import { getToken } from '@/utils/auth' // get token from cookie
import Layout from '@/views/layout/Layout.vue'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'index',
        component: Layout,
        redirect: '/book'
    },
    {
        path: '/book',
        name: 'book',
        component: Layout,
        redirect: '/book/index',
        children: [
            {
                path: 'index',
                name: 'book',
                component: () => import('@/views/book/BookList.vue'),
                meta: {
                    title: 'Arguments'
                }
            },
            {
                path: ':argId',
                name: 'singleArgument',
                component: () => import('@/views/book/BookList.vue'),
                props: true,
                meta: {
                    drawer: () => import('@/views/layout/DefaultNavigator.vue'),
                    title: 'Arguments'
                }
            }]
    },
    {
        path: '/inventory',
        name: 'inventory',
        component: Layout,
        redirect: '/inventory/index',
        children: [
            {
                path: 'index',
                name: 'inventory',
                component: () => import('@/views/inventory/Inventory.vue'),
                meta: {
                    drawer: () => import('@/views/inventory/Navigator.vue'),
                    title: '库存概览'
                }
            },
            {
                path: 'library',
                name: 'inventory-library',
                component: () => import('@/views/inventory/Library.vue'),
                meta: {
                    drawer: () => import('@/views/inventory/Navigator.vue'),
                    title: '图书馆管理'
                }
            },
            {
                path: 'book',
                name: 'inventory-book',
                component: () => import('@/views/inventory/Book.vue'),
                meta: {
                    drawer: () => import('@/views/inventory/Navigator.vue'),
                    title: '书籍管理'
                }
            }]
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/login/Login.vue'),
        meta: {
            title: 'Login'
        }
    }
]

const router = new VueRouter({
    // mode: 'history',
    routes
})


router.beforeEach(async (to, from, next) => {
    // determine whether the user has logged in
    const hasToken = getToken()

    document.title = `${to.meta.title} - Ossian Board`

    if (hasToken) {
        if (to.path === '/login') {
            // if is logged in, redirect to the home page
            next({
                path: '/'
            })
        } else {
            const hasRole = store.getters['user/roles'] && store.getters['user/roles'].length > 0
            if (!hasRole) {
                await store.dispatch('user/getInfo')
            }
            next()
        }
    } else {
        if (to.path === '/login') {
            next()
        } else {
            next(`/login`)
        }
    }
})

export default router