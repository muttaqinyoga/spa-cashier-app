import "./header.js";
import "../components/utility/toast.js";
import "../components/utility/ConfirmDelete.js";
export default () =>
    /*html*/
    `
    <header-app></header-app>
    <div class="container mt-5">
        <div class="card">
            <h4 class="card-header bg-primary text-white text-center p-2">Food List Category</h4>
            <div class="card-body text-white">
                <div class="row">
                    <div class="col-md-3">
                        <button type="button" class="btn btn-outline-success" data-bs-toggle="modal" data-bs-target="#addCategoryModal">
                            Add New Category
                        </button>
                    </div>
                </div>
                <div class="row mt-3">
                    <table id="foodTables" class="table table-striped table-responsive table-bordered">

                    </table>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade text-left" id="addCategoryModal" tabindex="-1" aria-labelledby="addCategoryModal" role="dialog">
        <div class="modal-dialog modal-dialog-top modal-dialog-scrollable" role="document">
            <div class="modal-content">
                <div class="modal-header bg-success">
                    <h4 class="modal-title text-light">Add Food Category</h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">

                    </button>
                </div>
                <form method="post" id="addCategoryForm">
                    <input type="hidden" name="_token" value="${csrf}" >
                    <div class="modal-body">
                        <label>Name</label>
                        <div class="form-group">
                            <input type="text" placeholder="Enter category food name..." class="form-control" name="category_name" id="category_name">
                            <div class="invalid-feedback" id="category_name_feedback">

                            </div>
                        </div>
                        <label>Image</label>
                        <div class="form-group">
                            <input class="form-control" type="file" name="category_image" id="category_image">
                            <div class="invalid-feedback" id="category_image_feedback">

                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                            Cancel
                        </button>
                        <button type="submit" class="btn btn-success ml-1" id="btnSubmitCategory">
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <delete-modal></delete-modal>
    <toast-app status="danger" message="berhasil"></toast-app>
`;
