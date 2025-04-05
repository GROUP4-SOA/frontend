document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("dashboard-link").classList.add("active");

    document.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", function(event) {
            event.preventDefault();
            const page = this.getAttribute("href").substring(1);

            if (page === "dashboard") {
                location.reload();
            } else {
                loadPage(page);
            }

            // Cập nhật class active
            document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
            this.classList.add("active");
        });
    });
});

// Navigation handling
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('href').replace('#', '');
            
            // Remove active class from all links
            navLinks.forEach(link => link.classList.remove('active'));
            // Add active class to clicked link
            this.classList.add('active');
            
            // Handle navigation based on clicked link
            switch(page) {
                case 'dashboard':
                    window.location.href = 'Dashboard.html';
                    break;
                case 'admin':
                    window.location.href = 'admin.html';
                    break;
                    case 'category':
                    window.location.href = 'category.html';
                    break;
                case 'books':
                    window.location.href = 'books.html';
                    break;
                case 'import':
                    window.location.href = 'import.html';
                    break;
                case 'export':
                    window.location.href = 'export.html';
                    break;
            }
        });
    });

    // Handle logout
    document.getElementById('logout-btn').addEventListener('click', function(e) {
        e.preventDefault();
        // Clear localStorage
        localStorage.clear();
        // Redirect to login page
        window.location.href = '../index.html';
    });
});

document.addEventListener("DOMContentLoaded", function () {
    // Sample data
    const importData = [50, 75, 120, 95, 130, 170, 200, 185, 220, 250, 230, 280];
    const exportData = [40, 60, 90, 80, 110, 140, 180, 160, 200, 220, 210, 260];
    const categories = ["Novel", "Science", "History", "Textbook", "Comics"];
    const categoryData = [40, 30, 15, 25, 35];

    // Bar chart - Books imported by month
    new Chart(document.getElementById("importChart"), {
        type: "bar",
        data: {
            labels: ["January", "February", "March", "April", "May", "June",
                     "July", "August", "September", "October", "November", "December"],
            datasets: [{
                label: "Books Imported",
                data: importData,
                backgroundColor: "rgba(54, 162, 235, 0.6)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: { y: { beginAtZero: true } }
        }
    });

    // Pie chart - Book categories distribution
    new Chart(document.getElementById("categoryChart"), {
        type: "pie",
        data: {
            labels: categories,
            datasets: [{
                label: "Book Quantity",
                data: categoryData,
                backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#4bc0c0", "#9966ff"]
            }]
        },
        options: { responsive: true }
    });

    // Line chart - Export trends by month
    new Chart(document.getElementById("exportChart"), {
        type: "line",
        data: {
            labels: ["January", "February", "March", "April", "May", "June",
                     "July", "August", "September", "October", "November", "December"],
            datasets: [{
                label: "Books Exported",
                data: exportData,
                borderColor: "rgba(255, 99, 132, 1)",
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                borderWidth: 2,
                fill: true
            }]
        },
        options: {
            responsive: true,
            scales: { y: { beginAtZero: true } }
        }
    });
});

// Handle Logout
document.getElementById("logout-btn").addEventListener("click", function(event) {
    event.preventDefault();
    if (confirm("Are you sure you want to log out?")) {
        window.location.href = "login.html";
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Get user role once
    const userRole = localStorage.getItem('role');
    console.log('Current user role:', userRole); // Debug log
    
    // Handle admin link visibility
    const adminLink = document.getElementById('admin-link').parentElement;
    if (userRole === '0' || userRole === 'ADMINISTRATOR') {
        adminLink.style.display = 'block';
    } else {
        adminLink.style.display = 'none';
    }

    // Setup navigation with role check
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('href').replace('#', '');

            // Remove active class from all links
            navLinks.forEach(link => link.classList.remove('active'));
            // Add active class to clicked link
            this.classList.add('active');

            // Handle navigation with role check
            if (page === 'admin') {
                if (userRole === '0' || userRole === 'ADMINISTRATOR') {
                    window.location.href = 'admin.html';
                } else {
                    alert('Access denied. Administrator privileges required.');
                }
            } else {
                window.location.href = `${page}.html`;
            }
        });
    });

    // Handle logout
    document.getElementById('logout-btn').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.clear();
        window.location.href = '../index.html';
    });

    // Verify login status
    if (!localStorage.getItem('token')) {
        window.location.href = '../index.html';
        return;
    }
});