function openAddAccountModal() {
    const username = prompt("Enter username:");
    const email = prompt("email:");
    const role = prompt("(admin/staff):").toLowerCase();
    
    if (username && email && (role === "admin" || role === "staff")) {
        addAccount(username, email, role);
    } else {
        alert("Account type can only be 'admin' or 'staff'.");
    }
}

function addAccount(username, email, role) {
    const table = document.getElementById("account-list");
    const row = table.insertRow();
    row.insertCell(0).innerText = table.rows.length;
    row.insertCell(1).innerText = username;
    row.insertCell(2).innerText = email;
    row.insertCell(3).innerText = role.charAt(0).toUpperCase() + role.slice(1); // Viết hoa chữ cái đầu
    const actions = row.insertCell(4);
    actions.innerHTML = '<button onclick="editAccount(this)">EditEdit</button> <button onclick="deleteAccount(this)">DeleteDelete</button>';
}

function editAccount(btn) {
    const row = btn.parentNode.parentNode;
    const newUsername = prompt("Update login name:", row.cells[1].innerText);
    const newEmail = prompt("Update email:", row.cells[2].innerText);
    const newRole = prompt("Update account type (admin/staff):", row.cells[3].innerText.toLowerCase());

    if (newUsername && newEmail && (newRole === "admin" || newRole === "staff")) {
        row.cells[1].innerText = newUsername;
        row.cells[2].innerText = newEmail;
        row.cells[3].innerText = newRole.charAt(0).toUpperCase() + newRole.slice(1);
    } else {
        alert("Account type can only be 'admin' or 'staff'.");
    }
}

function deleteAccount(btn) {
    if (confirm("Are you sure you want to delete this account?")) {
        btn.parentNode.parentNode.remove();
    }
}
//NavigationNavigation
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("admin-link").classList.add("active");

    document.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", function(event) {
            event.preventDefault();
            const page = this.getAttribute("href").substring(1);

            if (page === "admin") {
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

// Gọi hàm lấy danh sách sách khi trang được tải
window.onload = fetchBooks;
