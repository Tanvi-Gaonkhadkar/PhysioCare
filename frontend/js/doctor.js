
// 🔹 Navigation
function goHome() {
    window.location.href = "dashboard.html";
}

function goToPatients() {
    window.location.href = "patients.html";
}

function goToAppointments() {
    window.location.href = "appointments.html";
}

function setActiveButton(btn) {
    document.querySelectorAll(".filter-btn").forEach(b => {
        b.classList.remove("active");
    });
    btn.classList.add("active");
}


// 🔥 Display appointments (Appointments Page)
function displayAppointments() {
    let container = document.getElementById("appointmentList");
    if (!container) return;

    let doctorName = localStorage.getItem("userName");

    fetch(`http://localhost:5000/api/doctor/appointments?doctor=${doctorName}`)
    .then(res => res.json())
    .then(data => {
        container.innerHTML = "";

        if (data.length === 0) {
            container.innerHTML = "<p>No appointments</p>";
            return;
        }

        data.forEach(a => {
            let div = document.createElement("div");
            div.className = "patient-card";

            div.innerHTML = `
                <strong>📧 ${a.patientEmail}</strong><br>
                📅 ${a.date}<br>
                ⏰ ${a.time}
            `;

            container.appendChild(div);
        });
    })
    .catch(err => console.error("Error loading appointments:", err));
}

// 🔥 Dashboard (Counts + Next Appointment)
console.log("Dashboard function running");
function loadDashboard() {
    let doctorName = localStorage.getItem("userName");
    console.log("Doctor being used:", doctorName);
    let totalCount = document.getElementById("totalCount");
    let patientCount = document.getElementById("patientCount");
    let upcomingDiv = document.getElementById("upcomingAppointment");

    if (!totalCount || !patientCount || !upcomingDiv) return;

    fetch(`http://localhost:5000/api/doctor/appointments?doctor=${doctorName}`)
    .then(res => res.json())
    .then(data => {

        // ✅ Today's appointments count
        const today = new Date();
        const formattedToday = today.getFullYear() + "-" +
            String(today.getMonth() + 1).padStart(2, '0') + "-" +
            String(today.getDate()).padStart(2, '0');

        console.log("Formatted Today:", formattedToday);

        data.forEach(app => {
            console.log("DB Date:", app.date);
        });


        const todayAppointments = data.filter(app => {
            const appDate = new Date(app.date);

            const appFormatted =
                appDate.getFullYear() + "-" +
                String(appDate.getMonth() + 1).padStart(2, '0') + "-" +
                String(appDate.getDate()).padStart(2, '0');

            return appFormatted === formattedToday;
        });

        totalCount.innerText = todayAppointments.length;

        // ✅ Unique patients count
        const patients = new Set(data.map(app => app.patientEmail));
        patientCount.innerText = patients.size;

        // ✅ Next upcoming appointment
        if (data.length === 0) {
            upcomingDiv.innerHTML = "<p>No upcoming appointments</p>";
            return;
        }

        // Sort by date
        data.sort((a, b) => new Date(a.date + " " + a.time) - new Date(b.date + " " + b.time));

        let next = data[0];

        upcomingDiv.innerHTML = `
            <strong>📧 ${next.patientEmail}</strong><br>
            📅 ${next.date}<br>
            ⏰ ${next.time}
        `;
    })
    .catch(err => {
        console.error("Dashboard error:", err);
        upcomingDiv.innerHTML = "<p>Error loading data</p>";
    });
}

// 🔥 Add Patient
function addPatient() {
    let name = document.getElementById("name").value;
    let age = document.getElementById("age").value;
    let phone = document.getElementById("phone").value;
    let status = document.getElementById("status").value;

    if (!name || !age || !phone) {
        alert("Fill all fields");
        return;
    }

    fetch("http://localhost:5000/api/patient/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, age, phone, status })
    })
    .then(res => res.json())
    .then(() => {
        alert("Patient added successfully");

        document.getElementById("name").value = "";
        document.getElementById("age").value = "";
        document.getElementById("phone").value = "";

        displayPatients();
    })
    .catch(err => console.error("Error adding patient:", err));
}

function displayPatients(filter = "all") {
    let container = document.getElementById("patientList");
    if (!container) return;

    fetch("http://localhost:5000/api/patient/all")
    .then(res => res.json())
    .then(data => {

        console.log("Filter:", filter);
        container.innerHTML = "";

        // 🔥 Apply filter
        let filteredData = data;

        if (filter !== "all") {
            filteredData = data.filter(p => 
                p.status.toLowerCase() === filter.toLowerCase()
            );
        }

        if (filteredData.length === 0) {
            container.innerHTML = "<p>No patients found</p>";
            return;
        }

        filteredData.forEach(p => {
            let div = document.createElement("div");
            div.className = "patient-card";

            div.innerHTML = `
                <strong>${p.name}</strong><br>
                Age: ${p.age}<br>
                📞 ${p.phone}<br>
                Status: ${p.status}
            `;

            container.appendChild(div);
        });
    });
}
function loginDoctor() {
  let email = document.getElementById("email").value;

  fetch("http://localhost:5000/api/doctor/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email })
  })
  .then(res => res.json())
  .then(data => {
    if (data.message) {
      alert(data.message);
      return;
    }

    // ✅ Store correct doctor
    localStorage.setItem("userName", data.name);
    localStorage.setItem("userEmail", data.email);

    // 🔥 Redirect
    window.location.href = "dashboard.html";
  })
  .catch(err => console.error(err));
}

// 🔥 Single Onload (IMPORTANT)
window.onload = function () {
    displayAppointments();
    loadDashboard();
    displayPatients();
};

