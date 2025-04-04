function openAddImportModal() {
    const productName = prompt("Enter product name:");
    const quantity = prompt("Enter quantity:");
    const importDate = prompt("Enter import date (YYYY-MM-DD):");
    if (productName && quantity && importDate) {
        addImport(productName, quantity, importDate);
    }
}

function addImport(productName, quantity, importDate) {
    const table = document.getElementById("import-list");
    const row = table.insertRow();
    row.insertCell(0).innerText = table.rows.length;
    row.insertCell(1).innerText = productName;
    row.insertCell(2).innerText = quantity;
    row.insertCell(3).innerText = importDate;
    const actions = row.insertCell(4);
    actions.innerHTML = '<button onclick="editImport(this)">Edit</button> <button onclick="deleteImport(this)">Delete</button>';
}

function editImport(btn) {
    const row = btn.parentNode.parentNode;
    const newProductName = prompt("Update product name:", row.cells[1].innerText);
    const newQuantity = prompt("Update quantity:", row.cells[2].innerText);
    const newImportDate = prompt("Update import date (YYYY-MM-DD):", row.cells[3].innerText);
    if (newProductName && newQuantity && newImportDate) {
        row.cells[1].innerText = newProductName;
        row.cells[2].innerText = newQuantity;
        row.cells[3].innerText = newImportDate;
    }
}

function deleteImport(btn) {
    if (confirm("Are you sure you want to delete this import record?")) {
        btn.parentNode.parentNode.remove();
    }
}
//NavigationNavigation
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("import-link").classList.add("active");

    document.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", function(event) {
            event.preventDefault();
            const page = this.getAttribute("href").substring(1);

            if (page === "import") {
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
