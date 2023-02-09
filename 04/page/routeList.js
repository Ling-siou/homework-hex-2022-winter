import { apiUrl, adminPath } from '../js/config.js';

import componentCheckDeleteModal from '../components/componentCheckDeleteModal.js'; 
import componentEditItemModal from '../components/componentEditItemModal.js';

export default {
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
                starts: '',
                imageUrl: '',
                imagesUrl: ['', '', '', '', ''],
                isEnabled: false
            },
            modalModeNewItem: true,
            editItemId: '',
            deleteItemId: '',
            deleteItemName: '',
            pagination: {},
        };
    },
    template: `
    <div class="row mt-3">
            <a href="#" class="text-end" @click.prevent="logout">登出</a>
            <div class="col-xl-5 col-md-6 col-xs-12">
                <!-- 列表 -->
                <div class="d-flex align-item-center">
                    <h2 class="mb-0">產品列表</h2>
                    <button type="button" class="btn btn-success ms-auto btn-sm align-self-center"
                    data-bs-toggle="modal" data-bs-target="#newItemModal"
                    @click="modalModeNewItem = true,setEditData('')">新增品項</button>
                </div>
                <table class="table table-hover mt-2">
                    <tbody>
                    <tr>
                        <th width="150">產品名稱</th>
                        <th width="120">
                            原價
                        </th>
                        <th width="120">
                            售價
                        </th>
                        <th width="100">
                            是否啟用
                        </th>
                        <th width="140">
                            功能
                        </th>
                    </tr>
                    <tr v-for="item in products" :key="item.id">
                        <td class="bg-light">{{item.title}}</td>
                        <td class="bg-light">{{item.origin_price}}</td>
                        <td class="bg-light">{{item.price}}</td>
                        <td class="bg-light">
                            <span v-if="item.is_enabled !== 0 && item.is_enabled !== '0'" class="text-success">啟用</span>
                            <span v-else class="text-danger">未啟用</span></td>
                        <td class="bg-light">
                            <div class="d-flex">
                                <button class="btn btn-sm me-1" :class="showId === item.id ? 'btn-light disabled': 'btn-primary'" type="button" @click="showId = item.id">
                                <i class="bi" :class="showId === item.id ? 'bi-eye-fill': 'bi-eye'">
                                    </i></button>
                            <button class="btn btn-sm btn-info me-1" type="button" @click="modalModeNewItem = false, setEditData(item.id)"
                            data-bs-toggle="modal" data-bs-target="#newItemModal">
                                <i class="bi bi-pencil"></i></button>
                            <button class="btn btn-sm btn-danger" type="button" @click="deleteCheckModal(item.id, item.title)">
                                <i class="bi bi-trash3"></i></button>
                            </div>
                            
                            </td>
                    </tr>
                </tbody>
                </table>
                <p>目前有 {{ products.length }} 項產品</p>
                <nav aria-label="Page navigation example">
                    <ul class="pagination">
                        <li class="page-item">
                            <a class="page-link" :class="pagination.has_pre ? '' : 'disabled'" href="#"
                            @click.prevent="goBesidePage(-1)">
                                <i class="bi bi-chevron-left"></i></a></li>
                        <li class="page-item" v-for="page in pagination.total_pages" :key="page"
                        :class="pagination.current_page == page ? 'active' : ''">
                            <a class="page-link" href="#" @click.prevent="goPage(page)">{{page}}</a></li>
                        <li class="page-item">
                            <a class="page-link" :class="pagination.has_next ? '' : 'disabled'" href="#"
                            @click.prevent="goBesidePage(1)">
                                <i class="bi bi-chevron-right"></i></a></li>
                    </ul>
                </nav>
            </div>
            <div class="col-xl-7 col-md-6 col-xs-12 bg-light p-3">
                <!-- 單一展示 -->
                <h2 class="mb-4" v-if="showId">{{detialItme.title}}</h2>
                <h2 class="mb-4" v-else>單一產品細節</h2>
                <div v-if="showId">
                    <div class="center mb-2">
                        <img :src="detialItme.imageUrl" alt="detialItme.title" class="image mx-auto d-block">
                    </div>
                    <p>類型: {{detialItme.category}}<br>
                        描述: {{detialItme.description}}<br>
                    內容: {{detialItme.content}}</p>
                    <p class="text-end">{{detialItme.price}} <del>{{detialItme.origin_price}}</del> 元 / {{detialItme.unit}}</p>
                    <!-- 圖片列表 -->
                    <div class="d-flex overflow-auto">
                        <div class="p-1" v-for="(url, index) in detialItme.imagesUrl" :key="index">
                            <img :src="url" v-if="url" alt="detialItme.title" class="image-in-flex">
                        </div>
                    </div>
                </div>
                <div v-else>
                    <p class="text-secondary">請選擇一個商品查看</p>
                </div>
            </div>
            <!-- modle -->
            <componentEditItemModal :modal-mode-tiele="modalModeTiele" :modal-mode-new-item="modalModeNewItem" 
            :modal-item-data="modalItemData" :new-this-item="newThisItem" :edit-item="editItem" ref="editItemModalTemp"
            @update-value="setUploadImgUrl" />
            <componentCheckDeleteModal :delete-item-name="deleteItemName" :delete-item="deleteItem" ref="componentCheckDeleteModal" />
        </div>
    `,
    components : { componentCheckDeleteModal, componentEditItemModal },
    created() {
        axios.post(`${apiUrl}api/user/check`, {})
            .then(() => {
            })
            .catch((err) => {
                alert(err.response.data.message)
                this.$router.push({
                    path: '/'
                });
            });

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
                    starts: this.modalItemData.starts,
                    imageUrl: this.modalItemData.imageUrl,
                    imagesUrl: this.modalItemData.imagesUrl,
                    is_enabled: this.modalItemData.isEnabled ? '1' : '0'
                }
            };
        },
        getPageNow() {
            return this.$route.query.page || 1
        }
    },
    methods: {
        setUploadImgUrl(val) {
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
            axios.get(`${apiUrl}api/${adminPath}/admin/products?page=${this.getPageNow}`)
                .then((res) => {
                    this.products = res.data.products;
                    this.pagination = res.data.pagination;
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
                    this.$refs.componentCheckDeleteModal.closeModal();
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
            this.modalItemData.starts = editItem.starts || '';
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
        },
        goPage(page) {
            this.$router.push(`/list?page=${page}`)
        },
        goBesidePage(page) {
            const goPage = parseInt(this.getPageNow) + parseInt(page)
            this.$router.push(`/list?page=${goPage}`)
        }
    },
    watch: {
        getPageNow() {
            this.getItemList()
        }
    }
};