export default {
    props: ['deleteAllProduct'],
    template: `
    <div class="modal" tabindex="-1" aria-labelledby="checkModalLabel" aria-hidden="true" ref="checkModal">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">確認刪除</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p>確定要清空購物車嗎?</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" ref="close">Close</button>
                        <button type="button" class="btn btn-danger" @click="deleteAllProduct">確認刪除</button>
                    </div>
                </div>
            </div>
        </div>
    `,
    methods: {
        closeModal() {
            this.$refs.close.click();
        },
        modalShow() {
            const checkModal = new bootstrap.Modal(this.$refs.checkModal);
            checkModal.show();
        }
    }
};