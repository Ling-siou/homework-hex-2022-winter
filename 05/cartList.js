import { apiUrl, adminPath } from './config.js';

export default {
    data() {
        return {
            cartList:[]
        };
    },
    template: `
    <div>
        <table class="table table-striped border">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">商品名</th>
                    <th scope="col">價格</th>
                    <th scope="col">數量</th>
                    <th scope="col">功能</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, int) in cartList" :key="item.id">
                    <th scope="row" class="align-middle">{{ int+1 }}</th>
                        <td class="align-middle">{{ item.product.title }}</td>
                        <td class="align-middle">{{ item.product.price }}</td>
                        <td class="align-middle">@mdo</td>
                        <td class="align-middle">
                            <button class="btn btn-outline-danger btn-sm">刪除</button>
                        </td>
                    </tr>
            </tbody>
        </table>
    </div>
    `,
    created() {
        axios.get(`${apiUrl}api/${adminPath}/cart`)
        .then((res) => {
            this.cartList = res.data?.data?.carts;
            console.dir(res.data.data.carts);
        })
        .catch((err) => {
            console.dir(err);
        });
    },

};