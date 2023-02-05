import productsComp from './productsComp.js';
import cartList from './cartList.js';

const app = Vue.createApp({
    data() {
        return {
            text: '預設'
        };
    },
    components: {
        productsComp,
        cartList
    },
    methods: {
        getPage(){
            const urlQueryStr = window.location.search;
            const urlgetQuery = new URLSearchParams(urlQueryStr);
            const page = urlgetQuery.get('page');
            console.log(page);
        },
        addItemInCart(val) {
            console.log(`addItemInCart`, val);
        }
    },
});

// app.use(router);
app.mount('#app');

