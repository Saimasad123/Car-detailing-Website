// Safe user parsing
let user = null;
try {
  const raw = localStorage.getItem('user');
  user = raw ? JSON.parse(raw) : null;
} catch (err) {
  console.warn('Failed to parse user:', err);
  user = null;
}

if (!user) {
  window.location.href = 'login.html';
}

const bookingList = document.getElementById('bookingList');

// Show immediate status
bookingList.innerHTML = '<p style="color: blue;">Connecting to server...</p>';

// Fetch with timeout
const fetchWithTimeout = (url, timeout = 5000) => {
  return Promise.race([
    fetch(url),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeout)
    )
  ]);
};

// Load bookings immediately
const url = window.location.origin + '/api/bookings/history';
console.log('Fetching:', url);

fetchWithTimeout(url)
  .then(res => {
    console.log('Response received:', res.status);
    return res.json();
  })
  .then(data => {
    console.log('Data parsed:', data);
    
    if (!data.bookings || data.bookings.length === 0) {
      bookingList.innerHTML = '<p>No bookings found in system.</p>';
      return;
    }

    // Filter by user email
    const userEmail = (user.email || '').toLowerCase().trim();
    const userBookings = data.bookings.filter(b => 
      (b.email || '').toLowerCase().trim() === userEmail
    );

    console.log('User email:', userEmail);
    console.log('User bookings:', userBookings);

    if (userBookings.length === 0) {
      bookingList.innerHTML = `
        <p>No bookings for ${user.email}</p>
        <hr/>
        <p><b>Available bookings in system:</b></p>
        ${data.bookings.map(b => `<p>• ${b.email} - ${b.service}</p>`).join('')}
      `;
      return;
    }

    // Show bookings
    bookingList.innerHTML = userBookings.map(b => `
      <div class="booking-card">
        <h3>${b.service || 'Service'}</h3>
        <p><b>Booking ID:</b> <span class="booking-id">${b.bookingId || 'N/A'}</span></p>
        <p><b>Name:</b> ${b.name || 'N/A'}</p>
        <p><b>Email:</b> ${b.email || 'N/A'}</p>
        <p><b>Phone:</b> ${b.phone || 'N/A'}</p>
        <p><b>Address:</b> ${b.address && b.city && b.zipcode ? `${b.address}, ${b.city} ${b.zipcode}` : 'N/A'}</p>
        <p><b>Date:</b> ${b.date || 'N/A'}</p>
        <p><b>Time:</b> ${b.time || 'N/A'}</p>
        <p><b>Status:</b> <span class="booking-status">✓ Confirmed</span></p>
      </div>
    `).join('');
  })
  .catch(err => {
    console.error('Error:', err);
    bookingList.innerHTML = `
      <p style="color: red;"><b>Error loading bookings:</b></p>
      <p>${err.message}</p>
      <p>Server URL: ${url}</p>
      <p>Try restarting the server and refreshing this page.</p>
    `;
  });
