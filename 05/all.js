// import {createApp, component} from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.47/vue.esm-browser.min.js';

import { apiUrl, adminPath } from './js/config.js';
import products from './components/products.js';
import cartList from './components/cartList.js';

VeeValidateI18n.loadLocaleFromURL('./05/sorce/zh_TW.json');

Object.keys(VeeValidateRules).forEach(rule => {
    if (rule !== 'default') {
      VeeValidate.defineRule(rule, VeeValidateRules[rule]);
    }
  });

VeeValidate.configure({
    generateMessage: VeeValidateI18n.localize('zh_TW'),
    validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
  });

const app = Vue.createApp({
    data() {
        return {
            cartList:[],
            text: '預設',
            isLoading: false,
            user: {}
        };
    },
    components: {
        products,
        cartList
    },
    created() {
        this.getCartData();
    },
    methods: {
        onSubmit() {
            console.log(`onSubmit`);
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
app.component('loading', VueLoading.Component);
app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);
app.mount('#app');

