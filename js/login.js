document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorMessage = document.getElementById("errorMessage");

    if (username === "" || password === "") {
        errorMessage.textContent = "Please enter all required information!";
        return;
    }

    // Simulated user authentication (Replace with actual API if available)
    if (username === "admin" && password === "123456") {
        alert("Login successful!");
        window.location.href = "dashboard.html"; // Redirect after login
    } else {
        errorMessage.textContent = "Incorrect username or password!";
    }
});
