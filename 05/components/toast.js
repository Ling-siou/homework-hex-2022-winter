export default {
    props: ['successFont'],
    template: `
    <div class="toast-container position-fixed bottom-0 start-50 translate-middle-x p-3" >
        <div ref="liveToast" class="toast text-success" role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay="2000">
            <div class="toast-body">
                {{successFont}}
            </div>
        </div>
    </div>
    `,
    methods: {
        toastOpen() {
            const toast = new bootstrap.Toast(this.$refs.liveToast)
            toast.show();
        },
    }
}