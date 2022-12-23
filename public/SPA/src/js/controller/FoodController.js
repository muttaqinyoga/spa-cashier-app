import foods from "../views/foods.js";
import addFood from "../views/add-food.js";
import formatter from "../components/utility/formatter.js";
const food = {
    view: {
        index: foods,
        create: addFood,
    },
    redirect: null,
    init: {
        create: function () {
            const nav = document.querySelector(".foods");
            nav.classList.add("active");
            const btnSaveCategory = document.querySelector("#btnSaveCategory");
            const main = this;
            btnSaveCategory.addEventListener("click", function () {
                console.log(main);
            });
        },
        index: function () {
            let loading = APP_LOADING.activate();
            let Foods = {
                headings: [
                    "Id",
                    "Name",
                    "Categories",
                    "Price",
                    "Status",
                    "Action",
                    "image",
                    "desc",
                ],
                data: [],
            };
            let FoodDataTables = null;
            const food_categories = document.querySelector("#food_categories");
            const toastAlert = document.querySelector("#toastAlert");
            const toastBody = document.querySelector("#toastAlert .toast-body");
            const toast = new bootstrap.Toast(toastAlert);
            loadFoods();
            function loadFoods() {
                fetch(`${baseUrl}/api/admin/foods/get`)
                    .then((response) => {
                        return response.json();
                    })
                    .then((res) => {
                        if (res.status === "success") {
                            APP_LOADING.cancel(loading);
                            for (let i = 0; i < res.data.length; i++) {
                                const categories = [];

                                for (
                                    let j = 0;
                                    j < res.data[i]["categories"].length;
                                    j++
                                ) {
                                    categories.push(
                                        res.data[i]["categories"][j]["name"]
                                    );
                                }
                                Foods.data[i] = [];
                                Foods.data[i].push(res.data[i]["id"]);
                                Foods.data[i].push(res.data[i]["name"]);
                                Foods.data[i].push(categories.join(", "));
                                Foods.data[i].push(res.data[i]["price"]);
                                Foods.data[i].push(res.data[i]["status_stock"]);
                                Foods.data[i].push(res.data[i]["created_at"]);
                                Foods.data[i].push(res.data[i]["image"]);
                                Foods.data[i].push(res.data[i]["description"]);
                            }
                            initFoodTable();
                            return;
                        }
                        initFoodTable();
                        toastAlert.classList.add = "bg-danger";
                        toastBody.textContent =
                            "Failed to load data from Server";
                        toast.show();
                        throw new Error(res.message);
                    })
                    .catch(console.error);
            }
            function initFoodTable() {
                const foodTables = document.querySelector("#foodTables");
                FoodDataTables = new simpleDatatables.DataTable(foodTables, {
                    data: Foods,
                    columns: [
                        {
                            select: 4,
                            render: function (data) {
                                return data == "Tersedia"
                                    ? `<span class="badge rounded-pill bg-primary">${data}</span>`
                                    : `<span class="badge rounded-pill bg-danger">${data}</span>`;
                            },
                        },
                        {
                            select: 7,
                            sortable: false,
                            hidden: true,
                        },
                        {
                            select: 6,
                            sortable: false,
                            hidden: true,
                        },
                        {
                            select: 2,
                            sortable: false,
                        },
                        {
                            select: 5,
                            sortable: false,
                            render: function (data, cell, row) {
                                return `
                            <button type="button" class="btn btn-info btn-sm detail" data-bs-toggle="modal" data-bs-target="#detailFoodModal">Detail</button>
                            <button type="button" class="btn btn-warning btn-sm edit">Edit</button>
                            <button type="button" class="btn btn-danger btn-sm delete">Delete</button>
                            `;
                            },
                        },
                        {
                            select: 3,
                            render: function (data) {
                                return formatter.formatRupiah(data);
                            },
                        },
                        {
                            select: 0,
                            sortable: false,
                            hidden: true,
                        },
                    ],
                    perPage: 4,
                    perPageSelect: [4, 10, 20, 50],
                });
                FoodDataTables.on("datatable.init", function () {
                    const thead = document.querySelector("#foodTables > thead");
                    thead.classList.add("table-dark");
                });
            }
        },
    },
};

export default food;
