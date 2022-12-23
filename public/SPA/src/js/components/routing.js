import home from "../views/home.js";

// Register your page here
const page = {
    "/admin": {
        title: "Aplikasi Kasir Kafe",
        render: home,
    },
    // ...
};
const routing = {
    get: function (path = "/admin", controller = null) {
        this.push(path);
    },
    push: function (path = "/admin") {
        let view = page[path];
        if (view) {
            document.title = view.title;
            app.innerHTML = view.render();
        } else {
            history.replaceState("", "", "/admin");
            this.get("/admin");
        }
    },
};
// function router() {
//     let view = routes[location.pathname];
//     if (view) {
//         document.title = view.title;

//         if (view.controller) {
//             if (view.controller.redirect) {
//                 const loading = APP_LOADING.activate();
//                 history.pushState(
//                     "",
//                     "",
//                     `${baseUrl}${view.controller.redirect}`
//                 );
//                 APP_LOADING.cancel(loading);
//                 router();
//                 return;
//             }
//             app.innerHTML = view.render();
//             view.controller();
//         } else {
//             const loading = APP_LOADING.activate();
//             setTimeout(() => {
//                 APP_LOADING.cancel(loading);
//                 app.innerHTML = view.render();
//             }, 500);
//         }
//     } else {
//         history.replaceState("", "", "/admin");
//         router();
//     }
// }

// Handle navigation
window.addEventListener("click", (e) => {
    if (e.target.matches("[data-link]")) {
        e.preventDefault();
        if (location.href != e.target.href) {
            history.pushState("", "", e.target.href);
            routing.get(e.target.href);
        }
        return;
    }
});

// // Update router

window.addEventListener("popstate", routing.push());
window.addEventListener("DOMContentLoaded", routing.push());

export default routing;
