import { apiUrl, adminPath } from '../js/config.js';
import checkDeleteModal from './checkDeleteModal.js';
const cartTrComp = {
    data(){
        return {
            newQty: 1
        };
    },
    props: ['item', 'int'],
    template: `
    <tr>
        <th scope="row" class="align-middle">{{ int+1 }}</th>
        <td class="align-middle">{{ item.product.title }}</td>
        <td class="align-middle">
            <p v-if="item.product.price !== item.product.origin_price">
            <span class="text-decoration-line-through text-secondary">
                {{item.product.origin_price}}</span> <span class="font-monospace">{{item.product.price}}元</span></p>
            <p v-else class="font-monospace">
                {{product.price}}元
            </p>
        </td>
            <td class="align-middle">
        <div class="d-inline-block me-1" style="width:60px">
            <input type="number" class="form-control form-control-sm"
            :ref="'qty'+item.id" v-model="newQty" min=1 @change="dataChange">
        </div>
        </td>
        <td class="align-middle">
            <button v-if="item.qty === newQty" class="btn btn-outline-danger btn-sm"
            @click="deleteProduct(item.id)">刪除</button>
            <div v-else>
                <button class="btn btn-sm me-2" :class="item.qty === newQty ? 'btn-outline-dark' : 'btn-outline-primary'"
                @click="editQty(item.id)">修改</button>
                <button class="btn btn-outline-dark btn-sm" @click="resetQty">取消</button>
            </div>
        </td>
    </tr>
    `,
    mounted() {
        this.resetQty();
    },
    methods: {
        dataChange() {
            console.log('dataChange',this.newQty,this.item.qty);
            this.$emit('data-change', this.newQty !== this.item.qty);
        },
        resetQty() {
            this.newQty = this.item.qty;
            this.dataChange();
        },
        editQty(id) {
            this.setIsLoading(true);
            const data = {
                "data": {
                  "product_id": id,
                  "qty": this.newQty
                }
              };
            axios.put(`${apiUrl}api/${adminPath}/cart/${id}`, data)
            .then((res) => {
                console.log(res);
                this.setIsLoading(false);
                this.$emit('reset-cart-data');
            })
            .catch((err) => {
                console.dir(err);
                alert(err.response.data.message);
                this.setIsLoading(false);
            });
        },
        deleteProduct(id) {
            this.setIsLoading(true);
            axios.delete(`${apiUrl}api/${adminPath}/cart/${id}`)
            .then((res) => {
                console.log(res);
                this.setIsLoading(false);
                this.$emit('reset-cart-data');
            })
            .catch((err) => {
                console.dir(err);
                alert(err.response.data.message);
                this.setIsLoading(false);
            });
        },
        setIsLoading(val) {
            this.$emit('set-is-loading', val);
        },
    },
    watch: {
        'item.qty'(val) {
            this.newQty = val;
            this.dataChange();
        },

    }
};

export default {
    props: ['cartList'],
    data() {
        return {
            dataChange: false,
            isLoading: false
        };
    },
    components: { cartTrComp, checkDeleteModal },
    template: `
    <div>
        <loading v-model:active="isLoading"/>
        <checkDeleteModal :delete-all-product="deleteAllProduct" 
        ref="checkModal" />   
        <div class="text-end mb-3">
        <button type="button" class="btn btn-outline-danger btn-sm"
        @click="deleteCheck" :disabled="this.cartList.length === 0">清空購物車</button></div>
        <table class="table table-striped border">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">商品名</th>
                    <th scope="col">價格</th>
                    <th scope="col">數量</th>
                    <th scope="col">功能</th>
                </tr>
            </thead>
            <tbody>
                <cartTrComp v-for="(item, int) in cartList" :key="item.id"
                :item="item" :int="int" @data-change="newQty"
                @set-is-loading="setIsLoading"
                @reset-cart-data="getCartData"></cartTrComp>
            </tbody>
        </table>
        <p v-if="dataChange" class="text-end text-danger">您的商品數量尚在調整中, 請儲存或取消後方能計算總額</p>
        <p v-else class="text-end">總計: {{orgTotal}} <span class="fs-6 ms-2">折扣價: {{total}}</span></p>
    </div>
    `,
    computed: {
        total() {
            const reduceArr = this.cartList.reduce((accumulator, currentValue) => {
                return accumulator + currentValue.final_total;
              }, 0);
              return reduceArr;
        },
        orgTotal() {
            const reduceArr = this.cartList.reduce((accumulator, currentValue) => {
                return accumulator + currentValue.product?.origin_price * currentValue.qty;
              }, 0);
              return reduceArr;
        }
    },
    methods: {
        newQty(val){
            this.dataChange = val;
        },
        setIsLoading(val) {
            this.isLoading = val;
        },
        getCartData() {
            this.$emit('reset-cart-data');
        },
        deleteCheck() {
            this.$refs.checkModal.modalShow();
        },
        deleteAllProduct() {
            this.setIsLoading(true);
            axios.delete(`${apiUrl}api/${adminPath}/carts`)
            .then((res) => {
                this.$refs.checkModal.closeModal();
                this.setIsLoading(false);
                this.$emit('reset-cart-data');
            })
            .catch((err) => {
                console.dir(err);
                alert(err.response.data.message);
                this.setIsLoading(false);
            });
        },
    }
};