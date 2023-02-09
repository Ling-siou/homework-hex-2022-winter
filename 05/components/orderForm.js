import { apiUrl, adminPath } from '../js/config.js';

export default {
    prop: ['getCartData'],
    data() {
        return {
            isLoading: false,
            user: {
                name: '',
                email: '',
                tel: '',
                address: ''
            },
            message: ''
        };
    },
    template: `
    <div class="p-3">
    <loading v-model:active="isLoading"/>
    <h3>付款資料</h3>
    <v-form v-slot="{ errors }" @submit="onSubmit" class="p-3 border" ref="form">
        <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <v-field
                id="email"
                name="email"
                type="email"
                class="form-control"
                :class="{ 'is-invalid': errors['email'] }"
                placeholder="請輸入 Email" rules="email|required"
                v-model="user.email"
                ></v-field>
                <error-message name="email" class="invalid-feedback"></error-message>
        </div>
        <div class="mb-3">
            <label for="name" class="form-label">收件人姓名</label>
            <v-field
            id="name"
            name="姓名"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': errors['姓名'] }"
            placeholder="請輸入 姓名" rules="required"
            v-model="user.name"
            ></v-field>
            <error-message name="姓名" class="invalid-feedback"></error-message>
        </div>
        <div class="mb-3">
            <label for="name" class="form-label">收件人行動電話</label>
            <v-field
            id="tel"
            name="行動電話"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': errors['行動電話'] }"
            placeholder="請輸入 行動電話" rules="numeric|required|length:10"
            v-model="user.tel"
            ></v-field>
            <error-message name="行動電話" class="invalid-feedback"></error-message>
        </div>
        <div class="mb-3">
            <label for="name" class="form-label">收件人地址</label>
            <v-field
            id="email"
            name="地址"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': errors['地址'] }"
            placeholder="請輸入 地址" rules="required"
            v-model="user.address"
            ></v-field>
            <error-message name="地址" class="invalid-feedback"></error-message>
        </div>
        <div class="mb-3">
            <label for="message" class="form-label">留言</label>
            <textarea id="message" class="form-control" cols="30" rows="5" v-model="message"></textarea>
        </div>
        <div class="text-end">
        <button type="submit" class="btn btn-primary">確認結帳</button>
        </div>
    </v-form>
    </div>
    `,
    methods: {
        onSubmit() {
            this.isLoading = true;
            const orderData = {
                "data": {
                  "user": this.user,
                  "message": this.message
                }
            };
            axios.post(`${apiUrl}api/${adminPath}/order`, orderData)
            .then((res) => {
                alert(`${res.data.message}, 謝謝您的關顧:)`);
                this.resetUserAndCartData();
            })
            .catch((err) => {
                alert(err.response.data.message);
            })
            .then(() => {
                this.isLoading = false;
            });
        },
        resetUserAndCartData() {
            this.$refs.form.resetForm();
            this.user.name = '';
            this.user.tel = '';
            this.user.address = '';
            this.user.email = '';
            this.message = '';
            this.$emit('reset-cart-data');
        },
    }
};