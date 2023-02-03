import { apiUrl, adminPath } from './config.js';

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
    template: `
    <div class="mb-3">
            <input type="file" name="file-to-upload" v-on:change="fileChose()" ref="fileInput" class="form-control">
            <p v-if="memo" class="mt-1" :class="uploadSuccess ? 'text-success' : 'text-danger'">{{ memo }}</p>
        </div>
    `,
    mounted() {
        this.$refs.fileInput.value = '';
    },
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

export default {
    data() {
        return {
            updateImgByDownload: false
        };
    },
    props: ['modalModeTiele', 'modalModeNewItem', 'modalItemData', 'newThisItem', 'editItem'],
    template: `
    <div class="modal fade" id="newItemModal" tabindex="-1" aria-labelledby="newItemModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title fs-5" id="newItemModalLabel">{{modalModeTiele}}</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" ref="closeMobal"></button>
                </div>
                <div class="modal-body">
                    <!-- title -->
                    <div class="mb-3 row">
                        <label for="itemName" class="col-sm-3 col-form-label text-end">項目名稱</label>
                        <div class="col-sm-8">
                          <input type="text" class="form-control" id="itemName" v-model="modalItemData.title">
                        </div>
                    </div>
                    <!-- category -->
                    <div class="mb-3 row">
                        <label for="itemCategory" class="col-sm-3 col-form-label text-end">類型</label>
                        <div class="col-sm-8">
                          <input type="text" class="form-control" id="itemCategory" v-model="modalItemData.category">
                        </div>
                    </div>
                    <!-- description -->
                    <div class="mb-3 row">
                        <label for="itemDescription" class="col-sm-3 col-form-label text-end">描述</label>
                        <div class="col-sm-8">
                          <input type="text" class="form-control" id="itemDescription" v-model="modalItemData.description">
                        </div>
                    </div>
                    <!-- content -->
                    <div class="mb-3 row">
                        <label for="itemContent" class="col-sm-3 col-form-label text-end">說明</label>
                        <div class="col-sm-8">
                          <input type="text" class="form-control" id="itemContent" v-model="modalItemData.content">
                        </div>
                    </div>
                    <!-- unit -->
                    <div class="mb-3 row">
                        <label for="itemUnit" class="col-sm-3 col-form-label text-end">單位</label>
                        <div class="col-sm-8">
                          <input type="text" class="form-control" id="itemUnit" v-model="modalItemData.unit">
                        </div>
                    </div>
                    <!-- origin_price -->
                    <!-- price -->
                    <div class="mb-3 row">
                        <label for="itemOriginPrice" class="col-sm-3 col-form-label text-end">原價</label>
                        <div class="col-sm-3">
                          <input type="number" class="form-control" id="itemOriginPrice" v-model.number="modalItemData.originPrice"  min=0>
                        </div>
                        <label for="itemPrice" class="col-sm-2 col-form-label text-end">售價</label>
                        <div class="col-sm-3">
                          <input type="number" class="form-control" id="itemPrice" v-model.number="modalItemData.price" min=0>
                        </div>
                    </div>
                    <div class="mb-3 row align-items-center">
                        <label class="col-sm-3 col-form-label text-end">圖片設定</label>
                        <div class="col-sm-8">
                          <button class="btn btn-sm me-2"
                          :class="updateImgBtnClass.byUrl"
                          @click="updateImgByDownload = false">輸入網址</button>
                          <button class="btn btn-sm" :class="updateImgBtnClass.byDownload"
                          @click="updateImgByDownload = true">上傳圖片</button>
                        </div>
                    </div>
                    <!-- imageUrl -->
                    <div class="mb-3 row">
                        <label for="itemUrl" class="col-sm-3 col-form-label text-end">主要圖片</label>
                        <div class="col-sm-8">
                            <imageUrlSetterComp v-if="updateImgByDownload"
                            @update-value="updateValue"  :img-Item="'imageUrl'"/>
                          <input v-else type="text" class="form-control" id="itemUrl"
                           placeholder="請輸入網址" v-model="modalItemData.imageUrl">
                        </div>
                    </div>
                    <!-- imagesUrl -->
                    <div class="mb-3 row">
                        <label for="itemUrls1" class="col-sm-3 col-form-label text-end">其他圖片</label>
                        <div v-if="updateImgByDownload" class="col-sm-8">
                            <imageUrlSetterComp @update-value="updateValue"
                             :img-Item="'imagesUrl'" :img-Int="'0'"/>
                             <imageUrlSetterComp @update-value="updateValue"
                             :img-Item="'imagesUrl'" :img-Int="'1'"/>
                             <imageUrlSetterComp @update-value="updateValue"
                             :img-Item="'imagesUrl'" :img-Int="'2'"/>
                             <imageUrlSetterComp @update-value="updateValue"
                             :img-Item="'imagesUrl'" :img-Int="'3'"/>
                             <imageUrlSetterComp @update-value="updateValue"
                             :img-Item="'imagesUrl'" :img-Int="'4'"/>
                            </div>
                        <div v-else class="col-sm-8">
                          <input type="text" class="form-control mb-2" id="itemUrls1" placeholder="請輸入網址" v-model="modalItemData.imagesUrl[0]">
                          <input type="text" class="form-control mb-2" id="itemUrls2" placeholder="請輸入網址" v-model="modalItemData.imagesUrl[1]">
                          <input type="text" class="form-control mb-2" id="itemUrls3" placeholder="請輸入網址" v-model="modalItemData.imagesUrl[2]">
                          <input type="text" class="form-control mb-2" id="itemUrls4" placeholder="請輸入網址"  v-model="modalItemData.imagesUrl[3]">
                          <input type="text" class="form-control" id="itemUrls5" placeholder="請輸入網址"  v-model="modalItemData.imagesUrl[4]">
                        </div>
                    </div>
                    <!-- is_enabled -->
                    <div class="mb-3 form-check">
                        <input type="checkbox" class="form-check-input" id="isEnabled" v-model="modalItemData.isEnabled">
                        <label class="form-check-label" for="isEnabled">啟用</label>
                      </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <!-- TODO -->
                        <!-- {{modalMode}} -->
                        <button v-if="modalModeNewItem" type="button" class="btn btn-primary" @click="newThisItem">新增項目</button>
                        <button v-else type="button" class="btn btn-primary" @click="editItem">儲存編輯</button>
                    </div>
                </div>
            </div>
        </div>
    `,
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