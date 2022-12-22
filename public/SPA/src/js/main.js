import home from "./views/home.js";

import CategoryController from "./controller/CategoryController.js";
const routes = {
    "/admin": { title: "Aplikasi Kasir Kafe", render: home, controller: null },
    "/admin/categories": {
        title: "Aplikasi Kasir Kafe - Categories",
        render: CategoryController.view,
        controller: CategoryController,
    },
};

function router() {
    let view = routes[location.pathname];
    if (view) {
        document.title = view.title;

        if (view.controller) {
            if (view.controller.redirect) {
                const loading = APP_LOADING.activate();
                history.pushState(
                    "",
                    "",
                    `${baseUrl}${view.controller.redirect}`
                );
                APP_LOADING.cancel(loading);
                router();
                return;
            }
            app.innerHTML = view.render();
            CategoryController.init();
        } else {
            const loading = APP_LOADING.activate();
            setTimeout(() => {
                APP_LOADING.cancel(loading);
                app.innerHTML = view.render();
            }, 500);
        }
    } else {
        history.replaceState("", "", "/admin");
        router();
    }
}

// Handle navigation
window.addEventListener("click", (e) => {
    if (e.target.matches("[data-link]")) {
        e.preventDefault();
        if (location.href != e.target.href) {
            history.pushState("", "", e.target.href);
            router();
        }
        return;
    }
});

// Update router

window.addEventListener("popstate", router);
window.addEventListener("DOMContentLoaded", router);
