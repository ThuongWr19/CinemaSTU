window.BASE_PATH = '/CinemaSTU';

const routes = {
    '/': '/frontend/template/home.html',
    '/home': '/frontend/template/home.html',
    '/dangnhap': '/frontend/template/login.html',
    '/dangky': '/frontend/template/register.html',
    '/404': '/frontend/template/404.html',
    '/phimdangchieu': '/frontend/template/now_showing.html',
    '/phimsapchieu': '/frontend/template/coming_soon.html',
    '/chitietphim': '/frontend/template/movie-details.html',
    '/datve': '/frontend/template/booking.html',
    '/lienhe': '/frontend/template/contact.html',
    '/chinhsach': '/frontend/template/policy.html',
    '/faq': '/frontend/template/faq.html',
    '/admin/dashboard': '/frontend/template/admin.html',
    '/tickets': '/frontend/template/tickets.html',
};

const appContainer = document.getElementById('app-container');

window.addEventListener('popstate', () => {
    loadContent(location.pathname.replace(BASE_PATH, '') + location.search);
});

document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link && link.getAttribute('href')?.startsWith(BASE_PATH)) {
        e.preventDefault();
        const path = link.getAttribute('href').replace(BASE_PATH, '');
        navigate(path);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    loadContent(location.pathname.replace(BASE_PATH, '') + location.search);
});

function navigate(path) {
    history.pushState(null, '', BASE_PATH + path);
    loadContent(path);
}

async function loadContent(url) {
    const urlObj = new URL(url, window.location.origin);
    let pathname = urlObj.pathname.replace(BASE_PATH, '');
    const queryParams = urlObj.searchParams;

    try {
        const mappedRoute = routes[pathname] || routes['/404'];
        const response = await fetch(BASE_PATH + mappedRoute);
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

        appContainer.style.opacity = '0';
        appContainer.innerHTML = await response.text();

        // Đợi DOM cập nhậts
        await new Promise(resolve => setTimeout(resolve, 0));

        appContainer.style.opacity = '1';

        if (pathname === '/' || pathname === '/home' || pathname === '/phimdangchieu') {
            getNowShowingMovies();
        } else if (pathname === '/phimsapchieu') {
            getComingSoonMovies();
        } else if (pathname === '/tickets') {
            loadUserTickets();
        } else if (pathname === '/admin/dashboard') {
            loadAdminDashboard();
        } else if (pathname === '/datve') {
            if (queryParams.get('id')) {
                setTimeout(() => loadMovieBooking(queryParams.get('id')), 0);
            } else {
                showModal({
                    title: 'Cảnh báo',
                    message: 'Không tìm thấy ID phim trong URL.',
                    type: 'warning',
                    size: 'md'
                });
            }
        } else if (pathname === '/chitietphim') {
            if (queryParams.get('id')) {
                loadMovieDetails(queryParams.get('id'));
            } else {
                showModal({
                    title: 'Cảnh báo',
                    message: 'Không tìm thấy ID phim trong URL.',
                    type: 'warning',
                    size: 'md'
                });
            }
        }

        if (typeof executeScripts === 'function') {
            executeScripts();
        }
        updateLoginState();
        updateActiveNavLink(pathname);
    } catch (err) {
        console.error(err);
        appContainer.innerHTML = '<div class="alert alert-danger">Không thể tải trang.</div>';
    }
}

window.router = { navigate };
