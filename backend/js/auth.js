let selectedRole = null;

function selectRole(role) {
    console.log("Selected:", role); // DEBUG

    selectedRole = role;

    document.getElementById("doctorBtn").classList.remove("active");
    document.getElementById("patientBtn").classList.remove("active");

    if (role === "doctor") {
        document.getElementById("doctorBtn").classList.add("active");
    } else {
        document.getElementById("patientBtn").classList.add("active");
    }
}

function login() {
    console.log("Login role:", selectedRole); // DEBUG

    if (!selectedRole) {
        alert("Please select role");
        return;
    }

    if (selectedRole === "doctor") {
        window.location.href = "doctor/dashboard.html";
    } else {
        window.location.href = "patient/dashboard.html";
    }
}