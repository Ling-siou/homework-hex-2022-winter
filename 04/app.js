// 在html檔案內取得vue & vue-router & axios

// 共用
const apiUrl = 'https://vue3-course-api.hexschool.io/v2/';
// routerComp
const itemListComp = {
    data() {
        return {
            products: [],
            showId: '',
            title: '',
            category: '',
            description: '',
            content: '',
            unit: '',
            originPrice: '',
            price: '',
            imageUrl: '',
            imagesUrl: ['', '', '', '', ''],
            isEnabled: false,
            modalModeNewItem: true,
            editItemId: '',
            deleteItemId: '',
            deleteItemName: ''
        };
    },
    template: '#itemList',
    created() {
        this.getItemList();
    },
    computed: {
        modalModeTiele() {
            return this.modalModeNewItem ? '新增項目' : '編輯項目';
        },
        detialItme() {
            const detialDate = this.setShowItem(this.showId);
            return detialDate || this.showId;
        },
        editItemData() {
            return {
                data: {
                    title: this.title,
                    category: this.category,
                    description: this.description,
                    content: this.content,
                    origin_price: this.originPrice,
                    price: this.price,
                    unit: this.unit,
                    imageUrl: this.imageUrl,
                    imagesUrl: this.imagesUrl,
                    is_enabled: this.isEnabled ? '1' : '0'
                }
            };
        }
    },
    methods: {
        deleteCheckModal(id, name) {
            var checkModal = new bootstrap.Modal(document.getElementById('checkModal'));
            this.deleteItemId = id;
            this.deleteItemName = name;
            checkModal.show();
        },
        setShowItem(id) {
            const detialDate = this.products.find((item) => item.id === id);
            return detialDate || '';
        },
        getItemList() {
            axios.get(`${apiUrl}api/jujube-in-hex/admin/products`)
                .then((res) => {
                    this.products = res.data.products;
                })
                .catch((err) => {
                    alert(err.response.data.message);
                    this.$router.push({
                        path: '/'
                    });
                });
        },
        logout() {
            axios.post(`${apiUrl}logout`, {}, {
                    headers: {
                        Authorization: window.localStorage.getItem('token')
                    },
                })
                .then((res) => {
                    alert('已登出');
                    window.localStorage.setItem('token', '');
                    this.$router.push({
                        path: '/'
                    });
                })
                .catch((err) => {
                    alert('登出失敗');
                });
        },
        deleteItem() {
            axios.delete(`${apiUrl}api/jujube-in-hex/admin/product/${this.deleteItemId}`)
                .then((res) => {
                    alert('刪除成功');
                    this.getItemList();
                    // 若刪除正在檢視的商品，檢視id改回預設
                    this.$refs.close.click();
                    if (this.showId === this.deleteItemId) {
                        this.showId = '';
                    }
                })
                .catch((err) => {
                    alert(err.response.data.message);
                });
        },
        setEditData(id) {
            if (id) {
                this.editItemId = id;
            }
            const editItem = id ? this.setShowItem(id) : {};

            // set data
            this.title = editItem.title || '';
            this.category = editItem.category || '';
            this.content = editItem.content || '';
            this.description = editItem.description || '';
            this.imageUrl = editItem.imageUrl || '';
            this.isEnabled = (editItem.is_enabled !== 0 && editItem.is_enabled !== '0') || '';
            this.originPrice = editItem.origin_price || '';
            this.price = editItem.price || '';
            this.unit = editItem.unit || '';
            if (editItem.imagesUrl) {
                editItem.imagesUrl.forEach((e, i) => {
                    this.imagesUrl[i] = e;
                });
            } else {
                for (let i = 0; i < 5; i++) {
                    this.imagesUrl[i] = '';
                }
            }
        },
        editItem() {
            axios.put(`${apiUrl}api/jujube-in-hex/admin/product/${this.editItemId}`, this.editItemData)
                .then((res) => {
                    alert('編輯成功');
                    this.$refs.closeMobal.click();
                    this.getItemList();
                    this.setEditData('');
                })
                .catch((err => {
                    alert(err.response.data.message);
                }));
        },
        newThisItem() {
            axios.post(`${apiUrl}api/jujube-in-hex/admin/product`, this.editItemData)
                .then((res) => {
                    alert('新增成功');
                    this.$refs.closeMobal.click();
                    this.getItemList();
                    this.setEditData('');
                })
                .catch((err => {
                    alert(err.response.data.message);
                }));
        }
    }
};
const loginComp = {
    data() {
        return {
            email: '',
            password: ''
        };
    },
    template: '#login',
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
                    window.localStorage.setItem('token', res.data.token)
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
}

Vue.createApp(appDate).use(router).mount('#app');