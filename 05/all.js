// import {createApp, component} from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.47/vue.esm-browser.min.js';

import { apiUrl, adminPath } from './config.js';
import productsComp from './productsComp.js';
import cartList from './cartList.js';



const app = Vue.createApp({
    data() {
        return {
            cartList:[],
            text: '預設',
            isLoading: false
        };
    },
    components: {
        productsComp,
        cartList
    },
    created() {
        this.getCartData();
    },
    methods: {
        test(val) {
            console.log(`addItemInCart`, val);
        },
        getCartData() {
            this.isLoading = true;
            axios.get(`${apiUrl}api/${adminPath}/cart`)
            .then((res) => {
                this.cartList = res.data?.data?.carts;
                this.isLoading = false;
            })
            .catch((err) => {
                alert(err.response.data.message);
            });
        }
    },
});

// app.use(router);
app.use(VueLoading.LoadingPlugin);
app.component('loading', VueLoading.Component)
app.mount('#app');

