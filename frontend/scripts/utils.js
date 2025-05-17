function executeScripts() {
    const appContainer = document.getElementById('app-container'); // Local scope is fine here
    appContainer.querySelectorAll('script:not([src])').forEach(oldScript => {
        const newScript = document.createElement('script');
        newScript.textContent = oldScript.textContent;
        oldScript.parentNode.replaceChild(newScript, oldScript);
    });
}

function updateActiveNavLink(pathname) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.getAttribute('href')?.replace(BASE_PATH, '') === pathname);
    });
}