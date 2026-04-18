// Navigation
function goHome() {
    window.location.href = "dashboard.html";
}

function goToPatients() {
    window.location.href = "patients.html";
}

function goToAppointments() {
    window.location.href = "appointments.html";
}

// Data
let patients = [];
let currentFilter = "all";

// Add patient
function addPatient() {
    let name = document.getElementById("name").value;
    let age = document.getElementById("age").value;
    let phone = document.getElementById("phone").value;
    let status = document.getElementById("status").value;

    if (name === "" || age === "" || phone === "") {
        alert("Please fill all fields");
        return;
    }

    let patient = { name, age, phone, status };
    patients.push(patient);

    // Clear inputs (nice UX)
    document.getElementById("name").value = "";
    document.getElementById("age").value = "";
    document.getElementById("phone").value = "";

    applyFilter();
}

// Display patients (UPDATED UI 🔥)
function displayPatients(list) {
    let container = document.getElementById("patientList");
    container.innerHTML = "";

    if (list.length === 0) {
        container.innerHTML = "<p style='color:#777;'>No patients found</p>";
        return;
    }

    list.forEach(p => {
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
}

// Filter using buttons (NEW 🔥)
function setFilter(filter, btn) {
    currentFilter = filter;

    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    applyFilter();
}

// Apply filter logic
function applyFilter() {
    if (currentFilter === "all") {
        displayPatients(patients);
    } else {
        let filtered = patients.filter(p => p.status === currentFilter);
        displayPatients(filtered);
    }
}
// Appointments data
let appointments = [];

// Load patients into dropdown
function loadPatients() {
    let select = document.getElementById("patientSelect");

    if (!select) return;

    select.innerHTML = `<option value="">Select Patient</option>`;

    patients.forEach((p, index) => {
        let option = document.createElement("option");
        option.value = index;
        option.textContent = p.name;
        select.appendChild(option);
    });
}

// Add appointment
function addAppointment() {
    let patientIndex = document.getElementById("patientSelect").value;
    let date = document.getElementById("date").value;
    let time = document.getElementById("time").value;

    if (patientIndex === "" || date === "" || time === "") {
        alert("Please fill all fields");
        return;
    }

    let appointment = {
        patient: patients[patientIndex].name,
        date,
        time
    };

    appointments.push(appointment);

    displayAppointments();
}

// Display appointments
function displayAppointments() {
    let container = document.getElementById("appointmentList");
    container.innerHTML = "";

    if (appointments.length === 0) {
        container.innerHTML = "<p style='color:#777;'>No appointments yet</p>";
        return;
    }

    appointments.forEach(a => {
        let div = document.createElement("div");
        div.className = "patient-card";

        div.innerHTML = `
            <strong>${a.patient}</strong><br>
            📅 ${a.date}<br>
            ⏰ ${a.time}
        `;

        container.appendChild(div);
    });
}

// Run on page load
window.onload = function () {
    loadPatients();
    displayAppointments();
};