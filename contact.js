// Contact Form Submission
const scriptURL = 'https://script.google.com/macros/s/AKfycby9_gZXSk6O0OKVLgSnFhEKeOLoLum6FaG9xq5jlTkHQSy8aMzzmClqCMLKZLTCYo01/exec'; // Replace with your URL after deployment
const form = document.getElementById('contactForm');
const btn = document.querySelector('.submit-btn');

form.addEventListener('submit', e => {
    e.preventDefault();
    btn.disabled = true;
    btn.innerHTML = 'Sending...';

    const formData = new FormData(form);
    formData.append('timestamp', new Date().toLocaleString());

    fetch(scriptURL, { method: 'POST', body: formData })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok. Status: ' + response.status);
            }
            return response;
        })
        .then(() => {
            // Show Success Modal
            const modal = document.getElementById('successModal');
            document.getElementById('modalName').textContent = formData.get('name');
            document.getElementById('modalEmail').textContent = formData.get('email');

            modal.style.display = 'block';
            setTimeout(() => {
                modal.classList.add('show');
            }, 10);

            // Handle Close Button
            document.getElementById('closeModalBtn').addEventListener('click', () => {
                modal.classList.remove('show');
                setTimeout(() => {
                    modal.style.display = 'none';
                }, 300);
            });

            // Close on outside click
            window.onclick = function (event) {
                if (event.target == modal) {
                    modal.classList.remove('show');
                    setTimeout(() => {
                        modal.style.display = 'none';
                    }, 300);
                }
            }

            form.reset();
            btn.disabled = false;
            btn.innerHTML = 'Send Message';
        })
        .catch(error => {
            console.error('Submission Error:', error);
            alert('Error sending message: ' + error.message);
            btn.disabled = false;
            btn.innerHTML = 'Send Message';
        });
});
