//Tạo table
function renderTable({ title, headers, rows, actions }) {
    return `
        <h4>${title}</h4>
        <table class="table table-bordered">
            <thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
            <tbody>${rows.map(row => `
                <tr>${row.cells.map(cell => `<td>${cell}</td>`).join('')}
                    ${actions ? `<td>${actions(row.id).join('')}</td>` : ''}
                </tr>`).join('')}
            </tbody>
        </table>
    `;
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

function initParallax() {
    const parallaxSections = document.querySelectorAll('.parallax-section');
    if (!parallaxSections.length) return;

    const updateParallax = () => {
        parallaxSections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const scrollY = window.scrollY;
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                section.style.backgroundPositionY = `${scrollY * 0.3}px`;
            }
        });
        requestAnimationFrame(updateParallax);
    };
    requestAnimationFrame(updateParallax);
}

document.addEventListener('DOMContentLoaded', () => {
    initModal();
});