// Kiểm tra xem CONFIG đã được load chưa
console.log("API URL:", CONFIG.API_BASE_URL);



// Function to load export records from the server
async function loadExports() {
    try {
        // Fetch exports, books và users cùng lúc
        const [exportResponse, booksResponse, usersResponse] = await Promise.all([
            fetch(`${CONFIG.API_BASE_URL}warehouse-exports`),
            fetch(`${CONFIG.API_BASE_URL}books`),
            fetch(`${CONFIG.API_BASE_URL}auth/users`)
        ]);

        if (!exportResponse.ok || !booksResponse.ok || !usersResponse.ok) {
            throw new Error('Failed to fetch data');
        }

        const exports = await exportResponse.json();
        const books = await booksResponse.json();
        const users = await usersResponse.json();

        // Tạo map từ bookId -> title
        const bookMap = {};
        books.forEach(book => {
            bookMap[book.bookId] = book.title;
        });

        // Tạo map từ userId -> fullName
        const userMap = {};
        users.forEach(user => {
            userMap[user.userId] = user.fullName;
        });

        const exportList = document.getElementById("export-list");
        exportList.innerHTML = ''; // Clear existing records

        exports.forEach(WarehouseExport => {
            const row = document.createElement('tr');

            const bookDetails = WarehouseExport.warehouseExportBooks.map(book => {
                const title = bookMap[book.bookId] || "Unknown Title";
                return `<div><strong>${title}</strong></div><hr style="margin: 4px 0;">`;
            }).join('');

            const exportQuantities = WarehouseExport.warehouseExportBooks
                .map(book => book.exportQuantity)
                .join('<hr style="margin: 4px 0;">');

            const prices = WarehouseExport.warehouseExportBooks
                .map(book => book.price)
                .join('<hr style="margin: 4px 0;">');

            const exporterName = userMap[WarehouseExport.userId] || "Unknown User";

            row.innerHTML = `
                <td>${WarehouseExport.exportId}</td>
                <td>${bookDetails}</td>
                <td>${exportQuantities}</td>
                <td>${prices}</td>
                <td>${exporterName}</td>
                <td>${new Date(WarehouseExport.exportDate).toLocaleDateString()}</td>
            `;

            exportList.appendChild(row);
        });

    } catch (error) {
        console.error('Error loading exports:', error);
    }
}


// Function to open modal for adding new export
window.openAddExportModal = async function () {
    const [booksResponse, usersResponse] = await Promise.all([
        fetch(`${CONFIG.API_BASE_URL}books`),
        fetch(`${CONFIG.API_BASE_URL}auth/users`)
    ]);

    const books = await booksResponse.json();
    const users = await usersResponse.json();

    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>Add Export Record</h2>
            <form id="add-export-form">
                <label for="book-id">Book IDs</label>
                <select id="book-id" name="book-ids[]" multiple required style="height: 120px;">
                ${books.map(book => `   
                    <option value="${book.bookId}">
                        ${book.bookId} - ${book.title} (Stock: ${book.quantity})
                    </option>`).join('')}
                </select>

                <div id="book-details-container"></div>

                <label for="user-id">Exporter ID</label>
                <select id="user-id" name="user-id" required>
                    <option value="">-- Select User ID --</option>
                    ${users.map(user => `<option value="${user.userId}">${user.userId} - ${user.fullName}</option>`).join('')}
                </select>

                <label for="export-date">Export Date</label>
                <input type="date" id="export-date" name="export-date" required>

                <button class="save-btn" type="submit">Save Export</button>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
    modal.style.display = "block";

    const closeButton = modal.querySelector('.close');
    closeButton.onclick = () => { modal.remove(); };
    window.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };

    const bookSelect = modal.querySelector('#book-id');
    const bookDetailsContainer = modal.querySelector('#book-details-container');

    bookSelect.addEventListener('change', () => {
        const selectedBookIds = Array.from(bookSelect.selectedOptions).map(opt => opt.value);
        bookDetailsContainer.innerHTML = '';

        selectedBookIds.forEach(bookId => {
            const selectedBook = books.find(b => b.bookId === bookId);
            const price = selectedBook ? selectedBook.price : 0;

            const div = document.createElement('div');
            div.classList.add('book-detail-row');
            div.innerHTML = `
                <h4>Book ID: ${bookId}</h4>
                <label>Quantity:</label>
                <input type="number" class="quantity-input" data-bookid="${bookId}" required>
                <label>Price (auto):</label>
                <input type="number" class="price-input" value="${price}" data-bookid="${bookId}" readonly>
                <hr>
            `;
            bookDetailsContainer.appendChild(div);
        });
    });

    document.getElementById('add-export-form').addEventListener('submit', async function (e) {
        e.preventDefault();

        const exportDate = document.getElementById('export-date').value;
        const userId = document.getElementById('user-id').value;

        const quantities = modal.querySelectorAll('.quantity-input');
        const prices = modal.querySelectorAll('.price-input');

        const WarehouseExportBooks = Array.from(quantities).map((qtyInput, index) => {
            const bookId = qtyInput.getAttribute('data-bookid');
            const quantity = qtyInput.value;
            const price = prices[index].value;

            return {
                BookId: bookId,
                ExportQuantity: quantity,
                Price: price
            };
        });

        const exportData = {
            ExportDate: exportDate,
            UserId: userId,
            WarehouseExportBooks
        };

        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}warehouse-exports`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(exportData)
            });

            if (response.ok) {
                alert('Export added successfully');
                modal.remove();
                loadExports();
            } else {
                const error = await response.json();
                alert('Error: ' + error.message);
            }
        } catch (error) {
            console.error('Error adding export:', error);
            alert('Error adding export');
        }
    });
};






//NavigationNavigation
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("export-link").classList.add("active");

    document.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            const page = this.getAttribute("href").substring(1);

            if (page === "export") {
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
document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const page = this.getAttribute('href').replace('#', '');

            // Remove active class from all links
            navLinks.forEach(link => link.classList.remove('active'));
            // Add active class to clicked link
            this.classList.add('active');

            // Handle navigation based on clicked link
            switch (page) {
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
    document.getElementById('logout-btn').addEventListener('click', function (e) {
        e.preventDefault();
        // Clear localStorage
        localStorage.clear();
        // Redirect to login page
        window.location.href = '../index.html';
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Check user role and hide admin link
    const userRole = localStorage.getItem('role');
    const adminLink = document.getElementById('admin-link').parentElement;
    
    // Hide admin link for non-administrators
    if (userRole !== '0' && userRole !== 'ADMINISTRATOR') {
        adminLink.style.display = 'none';
    }

    // Prevent non-admin access
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#admin' && 
                (userRole !== '0' && userRole !== 'ADMINISTRATOR')) {
                e.preventDefault();
                alert('Access denied. Administrator privileges required.');
                return;
            }
        });
    });

    // Verify login status
    if (!localStorage.getItem('token')) {
        window.location.href = '../index.html';
        return;
    }
});

// Lấy danh sách phiếu xuất kho khi trang được tải
window.onload = loadExports;