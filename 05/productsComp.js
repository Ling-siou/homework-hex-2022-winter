import { apiUrl, adminPath } from './config.js';

import modalComp from './modalComp.js';

export default {
prop: ['getCartData'],
data() {
    return {
        productList: [],
        focusProductId: '',
        isLoading: false,
    };
},
components: {
    modalComp
},
template: `
    <div>
    <loading v-model:active="isLoading"/>
    <modal-comp :item="focusProduct" ref="itemModal"></modal-comp>
         <table class="table">
            <thead>
                <tr>
                    <th scope="col">產品名稱</th>
                    <th scope="col">縮圖</th>
                    <th scope="col">價格</th>
                    <th scope="col">功能</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(product, int) in productList" :key="product.id"
                class="align-items-center">
                    <td class="align-middle">{{product.title}}</td>
                    <td>
                    <img :src="product.imageUrl" class="product-img" />
                    </td>
                    <td class="align-middle">
                        <p v-if="product.price !== product.origin_price">
                        <span class="text-decoration-line-through text-secondary">
                            {{product.origin_price}}</span> <span class="font-monospace">{{product.price}}元</span></p>
                        <p v-else class="font-monospace">
                            {{product.price}}元
                        </p>
                    </td>
                    <td scope="row" class="align-middle">
                    <span>數量: </span>
                        <div class="d-inline-block me-1" style="width:60px">
                            <input type="number" class="form-control form-control-sm"
                        :ref="'qty'+product.id" value="1" min=1>
                        </div>
                        <button type="button" class="btn btn-outline-primary btn-sm me-2"
                            @click="putProductInCart(product.id)">加入購物車</button>
                        <button type="button" class="btn btn-outline-info btn-sm"
                        @click="showItem(product.id)">看細節</button>
                    </td>
                 </tr>
            </tbody>
        </table>
    </div>
`,
computed: {
    focusProduct() {
        const product = this.productList.find((e) => e.id === this.focusProductId);
        return this.focusProductId ? product : {};
    }
},
mounted() {
    this.isLoading = true;
    axios.get(`${apiUrl}api/${adminPath}/products/all`)
    .then((res) => {
        console.log(res.data);
        this.productList = [...res.data.products];
        this.isLoading = false;
    })
    .catch((err) => {
        console.dir(err);
    });
},
methods: {
    showItem(id) {
        this.focusProductId = id;
        this.$refs.itemModal.openModal();
    },
    yourCallbackMethod() {
        console.log('yourCallbackMethod');
    },
    getProductById(id) {
        console.log(id);
        const product = this.productList.find((e) => e.id = id);
        return product;
    },
    resetCartData() {
        this.$emit('reset-cart-data');
    },
    putProductInCart(id) {
        this.isLoading = true;
        const qty = this.$refs['qty'+id][0].value;
        const productDatqtya = {
            "data": {
              "product_id": id,
              "qty": parseInt(qty)
            }
        };

        axios.post(`${apiUrl}api/${adminPath}/cart`, productDatqtya)
        .then((res) => {
            this.isLoading = false;
            this.resetCartData();
        })
        .catch((err) => {
            console.dir(err);
        });

    }
},
};