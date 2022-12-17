class Toast extends HTMLElement {
    constructor() {
        super();
        const status = this.getAttribute("status");
        const message = this.getAttribute("message");
        let statusColor = "";
        switch (status) {
            case "success":
                statusColor = "bg-success";
                break;
            case "primary":
                statusColor = "bg-primary";
                break;
            case "warning":
                statusColor = "bg-warning";
                break;
            case "danger":
                statusColor = "bg-danger";
                break;
            default:
                statusColor = "bg-secondary";
                break;
        }
        this.innerHTML = `<div class="toast-container position-fixed p-3 top-0 start-50 translate-middle-x">
                            <div id="toastAlert" class="toast border-0 ${statusColor}" role="alert" aria-live="assertive" aria-atomic="true" >
                                <div class="d-flex">
                                    <div class="toast-body text-light">
                                        ${message}
                                    </div>
                                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                                </div>
                            </div>
                        </div>`;
    }
}
customElements.define("toast-app", Toast);
