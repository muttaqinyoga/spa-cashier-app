import "./header.js";
import "../components/utility/toast.js";
export default () =>
    /*html*/
    `
    <header-app></header-app>
    <div class="container mt-5">
        <div class="card">
            <h3 class="card-header bg-success text-white text-center p-3">Food List</h3>
            <div class="card-body">
                <div class="row ">
                    <h2 class="text-dark text-center">Create New Food</h2>
                </div>
                <div class="row mt-3">
                    <form action="{{ url('auth/login') }}" method="post" id="formLogin">
                        <div class="form-group">
                            <label for="username" class="text-light">Username</label>
                            <input type="text" class="form-control" id="username" name="username">
                        </div>
                        <div class="form-group">
                            <label for="password" class="text-light">Password</label>
                            <input type="password" class="form-control" id="password" name="password">
                        </div>

                        <div class="form-group mt-3">
                            <button id="btnSaveCategory" type="button" class="form-control btn btn-primary">Create</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <toast-app status="danger" message="berhasil"></toast-app>
`;
