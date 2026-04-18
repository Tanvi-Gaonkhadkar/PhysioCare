// 🔥 Selected role
let selectedRole = null;

// Select role
function selectRole(role) {
    selectedRole = role;

    document.getElementById("doctorBtn").classList.remove("active");
    document.getElementById("patientBtn").classList.remove("active");

    if (role === "doctor") {
        document.getElementById("doctorBtn").classList.add("active");
    } else {
        document.getElementById("patientBtn").classList.add("active");
    }
}

// 🔥 LOGIN (CONNECTED TO BACKEND)
function login() {
    let username = document.getElementById("username").value.trim();
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();

    if (!username || !email || !password) {
        alert("Please fill all fields");
        return;
    }

    if (!selectedRole) {
        alert("Please select Doctor or Patient");
        return;
    }

    fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: username,
            email: email,
            password: password,
            role: selectedRole
        })
    })
    .then(res => res.json())  // 🔥 backend always returns JSON
    .then(data => {
        if (!data || !data.email) {
            throw new Error("Login failed");
        }

        console.log("Login success:", data);

        // 🔐 Save session
        localStorage.setItem("userName", data.name);
        localStorage.setItem("userEmail", data.email);
        localStorage.setItem("role", data.role);

        // 🔀 Redirect based on role
        if (data.role === "doctor") {
            window.location.href = "doctor/dashboard.html";
        } else {
            window.location.href = "patient/dashboard.html";
        }
    })
    .catch(err => {
        alert("Login failed. Try again.");
        console.error(err);
    });
}