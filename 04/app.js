// 在html檔案內取得vue & vue-router & axios

// 共用
const apiUrl = 'https://vue3-course-api.hexschool.io/v2/';
const adminPath = 'jujube-in-hex';
import checkDeleteModalTemp from './checkDeleteModalTemp.js'; 
// import editItemDataTemp from './editItemDataTemp.js';
const imageUrlSetterComp = {
    props: ['imgItem', 'imgInt'],
    data() {
        return {
            value: '',
            memo:'',
            uploadSuccess: true,
        };
    },
    computed: {
        emitData() {
            return {
                imgItem: this.imgItem,
                imgInt: this.imgInt,
                value: this.value,
            };
        }
    },
    template: '#imageUrlSetter',
    methods: {
        fileChose() {
            this.memo = '檔案上傳中，請稍等...';
            console.log(this.$refs.fileInput.files[0]);
            const choseFile = this.$refs.fileInput.files[0];
            let upLoadfile = new FormData();
            upLoadfile.append('file-to-upload', choseFile);

            axios.post(`${apiUrl}api/${adminPath}/admin/upload`, upLoadfile)
            .then((res) => {
                console.log(res.data);
                if(res.data.success) {
                    this.value = res.data.imageUrl;
                    this.updateValue(res.data.imageUrl);
                    this.uploadSuccess = true;
                    this.memo = '上傳成功!';
                } else {
                    alert(res.data.message);
                    this.uploadSuccess = false;
                    this.memo = '上傳失敗';
                }
                
            })
            .catch((err) => {
                console.dir(err);
            });
            
        },
        updateValue(value) {
            console.log('in', value);
            this.$emit('update-value', this.emitData);
        }
    }
};
const editItemDataTemp = {
    data() {
        return {
            updateImgByDownload: true
        };
    },
    props: ['modalModeTiele', 'modalModeNewItem', 'modalItemData', 'newThisItem', 'editItem'],
    template: '#editItemDataTemp',
    components: {imageUrlSetterComp},
    computed: {
        updateImgBtnClass() {
            return this.updateImgByDownload ? {
                byDownload: 'btn-primary',
                byUrl: 'btn-outline-primary'
            } : {
                byDownload: 'btn-outline-primary',
                byUrl: 'btn-primary'
            };
        }
    },
    methods: {
        closeModal() {
            this.$refs.closeMobal.click();
        },
        updateValue(val){
            console.log('mit', val);
            this.$emit('update-value', val);
        }
    }
};

// routerComp
const itemListComp = {
    data() {
        return {
            products: [],
            showId: '',
            modalItemData: {
                title: '',
                category: '',
                description: '',
                content: '',
                unit: '',
                originPrice: '',
                price: '',
                imageUrl: '',
                imagesUrl: ['', '', '', '', ''],
                isEnabled: false
            },
            modalModeNewItem: true,
            editItemId: '',
            deleteItemId: '',
            deleteItemName: ''
        };
    },
    template: '#itemList',
    components : { checkDeleteModalTemp, editItemDataTemp },
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
                    title: this.modalItemData.title,
                    category: this.modalItemData.category,
                    description: this.modalItemData.description,
                    content: this.modalItemData.content,
                    origin_price: this.modalItemData.originPrice,
                    price: this.modalItemData.price,
                    unit: this.modalItemData.unit,
                    imageUrl: this.modalItemData.imageUrl,
                    imagesUrl: this.modalItemData.imagesUrl,
                    is_enabled: this.modalItemData.isEnabled ? '1' : '0'
                }
            };
        }
    },
    methods: {
        setUploadImgUrl(val) {
            // console.log(val);
            if(val.imgInt) {
                this.modalItemData[val.imgItem][val.imgInt] = val.value;
            } else {
                this.modalItemData[val.imgItem] = val.value;
            }

        },
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
            axios.get(`${apiUrl}api/${adminPath}/admin/products`)
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
            axios.delete(`${apiUrl}api/${adminPath}/admin/product/${this.deleteItemId}`)
                .then((res) => {
                    alert('刪除成功');
                    this.getItemList();
                    // 若刪除正在檢視的商品，檢視id改回預設
                    this.$refs.checkDeleteModalTemp.closeModal();
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
            this.modalItemData.title = editItem.title || '';
            this.modalItemData.category = editItem.category || '';
            this.modalItemData.content = editItem.content || '';
            this.modalItemData.description = editItem.description || '';
            this.modalItemData.imageUrl = editItem.imageUrl || '';
            this.modalItemData.isEnabled = (editItem.is_enabled !== 0 && editItem.is_enabled !== '0') || '';
            this.modalItemData.originPrice = editItem.origin_price || '';
            this.modalItemData.price = editItem.price || '';
            this.modalItemData.unit = editItem.unit || '';
            if (editItem.imagesUrl) {
                editItem.imagesUrl.forEach((e, i) => {
                    this.modalItemData.imagesUrl[i] = e;
                });
            } else {
                for (let i = 0; i < 5; i++) {
                    this.modalItemData.imagesUrl[i] = '';
                }
            }
        },
        editItem() {
            axios.put(`${apiUrl}api/${adminPath}/admin/product/${this.editItemId}`, this.editItemData)
                .then((res) => {
                    alert('編輯成功');
                    this.$refs.editItemModalTemp.closeModal();
                    this.getItemList();
                    this.setEditData('');
                })
                .catch((err => {
                    alert(err.response.data.message);
                }));
        },
        newThisItem() {
            axios.post(`${apiUrl}api/${adminPath}/admin/product`, this.editItemData)
                .then((res) => {
                    alert('新增成功');
                    this.$refs.editItemModalTemp.closeModal();
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
};

Vue.createApp(appDate).use(router).mount('#app');