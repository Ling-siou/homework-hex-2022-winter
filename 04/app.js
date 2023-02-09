// 已在html檔案內取得vue & vue-router & axios

// routerPages
import itemListPage from './page/routeList.js'; 
import loginPage from './page/routeLogin.js'; 

// routes
const routes = [{
        path: '/list',
        component: itemListPage
    },
    {
        path: '/',
        component: loginPage
    }
];

const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes,
});

const appDate = {};

Vue.createApp(appDate).use(router).mount('#app');