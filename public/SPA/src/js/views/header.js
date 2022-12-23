class Header extends HTMLElement {
    constructor() {
        super();

        this.innerHTML = `<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
                            <div class="container" style="padding-right: 5rem; padding-left: 3rem;">
                                <a class="navbar-brand" href="javascript:">Mtq Kafe</a>
                                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                                    <span class="navbar-toggler-icon"></span>
                                </button>
                                <div class="collapse navbar-collapse" id="navbarNavDropdown">
                                    <ul class="navbar-nav">
                                        <li class="nav-item">
                                            <a class="nav-link admin" href="/admin" data-link>Home</a>
                                        </li>
                                        <li class="nav-item">
                                            <a class="nav-link categories" href="/admin/categories" data-link>Category List</a>
                                        </li>
                                        <li class="nav-item">
                                            <a class="nav-link foods" href="/admin/foods" data-link>Food List</a>
                                        </li>
                                        <li class="nav-item">
                                            <a class="nav-link orders" href="{{ url('admin/orders') }}">Orders</a>
                                        </li>
                                    </ul>
                                    <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                                        <li class="nav-item dropdown">
                                            <a class="nav-link dropdown-toggle" href="javascript:" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                Akun
                                            </a>
                                            <ul class="dropdown-menu col-md-4" aria-labelledby="navbarDropdownMenuLink">
                                                <li class="dropdown-item">${credentials}</li>
                                                <li>
                                                    <hr class="dropdown-divider">
                                                </li>
                                                <li>
                                                    <a class="dropdown-item" href="javascript:" id="logoutBtn">Sign out</a>
                                                    <form action="${baseUrl}/auth/logout" id="formLogout" method="post" style="display: none;">
                                                        <input type="hidden" name="_token" value="${csrf}" />
                                                    </form>
                                                </li>
                                            </ul>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </nav>`;

        const logoutBtn = document.querySelector("#logoutBtn");
        const formLogout = document.querySelector("#formLogout");

        logoutBtn.addEventListener("click", function () {
            formLogout.submit();
        });
        const navLinks = document.querySelectorAll(".nav-link");
        const currUrl = window.location.pathname.split("/").pop();
        navLinks.forEach((e) => {
            e.classList.remove = "active";
            if (e.classList.contains(currUrl)) {
                e.classList.add("active");
            }
        });
    }
}

customElements.define("header-app", Header);
