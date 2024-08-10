document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('signupForm');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const data = {
            fullName: formData.get('name'),
            emailAddress: formData.get('email'),
            phoneNumber: formData.get('phone'),
            ticketType: formData.get('ticketType'),
            subscribeToNewsletter: formData.get('newsletter') === 'on',
        };

        try {
            const response = await fetch('/api/tickets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                alert('Successfully signed up!');
                form.reset();
            } else {
                alert('Failed to sign up. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
        }
    });
});
