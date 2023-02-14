export default {
    props: ['goBesidePage', 'goPage', 'pagination'],
    template:`
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
    `
}