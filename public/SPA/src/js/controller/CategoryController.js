import categories from "../views/categories.js";
import "../libs/simple-datatables/simple-datatables.js";
const category = {
    view: categories,
    redirect: null,
    init: function (loading) {
        loadCategories();
        let FoodDataTables = null;
        let Foods = {
            headings: ["Id", "Slug", "Name", "Image", "Action"],
            data: [],
        };
        // Get Categories
        function loadCategories() {
            fetch(`${baseUrl}/api/admin/categories/get`)
                .then((response) => {
                    return response.json();
                })
                .then((res) => {
                    if (res.status === "success") {
                        for (let i = 0; i < res.data.length; i++) {
                            Foods.data[i] = [];
                            Foods.data[i].push(res.data[i]["id"]);
                            Foods.data[i].push(res.data[i]["slug"]);
                            Foods.data[i].push(res.data[i]["name"]);
                            Foods.data[i].push(res.data[i]["image"]);
                            Foods.data[i].push(res.data[i]["created_at"]);
                        }
                        initFoodTable();
                        APP_LOADING.cancel(loading);
                        return;
                    }
                    initFoodTable();
                    throw new Error(res.message);
                })
                .catch(console.error);
        }

        // Confirm Modal
        function initFoodTable() {
            const foodTables = document.querySelector("#foodTables");
            FoodDataTables = new simpleDatatables.DataTable(foodTables, {
                data: Foods,
                columns: [
                    {
                        select: 3,
                        sortable: false,
                        render: function (data) {
                            return `<img src="${assetUrl}/images/categories/${data}" class="img-fluid mx-auto d-block" alt="food-categories" width="100">`;
                        },
                    },
                    {
                        select: 4,
                        sortable: false,
                        render: function (data, cell, row) {
                            return `
                                <button type="button" class="btn btn-warning btn-sm edit" data-id="${row.childNodes[0].textContent}" data-name="${row.childNodes[2].textContent}" data-image="${row.childNodes[3].childNodes[0].src}" data-bs-toggle="modal" data-bs-target="#editCategoryModal" data-index="${row.dataIndex}" onclick="showEdit(${row.dataIndex})" >Edit</button>
                                <button type="button" id="deleteCategory" class="btn btn-danger btn-sm" data-bs-toggle="modal" data-bs-target="#deleteConfirmModal" >Delete</button>
                                `;
                        },
                    },
                    {
                        select: 0,
                        sortable: false,
                        hidden: true,
                    },
                    {
                        select: 1,
                        sortable: false,
                        hidden: true,
                    },
                ],
                perPage: 4,
                perPageSelect: [4, 10, 20, 50],
            });
            const thead = document.querySelector("#foodTables > thead");
            thead.classList.add("table-dark");
            foodTables.addEventListener("click", function (e) {
                if (e.target.getAttribute("id") === "deleteCategory") {
                    const data =
                        FoodDataTables.data[
                            e.target.parentNode.parentNode.dataIndex
                        ];
                    const deleteCategory = {
                        id: data.childNodes[0].data,
                        name: data.childNodes[2].data,
                    };
                    const deleteConfirmModalBody = document.querySelector(
                        "#deleteConfirmModal .modal-body"
                    );
                    const delete_id = document.querySelector(
                        "#deleteConfirmModal #delete_id"
                    );
                    delete_id.value = deleteCategory.id;
                    deleteConfirmModalBody.innerHTML = `Do you want to Delete <strong>${deleteCategory.name}</strong> from Category List ?`;
                }
            });
            const deleteConfirmModal = new bootstrap.Modal(
                "#deleteConfirmModal"
            );
            const deleteCategoryForm = document.querySelector(
                "#deleteConfirmModal #deleteCategoryForm"
            );
            const toastAlert = document.querySelector("#toastAlert");
            const toastBody = document.querySelector("#toastAlert .toast-body");
            deleteCategoryForm.addEventListener("submit", function (e) {
                e.preventDefault();
                loading = APP_LOADING.activate();
                const payloadDeleteCategory = {
                    _token: csrf,
                    _method: "DELETE",
                    delete_id: document
                        .getElementsByName("delete_id")[0]
                        .getAttribute("value"),
                };
                fetch(`${baseUrl}/api/admin/categories/delete`, {
                    method: "DELETE",
                    headers: {
                        accept: "application/json",
                        "Content-type": "application/json; charset=UTF-8",
                        "X-CSRF-TOKEN": csrf,
                    },
                    credentials: "same-origin",
                    body: JSON.stringify(payloadDeleteCategory),
                })
                    .then((response) => response.json())
                    .then((res) => {
                        if (res.status === "failed") {
                            deleteConfirmModal.hide();
                            deleteCategoryForm.reset();
                            APP_LOADING.cancel(loading);
                            toastAlert.classList.add("bg-danger");
                            toastBody.textContent = res.message;
                            const toast = new bootstrap.Toast(toastAlert);
                            toast.show();
                        } else if (res.status === "success") {
                            deleteConfirmModal.hide();
                            deleteCategoryForm.reset();
                            FoodDataTables.destroy();
                            loadCategories();
                            toastAlert.classList.add("bg-success");
                            toastBody.textContent = res.message;
                            const toast = new bootstrap.Toast(toastAlert);
                            toast.show();
                        }
                    })
                    .catch((err) => {
                        deleteConfirmModal.hide();
                        deleteCategoryForm.reset();
                        APP_LOADING.cancel(loading);
                        toastAlert.classList.add("bg-danger");
                        toastBody.textContent = res.message;
                        const toast = new bootstrap.Toast(toastAlert);
                        toast.show();
                    });
            });
        }
    },
};

export default category;
