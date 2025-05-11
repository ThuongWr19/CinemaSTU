// Authentication utility functions
const auth = {
    // Check if user is logged in
    isLoggedIn: function() {
        return localStorage.getItem('isLoggedIn') === 'true';
    },
    
    // Get current user information
    getCurrentUser: function() {
        if (this.isLoggedIn()) {
            return {
                username: localStorage.getItem('username'),
                fullName: localStorage.getItem('fullName'),
                token: localStorage.getItem('token')
            };
        }
        return null;
    },
    
    // Get authentication token
    getToken: function() {
        return localStorage.getItem('token');
    },
    
    // Logout user
    logout: function() {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('fullName');
        localStorage.removeItem('isLoggedIn');
        updateLoginState();
        // Redirect to home page
        window.router.navigate('/');
    }
};

// Update UI based on login state
function updateLoginState() {
    const authButtons = document.querySelector('.navbar .collapse > div');
    
    if (auth.isLoggedIn()) {
        const user = auth.getCurrentUser();
        authButtons.innerHTML = `
            <span class="me-3">Xin chào, ${user.fullName}</span>
            <div class="dropdown d-inline-block">
                <button class="btn btn-outline-dark dropdown-toggle" type="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="bi bi-person-circle"></i> Tài khoản
                </button>
                <ul class="dropdown-menu" aria-labelledby="userDropdown">
                    <li><a class="dropdown-item" href="/profile">Hồ sơ</a></li>
                    <li><a class="dropdown-item" href="/tickets">Vé đã đặt</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item" href="#" id="logoutBtn">Đăng xuất</a></li>
                </ul>
            </div>
        `;
        
        // Add logout event listener
        document.getElementById('logoutBtn').addEventListener('click', (e) => {
            e.preventDefault();
            auth.logout();
        });
    } else {
        authButtons.innerHTML = `
            <a class="btn btn-outline-dark me-3" href="/dangnhap" role="button">
                <i class="bi bi-person-circle"></i> Đăng nhập
            </a>
            <a class="btn btn-outline-dark me-3" href="/dangky" role="button">
                <i class="bi bi-person-plus"></i> Đăng ký
            </a>
            <a class="btn btn-outline-dark" href="/lienhe" role="button">
                <i class="bi bi-patch-question-fill"></i> Liên hệ
            </a>
        `;
    }
}

// Helper function to make authenticated API requests
async function authFetch(url, options = {}) {
    // Get the auth token
    const token = auth.getToken();
    
    // Default options
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    
    // Add auth header if token exists
    if (token) {
        defaultOptions.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Merge options
    const mergedOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers
        }
    };
    
    return fetch(url, mergedOptions);
}

// Initialize auth state when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    updateLoginState();
});

// Export the auth module
window.auth = auth;
window.authFetch = authFetch;
window.updateLoginState = updateLoginState;