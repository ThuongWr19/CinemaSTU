window.auth = {
    isLoggedIn: function() {
        return localStorage.getItem('isLoggedIn') === 'true';
    },

    getCurrentUser: function() {
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

    getToken: function() {
        return localStorage.getItem('accessToken');
    },

    logout: function() {
        ['accessToken', 'username', 'fullName', 'role', 'isLoggedIn'].forEach(item => localStorage.removeItem(item));
        updateLoginState();
        window.router.navigate('/');
    }
};

function createLoggedInHTML(user) {
    const adminMenu = user.role === 'ROLE_ADMIN' ? `
        <li><a class="dropdown-item" href="/CinemaGo/admin/dashboard">Dashboard Admin</a></li>
    ` : '';
    
    return `
        <span class="me-3">Xin chào, ${user.fullName}</span>
        <div class="dropdown d-inline-block">
            <button class="btn btn-outline-dark dropdown-toggle" type="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="bi bi-person-circle"></i> Tài khoản
            </button>
            <ul class="dropdown-menu" aria-labelledby="userDropdown">
                <li><a class="dropdown-item" href="/CinemaGo/profile">Hồ sơ</a></li>
                <li><a class="dropdown-item" href="/CinemaGo/tickets">Vé đã đặt</a></li>
                ${adminMenu}
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="#" id="logoutBtn">Đăng xuất</a></li>
            </ul>
        </div>
    `;
}

function createLoggedOutHTML() {
    return `
        <a class="btn btn-outline-dark me-3" href="/CinemaGo/dangnhap" role="button">
            <i class="bi bi-person-circle"></i> Đăng nhập
        </a>
        <a class="btn btn-outline-dark me-3" href="/CinemaGo/dangky" role="button">
            <i class="bi bi-person-plus"></i> Đăng ký
        </a>
        <a class="btn btn-outline-dark" href="/CinemaGo/lienhe" role="button">
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
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers
    };

    return fetch(url, { ...options, headers });
}

function initModal() {
    const modalHTML = `
        <div class="modal fade" id="appModal" tabindex="-1" aria-labelledby="appModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="appModalLabel"></h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="confirmModal" tabindex="-1" aria-labelledby="confirmModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="confirmModalLabel">Xác nhận</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                        <button type="button" class="btn btn-primary" id="confirmModalOk">OK</button>
                    </div>
                </div>
            </div>
        </div>
        <style>
            .modal {
                display: flex !important;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                z-index: 1050;
            }
            .modal-dialog {
                margin: auto;
                max-width: 90%;
            }
            .modal-content {
                width: 100%;
            }
            .modal-backdrop {
                z-index: 1040;
            }
            .modal.fade:not(.show) {
                display: none !important;
            }
        </style>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function showModal({ title, message, type = 'error', autoClose = false, size = 'md' }) {
    const modal = document.getElementById('appModal');
    const modalDialog = modal.querySelector('.modal-dialog');
    const modalTitle = modal.querySelector('.modal-title');
    const modalBody = modal.querySelector('.modal-body');
    const modalContent = modal.querySelector('.modal-content');

    modalTitle.textContent = title;
    modalBody.textContent = message;
    
    modalDialog.classList.remove('modal-sm', 'modal-md', 'modal-lg', 'modal-xl');
    modalDialog.classList.add(`modal-${size}`);
    
    modalContent.classList.remove('border-success', 'border-danger', 'border-warning', 'text-success', 'text-danger', 'text-warning');
    
    if (type === 'success') {
        modalContent.classList.add('border-success', 'text-success');
    } else if (type === 'warning') {
        modalContent.classList.add('border-warning', 'text-warning');
    } else {
        modalContent.classList.add('border-danger', 'text-danger');
    }

    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();

    if (type === 'success' && autoClose) {
        setTimeout(() => bsModal.hide(), 2000);
    }

    modal.addEventListener('hidden.bs.modal', () => {
        document.body.classList.remove('modal-open');
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) backdrop.remove();
    }, { once: true });
}

function showConfirmModal({ message, onConfirm, size = 'md' }) {
    const modal = document.getElementById('confirmModal');
    const modalDialog = modal.querySelector('.modal-dialog');
    const modalBody = modal.querySelector('.modal-body');
    const okButton = modal.querySelector('#confirmModalOk');

    modalBody.textContent = message;

    modalDialog.classList.remove('modal-sm', 'modal-md', 'modal-lg', 'modal-xl');
    modalDialog.classList.add(`modal-${size}`);

    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();

    const handleConfirm = () => {
        onConfirm();
        bsModal.hide();
        okButton.removeEventListener('click', handleConfirm);
    };

    okButton.addEventListener('click', handleConfirm);

    modal.addEventListener('hidden.bs.modal', () => {
        document.body.classList.remove('modal-open');
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) backdrop.remove();
    }, { once: true });
}

document.addEventListener('DOMContentLoaded', () => {
    initModal();
    updateLoginState();
    document.addEventListener('click', (e) => {
        if (e.target.id === 'logoutBtn') {
            e.preventDefault();
            auth.logout();
        }
    });
});

window.authFetch = authFetch;
window.updateLoginState = updateLoginState;
window.showConfirmModal = showConfirmModal;