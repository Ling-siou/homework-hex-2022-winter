export default {
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
                    <!-- imageUrl -->
                    <div class="mb-3 row">
                        <label for="itemUrl" class="col-sm-3 col-form-label text-end">主要圖片</label>
                        <div class="col-sm-8">
                          <input type="text" class="form-control" id="itemUrl" placeholder="請輸入網址" v-model="modalItemData.imageUrl">
                        </div>
                    </div>
                    <!-- imagesUrl -->
                    <div class="mb-3 row">
                        <label for="itemUrls1" class="col-sm-3 col-form-label text-end">主要圖片</label>
                        <div class="col-sm-8">
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
    methods: {
        closeModal() {
            this.$refs.closeMobal.click();
        }
    }
};