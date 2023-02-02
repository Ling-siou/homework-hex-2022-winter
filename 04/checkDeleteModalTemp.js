export default {
    props: ['deleteItemName', 'deleteItem'],
    template: `
    <div class="modal" id="checkModal" tabindex="-1" aria-labelledby="checkModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">確認刪除</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p>確定要刪除項目「{{deleteItemName}}」嗎?<br>刪除的項目無法復原 </p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" ref="close">Close</button>
                        <button type="button" class="btn btn-danger" @click="deleteItem">確認刪除</button>
                    </div>
                </div>
            </div>
        </div>
    `,
    methods: {
        closeModal() {
            this.$refs.close.click();
        }
    }
};