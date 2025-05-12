// History-based router with base path support (e.g., /CinemaGo)
const BASE_PATH = '/CinemaGo';

const routes = {
  '/': '/frontend/template/home.html',
  '/home': '/frontend/template/home.html',
  '/dangnhap': '/frontend/template/login.html',
  '/dangky': '/frontend/template/register.html',
  '/404': '/frontend/template/404.html',
  '/danhsachphim': '/frontend/template/home.html',
  '/datve': '/frontend/template/booking.html',
  '/khuyenmai': '/frontend/template/promotions.html',
  '/lienhe': '/frontend/template/contact.html',
  '/chinhsach': '/frontend/template/policy.html',
  '/faq': '/frontend/template/faq.html',
  '/admin': '/frontend/template/faq.html'
};

const appContainer = document.getElementById('app-container');

window.addEventListener('popstate', () => {
  const path = location.pathname.replace(BASE_PATH, '') + location.search;
  loadContent(path);
});

// Initial load
const initialPath = location.pathname.replace(BASE_PATH, '') + location.search;
loadContent(initialPath);

function navigate(path) {
  const fullPath = BASE_PATH + path;
  history.pushState(null, '', fullPath);
  loadContent(path);
}

async function loadContent(url) {
  const urlObj = new URL(url, window.location.origin);
  const pathname = urlObj.pathname;
  const queryParams = urlObj.searchParams;

  try {
    const route = BASE_PATH + (routes[pathname] || BASE_PATH + routes['/404']);
    const response = await fetch(route);
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

    const content = await response.text();
    appContainer.innerHTML = content;
    executeScripts();

    if (pathname === '/' || pathname === '/home' || pathname === '/danhsachphim') {
      getMovieList();
    }

    if (pathname === '/datve') {
      const movieId = queryParams.get('id');
      if (movieId) {
        loadMovieDetails(movieId);
      } else {
        appContainer.innerHTML = '<p>Không tìm thấy ID phim trong URL.</p>';
      }
    }

    window.scrollTo(0, 0);
    updateActiveNavLink(pathname);
  } catch (err) {
    console.error(err);
    appContainer.innerHTML = '<div class="alert alert-danger">Không thể tải trang.</div>';
  }
}

function updateActiveNavLink(pathname) {
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    const relativeHref = href.replace(BASE_PATH, '');
    link.classList.toggle('active', relativeHref === pathname);
  });
}

function executeScripts() {
  const scripts = appContainer.querySelectorAll('script');
  scripts.forEach(oldScript => {
    const newScript = document.createElement('script');
    Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
    newScript.textContent = oldScript.textContent;
    oldScript.parentNode.replaceChild(newScript, oldScript);
  });
}

document.addEventListener('click', function (e) {
  const link = e.target.closest('a');
  if (link && link.getAttribute('href')?.startsWith(BASE_PATH)) {
    e.preventDefault();
    const path = link.getAttribute('href').replace(BASE_PATH, '');
    navigate(path);
  }
});