window.auth = {
    isLoggedIn: function () {
        return localStorage.getItem('isLoggedIn') === 'true' && !!localStorage.getItem('accessToken');
    },

    getCurrentUser: function () {
        if (this.isLoggedIn()) {
            return {
                username: localStorage.getItem('username'),
                fullName: localStorage.getItem('fullName'),
                token: localStorage.getItem('accessToken'),
                role: localStorage.getItem('role')
            };
        }
        return null;
    },

    getToken: function () {
        return localStorage.getItem('accessToken');
    },

    logout: function () {
        ['accessToken', 'username', 'fullName', 'role', 'isLoggedIn'].forEach(item => localStorage.removeItem(item));
        updateLoginState();
        window.router.navigate('/');
    }
};

function createLoggedInHTML(user) {
    const adminMenu = user.role === 'ROLE_ADMIN' ? `
        <li><a class="dropdown-item" href="/CinemaSTU/admin/dashboard">Dashboard Admin</a></li>
    ` : '';

    return `
        <span class="me-3">Xin chào, ${user.fullName}</span>
        <div class="dropdown d-inline-block">
            <button class="btn btn-outline-white text-white dropdown-toggle" type="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="bi bi-person-circle"></i> Tài khoản
            </button>
            <ul class="dropdown-menu" aria-labelledby="userDropdown">
                <li><a class="dropdown-item" href="/CinemaSTU/profile">Hồ sơ</a></li>
                <li><a class="dropdown-item" href="/CinemaSTU/tickets">Vé đã đặt</a></li>
                ${adminMenu}
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="#" id="logoutBtn">Đăng xuất</a></li>
            </ul>
        </div>
    `;
}

function createLoggedOutHTML() {
    return `
        <a class="btn btn-outline-success me-3 text-white border-0" href="/CinemaSTU/dangnhap" role="button">
            <i class="bi bi-person-circle"></i> Đăng nhập
        </a>
        <a class="btn btn-outline-success me-3 text-white border-0" href="/CinemaSTU/dangky" role="button">
            <i class="bi bi-person-plus"></i> Đăng ký
        </a>
        <a class="btn btn-outline-success text-white border-0" href="/CinemaSTU/lienhe" role="button">
            <i class="bi bi-patch-question-fill"></i> Liên hệ
        </a>
    `;
}

function updateLoginState() {
    const authButtons = document.querySelector('.navbar .collapse > div');
    if (auth.isLoggedIn()) {
        authButtons.innerHTML = createLoggedInHTML(auth.getCurrentUser());
    } else {
        authButtons.innerHTML = createLoggedOutHTML();
    }
}

async function authFetch(url, options = {}) {
    const token = auth.getToken();
    if (!token && auth.isLoggedIn()) {
        console.error("Không tìm thấy accessToken mặc dù đã đăng nhập");
        throw new Error("Chưa đăng nhập hoặc token không hợp lệ");
    }
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers
    };
    return fetch(url, { ...options, headers });
}

document.addEventListener('click', (e) => {
    if (e.target.id === 'logoutBtn') {
        e.preventDefault();
        auth.logout();
    }
});
