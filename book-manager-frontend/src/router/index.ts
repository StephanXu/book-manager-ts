import Vue from 'vue'
import VueRouter from 'vue-router'
import { getToken } from '@/utils/auth'
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
                component: () => import('@/views/book/Book.vue'),
                meta: {
                    title: '查看馆藏'
                }
            }]
    },
    {
        path: '/borrow',
        name: 'borrow',
        component: Layout,
        redirect: '/borrow/index',
        children: [
            {
                path: 'index',
                name: 'borrow',
                component: () => import('@/views/book/Borrow.vue'),
                meta: {
                    title: '我借的'
                }
            }]
    },
    {
        path: '/library',
        name: 'library',
        component: Layout,
        redirect: '/library/index',
        children: [
            {
                path: 'index',
                name: 'library',
                component: () => import('@/views/inventory/Library.vue'),
                meta: {
                    title: '图书馆'
                }
            }]
    },
    {
        path: '/inventory',
        name: 'inventory',
        component: Layout,
        redirect: '/inventory/book',
        children: [
            {
                path: 'book',
                name: 'inventory-book',
                component: () => import('@/views/inventory/Book.vue'),
                meta: {
                    title: '书库管理'
                }
            }]
    },
    {
        path: '/reader',
        name: 'reader',
        component: Layout,
        redirect: '/reader/index',
        children: [
            {
                path: 'index',
                name: 'inventory-users',
                component: () => import('@/views/inventory/UserManage.vue'),
                meta: {
                    title: '用户管理'
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
    mode: 'history',
    routes
})


router.beforeEach(async (to, from, next) => {
    // determine whether the user has logged in
    const hasToken = getToken()

    document.title = `${to.meta.title} - Borok Library`

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