import { apiUrl } from './config.js';

export default {
    data() {
        return {
            email: '',
            password: ''
        };
    },
    template: `
    <div class="login pt-5">
        <form>
            <h3 class="mb-3 text-center">登入</h3>
            <div class="mb-3">
              <label for="loginEmail" class="form-label">Email</label>
              <input type="email" class="form-control" id="loginEmail" v-model="email">
            </div>
            <div class="mb-3">
              <label for="loginPassword" class="form-label">密碼</label>
              <input type="password" class="form-control" id="loginPassword" v-model="password">
            </div>
            <div class="text-center">
                <button type="submit" class="btn btn-primary text-center" @click.prevent="login">登入</button>
            </div>
          </form>
          <router-link to="/list">Go to List</router-link>
        </div>
    `,
    created() {
        axios.post(`${apiUrl}api/user/check`, {})
            .then((res) => {
                alert('歡迎回來');
                this.$router.push({
                    path: '/list'
                });
            });
    },
    methods: {
        login() {
            const loginData = {
                username: this.email,
                password: this.password
            };
            axios.post(`${apiUrl}admin/signin`, loginData)
                .then((res) => {
                    window.localStorage.setItem('token', res.data.token);
                    // 登入後預設後續的 headers 'Authorization'
                    axios.defaults.headers.common['Authorization'] = window.localStorage.getItem('token');
                    alert('登入成功');
                    this.$router.push({
                        path: '/list'
                    });
                })
                .catch((err) => {
                    alert('登入失敗');
                });
        }
    },
};