document.addEventListener('DOMContentLoaded', () => {
    // Handle checkout form submission
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent default form submission
            
            // Retrieve form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const ticketType = document.querySelector('input[name="ticket-type"]:checked').value;
            
            // Display confirmation alert
            alert(`Thank you, ${name}! Your ${ticketType} ticket has been purchased. A confirmation email will be sent to ${email}.`);

            // Here you would normally send the form data to your server or payment gateway
            // For example, using fetch:
            /*
            fetch('/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    ticketType: ticketType,
                }),
            })
            .then(response => response.json())
            .then(data => {
                // Handle server response
                console.log('Success:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
            */
        });
    }

    // Load lineup details dynamically
    const lineupSection = document.querySelector('.artist-list');
    if (lineupSection) {
        // Check if artist list is already populated
        if (!lineupSection.hasAttribute('data-loaded')) {
            // Sample data (this could be fetched from a server)
            const artists = [
                { name: 'Taylor Swift', time: '12:00 PM - 1:00 PM' },
                { name: 'Rihanna', time: '1:30 PM - 2:30 PM' },
                { name: 'Bruno Mars', time: '3:00 PM - 4:00 PM' },
                { name: 'Shawn Mendes', time: '4:30 PM - 5:30 PM' }
            ];

            // Populate artist list
            const artistList = lineupSection.querySelector('ul');
            if (artistList) {
                artists.forEach(artist => {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `<h4>${artist.name}</h4><p>Performance Time: ${artist.time}</p>`;
                    artistList.appendChild(listItem);
                });
            }
            lineupSection.setAttribute('data-loaded', 'true');
        }
    }

    
});
