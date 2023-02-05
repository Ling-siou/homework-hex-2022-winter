import { apiUrl, adminPath } from './config.js';

export default {
data() {
    return {
        productList: [],
        cartList: [],
        focusProductId: ''
    };
},
template: `
    <div>
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
                        <span class="text-decoration-line-through">
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
                        <button type="button" class="btn btn-outline-secondary btn-sm">看細節</button>
                    </td>
                 </tr>
            </tbody>
        </table>
    </div>
`,
computed: {
    focusProduct() {
        return this.focusProductId ? this.getProductById(this.focusProductId) : {};
    }
},
created() {
    axios.get(`${apiUrl}api/${adminPath}/products/all?page=2`)
    .then((res) => {
        this.productList = res.data.products;
        console.log(res);
    })
    .catch((err) => {
        console.dir(err);
    });
},
methods: {
    getProductById(id) {
        const product = this.productList.filters((e) => e.id = id)[0];
        return product;
    },
    putProductInCart(id) {
        const qty = this.$refs['qty'+id][0].value;
        const productDatqtya = {
            "data": {
              "product_id": id,
              "qty": parseInt(qty)
            }
        };

        axios.post(`${apiUrl}api/${adminPath}/cart`, productDatqtya)
        .then((res) => {
            console.log(res);
        })
        .catch((err) => {
            console.dir(err);
        });

    }
},
};