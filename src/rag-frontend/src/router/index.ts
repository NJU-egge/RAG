//index.ts
import {createRouter, createWebHashHistory} from "vue-router"

const router = createRouter({
    history: createWebHashHistory(),
    routes: [{
        path: '/',
        redirect: '/home',
    }, {
        path: '/home',
        redirect: '/dashboard',
        component: () => import('../views/Home.vue'),
        children: [
            {
                path: '/dashboard',
                name: 'Dashboard',
                component: () => import('../views/Dashboard.vue'),
                meta: {title: 'RAG问答 | CodeCrafts'}
            },{
                path: '/ware',
                name: 'Warehouse',
                component: () => import('../views/ware.vue'),
                meta: { title: '知识库管理 | CodeCrafts' }
            },{
                path: '/image',
                name: 'ImageGenerator',
                component: () => import('../views/image.vue'),
                meta: { title: '表情包生成 | CodeCrafts' }
            },
        ]
    }, {
        path: '/404',
        name: '404',
        component: () => import('../views/NotFound.vue'),
        meta: {title: '404'}
    }, {
        path: '/:catchAll(.*)',
        redirect: '/404'
    }]
})




router.beforeEach((to, _) => {
    //to是即将跳转到的目标路由对象

    //更新浏览器标题栏
    if (to.meta.title) {
        document.title = to.meta.title
    }
})




export {router}
