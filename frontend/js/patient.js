// 🔹 Navigation
function goHome() {
    window.location.href = "dashboard.html";
}

function goToBook() {
    window.location.href = "book.html";
}

function goToAppointments() {
    window.location.href = "appointments.html";
}

function showToast(message) {
    let toast = document.getElementById("toast");
    toast.innerText = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

// 🔥 Load doctors in dropdown
function loadDoctors() {
    let select = document.getElementById("doctor");
    if (!select) return;

    select.innerHTML = `<option value="">Select Doctor</option>`;

    fetch("http://localhost:5000/api/doctor/all")
    .then(res => res.json())
    .then(data => {
        console.log("Doctors:", data); // 🔥 debug

        data.forEach(doc => {
            let option = document.createElement("option");
            option.value = doc.name;
            option.textContent = doc.name;
            select.appendChild(option);
        });
    })
    .catch(err => console.error(err));
}

// 🔥 Book appointment (CONNECTED TO BACKEND)
function bookAppointment() {
    console.log("Booking started");

    let doctor = document.getElementById("doctor").value;
    let date = document.getElementById("date").value;
    let time = document.getElementById("time").value;

    let patientEmail = localStorage.getItem("patientEmail");

    if (!doctor || !date || !time) {
        alert("Please fill all fields");
        return;
    }

    fetch("http://localhost:5000/api/patient/book", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            doctor,
            date,
            time,
            patientEmail
        })
    })
    .then(res => {
        console.log("Response received");  // 🔥 ADD THIS
        return res.text();
    })
    .then(data => {
        console.log("Server says:", data); // 🔥 ADD THIS

        showToast("Appointment booked successfully!");

        displayAppointments();

        document.getElementById("doctor").value = "";
        document.getElementById("date").value = "";
        document.getElementById("time").value = "";
    })
    .catch(err => {
        console.error("Fetch error:", err);
        alert("Error booking appointment");
    });
}

// 🔥 Display appointments (FROM BACKEND)
function displayAppointments() {
    let container = document.getElementById("appointmentList");
    if (!container) return;

    let patientEmail = localStorage.getItem("patientEmail");

    fetch(`http://localhost:5000/api/patient/appointments?email=${patientEmail}`)
    .then(res => res.json())
    .then(data => {
        container.innerHTML = "";

        if (data.length === 0) {
            container.innerHTML = "<p style='color:#777;'>No appointments yet</p>";
            return;
        }

        data.forEach(a => {
            let div = document.createElement("div");
            div.className = "appointment-card";

            div.innerHTML = `
                <strong>🩺 ${a.doctor}</strong><br>
                📅 ${a.date}<br>
                ⏰ ${a.time}
            `;

            container.appendChild(div);
        });
    })
    .catch(err => {
        console.error(err);
        container.innerHTML = "<p>Error loading appointments</p>";
    });
}

// 🔥 Dashboard (optional but useful)
function loadDashboard() {
    let totalCount = document.getElementById("totalCount");
    let upcomingDiv = document.getElementById("upcomingAppointment");

    if (!totalCount || !upcomingDiv) return;

    let patientEmail = localStorage.getItem("patientEmail");

    fetch(`http://localhost:5000/api/patient/appointments?email=${patientEmail}`)
    .then(res => res.json())
    .then(data => {
        totalCount.innerText = data.length;

        if (data.length === 0) {
            upcomingDiv.innerHTML = "<p>No upcoming appointments</p>";
            return;
        }

        let next = data[0];

        upcomingDiv.innerHTML = `
            <strong>🩺 ${next.doctor}</strong><br>
            📅 ${next.date}<br>
            ⏰ ${next.time}
        `;
    });
}

// 🔥 Profile
function loadProfile() {
    let name = localStorage.getItem("patientName");
    let email = localStorage.getItem("patientEmail");

    let nameSpan = document.getElementById("patientName");
    let emailSpan = document.getElementById("patientEmail");

    if (nameSpan) nameSpan.innerText = name || "Not available";
    if (emailSpan) emailSpan.innerText = email || "Not available";
}

// 🔥 On page load
window.onload = function () {
    loadDoctors();
    displayAppointments();
    loadDashboard();
    loadProfile();
};