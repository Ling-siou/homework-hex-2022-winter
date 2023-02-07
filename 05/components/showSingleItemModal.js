export default {
    props: ['item'],
    template: `
    <div class="modal fade" ref="itemModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">產品資訊</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <h3>{{ item.title }}</h3>
        <div class="center mb-2">
            <img :src="item.imageUrl" alt="item.title" class="image mx-auto d-block img-fluid">
        </div>
            <p>類型: {{item.category}}<br>
                描述: {{item.description}}<br>
                內容: {{item.content}}</p>
            <p class="text-end">{{item.price}} <del>{{item.origin_price}}</del> 元 / 個</p>
            <!-- 圖片列表 -->
            <div class="d-flex flex-row">
                <div class="p-1" v-for="(url, int) in item.imagesUrl" :key="int">
                <img v-if="url" :src="url" alt="item.title" class="image-in-flex">
            </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" data-bs-dismiss="modal">確定</button>
      </div>
    </div>
  </div>
</div>
    `,
methods: {
    openModal() {
        const itemModal = new bootstrap.Modal(this.$refs.itemModal);
        itemModal.show();
    }
},
};