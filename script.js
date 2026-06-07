let selectedService = "";
let selectedPrice = 0;

function selectService(service, price){
  selectedService = service;
  selectedPrice = price;
  document.getElementById("service").value = service;
  document.getElementById("price").value = "Rs " + price;
}

const form = document.getElementById("bookingForm");

form.addEventListener("submit", function(e){
  e.preventDefault();

  const booking = {
    service: selectedService,
    price: selectedPrice,
    name: document.getElementById("name").value,
    phone: document.getElementById("phone").value,
    address: document.getElementById("address").value,
    date: document.getElementById("date").value,
    time: document.getElementById("time").value
  };

  // Save booking in localStorage
  let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
  bookings.push(booking);
  localStorage.setItem("bookings", JSON.stringify(bookings));

  document.getElementById("result").innerHTML = `
    ✅ Booking Confirmed!<br>
    Service: ${booking.service}<br>
    Price: Rs ${booking.price}<br>
    Name: ${booking.name}<br>
    Date: ${booking.date}<br>
    Time: ${booking.time}
  `;

  form.reset();
});
