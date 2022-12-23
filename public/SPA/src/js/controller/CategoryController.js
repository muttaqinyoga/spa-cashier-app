import categories from "../views/categories.js";
import "../libs/simple-datatables/simple-datatables.js";
import validation from "../components/utility/validation.js";
const category = {
    view: categories,
    redirect: null,
    init: function () {
        console.log("oke");
        loadCategories();
        let loading = APP_LOADING.activate();
        let FoodDataTables = null;
        let Foods = {
            headings: ["Id", "Slug", "Name", "Image", "Action"],
            data: [],
        };
        const toastAlert = document.querySelector("#toastAlert");
        const toastBody = document.querySelector("#toastAlert .toast-body");
        const toast = new bootstrap.Toast(toastAlert);
        const delete_id = document.querySelector(
            "#deleteConfirmModal #delete_id"
        );
        const deleteConfirmModal = new bootstrap.Modal("#deleteConfirmModal");
        const deleteCategoryForm = document.querySelector(
            "#deleteConfirmModal #deleteCategoryForm"
        );
        const deleteConfirmModalBody = document.querySelector(
            "#deleteConfirmModal .modal-body"
        );
        const editCategoryModal = new bootstrap.Modal("#editCategoryModal");
        const editCategoryForm = document.querySelector(
            "#editCategoryModal #editCategoryForm"
        );
        const edit_id = document.querySelector(
            "#editCategoryModal #editCategoryForm #edit_id"
        );
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
        function initFoodTable() {
            const foodTables = document.querySelector("#foodTables");
            FoodDataTables = new simpleDatatables.DataTable(foodTables, {
                data: Foods,
                columns: [
                    {
                        select: 3,
                        sortable: false,
                        render: function (data) {
                            return `<img src="${assetUrl}images/categories/${data}" class="img-fluid mx-auto d-block" alt="food-categories" width="100">`;
                        },
                    },
                    {
                        select: 4,
                        sortable: false,
                        render: function (data, cell, row) {
                            return `
                                <button type="button" class="btn btn-warning btn-sm editCategory" >Edit</button>
                                <button type="button"  class="btn btn-danger btn-sm deleteCategory" >Delete</button>
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
            FoodDataTables.on("datatable.init", function () {
                const thead = document.querySelector("#foodTables > thead");
                thead.classList.add("table-dark");
            });
        }
        foodTables.addEventListener("click", function (e) {
            if (e.target.classList.contains("deleteCategory")) {
                const data =
                    FoodDataTables.data[
                        e.target.parentNode.parentNode.dataIndex
                    ];
                const deleteCategory = {
                    id: data.childNodes[0].data,
                    name: data.childNodes[2].data,
                };
                delete_id.value = deleteCategory.id;
                deleteConfirmModalBody.innerHTML = `Do you want to Delete <strong>${deleteCategory.name}</strong> from Category List ?`;
                deleteConfirmModal.show();
            } else if (e.target.classList.contains("editCategory")) {
                const data =
                    FoodDataTables.data[
                        e.target.parentNode.parentNode.dataIndex
                    ];
                const editCategory = {
                    id: data.childNodes[0].data,
                    name: data.childNodes[2].data,
                    imgSrc: data.childNodes[3].childNodes[0].currentSrc,
                };
                editCategoryForm.reset();
                edit_id.value = editCategory.id;
                document.querySelector("#category_edit_name").value =
                    editCategory.name;
                document
                    .querySelector("#current_category_edit_image")
                    .setAttribute("src", editCategory.imgSrc);
                validation.run("category_edit_name");
                editCategoryModal.show();
            }
        });
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
                        toast.show();
                        return;
                    } else if (res.status === "success") {
                        FoodDataTables.destroy();
                        FoodDataTables = null;
                        Foods.data = [];
                        deleteConfirmModal.hide();
                        loadCategories();
                        toastAlert.classList.add("bg-success");
                        toastBody.textContent = res.message;
                        toast.show();
                        return;
                    }
                })
                .catch((err) => {
                    console.error;
                });
        });
        // Update Category
        editCategoryForm.addEventListener("submit", (e) => {
            e.preventDefault();
            if (validation.run("category_edit_name")) {
                const payloadEditCategory = new FormData(editCategoryForm);
                loading = APP_LOADING.activate();
                fetch(`${baseUrl}/api/admin/categories/update`, {
                    method: "POST",
                    headers: {
                        accept: "application/json",
                    },
                    credentials: "same-origin",
                    body: payloadEditCategory,
                })
                    .then((response) => response.json())
                    .then((res) => {
                        if (res.status === "failed") {
                            APP_LOADING.cancel(loading);
                            if (res.errors) {
                                Object.keys(res.errors).forEach(
                                    (key, index) => {
                                        const elemInput =
                                            document.getElementById(key);
                                        const elemFeedBack =
                                            document.getElementById(
                                                key + "_feedback"
                                            );
                                        if (elemInput && elemFeedBack) {
                                            elemInput.classList.add(
                                                "is-invalid"
                                            );
                                            elemFeedBack.textContent =
                                                res.errors[key][0];
                                        }
                                    }
                                );
                                return;
                            }
                            editCategoryModal.hide();
                            editCategoryForm.reset();
                            toastAlert.classList.add("bg-danger");
                            toastBody.textContent = res.message;
                            toast.show();
                            return;
                        } else if (res.status === "success") {
                            editCategoryModal.hide();
                            editCategoryForm.reset();
                            APP_LOADING.cancel(loading);
                            FoodDataTables.destroy();
                            FoodDataTables = null;
                            Foods.data = [];
                            loadCategories();
                            toastAlert.classList.add("bg-warning");
                            toastBody.textContent = res.message;
                            toast.show();
                        }
                    })
                    .catch((err) => console.error);
            }
        });
        // Save Category
        const addCategoryModal = new bootstrap.Modal("#addCategoryModal");
        const addCategoryForm = document.querySelector(
            "#addCategoryModal #addCategoryForm"
        );
        const inputs = document.querySelectorAll("input");
        inputs.forEach(function (input) {
            input.addEventListener("input", function (e) {
                if (e.target.type === "file") {
                    validation.checkFile(e.target.name);
                    return;
                }
                validation.run(input.id);
                return;
            });
        });
        addCategoryForm.addEventListener("submit", (e) => {
            e.preventDefault();
            if (validation.run("category_name")) {
                const payloadCategory = new FormData(addCategoryForm);
                loading = APP_LOADING.activate();
                fetch(`${baseUrl}/api/admin/categories/save`, {
                    method: "POST",
                    headers: {
                        accept: "application/json",
                    },
                    credentials: "same-origin",
                    body: payloadCategory,
                })
                    .then((response) => response.json())
                    .then((res) => {
                        if (res.status === "failed") {
                            APP_LOADING.cancel(loading);
                            if (res.errors) {
                                Object.keys(res.errors).forEach(
                                    (key, index) => {
                                        const elemInput =
                                            document.getElementById(key);
                                        const elemFeedBack =
                                            document.getElementById(
                                                key + "_feedback"
                                            );
                                        if (elemInput && elemFeedBack) {
                                            elemInput.classList.add(
                                                "is-invalid"
                                            );
                                            elemFeedBack.textContent =
                                                res.errors[key][0];
                                        }
                                    }
                                );
                                return;
                            }
                            addCategoryModal.hide();
                            addCategoryForm.reset();
                            toastAlert.classList.add("bg-danger");
                            toastBody.textContent = res.message;
                            toast.show();
                        } else if (res.status === "created") {
                            addCategoryModal.hide();
                            addCategoryForm.reset();
                            APP_LOADING.cancel(loading);
                            FoodDataTables.destroy();
                            FoodDataTables = null;
                            Foods.data = [];
                            loadCategories();
                            toastAlert.classList.add("bg-primary");
                            toastBody.textContent = res.message;
                            toast.show();
                        }
                    })
                    .catch((err) => console.error);
            }
        });
    },
};

export default category;
