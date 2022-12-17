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
let view = null;
function router() {
    view = routes[location.pathname];
    console.log(view);
    const loading = APP_LOADING.activate();
    if (view) {
        document.title = view.title;
        if (view.controller) {
            if (view.controller.redirect) {
                // history.replaceState(
                //     "",
                //     "",
                //     `${baseUrl}${view.controller.redirect}`
                // );
                view = router[view.controller.redirect];
                router();
            }
        }
        setTimeout(() => {
            APP_LOADING.cancel(loading);
            app.innerHTML = view.render();
        }, 500);
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
