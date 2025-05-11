// Define routes
const routes = {
    '/': '/frontend/template/home.html',
    '/home': '/frontend/template/home.html',
    '/dangnhap': '/frontend/template/login.html',
    '/dangky': '/frontend/template/register.html',
    '/404': '/frontend/template/404.html',
    '/danhsachphim': '/frontend/template/movies-list.html',
    '/datve': '/frontend/template/booking.html',
    '/khuyenmai': '/frontend/template/promotions.html',
    '/lienhe': '/frontend/template/contact.html',
    '/chinhsach': '/frontend/template/policy.html',
    '/faq': '/frontend/template/faq.html'
};

// Application container
const appContainer = document.getElementById('app-container');

// Load page content
async function loadContent(url) {
    try {
        // Get the route path or default to 404
        const route = routes[url] || routes['/404'];
        
        // Fetch the page content
        const response = await fetch(route);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const content = await response.text();
        
        // Update the container with the new content
        appContainer.innerHTML = content;
        
        // Execute any scripts in the loaded content
        executeScripts();
        
        // If on homepage, load movies
        if (url === '/' || url === '/home') {
            if (typeof getMovieList === 'function') {
                getMovieList();
            }
        }
        
        // Scroll to top of page
        window.scrollTo(0, 0);
        
        // Update active nav link
        updateActiveNavLink(url);
        
    } catch (error) {
        console.error('Error loading content:', error);
        // Load 404 page if there's an error
        if (url !== '/404') {
            loadContent('/404');
        } else {
            appContainer.innerHTML = '<div class="alert alert-danger">Không thể tải trang. Vui lòng thử lại sau.</div>';
        }
    }
}

// Execute scripts from loaded HTML
function executeScripts() {
    const scripts = appContainer.querySelectorAll('script');
    scripts.forEach(oldScript => {
        const newScript = document.createElement('script');
        
        // Copy all attributes from the old script to the new one
        Array.from(oldScript.attributes).forEach(attr => {
            newScript.setAttribute(attr.name, attr.value);
        });
        
        // Copy the content of the script
        newScript.textContent = oldScript.textContent;
        
        // Replace the old script with the new one
        oldScript.parentNode.replaceChild(newScript, oldScript);
    });
}

// Handle navigation
function navigate(url) {
    // Push the new state to browser history
    history.pushState(null, null, url);
    loadContent(url);
}

// Update active navigation link
function updateActiveNavLink(url) {
    // Remove active class from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to current nav link
    const activeLink = document.querySelector(`.nav-link[href="${url}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// Initial page load
document.addEventListener('DOMContentLoaded', () => {
    // Load content based on current URL
    loadContent(window.location.pathname);
    
    // Add click event listeners to all internal links
    document.addEventListener('click', (event) => {
        const link = event.target.closest('a');
        
        if (link && link.href.startsWith(window.location.origin) && !link.hasAttribute('target')) {
            event.preventDefault();
            const url = link.getAttribute('href');
            navigate(url);
        }
    });
    
    // Handle back/forward browser buttons
    window.addEventListener('popstate', () => {
        loadContent(window.location.pathname);
    });
});

// Export functions for use in other scripts
window.router = {
    navigate: navigate,
    loadContent: loadContent
};