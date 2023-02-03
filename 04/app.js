// 已在html檔案內取得vue & vue-router & axios

// routerComp
import itemListComp from './routeList.js'; 
import loginComp from './routeLogin.js'; 

// routes
const routes = [{
        path: '/list',
        component: itemListComp
    },
    {
        path: '/',
        component: loginComp
    }
];

const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes,
});

const appDate = {
    // 內容在各route中
    created() {
        // 預設後續的 headers 'Authorization'
        axios.defaults.headers.common['Authorization'] = window.localStorage.getItem('token');
    }
};

Vue.createApp(appDate).use(router).mount('#app');