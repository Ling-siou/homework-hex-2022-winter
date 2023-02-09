import { apiUrl, adminPath } from '../js/config.js';
import checkDeleteModal from './checkDeleteModal.js';
const cartTrComp = {
    data(){
        return {
            newQty: '',
            inputDisabled: false
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
            :ref="'qty'+item.id" v-model="newQty" min=1 :disabled="inputDisabled">
        </div>
        </td>
        <td class="align-middle">
            <button :disabled="inputDisabled" class="btn btn-outline-danger btn-sm"
            @click="deleteProduct(item.id)">刪除</button>
        </td>
    </tr>
    `,
    mounted() {
        this.resetQty();
    },
    methods: {
        resetQty() {
            this.newQty = this.item.qty;
        },
        debounceEditQty: _.debounce( (vm)=>{
                vm.editQty()
            }  , 1000, {
                leading: false,
                trailing: true,
                maxWait: 2000
            }),
        editQty() {
            this.inputDisabled = true;
            const data = {
                "data": {
                  "product_id": this.item.id,
                  "qty": this.newQty
                }
              };
            axios.put(`${apiUrl}api/${adminPath}/cart/${this.item.id}`, data)
            .then((res) => {
                this.$emit('reset-cart-data');
                this.$emit('toast-open');
            })
            .catch((err) => {
                alert(err.response.data.message);
            })
            .then(() => {
                this.inputDisabled = false;
            });
        },
        deleteProduct(id) {
            this.setIsLoading(true);
            axios.delete(`${apiUrl}api/${adminPath}/cart/${id}`)
            .then((res) => {
                this.$emit('reset-cart-data');
            })
            .catch((err) => {
                alert(err.response.data.message);
            })
            .then(() => {
                this.setIsLoading(false);
            });
        },
        setIsLoading(val) {
            this.$emit('set-is-loading', val);
        },
    },
    watch: {
        newQty(val, oldVal) {
            if(val !== oldVal && oldVal !== '') {
                const vm = this;
                this.debounceEditQty(vm)
            }
        }
    }
};

export default {
    props: ['cartList'],
    data() {
        return {
            isLoading: false
        };
    },
    components: { cartTrComp, checkDeleteModal },
    template: `
    <div>
        <loading v-model:active="isLoading"/>
        <div class="toast-container position-fixed bottom-0 start-50 translate-middle-x p-3" >
            <div ref="liveToast" class="toast text-success" role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay="2000">
                <div class="toast-body">
                    數量修改完成!
                </div>
            </div>
        </div>
        <checkDeleteModal :delete-all-product="deleteAllProduct" 
        ref="checkModal" /> 
        <div class="d-flex align-items-center mb-2 pt-3">
        <h3 class="mb-0">購物車內容</h3>
        <button type="button" class="btn btn-outline-danger btn-sm ms-auto align-self-center"
        @click="deleteCheck" :disabled="this.cartList.length === 0">清空購物車</button>
        </div>  
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
                :item="item" :int="int"                 @set-is-loading="setIsLoading"
                @reset-cart-data="getCartData" @toast-open="toastOpen"></cartTrComp>
            </tbody>
        </table>
        <p class="text-end">總計: {{orgTotal}} <span class="fs-6 ms-2">折扣價: {{total}}</span></p>
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
        toastOpen() {
            const toast = new bootstrap.Toast(this.$refs.liveToast)
            toast.show();
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
                this.$emit('reset-cart-data');
            })
            .catch((err) => {
                alert(err.response.data.message);
            })
            .then(() => {
                this.setIsLoading(false);
            });
        },
    }
};