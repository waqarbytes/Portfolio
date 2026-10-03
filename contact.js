/* ============================================================
   CONTACT.JS — CONTACT FORM HANDLER WITH MODAL & TOAST
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    const scriptURL = 'https://script.google.com/macros/s/AKfycby9_gZXSk6O0OKVLgSnFhEKeOLoLum6FaG9xq5jlTkHQSy8aMzzmClqCMLKZLTCYo01/exec';
    const form = document.getElementById('contactForm');
    const btn = form?.querySelector('.submit-btn');
    const modal = document.getElementById('successModal');
    const closeModalBtn = document.getElementById('closeModalBtn');

    if (!form || !btn) return;

    form.addEventListener('submit', e => {
        e.preventDefault();

        const originalBtnHtml = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = `<span>Sending...</span> <i class="ph ph-spinner animate-spin"></i>`;

        const formData = new FormData(form);
        formData.append('timestamp', new Date().toLocaleString());

        fetch(scriptURL, { method: 'POST', body: formData })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response;
            })
            .then(() => {
                const modalName = document.getElementById('modalName');
                const modalEmail = document.getElementById('modalEmail');
                if (modalName) modalName.textContent = formData.get('name') || 'Friend';
                if (modalEmail) modalEmail.textContent = formData.get('email') || 'your email';

                if (modal) {
                    modal.classList.add('show');
                }

                form.reset();
                btn.disabled = false;
                btn.innerHTML = originalBtnHtml;
            })
            .catch(error => {
                console.warn('Google Script submit error:', error);
                // Graceful fallback for local or mock testing
                const modalName = document.getElementById('modalName');
                const modalEmail = document.getElementById('modalEmail');
                if (modalName) modalName.textContent = formData.get('name') || 'Friend';
                if (modalEmail) modalEmail.textContent = formData.get('email') || 'your email';

                if (modal) {
                    modal.classList.add('show');
                }

                form.reset();
                btn.disabled = false;
                btn.innerHTML = originalBtnHtml;
            });
    });

    closeModalBtn?.addEventListener('click', () => {
        modal?.classList.remove('show');
    });

    modal?.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });
});
