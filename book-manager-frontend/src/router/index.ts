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
                    drawer: () => import('@/views/layout/DefaultNavigator.vue'),
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